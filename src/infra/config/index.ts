require('dotenv').config()

export const appConfig = {
  node_env: process.env.NODE_ENV || 'development',
  db: {
    filepath: process.env.DB_FILEPATH || "data/dev.sqlite"
  }
}

