import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../api/agent";
import { ITeam, ITeamFormValues } from "../models/team";

export default class TeamStore {

    @observable teams: ITeam[] | null = null;
    @observable loading = false;
    @observable page = 0;
    @observable teamCount = 0;
    @observable limit = 10;
    @observable filters = new Map();

    constructor() {
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
        return Math.ceil(this.teamCount / this.limit);
    }

    @action setPage = (page: number) => {
        this.page = page;
    }

    @action setFilter = (value: string, key: string, reload = true) => {

        this.filters.set(value, key);

        if (reload) {
            this.page = 0;
            this.loadTeams();
        }
    };

    @action setLimit = (limit: number) => {
        this.page = 0;
        this.limit = limit;
        this.loadTeams();
    }

    @action loadTeams = async () => {
        this.loading = true;
        try {
            const teamsEnvelope = await agent.Teams.get(this.urlParams);
            runInAction(() => {
                this.teams = teamsEnvelope.teams;
                this.teamCount = teamsEnvelope.teamCount;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action createTeam = async (formValues: ITeamFormValues) => {
        this.loading = true;
        try {
            await agent.Teams.create(formValues);
            toast.success("Team successfully created");
            history.push('/admin/tables/teams')
        } catch (error) {
            throw error;
        } finally {
            runInAction(()=>{
                this.loading = false;
            })
        }
    }

}