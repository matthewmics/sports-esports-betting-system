export interface IPrediction {
    id: number;
    status: string; 
    title: string;
    description: string;
    startDate: Date;
}

export interface IPredictionForm {
    amount: string;
    team: string;
}

export interface IActivePrediction {
    teamName: string,
    amount: number,
    potentialWinning: number
}