import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IProfilePredictionStats, IUserPrediction } from "../models/profile";
import { RootStore } from "./rootStore";

const LIMIT = 6;

export default class ProfileStore {

    rootStore: RootStore;
    @observable predictionRegistry = new Map();
    @observable predictionFilters = new Map();
    @observable page = 0;
    @observable predictionCount = 0;
    @observable loadingPrediction = false;
    @observable hasLoaded = false;

    @observable loading = false;
    @observable predictionStats: IProfilePredictionStats | null = null;

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @computed get totalPages() {
        return Math.ceil(this.predictionCount / LIMIT);
    }

    @computed get predictionList() {
        return Array.from(this.predictionRegistry.values()).sort((a: IUserPrediction, b: IUserPrediction) => {
            return b.predictedAt.getTime() - a.predictedAt.getTime();
        });
    }

    @computed get predictionParams() {
        var params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', String(this.page * LIMIT));
        this.predictionFilters.forEach((value, key) => {
            params.append(key, value);
        })
        return params;
    }

    @action reset = () => {
        this.predictionRegistry.clear();
        this.predictionFilters.clear();
        this.page = 0;
        this.predictionCount = 0;
        this.hasLoaded = false;
        this.predictionStats = null;
    }

    @action setFilter = (key: string, value: string, reload = true) => {
        if (this.loadingPrediction)
            return;

        this.predictionFilters.set(key, value);

        if (reload) {
            this.predictionRegistry.clear();
            this.page = 0;
            this.predictionCount = 0;
            this.loadPredictions();
        }
    }

    @action setPage = (page: number) => {
        this.page = page;
    }

    @action loadPredictions = async () => {
        this.hasLoaded = true;
        this.loadingPrediction = true;
        try {
            const response = await agent.Profile.listPredictions(this.predictionParams);
            runInAction(() => {
                response.userPredictions.forEach((up) => {
                    up.predictedAt = new Date(up.predictedAt);
                    this.predictionRegistry.set(up.predictionId, up);
                });
                this.predictionCount = response.userPredictionCount;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingPrediction = false;
            })
        }
    }

    @action loadPredictionStats = async () => {
        this.loading = true;
        try {
            const response = await agent.Profile.getPredictionStats();
            response.lastUpdated = new Date(response.lastUpdated);
            runInAction(() => {
                this.predictionStats = response;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action changePhoto = async (file: Blob) => {
        this.loading = true;
        try {
            const response = await agent.Profile.changePhoto(file);
            runInAction(() => {
                this.rootStore.userStore.user!.photo = response.photoUrl;
            });
        } catch (error) {
            console.log(error);
            toast.error("An error occured while changing photo");
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

}