
TODO
  - Accounts
    - Get whole balance in selecting any currency
    - Expenses features: Insert, getBalance()
    - Income features: Insert, getBalance()

  - Currencies:
    - Get daily rates from external service. ISO: EUR, USD, ARS, ARS blue, GBP

  - Imports
    - Transactions from custom csv (select matching columns)
    - Transaction from template. Eg: N26 export

  - Investments: Stock, Crypto, ETF
    - Exchange Rates for stocks and crypto. Similar to currency rates
    - Get daily rates from external service: Price and volume.
    - Transfer money to these accounts, can have fees.
    - Buy / Sell. With fees and rate at that moment
    - Portfolio net worth in selected currency
    - Portfolio performance by time frame. By %
    - Individual asset performance by time frame. 
      Eg: MELI I could have bought and selled many times, at different prices
    - Compare my performance with others such as SP500, Nasdaq100, an ETF, etc.


0.2
  - Feature `Account`: Get account balance selecting currency
  - Feature `Account`: Get balance now supporting transfers between accounts
  - Feature `Currency`: Add currency rates (ingest manually via CLI)

0.1
  - Feature: `Account`: Transfer money from account A to account B
  - Feature: `Account`: Update account balance
    - Added CLI support
  - Feature: `Account`: Create account with currency
  - Feature: `Currency`: Create
