export interface IUser {
    displayName: string;
    username: string;
    email: string;
    token: string;
    walletBalance: number;
}

export interface IUserFormValues {
    displayName: string;
    email: string;
    username: string;
    password: string;
}

export interface IUserRegisterFormValues {
    displayName: string;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}