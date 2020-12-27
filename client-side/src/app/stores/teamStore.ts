import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { ITeam, ITeamFormValues } from "../models/team";

export default class TeamStore {

    @observable teams: ITeam[] | null = null;
    @observable loading = false;
    @observable page = 0;
    @observable teamCount = 0;
    @observable limit = 10;
    @observable filters = new Map();
    @observable selectedTeam: ITeam | null = null;

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
            const teamsEnvelope = await agent.Teams.list(this.urlParams);
            const teams = teamsEnvelope.teams;
            teams.forEach(x => { x.createdAt = new Date(x.createdAt) });
            runInAction(() => {
                this.teams = teams;
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


    @action searchTeams = async (query: string) => {
        try {
            const params = new URLSearchParams();
            params.append('q', query);
            params.append('limit', '10');
            const teamsEnvelope = await agent.Teams.list(params);
            const { teams } = teamsEnvelope;
            return teams;
        } catch (error) {
            throw error;
        }
    }

    @action createTeam = async (formValues: ITeamFormValues) => {
        this.loading = true;
        try {
            await agent.Teams.create(formValues);
            toast.success("Team successfully created");
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action selectTeam = async (id: number) => {
        if (this.teams)
            this.selectedTeam = this.teams.filter(x => x.id === id)[0];
        else {
            try {
                const team = await agent.Teams.get(id);
                team.createdAt = new Date(team.createdAt);
                runInAction(() => {
                    this.selectedTeam = team;
                })
            } catch (error) {
                throw error;
            }
        }
    }

    @action changeImage = async (file: Blob) => {
        this.loading = true;
        try {
            await agent.Teams.changeImage(file, this.selectedTeam!.id);
            toast.success("Image updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Problem changing image")
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action updateTeam = async (values: ITeamFormValues) => {
        this.loading = true;
        try {
            await agent.Teams.update(this.selectedTeam!.id, values);
            toast.success("Team updated successfully");
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action delete = async (id: number) => {
        this.loading = true;
        try {
            await agent.Teams.delete(id);
            runInAction(() => {
                this.teams = this.teams!.filter(x => x.id !== id);
            })
            toast.success("Team deleted");
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

}