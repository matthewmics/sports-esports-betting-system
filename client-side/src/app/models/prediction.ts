import { ITeam } from "./team";

export interface IPrediction {
    id: number;
    sequence: number;
    predictionStatus: IPredictionStatus;
    title: string;
    description: string;
    startDate: Date;
    predictionDetails: IPredictionDetails;
    isMain: boolean;
    winner: ITeam;
}

export interface IPredictionStatus {
    id: number;
    displayText: string;
    name: string;
}

export const predictionStatus = {
    open: {
        id: 0,
        displayText: 'Open',
        name: 'open'
    } as IPredictionStatus,
    settled: {
        id: 1,
        displayText: 'Settled',
        name: 'settled'
    } as IPredictionStatus,
    cancelled: {
        id: 2,
        displayText: 'Cancelled',
        name: 'cancelled'
    } as IPredictionStatus,
    live: {
        id: 3,
        displayText: 'Live',
        name: 'live'
    } as IPredictionStatus
}

export interface IPredictionForm {
    amount: string;
    teamId: string;
}

export interface IPredictionCreateForm {
    matchId?: number;
    title?: string;
    description?: string;
    startsAt: Date;
}

export interface IActivePrediction {
    team: ITeam;
    amount: number;
    potentialReward: number;
}

export interface IPredictionDetails {
    activePrediction: IActivePrediction | null;
    prediction: IPrediction;
    teamPredictionEnvelope: ITeamPredictionEnvelope;
}

export interface ITeamPredictionEnvelope {
    teamA: ITeamPredictionDetails;
    teamB: ITeamPredictionDetails;
}

export interface ITeamPredictionDetails {
    odds: number;
    percentage: number;
}