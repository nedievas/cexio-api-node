const REST = require('./rest.js')
const WS = require('./ws.js')

class CEXIO {
  constructor (clientId, apiKey, apiSecret) {
    this.clientId = clientId
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.rest = new REST(this.clientId, this.apiKey, this.apiSecret)
    this.ws = new WS(this.clientId, this.apiKey, this.apiSecret)
  }
}

module.exports = CEXIO
