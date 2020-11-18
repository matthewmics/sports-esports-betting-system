import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IMatch } from "../models/match";
import { IPrediction } from "../models/prediction";
import { RootStore } from "./rootStore";

const LIMIT: number = 5;

export default class MatchStore {

  rootStore: RootStore;
  @observable matchRegistry = new Map();
  @observable selectedMatch: IMatch | null = null;
  @observable selectedPrediction: IPrediction | null = null;
  @observable loading = false;
  @observable page = 0;
  @observable matchCount = 0;
  @observable loadingMatches = false;
  @observable matchFilters = new Map();

  constructor(rootStore: RootStore) {
    makeObservable(this);
    this.rootStore = rootStore;
  }

  sortPredictionsBySequence = (predictions: IPrediction[]) => {
    return predictions.sort((a, b) => a.sequence - b.sequence);
  }

  @computed get totalPages() {
    return Math.ceil(this.matchCount / LIMIT);
  }

  @computed get matchParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", String(this.page * LIMIT));

    this.matchFilters.forEach((value, key) => {
      params.append(key, value);
    })

    return params;
  }

  @computed get matchList() {
    return Array.from(this.matchRegistry.values()).sort((a: IMatch, b: IMatch) =>
      a.startDate.getTime() - b.startDate.getTime());
  }

  @computed get matchSelections() {
    if (!this.selectedMatch)
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

  @action setPage = (page: number) => {
    this.page = page;
  }

  @action setFilter = (predicate: string, value: string) => {
    if (this.loadingMatches)
      return;
    this.page = 0;
    this.matchRegistry.clear();
    this.matchFilters.set(predicate, value);
    this.loadMatches();
  }

  @action loadMatches = async () => {
    this.loadingMatches = true;
    try {
      const matchEnvelope = await agent.Matches.list(this.matchParams);
      runInAction(() => {
        matchEnvelope.matches.forEach((match) => {
          match.startDate = new Date(match.startDate);
          match.predictions.forEach(p => p.startDate = new Date(p.startDate));
          match.predictions = this.sortPredictionsBySequence(match.predictions);
          this.matchRegistry.set(match.id, match);
        });
        this.matchCount = matchEnvelope.matchCount;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingMatches = false;
      })
    }
  };

  @action selectMatch = async (id: number) => {
    this.selectedMatch = this.matchRegistry.get(id);
    if (!this.selectedMatch) {
      try {
        const match = await agent.Matches.get(id);
        match.startDate = new Date(match.startDate);
        match.predictions.forEach(p => p.startDate = new Date(p.startDate));
        match.predictions = this.sortPredictionsBySequence(match.predictions);
        runInAction(() => {
          this.selectedMatch = match;
        })
      } catch (error) {
        throw error;
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
      toast.success("Prediction updated");

    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

}
