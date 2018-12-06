const ds = require('deepstream.io-client-js')(`${window.location.hostname}:6020`)
const client = ds.login()

export { client }

client.on('error', () => {

})