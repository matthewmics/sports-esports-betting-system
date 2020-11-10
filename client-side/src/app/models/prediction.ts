import { ITeam } from "./team";

export interface IPrediction {
    id: number;
    status: string; 
    title: string;
    description: string;
    startDate: Date;
    predictionDetails: IPredictionDetails;
}

export interface IPredictionForm {
    amount: string;
    teamId: string;
}

export interface IActivePrediction {
    team: ITeam;
    amount: number;
    potentialReward: number;
}

export interface IPredictionDetails {
    activePrediction: IActivePrediction | null;

}