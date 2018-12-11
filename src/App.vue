<template>
  <div class="columns">
    <transition enter-active-class="animated tada" leave-active-class="animated bounceOut" mode='out-in'>
      <router-view />
    </transition>
    <template v-if='$route.path == "/" && has_no_room()'>
      <div class="cc-12">
      <div>
        <h6>chưa có phòng nào...</h6>
      </div>
      <div class="cc-loader">
        <div class="spinner" />
      </div>
      </div>
    </template>
  </div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat|Nunito");
h6 {
  text-align: center;
  font-family: "Montserrat", sans-serif;
}
</style>
<script>
import { client, user_uuid } from "@/deepstream.js";
import { mapGetters } from "vuex";
const { detect } = require("detect-browser");
import $ from "jquery";

export default {
  name: "App",
  created() {
    const browser = detect();
    const os_name = browser.os;
    const event_name =
      os_name == "iOS" || os_name == "Android OS" ? "pagehide" : "beforeunload";
    client.presence.unsubscribe();
    window.addEventListener(event_name, e => {
      this.$store.dispatch("get_out");
      client.event.unsubscribe();
      client.presence.unsubscribe();
    });
  },
  methods: {
    has_no_room() {
      return this.$store.state.rooms.length == 0;
    }
  }
};
</script>

<style>
</style>
