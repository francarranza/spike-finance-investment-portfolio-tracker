require('dotenv').config()

export const appConfig = {
  db: {
    filepath: process.env.DB_FILEPATH || "data/dev.sqlite"
  }
}

