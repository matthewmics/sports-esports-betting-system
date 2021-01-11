interface IUserBase {
    displayName: string;
    email: string;
    token: string;
}

export interface IUser extends IUserBase {
    walletBalance: number;
    photo: string;
    predictionNotifications: IPredictionNotification[];
}

export interface IUserAdmin extends IUserBase {

}

export interface IUserFormValues {
    displayName?: string;
    email: string;
    password: string;
}

export interface IUserRegisterFormValues {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface IPredictionNotification {
    outcome: number;
    matchPredictionName: string;
    when: Date;
    id: number;
    predictionId: number;
    matchId: number;
}