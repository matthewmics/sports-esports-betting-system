import { action, makeObservable, observable } from "mobx";

export default class ModalStore {

    @observable.shallow modal = {
        open: false,
        body: null
    };

    constructor() {
        makeObservable(this);
    }

    @action openModal = (body: any) => {
        this.modal.open = true;
        this.modal.body = body;
    }

    @action closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }

}