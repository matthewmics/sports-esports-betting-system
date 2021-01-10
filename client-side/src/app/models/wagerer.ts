export interface IWagererData {
    displayName: string;
    email: string;
    banned: boolean;
    id: string;
    photo: string;
}
export interface IWagererDataEnvelope {
    wagerers: IWagererData[];
    wagererCount: number;
}