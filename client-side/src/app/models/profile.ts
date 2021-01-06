import { IGame } from "./match";
import { IPredictionStatus } from "./prediction";

export interface IUserPredictionTeam {
    id: number;
    name: string;
    image: string;
    isSelected: boolean;
}

export interface IUserPrediction {
    teamA: IUserPredictionTeam;
    teamB: IUserPredictionTeam;
    predictionTitle: string;
    game: IGame;
    amount: number;
    predictedAt: Date;
    predictionId: number;
    matchId: number;
    outcome: number;
    predictionStatus: IPredictionStatus;
}

export interface IUserPredictionEnvelope {
    userPredictions: IUserPrediction[];
    userPredictionCount: number;
}

export interface IProfilePredictionStats {
    predictionValue: number;
    predictionTotal: number;
}

export interface IProfileChangePhotoResult {
    photoUrl: string;
}