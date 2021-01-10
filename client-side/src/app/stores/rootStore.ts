import { configure } from "mobx";
import { createContext } from "react";
import AdminStore from "./adminStore";
import CommonStore from "./commonStore";
import FundStore from "./fundStore";
import MatchStore from "./matchStore";
import ModalStore from "./modalStore";
import PredictionStore from "./predictionStore";
import ProfileStore from "./profileStore";
import TeamStore from "./teamStore";
import UserStore from "./userStore";
import WagererStore from "./wagererStore";

configure({ enforceActions: "always" });

export class RootStore {

  matchStore: MatchStore;
  modalStore: ModalStore;
  predictionStore: PredictionStore;
  userStore: UserStore;
  teamStore: TeamStore;
  profileStore: ProfileStore;
  fundStore: FundStore;
  commonStore: CommonStore;
  wagererStore: WagererStore;


  adminStore: AdminStore;

  constructor() {
    this.matchStore = new MatchStore(this);
    this.modalStore = new ModalStore();
    this.userStore = new UserStore(this);
    this.predictionStore = new PredictionStore(this);
    this.profileStore = new ProfileStore(this);
    this.fundStore = new FundStore(this);
    this.wagererStore = new WagererStore(this);
    this.commonStore = new CommonStore(this);


    this.adminStore = new AdminStore(this);
    this.teamStore = new TeamStore();
  }
}

export const RootStoreContext = createContext(new RootStore());
