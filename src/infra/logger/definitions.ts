/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILogger {
  error(message: any, errObject?: Error): void;
  debug(message: any, errObject?: Error): void;
  info(message: any, errObject?: Error): void;
  warn(message: any, errObject?: Error): void;
  table(message: any): void;
}

export enum LogLevels {
  debug = 1,
  info = 2,
  warn = 3,
}
