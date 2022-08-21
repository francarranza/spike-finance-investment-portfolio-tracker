import { Logger, LogLevels } from "./definitions";


export class PinoLogger implements Logger {

  private client: Console;
  public level: LogLevels;

  constructor() {
    throw new Error('Not implemented yet')
    this.client = console;
    this.level = LogLevels.debug;
  }

  debug(message: string, errorObj?: Error) {
    if (this.level <= 1) this.client.debug(message, errorObj);
  }

  info(message: string, errorObj?: Error) {
    if (this.level <= 2) this.client.info(message, errorObj);
  }

  warn(message: string, err?: Error) {
    if (this.level <= 3) {
      this.client.warn(message, err);
    }
  }

  error(message = '', errorObj?: Error) {
    this.client.error(message, errorObj);
  }

}
