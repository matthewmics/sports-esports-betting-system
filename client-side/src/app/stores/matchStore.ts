import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent, { apiUrl } from "../api/agent";
import { IComment, IMatch, IMatchForm } from "../models/match";
import { IPrediction } from "../models/prediction";
import { RootStore } from "./rootStore";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { getJwtToken } from "../common/util/security";

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
  @observable selectedStatusFilter = 'all';
  @observable loadingRecentComments = false;

  @observable.ref hubConnection: HubConnection | null = null;

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
    const matches = Array.from(this.matchRegistry.values()) as IMatch[];
    const liveMatches = matches.filter(x => x.matchStatus.name === 'live');
    const finishedMatches = matches.filter(x => x.matchStatus.name === 'cancelled' || x.matchStatus.name === 'settled')
      .sort((a: IMatch, b: IMatch) =>
        a.startDate.getTime() - b.startDate.getTime());
    const openMatches = matches.filter(x => x.matchStatus.name === 'open').sort((a: IMatch, b: IMatch) =>
      a.startDate.getTime() - b.startDate.getTime());
    return [...liveMatches, ...openMatches, ...finishedMatches];
  }

  @action createHubConnection = (matchId: number) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(apiUrl + '/chat', {
        accessTokenFactory: () => getJwtToken() || ''
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection.start()
      //.then(() => console.log(this.hubConnection!.state))
      .then(() => this.hubConnection!.invoke("AddToMatchGroup", matchId))
      .catch(error => console.log('Error establishing connection', error));

    this.hubConnection.on('ReceiveComment', (comment: IComment) => {
      comment.createdAt = new Date(comment.createdAt);
      const match = this.selectedMatch!;
      runInAction(() => {
        if (match.comments.length !== 20)
          match.comments.push(comment);
        else {
          const comments = match.comments.filter((v, i) => i !== 0);
          match.comments = [...comments, comment];
        }
      })
    });
  }

  @action stopHubConnection = () => {
    this.hubConnection!.stop();
  }

  @action sendComment = (values: any) => {
    values.matchId = this.selectedMatch!.id;
    try {
      this.hubConnection!.invoke('SendComment', values);
    } catch (error) {
      console.log(error);
    }
  }

  @action loadRecentComments = async () => {
    this.loadingRecentComments = true;
    try {
      const result = await agent.Matches.recentComments(this.selectedMatch!.id);
      result.forEach(comment => {
        comment.createdAt = new Date(comment.createdAt);
      });
      runInAction(() => {
        this.selectedMatch!.comments = result.sort((a, b) => {
          return a.createdAt.getTime() - b.createdAt.getTime()
        })
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingRecentComments = false;
      })
    }
  }

  @action setSelectedStatusFilter = (value: string) => {
    this.selectedStatusFilter = value;
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
      this.matchCount = 0;
      this.matchRegistry.clear();
      this.loadMatches();
    }
  }

  @action clearMatchRegistry = () => {
    this.matchRegistry.clear();
  }

  initializeMatch = (match: IMatch): IMatch => {
    match.comments = [];
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
      let match = await agent.Matches.create(matchForm);
      match = this.initializeMatch(match);
      runInAction(() => {
        if (this.matchFilters.get("status") === 'upcoming')
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
