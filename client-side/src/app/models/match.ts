import { ITeam } from "./team";

export interface IMatch {
    id: number;
    category: string;
    eventName: string;
    startDate: Date;
    teamA: ITeam,
    teamB: ITeam
}