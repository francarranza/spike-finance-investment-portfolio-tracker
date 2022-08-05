# Spike Personal Finance Tracker

## Description

- Keep record of the status of your accounts.
- Manage different currencies and get the whole balance in one.
- Add movements between accounts to keep track where your money is going.

__Security__
- You own your data. All information is stored locally in your computer.

__Portfolio tracker__
- Manage and visualize investment portfolios
- Keep track of stocks and crypto assets
- Measure performance by time window of your portfolio investments

__Expenses tracker__
- Add expenses from an account
- Import your bank's statement expenses summary.

__Income tracker__
- Add income to an account.

__Crypto wallet__
- Connect to your metamask account to import all your movements.


## Tech stack

  - Nodejs 16 + Typescript + Yarn
  - [typeDI]() for dependencies managment
  - Mocha and Chai as testing framework
  - [pino]() logger
  - Sqlite for data with [knex]() as sql builder
  - [zod] for validations
  - `Future` [Bull]() for background tasks
  - [commanderjs]() as CLI API

## Software design principles

  - SOLID
  - Hexagonal or similar architecture
  - Integration testing
  - Unit testing for critical use cases
