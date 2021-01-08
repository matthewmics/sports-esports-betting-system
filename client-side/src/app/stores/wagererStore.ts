import { action, computed, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { IWagererData } from "../models/wagerer";
import { RootStore } from "./rootStore";

export default class WagererStore {

    rootStore: RootStore;
    @observable loading = false;
    @observable wagererList: IWagererData[] = [];
    @observable filters = new Map();
    @observable page = 0;
    @observable wagererCount = 0;
    @observable limit = 10;
    @observable hasLoaded = false;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @computed get urlParams() {
        const params = new URLSearchParams();
        params.append("limit", String(this.limit));
        params.append("offset", String(this.page * this.limit));
        this.filters.forEach((v, k) => {
            params.append(k, v);
        })
        return params;
    }

    @computed get totalPage() {
        return Math.ceil(this.wagererCount / this.limit);
    }

    @action setPage = (page: number) => {
        this.page = page;
    }

    @action setFilter = (value: string, key: string, reload = true) => {

        this.filters.set(value, key);

        if (reload) {
            this.page = 0;
            this.loadWagerers();
        }
    };

    @action setLimit = (limit: number) => {
        this.page = 0;
        this.limit = limit;
        this.loadWagerers();
    }

    @action loadWagerers = async () => {
        this.hasLoaded = true;
        this.loading = true;
        try {
            const response = await agent.Wagerers.list(this.urlParams)
            runInAction(() => {
                this.wagererList = response.wagerers;
                this.wagererCount = response.wagererCount;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}