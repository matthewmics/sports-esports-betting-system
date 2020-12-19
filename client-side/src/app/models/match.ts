import { IPrediction, IPredictionStatus } from "./prediction";
import { ITeam } from "./team";

export interface IMatchEnvelope {
    matches: IMatch[];
    matchCount: number;
}

export interface IMatch {
    id: number;
    category: string;
    eventName: string;
    startDate: Date;
    teamA: ITeam;
    teamB: ITeam;
    predictions: IPrediction[];
    series: number;
    matchStatus: IPredictionStatus;
    game: IGame;
}

export interface IGame {
    id: number;
    name: string;
    displayText: string;
}

export interface IMatchForm {
    eventName: string;
    teamAId: number;
    teamBId: number;
    gameId: number;
    series: number;
    title: string;
    description: string;
    startsAt: Date;
}