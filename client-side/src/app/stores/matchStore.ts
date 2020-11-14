import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IMatch } from "../models/match";
import { IPrediction } from "../models/prediction";
import { RootStore } from "./rootStore";

export default class MatchStore {

  rootStore: RootStore;
  @observable matchRegistry = new Map();
  @observable selectedMatch: IMatch | null = null;
  @observable selectedPrediction: IPrediction | null = null;
  @observable loading = false;

  constructor(rootStore: RootStore) {
    makeObservable(this);
    this.rootStore = rootStore;
  }

  @computed get matchList() {
    return Array.from(this.matchRegistry.values());
  }

  @computed get matchSelections() {
    if(!this.selectedMatch)
      return [];

    return [
      {
        key: this.selectedMatch.teamA.id.toString(),
        text: this.selectedMatch.teamA.name,
        value: this.selectedMatch.teamA.id.toString(),
      }, {
        key: this.selectedMatch.teamB.id.toString(),
        text: this.selectedMatch.teamB.name,
        value: this.selectedMatch.teamB.id.toString(),
      }
    ];
  }

  @action loadMatches = async () => {
    try {
      const matches = await agent.Matches.list();
      runInAction(() => {
        matches.forEach((match) => {
          this.matchRegistry.set(match.id, match);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action selectMatch = async (id: number) => {
    this.selectedMatch = this.matchRegistry.get(id);
    if (!this.selectedMatch) {
      try {
        const match = await agent.Matches.get(id);
        runInAction(() => {
          this.selectedMatch = match;
        })
      } catch (error) {
        console.log(error);
      }
    }

    runInAction(() => {
      this.selectedPrediction = this.selectedMatch!.predictions[0];
    });

    this.loadPredictionDetails();
  }

  @action selectPrediction = (id: number) => {
    this.selectedPrediction = this.selectedMatch!.predictions.filter(p => p.id === id)[0];

    this.loadPredictionDetails();
  }

  @action loadPredictionDetails = async () => {
    this.loading = true;
    try {
      const predictionDetails = await agent.Matches.predictionDetails(this.selectedMatch!.id, this.selectedPrediction!.id);
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

  @action unpredict = async () => {
    this.loading = true;
    try {
      await agent.Matches.unpredict(this.selectedMatch!.id, this.selectedPrediction!.id);
      runInAction(() => {
        this.rootStore.userStore.user!.walletBalance += this.selectedPrediction!.predictionDetails.activePrediction!.amount;
        this.selectedPrediction!.predictionDetails.activePrediction = null;
      });
      toast.info("You have successfully cancelled your prediction");
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
    try {
      const activePrediction = await agent.Matches.predict(
        this.selectedMatch!.id,
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
    } 
  }

  @action updatePrediction = async (teamId: number, amount: number) => {
    this.loading = true;
    try {
      const activePrediction = await agent.Matches.updatePrediction(
        this.selectedMatch!.id,
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
      toast.success("Prediction updated successfully");

    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }


}
