import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPrediction } from "../models/prediction";
import { RootStore } from "./rootStore";

export default class PredictionStore {

    rootStore: RootStore;

    @observable selectedPrediction: IPrediction | null = null;
    @observable loading = false;

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @action loadPredictionDetails = async () => {
        this.loading = true;
        try {
          const predictionDetails = await agent.Predictions
          .predictionDetails(this.selectedPrediction!.id);
          runInAction(() => {
            this.selectedPrediction!.predictionDetails = predictionDetails;
          });
        } catch (error) {
          console.log(error);
        } finally {
          runInAction(() => {
            this.loading = false;
          })
        }
      }

    @action selectPrediction = (id: number) => {
        this.selectedPrediction = this.rootStore.matchStore.selectedMatch!.predictions.filter(p => p.id === id)[0];

        this.loadPredictionDetails();
    }

    @action unpredict = async () => {
        this.loading = true;
        try {
          await agent.Predictions.unpredict(this.selectedPrediction!.id);
          runInAction(() => {
            this.rootStore.userStore.user!.walletBalance += this.selectedPrediction!.predictionDetails.activePrediction!.amount;
            this.selectedPrediction!.predictionDetails.activePrediction = null;
          });
          toast.info("You have cancelled prediction");
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong while cancelling your prediction");
        } finally {
          runInAction(() => {
            this.loading = false;
          })
        }
      }

      @action predict = async (teamId: number, amount: number) => {
        try {
          const activePrediction = await agent.Predictions.predict(
            this.selectedPrediction!.id,
            teamId,
            amount);
    
          runInAction(() => {
            this.rootStore.userStore.user!.walletBalance -= activePrediction.amount;
            this.selectedPrediction!.predictionDetails.activePrediction = activePrediction;
          })
    
          this.rootStore.modalStore.closeModal();
          toast.success("Prediction successful");   
    
        } catch (error) {
          throw error;
        }
      }

      @action updatePrediction = async (teamId: number, amount: number) => {
        this.loading = true;
        try {
          const activePrediction = await agent.Predictions.updatePrediction(
            this.selectedPrediction!.id,
            teamId,
            amount);
    
          runInAction(() => {
            this.rootStore.userStore.user!.walletBalance +=
              this.selectedPrediction!.predictionDetails.activePrediction!.amount -
              activePrediction.amount;
    
            this.selectedPrediction!.predictionDetails.activePrediction = activePrediction;
          })
    
          this.rootStore.modalStore.closeModal();
          toast.success("Prediction updated");
    
        } catch (error) {
          throw error;
        } finally {
          runInAction(() => {
            this.loading = false;
          })
        }
      }

}