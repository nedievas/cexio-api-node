// Below follows examples for use of the public REST API with Promise interfaces
// To do authenticated requests follow the sam pattern, but provide userId, key and secret
// in the constructor of CEXIO(). See also private_rest.js.

const CEXIO = require('../index.js')
const cex = new CEXIO()
const cexRest = cex.promiseRest

cexRest.currency_limits().then(data => {
  console.log('Currency limits\n', data.pairs)
}).catch(err => {
  console.error(err)
})

cexRest.ticker('ETH/USD').then(data => {
  console.log('ETH/USD ticker\n', data)
}).catch(err => {
  console.error(err)
})

