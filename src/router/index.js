import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Waiting from '@/components/Waiting'
import store from '@/store'
import playerBoard from '@/components/player_board'
import { client } from '@/deepstream'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter(to, from, next) {
        if (store.state.room_id != "") {
          next('/waiting')
          return
        }
        client.presence.unsubscribe();
        next()
      }
    },
    {
      path: '/waiting',
      name: 'Waiting',
      component: Waiting,
      beforeEnter(to, from, next) {
        if (store.state.room_id == "")
          next({ name: 'Home' })
        else
          next()
      }
    },
    {
      path: '/playing',
      name: 'playing',
      component: playerBoard
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path != '/playing') {
    if (store.state.playing)
      next('/playing')
    else next();
  }
  else next();
})

export default router