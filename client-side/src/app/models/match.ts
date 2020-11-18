import { IPrediction } from "./prediction";
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
    game: IGame;
}

export interface IGame {
    id: number;
    name: string;
    displayText: string;
}