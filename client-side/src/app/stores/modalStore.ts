import { action, makeObservable, observable } from "mobx";

export default class ModalStore {

    @observable.shallow modal = {
        open: false
    };

    constructor() {
        makeObservable(this);
    }

    @action openModal = () => {
        this.modal.open = true;
    }

    @action closeModal = () => {
        this.modal.open = false;
    }

}