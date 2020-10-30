import { action, makeObservable } from "mobx";
import agent from "../api/agent";
import { IUserFormValues } from "../models/user";

export default class UserStore {

    constructor() {
        makeObservable(this);
    }

    @action login = async (formValues: IUserFormValues) => {
        try {
            const user = await agent.User.login(formValues);
            console.log(user);
        } catch (error) {
            throw error;
        }
    }
}