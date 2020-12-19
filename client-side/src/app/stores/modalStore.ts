import { action, makeObservable, observable } from "mobx";
import Confirmation from "../common/modals/Confirmation";

export default class ModalStore {

    @observable.shallow modal = {
        open: false,
        body: null as any
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

    @action openConfirmation = (message: string, title = '' as string, onConfirm?: () => void, onReject?: () => void) => {
        const closeModal = () => { this.closeModal() };
        this.modal.body = Confirmation({ message, title, onConfirm, onReject, closeModal });
        this.modal.open = true;
    }

}