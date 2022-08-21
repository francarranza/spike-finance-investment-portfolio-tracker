/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILogger, LogLevels } from "./definitions";


export class ConsoleLogger implements ILogger {

  private client: Console;
  public level: LogLevels;

  constructor() {
    this.client = console;
    this.level = LogLevels.debug;
  }

  debug(message: any, errorObj?: Error) {
    if (this.level <= 1) this.client.debug(message, errorObj);
  }

  info(message: any, errorObj?: Error) {
    if (this.level <= 2) this.client.info(message, errorObj);
  }

  warn(message: any, err?: Error) {
    if (this.level <= 3) {
      this.client.warn(message, err);
    }
  }

  error(message: any, errorObj?: Error) {
    this.client.error(message, errorObj);
  }

  table(message: any | Array<any>) {
    this.client.table(message);
  }

}
