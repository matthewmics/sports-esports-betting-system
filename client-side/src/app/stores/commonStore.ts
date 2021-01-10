import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { action, makeObservable, observable, runInAction } from "mobx";
import { apiUrl } from "../api/agent";
import { IMatch } from "../models/match";
import { RootStore } from "./rootStore";

export default class CommonStore {
    rootStore: RootStore;

    @observable.ref hubConnection: HubConnection | null = null;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @action createHubConnection = () => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(apiUrl + '/commonhub', {
                accessTokenFactory: () => ''
            })
            .configureLogging(LogLevel.None)
            .build();

        this.hubConnection.start()
            .catch(error => console.log('Error establishing connection', error));

        this.hubConnection.on("PredictionUpdate", (match: IMatch) => {
            const { matchRegistry, initializeMatch, selectedMatch, selectMatch } = this.rootStore.matchStore;
            const { selectedPrediction, selectPrediction } = this.rootStore.predictionStore;
            runInAction(() => {
                match = initializeMatch(match);
                matchRegistry.set(match.id, match);
                if (selectedMatch && selectedMatch.id === match.id)
                    selectMatch(match.id);
                if (selectedPrediction)
                    selectPrediction(selectedPrediction.id);
            })
        });
    }
}