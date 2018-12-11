<template>
    <div>
        <transition name='loading' mode='out-in' enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <template v-if='!can_play'>
            <div>
                <div class="cc-loader">
                  <div class="spinner"></div>
                </div>
                <h5 id='wating'>Đang chờ người chơi thứ hai</h5>
            </div>
          </template>
        </transition>
        <div class="columns cc-justify-center cc-10 cc-12-s cc-12-xs heading">
          <button @click="get_out" class="cc-4-s cc-2 cc-1-m btn cc-bg-red cc-outlined"> <icon icon='sign-out-alt' />Thoát</button>
        </div>
        <div class="columns cc-justify-center cc-10 cc-12-s cc-12-xs">
          <Sketch />
        </div>
    </div>
</template>
<style scoped>
button {
  margin-bottom: 6px;
}
div.heading {
  margin-top: 4rem;
}
button {
  font-family: "Nunito", sans-serif;
}
h5 {
  text-align: center;
  font-family: "Nunito", sans-serif;
  min-height: 1.6em;
}
</style>

<script>
import Sketch from "@/components/grid_builder.vue";
import { mapGetters, mapActions } from "vuex";
import { room_lists } from "@/store";
import { client } from "@/deepstream";
import Typed from "typed.js";
import Noty from "noty";
export default {
  created() {
    client.event.subscribe(`play/${this.$store.state.room_id}`, data => {
      if (data.user_id != this.$store.state.user_id) {
        this.$store.commit("set_other_playing", data.status);
      }
    });
    this.unsubscribe_joining();
    /*client.event.subscribe(`join/${this.$store.state.room_id}`, data => {

      new Noty({
        type: "warning",
        text: `Người chơi <b style='color:#2c3e50'>${
          data.player_id
        }</b> đã tham gia`,
        timeout: 900
      }).show();
    });*/
  },
  destroyed() {
    //this.unsubscribe_joining();
  },
  beforeRouteLeave(to, from, next) {
    //this.unsubscribe_joining();
    next();
  },
  mounted() {
    try {
      var typed2 = new Typed("#wating", {
        strings: [
          "Đang chờ người chơi thứ hai",
          "Hãy xây dựng bảng chơi của bạn"
        ],
        typeSpeed: 34,
        backSpeed: 8,
        cursorChar: "",
        fadeOut: true,
        loop: true
      });
    } catch (e) {}
  },
  computed: {
    ...mapGetters(["players", "can_play", "other_player"])
  },
  methods: {
    unsubscribe_joining() {
      client.event.unsubscribe(`join/${this.$store.state.room_id}`);
    },
    ...mapActions(["get_out"])
  },
  components: {
    Sketch
  }
};
</script>
