import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IMatch, IMatchForm } from "../models/match";
import { IPrediction } from "../models/prediction";
import { RootStore } from "./rootStore";

const LIMIT: number = 6;

export default class MatchStore {

  rootStore: RootStore;

  @observable matchRegistry = new Map();
  @observable selectedMatch: IMatch | null = null;
  @observable loading = false;
  @observable page = 0;
  @observable matchCount = 0;
  @observable loadingMatches = false;
  @observable matchFilters = new Map();
  @observable hasLoaded = false;

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

  @action setFilter = (predicate: string, value: string, reload = true) => {
    if (this.loadingMatches)
      return;

    this.matchFilters.set(predicate, value);

    if (reload) {
      this.page = 0;
      this.matchRegistry.clear();
      this.loadMatches();
    }
  }

  initializeMatch = (match: IMatch): IMatch => {
    match.startDate = new Date(match.startDate);
    match.predictions.forEach(p => p.startDate = new Date(p.startDate));
    match.predictions = this.sortPredictionsBySequence(match.predictions);
    return match;
  }

  @action loadMatches = async () => {
    this.hasLoaded = true;
    this.loadingMatches = true;
    try {
      const matchEnvelope = await agent.Matches.list(this.matchParams);
      runInAction(() => {
        matchEnvelope.matches.forEach((match) => {
          match = this.initializeMatch(match);
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

  @action selectMatch = async (id: number, loadUserPredictionDetails = true) => {
    this.selectedMatch = this.matchRegistry.get(id);
    if (!this.selectedMatch) {
      try {
        let match = await agent.Matches.get(id);
        match = this.initializeMatch(match);
        runInAction(() => {
          this.selectedMatch = match;
        })
      } catch (error) {
        throw error;
      }
    }

    runInAction(() => {
      this.rootStore.predictionStore.selectedPrediction = this.selectedMatch!.predictions[0];
    });

    if (loadUserPredictionDetails)
      this.rootStore.predictionStore.loadPredictionDetails();
  }

  @action create = async (matchForm: IMatchForm) => {
    this.loading = true;
    try {
      let createdMatch = await agent.Matches.create(matchForm);
      let match = await agent.Matches.get(createdMatch.id);
      match = this.initializeMatch(match);
      runInAction(() => {
        this.matchRegistry.set(match.id, match);
      });
      toast.success("Match created");
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

}
