const REST = require('./rest.js')

class CEXIO {
  constructor (clientId, apiKey, apiSecret) {
    this.clientId = clientId
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.rest = new REST(this.clientId, this.apiKey, this.apiSecret)
  }
}

module.exports = CEXIO
