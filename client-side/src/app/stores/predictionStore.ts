import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPrediction, IPredictionCreateForm, predictionStatus } from "../models/prediction";
import { RootStore } from "./rootStore";

export default class PredictionStore {

  rootStore: RootStore;

  @observable selectedPrediction: IPrediction | null = null;
  @observable loading = false;
  @observable targetLoading = '' as any;

  constructor(rootStore: RootStore) {
    makeObservable(this);
    this.rootStore = rootStore;
  }

  @action loadPredictionDetails = async () => {
    this.loading = true;
    try {
      const predictionDetails = await agent.Predictions
        .predictionDetails(this.selectedPrediction!.id);
      runInAction(() => {
        this.selectedPrediction!.predictionDetails = predictionDetails;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action selectPrediction = (id: number) => {
    this.selectedPrediction = this.rootStore.matchStore.selectedMatch!.predictions.filter(p => p.id === id)[0];

    this.loadPredictionDetails();
  }

  @action unpredict = async () => {
    this.loading = true;
    try {
      await agent.Predictions.unpredict(this.selectedPrediction!.id);
      runInAction(() => {
        this.rootStore.userStore.user!.walletBalance += this.selectedPrediction!.predictionDetails.activePrediction!.amount;
        this.selectedPrediction!.predictionDetails.activePrediction = null;
      });
      toast.info("You have cancelled prediction");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while cancelling your prediction");
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action predict = async (teamId: number, amount: number) => {
    this.loading = true;
    try {
      const activePrediction = await agent.Predictions.predict(
        this.selectedPrediction!.id,
        teamId,
        amount);

      runInAction(() => {
        this.rootStore.userStore.user!.walletBalance -= activePrediction.amount;
        this.selectedPrediction!.predictionDetails.activePrediction = activePrediction;
      })

      this.rootStore.modalStore.closeModal();
      toast.success("Prediction successful");

    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action updatePrediction = async (teamId: number, amount: number) => {
    this.loading = true;
    try {
      const activePrediction = await agent.Predictions.updatePrediction(
        this.selectedPrediction!.id,
        teamId,
        amount);

      runInAction(() => {
        this.rootStore.userStore.user!.walletBalance +=
          this.selectedPrediction!.predictionDetails.activePrediction!.amount -
          activePrediction.amount;

        this.selectedPrediction!.predictionDetails.activePrediction = activePrediction;
      })

      this.rootStore.modalStore.closeModal();
      toast.success("Prediction updated");

    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  getMatch = () => {
    return this.rootStore.matchStore.selectedMatch!;
  }
  getPrediction = (predictionId: number) => {
    return this.getMatch().predictions.filter(x => x.id === predictionId)[0];
  }


  @action setLive = async (predictionId: number) => {
    this.loading = true;
    this.targetLoading = predictionId;
    try {
      await agent.Predictions.setLive(predictionId);
      const prediction = this.getPrediction(predictionId);
      const match = this.getMatch();
      runInAction(() => {
        prediction.predictionStatus = predictionStatus.live;
        prediction.startDate = new Date();
        if (prediction.isMain) {
          match.matchStatus = predictionStatus.live;
          match.startDate = new Date();
        }
      });
      toast.success("Prediction is now live");
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action reschedule = async (predictionId: number, schedule: string) => {
    this.loading = true;
    try {
      await agent.Predictions.reschedule(predictionId, schedule);
      const prediction = this.getPrediction(predictionId);
      const match = this.getMatch();
      runInAction(() => {
        prediction.predictionStatus = predictionStatus.open;
        prediction.startDate = new Date(schedule);
        if (prediction.isMain) {
          match.matchStatus = predictionStatus.open;
          match.startDate = new Date(schedule);
        }
      });
      toast.success("Prediction rescheduled");
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action settle = async (predictionId: number, teamId: number) => {
    this.loading = true;
    try {
      await agent.Predictions.settle(predictionId, teamId);
      const match = this.rootStore.matchStore.selectedMatch!;
      const prediction = match.predictions.filter(x => x.id === predictionId)[0];
      runInAction(() => {
        prediction.predictionStatus = predictionStatus.settled;
        const teamWinner = match.teamA.id === teamId ? match.teamA : match.teamB;
        prediction.winner = teamWinner;
        if (prediction.isMain) {
          match.predictions.forEach(p => {
            if (p.predictionStatus.name !== 'settled')
              p.predictionStatus = predictionStatus.cancelled;
          });
          match.winner = teamWinner;
          match.matchStatus = predictionStatus.settled;
        }
      });
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action cancel = async (predictionId: number) => {
    this.targetLoading = predictionId;
    this.loading = true;
    try {
      await agent.Predictions.cancel(predictionId);
      const prediction = this.getPrediction(predictionId);
      const match = this.getMatch();
      runInAction(() => {
        prediction.predictionStatus = predictionStatus.cancelled;
        if (prediction.isMain) {
          match.predictions.forEach(p => {
            if (p.predictionStatus.name !== 'settled')
              p.predictionStatus = predictionStatus.cancelled;
          });
          match.matchStatus = predictionStatus.cancelled;
        }
      })
      toast.success("Prediction cancelled");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while processing your request")
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action create = async (formValues: IPredictionCreateForm) => {
    this.loading = true;
    try {
      const prediction = await agent.Predictions.create(formValues);
      prediction.startDate = new Date(prediction.startDate);
      const match = this.getMatch();
      runInAction(() => {
        match.predictions.push(prediction);
      });
      toast.success("Prediction created");
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }
}