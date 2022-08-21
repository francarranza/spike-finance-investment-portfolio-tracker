/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
  error(message: any, errObject?: Error): void;
  debug(message: any, errObject?: Error): void;
  info(message: any, errObject?: Error): void;
  warn(message: any, errObject?: Error): void;
}

export enum LogLevels {
  debug = 1,
  info = 2,
  warn = 3,
}
