export interface IUser {
    displayName: string;
    username: string;
    token: string;
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