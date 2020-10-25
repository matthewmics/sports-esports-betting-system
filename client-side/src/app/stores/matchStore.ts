import { action, computed, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";

export default class MatchStore {
  @observable matchRegistry = new Map();

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
}
