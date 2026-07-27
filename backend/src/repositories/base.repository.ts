import { EntityManager } from "typeorm";
import AppDataSource from "../config/db.ts";


export class Manager{
  public manager: EntityManager;

  constructor(transactionalManager?: EntityManager){
    this.manager = transactionalManager || AppDataSource.manager;
  }
}