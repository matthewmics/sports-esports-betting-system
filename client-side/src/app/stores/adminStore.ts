import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import { history } from "../..";
import agent, { apiUrl } from "../api/agent";
import { IDashboardDto } from "../models/admin";
import { IUserAdmin, IUserFormValues } from "../models/user";
import { IWagererData } from "../models/wagerer";
import { RootStore } from "./rootStore";
import WagererStore from "./wagererStore";

export default class AdminStore {
    rootStore: RootStore;

    @observable loading = false;
    @observable loadingUser = true;
    @observable adminUser: IUserAdmin | null = null;

    @observable dashboard: IDashboardDto | null = null;

    @observable.ref hubConnection: HubConnection | null = null;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        makeObservable(this);

        reaction(
            () => this.adminUser,
            () => {
                if (this.adminUser) {
                    window.localStorage.setItem("jwt_admin", this.adminUser.token);
                    this.createHubConnection(this.adminUser!.token);
                } else {
                    window.localStorage.removeItem("jwt_admin");
                    this.stopHubConnection();
                }
            }
        )
    }

    @computed get isLoggedIn() {
        return !!this.adminUser;
    }

    @action createHubConnection = (token: string) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(apiUrl + '/mainhub', {
                accessTokenFactory: () => token
            })
            .configureLogging(LogLevel.None)
            .build();

        this.hubConnection.start()
            .then(() => {
                this.hubConnection!.invoke('GetOnlineUsers', this.adminUser!.email)
            })
            .catch(error => console.log('Error establishing connection', error));


        let { addOnlineUser, removeOnlineUser, setOnlineUsers } = this.rootStore.wagererStore;

        this.hubConnection.on('UserConnect', (user: IWagererData) => {
            addOnlineUser(user);
        })


        this.hubConnection.on('UserDisconnect', (userId: string) => {
            removeOnlineUser(userId);
        })

        this.hubConnection.on('UsersFetched', (users: IWagererData[]) => {
            setOnlineUsers(users);
        })
    }


    @action stopHubConnection = () => {
        this.hubConnection!.stop();
    }

    @action login = async (values: IUserFormValues) => {
        this.loading = true;
        try {
            const user = await agent.Admin.login(values);
            runInAction(() => {
                this.adminUser = user;
            })
            toast.success("Login Successful!");
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action logout = () => {
        this.adminUser = null;
        toast.info("You have logged out!");
        history.push("/admin/login");
    }

    @action getCurrentAdmin = async () => {
        this.loadingUser = true;
        try {
            if (window.localStorage.getItem('jwt_admin')) {
                const user = await agent.Admin.current();
                runInAction(() => {
                    this.adminUser = user;
                })
            } else {
                history.push("/admin/login");
            }
        } catch {
            history.push("/admin/login");
        } finally {
            runInAction(() => {
                this.loadingUser = false;
            })
        }
    }

    @action loadDashboard = async () => {
        this.loading = true;
        try {
            const response = await agent.Admin.dashboard();
            response.lastUpdated = new Date(response.lastUpdated);
            runInAction(() => {
                this.dashboard = response;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

}