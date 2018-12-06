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
h6{
  text-align: center;
  font-family: 'Montserrat',sans-serif;
}
</style>
<script>
import { client } from "@/deepstream.js";
import { mapGetters } from "vuex";
export default {
  name: "App",
  created() {
    window.onbeforeunload = e => {
      this.$store.dispatch("get_out");
      client.event.unsubscribe();
    };
  },
  methods: {
    has_no_room(){
      return this.$store.state.rooms.length == 0
    }
  }
};
</script>

<style>
</style>
