const ds = require('deepstream.io-client-js')(`${window.location.hostname}:6020`)
const uuidv4 = require('uuid/v4');
const username = uuidv4();
const client = ds.login({
    username: username
})
const room_name = localStorage['room_name']
if (room_name) {
    const room = client.record.getRecord(room_name)
    room.whenReady(record => {
        record.delete()
    })
}
export { client ,username }

client.on('error', () => {

})
