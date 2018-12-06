import Vuex from 'vuex'
import Vue from 'vue'
import router from '@/router'
Vue.use(Vuex)
import { client } from '@/deepstream'
import _ from 'lodash'
const room_lists = client.record.getList('lists/rooms')
const store = new Vuex.Store({
    state: {
        room_name: "",
        room_id: "",
        user_id: client.getUid(),
        player1: "",
        player2: "",
        rooms: [],
        playing: false,
        other_playing: false,
        grid: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        number: 1
    },
    mutations: {
        set_other_playing(state, status) {
            state.other_playing = status
        },
        set_playing(state, status) {
            state.playing = status
        },
        set_number(state, number) {
            state.number = number
        },
        set_grid(state, { grid, number }) {
            console.log('number')
            state.grid = grid
            state.number = number
        },
        set_rooms(state, rooms) {
            state.rooms = rooms
        },
        set_room_name(state, room_name) {
            state.room_name = room_name
        },
        set_room_id(state, room_id) {
            state.room_id = room_id
        },
        set_player1(state, player_id) {
            state.player1 = player_id
        },
        set_player2(state, player_id) {
            state.player2 = player_id
        },
        erease_room_data(state) {
            state.room_name = ""
            state.room_id = ""
            state.player1 = ""
            state.player2 = ""
        }

    },
    getters: {
        other_player(state) {
            if (state.player1 == state.user_id) return state.player2
            else return state.player1
        },
        formated_room(state) {
            return state.grid
        },
        is_admin(state, getters) {
            return state.user_id == state.player1
        },
        players(state) {
            return { player1: state.player1, player2: state.player2 }
        },
        rooms(state) {
            return state.rooms
        },
        can_play(state) {
            return state.player1 != '' && state.player2 != ''
        }
    },
    actions: {
        create_room(context, room_name, description = '') {
            context.commit("set_room_name", room_name)
            const room_id = `rooms/${context.state.user_id}/${context.state.room_name}`
            const room = client.record.getRecord(room_id)
            context.commit('set_room_id', room_id)
            context.commit("set_player1", context.state.user_id)
            room_lists.addEntry(room_id)
            //room.set('player1', context.state.player1)
            //room.set('description',description)
            room.set({
                player1: context.state.player1,
                description
            })
            //wait for player2 joining the room or see if he/she get out
            room.subscribe('player2', player2 => {
                context.commit("set_player2", player2)
            })
            room.subscribe('player1', player1 => {
                context.commit('set_player1', player1)
            })
            room.on('delete', () => {
                room_lists.removeEntry(context.state.room_id)
                context.commit("erease_room_data") //delete room id , room name , players's information
                router.push({ name: "Home" })
            })
            router.push({ name: 'Waiting' })
        },
        join_room(context, room_id) {
            const room = client.record.getRecord(room_id)
            room.whenReady(record => {
                if (record.get('player2'))
                    return;
                const room_name = room_id.split('/').pop()
                context.commit("set_room_name", room_name)
                context.commit("set_room_id", room_id)
                context.commit("set_player2", context.state.user_id)
                room.set("player2", context.state.user_id)
                const player1 = room.get('player1')
                context.commit('set_player1', player1)
                //watch if admin is out of the group, so you become admin
                room.subscribe('player1', player1 => {
                    context.commit('set_player1', player1)
                })
                room.subscribe('player2', player2 => {
                    context.commit('set_player2', player2)
                })
                room.on('delete', () => {
                    room_lists.removeEntry(room_id)
                    context.commit("erease_room_data") //delete room id , room name , players's information
                    router.push({ name: "Home" })
                })
                room_lists.removeEntry(room_id)
                router.push({ name: "Waiting" })
                client.event.emit(`join/${room_id}`, { player_id: context.state.user_id })
            })
        },
        delete_room(context) {
            if (context.state.user_id == context.state.player1) {
                //if you are admin
                const room = client.record.getRecord(context.state.room_id)
                room.delete()
            }
        },
        get_out(context) {
            if (context.state.playing) {
                client.event.emit(`winning_the_game/${context.state.room_id}`, { player_id: context.getters.other_player })
                client.event.emit(`play/${context.state.room_id}`, {
                    user_id: context.state.user_id, status: false
                })
            }
            const room = client.record.getRecord(context.state.room_id)
            if (context.getters.is_admin) {
                if (context.state.player2 == "") {
                    context.dispatch("delete_room")
                    return
                }
                const player2 = room.get('player2')
                room.set('player1', player2)
                room.set('player2', "")
                room_lists.addEntry(context.state.room_id)
                context.commit('erease_room_data')
                router.push('/')
            }
            else if (context.state.player2 == context.state.user_id) {
                room.set('player2', "")
                room_lists.addEntry(context.state.room_id)
                context.commit("erease_room_data")
                router.push('/')
            }
            //client.event.emit(`join/${room_id}`, { player_id: ""})
        }
    }
})
export default store
function subscribe(entries) {
    store.commit("set_rooms", entries.reverse())
}
function subscribe_rooms() {
    room_lists.subscribe(subscribe)
}
function unsubscribe_rooms() {
    room_lists.unsubscribe(subscribe)
}
export { subscribe, subscribe_rooms, unsubscribe_rooms, room_lists }
subscribe_rooms()