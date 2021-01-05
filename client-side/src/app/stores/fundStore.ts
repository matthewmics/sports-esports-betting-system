import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { RootStore } from "./rootStore";

export const paypalPayoutFee = 12.50;

export default class FundStore {

    rootStore: RootStore;
    @observable loading = false;

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @action paypalDeposit = async (amount: number) => {
        this.loading = true;
        try {
            const response = await agent.Funds.paypalDeposit(amount);
            return response.checkoutLink;
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    };

    @action paypalWithdraw = async (amount: number, email: string) => {
        this.loading = true;
        try {
            await agent.Funds.paypalWithdraw(amount, email);
            runInAction(() => {
                this.rootStore.userStore.user!.walletBalance -= (amount + paypalPayoutFee);
            });
            toast.success('Withdraw successful');
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}