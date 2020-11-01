import { action, computed, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { IMatch } from "../models/match";
import { IPrediction } from "../models/prediction";

export default class MatchStore {

  @observable matchRegistry = new Map();
  @observable selectedMatch: IMatch | null = null;
  @observable selectedPrediction: IPrediction | null = null;

  constructor() {
    makeObservable(this);
  }

  @computed get matchList() {
    return Array.from(this.matchRegistry.values());
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

  @action selectMatch = (id: number) => {
    this.selectedMatch = this.matchRegistry.get(id);
    this.selectedPrediction = this.selectedMatch!.predictions[0];
  }

  @action selectPrediction = (id: number) => {
    this.selectedPrediction = this.selectedMatch!.predictions.filter(p => p.id === id)[0];
  }
}
