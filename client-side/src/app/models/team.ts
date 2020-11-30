export interface ITeam {
    id: number;
    name: string;
    createdAt: Date;
    image: string;
}

export interface ITeamEnvelope {
    teams: ITeam[];
    teamCount: number;
}