import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { getJwtToken } from "../common/util/security";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {

    rootStore: RootStore;
    @observable user: IUser | null = null;
    @observable loading = false;
    @observable userLoading = true;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        makeObservable(this);

        reaction(
            () => this.user,
            (user) => {
                if (user) {
                    window.localStorage.setItem("jwt", user.token)
                } else {
                    window.localStorage.removeItem("jwt")
                }
            }
        )
    }

    @computed get isLoggedIn() {
        return !!this.user;
    }

    @action register = async (formValues: IUserFormValues) => {
        this.loading = true;
        try {
            const user = await agent.User.register(formValues);
            this.rootStore.modalStore.closeModal();
            runInAction(() => {
                this.user = user;
            })
            toast.success("Registration Successful!")
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action login = async (formValues: IUserFormValues) => {
        this.loading = true;
        try {
            const user = await agent.User.login(formValues);
            toast.success("Login Successful!");
            this.rootStore.modalStore.closeModal();
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

    @action getUser = async () => {
        if(!getJwtToken())
            this.userLoading = false;   

        this.userLoading = true;
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.userLoading = false;
            })
        }
    }

    @action logout = () => {
        this.user = null;
        toast.info("Logout Successful!");
    }
}