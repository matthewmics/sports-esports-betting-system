import { configure } from "mobx";
import { createContext } from "react";

configure({ enforceActions: "always" });

export class RootStore {
  constructor() {

  }
}

export const RootStoreContext = createContext(new RootStore());
