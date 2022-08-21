import { IDependencies } from "../../infra/dependencies/definitions";
import { ILogger } from "../../infra/logger/definitions";
import { IPersisted } from "./PersistanceOpts";


export class BaseDomain {
  
  protected _data: unknown;
  protected deps: IDependencies;
  protected logger: ILogger;
  protected persisted: IPersisted = {
    isNew: true,
    isUpdated: false,
  };

  constructor(deps: IDependencies) {
    this.deps = deps;
    this.logger = deps.logger;
  }

  public get data() {
    return this._data;
  }

  protected get isNew() {
    return this.persisted.isNew;
  }
  protected get isUpdated() {
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
