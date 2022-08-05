
const logLevel = process.env.LOG_LEVEL || 'info';
const levels = {
  debug: 1,
  info: 2,
  warn: 3
};

class Logger {

  private client;
  public level;

  constructor() {
    this.client = console;
    this.level = levels[logLevel] || levels.info;
  }

  error(errorObj, message = '') {
    this.client.error(errorObj, message);
  }

  debug(message) {
    if (this.level <= 1) this.client.debug(message);
  }

  info(message) {
    if (this.level <= 2) this.client.info(message);
  }

  log(message) {
    this.info(message);
  }

  warn(message, err) {
    if (this.level <= 3) {
      this.client.warn(message);
      this.client.warn(err);
    }
  }

}

module.exports = new Logger();
