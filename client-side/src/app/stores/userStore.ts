import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";

export default class UserStore {

    @observable user: IUser | null = null;
    @observable loading = false;

    constructor() {
        makeObservable(this);
    }

    @computed get isLoggedIn() {
        return !!this.user;
    }

    @action login = async (formValues: IUserFormValues) => {
        this.loading = true;
        try {
            const user = await agent.User.login(formValues);
            toast.success("Login Success!");

            runInAction(() => {
                this.user = user;
            })
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}