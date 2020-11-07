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
    team: string;
}

export interface IActivePrediction {
    teamName: string;
    amount: number;
    potentialReward: number;
}

export interface IPredictionDetails {
    activePrediction: IActivePrediction;

}