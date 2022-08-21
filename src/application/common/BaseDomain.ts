import { IDependencies } from "../../infra/dependencies";
import { IPersisted } from "./PersistanceOpts";


export class BaseDomain {
  
  protected deps: IDependencies;
  protected persisted: IPersisted = {
    isNew: true,
    isUpdated: false,
  };
  constructor(deps: IDependencies) {
    this.deps = deps;
  }

  get isNew() {
    return this.persisted.isNew;
  }
  get isUpdated() {
    return this.persisted.isUpdated;
  }

  protected markAsCreated() {
    this.persisted.isNew = false;
    this.persisted.isUpdated = true;
  }

  protected markAsUpdated() {
    this.persisted.isNew = false;
    this.persisted.isUpdated = true;
  }

  protected updateInProgress() {
    this.persisted.isUpdated = false;
  }

}
