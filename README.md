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
  - Mocha and Chai as testing framework
  - [pino]() logger
  - Sqlite for data with [knex]() as sql builder
  - [commanderjs]() as CLI API
  - `Future` [zod] for validations
  - `Future` [Bull]() for background tasks

## Software design principles

  - OOP
  - Active records
  - Layers: ( Domain <-- Repository ) --> ui
  - Dependency Injection
  - Integration testing with test DB
  - Unit testing for critical use cases

__Notes__:
  - Arrow --> means injected into.
  - Repository is the data persistance layer.

### OOP

__Active records__

- An object can persist itself. See [Active Record Pattern](https://en.wikipedia.org/wiki/Active_record_pattern)
- Repositories are injected into the Domain

Interesting thread between OOP with active records vs let's say, clean architecture:
[Link](https://softwareengineering.stackexchange.com/questions/379992/is-domain-persistence-model-isolation-usually-this-awkward)
