export interface IWagererData {
    displayName: string;
    email: string;
    blocked: boolean;
    id: string;
}
export interface IWagererDataEnvelope {
    wagerers: IWagererData[];
    wagererCount: number;
}