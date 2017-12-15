const REST = require('./rest.js')
const WebSocket = require('./websocket.js')

class CEXIO {
  constructor (clientId, apiKey, apiSecret) {
    this.clientId = clientId
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.rest = new REST(this.clientId, this.apiKey, this.apiSecret)
    this.ws = new WebSocket(this.apiKey, this.apiSecret)
  }
}

module.exports = CEXIO
