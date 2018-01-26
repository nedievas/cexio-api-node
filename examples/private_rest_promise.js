'use strict';

const CEXIO = require('../index.js');
const apiKey = 'YOUR-API-KEY';
const apiSecret = 'YOUR-API-SECRET';
const clientId = 'YOUR-USERNAME';


class TestClass {

  constructor (id, key, secret) {
    this.api = new CEXIO(id, key, secret).promiseRest;
  }

  async getBalances () {
    try {
        let balances = await this.api.account_balance();
        console.log(balances)
    } catch (e) {
      console.error(e);
    }

  }

}

let test = new TestClass(clientId, apiKey, apiSecret);

test.getBalances();
