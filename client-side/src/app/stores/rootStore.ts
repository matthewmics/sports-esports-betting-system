import { configure } from "mobx";
import { createContext } from "react";
import MatchStore from "./matchStore";

configure({ enforceActions: "always" });

export class RootStore {

  matchStore: MatchStore;

  constructor() {
    this.matchStore = new MatchStore();
  }
}

export const RootStoreContext = createContext(new RootStore());
