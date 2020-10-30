import { configure } from "mobx";
import { createContext } from "react";
import MatchStore from "./matchStore";
import ModalStore from "./modalStore";
import UserStore from "./userStore";

configure({ enforceActions: "always" });

export class RootStore {

  matchStore: MatchStore;
  modalStore: ModalStore;
  userStore: UserStore;

  constructor() {
    this.matchStore = new MatchStore();
    this.modalStore = new ModalStore();
    this.userStore = new UserStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
