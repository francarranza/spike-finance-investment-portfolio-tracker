/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILogger, LogLevels } from "./definitions";


export class SilentLogger implements ILogger {

  private client: Console;
  public level: LogLevels;

  constructor() {
    this.client = console;
    this.level = LogLevels.debug;
  }

  debug() {
    return;
  }

  info() {
    return;
  }

  warn() {
    return;
  }

  error() {
    return;
  }

  table() {
    return;
  }

}
