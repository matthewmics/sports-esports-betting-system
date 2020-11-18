interface IUserBase {
    displayName: string;
    username: string;
    email: string;
    token: string;
}

export interface IUser extends IUserBase {   
    walletBalance: number;
}

export interface IUserAdmin extends IUserBase {

}

export interface IUserFormValues {
    displayName?: string;
    email: string;
    username?: string;
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