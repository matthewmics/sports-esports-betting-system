import { configure } from "mobx";
import { createContext } from "react";
import MatchStore from "./matchStore";
import ModalStore from "./modalStore";

configure({ enforceActions: "always" });

export class RootStore {

  matchStore: MatchStore;
  modalStore: ModalStore;

  constructor() {
    this.matchStore = new MatchStore();
    this.modalStore = new ModalStore();
  }
}

export const RootStoreContext = createContext(new RootStore());
