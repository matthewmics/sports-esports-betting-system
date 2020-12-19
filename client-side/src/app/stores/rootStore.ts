import { configure } from "mobx";
import { createContext } from "react";
import AdminUserStore from "./adminUserStore";
import MatchStore from "./matchStore";
import ModalStore from "./modalStore";
import PredictionStore from "./predictionStore";
import TeamStore from "./teamStore";
import UserStore from "./userStore";

configure({ enforceActions: "always" });

export class RootStore {

  matchStore: MatchStore;
  modalStore: ModalStore;
  predictionStore: PredictionStore;
  userStore: UserStore;
  teamStore: TeamStore;

  adminUserStore: AdminUserStore;

  constructor() {
    this.matchStore = new MatchStore(this);
    this.modalStore = new ModalStore();
    this.userStore = new UserStore(this);
    this.predictionStore = new PredictionStore(this);

    this.adminUserStore = new AdminUserStore(this);
    this.teamStore = new TeamStore();
  }
}

export const RootStoreContext = createContext(new RootStore());
