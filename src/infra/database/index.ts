import { Knex } from "knex";
import dbConfig from '../../../knexfile'
import { appConfig } from "../config";

export const db: Knex = require("knex")(dbConfig[appConfig.node_env]);
