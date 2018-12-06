<template>
<div class='columns cc-justify-center'>
    <div class="columns cc-12 cc-justify-center">
        <div class="cc-6-m cc-10 columns">
          <h1 id="title" class=" type-it cc-center cc-10 cc-6-m">BINGO</h1>
        </div>
    </div>
    <div class="columns cc-12 cc-justify-center">
        <div class="cc-8 columns cc-justify-center">
          <form action="#" class='cc-orange cc-10 cc-6-m'>
            <div class="form-item cc-chained">
              <input v-model='room_name' type="text" maxlength="47" placeholder="Tên phòng">
              <input v-model='room_description' type="text" placeholder="Mô tả">
              <input @click="create_room" type="submit" value="Tạo phòng">
            </div>
          </form>
        </div>
    </div>
    <div class="columns cc-12 cc-justify-center">
    <div class="cc-10 cc-4-m">
        <roomList :lists='rooms'></roomList>
    </div>
</div>
</div>
</template>
<style scoped>
h1#title {
  font-size: 3.8em;
  text-align: center;
  padding-left: 0px;
  padding-right: 0px;
  font-family: "Montserrat", sans-serif;
}
</style>

<script>
import { client } from "@/deepstream.js";
import { mapGetters } from "vuex";
import posed from "vue-pose";
import { subscribe, subscribe_rooms, unsubscribe_rooms } from "@/store";
import Noty from "noty";
import roomList from "@/components/UI/list";
export default {
  mounted() {
  },
  data: function() {
    return {
      room_name: "",
      room_description: ""
    };
  },
  components: {
    roomList: roomList
  },
  methods: {
    has_room() {
      return this.$store.state.rooms.length == 0;
    },
    create_room(e) {
      if (this.room_name != "") {
        this.$store.dispatch(
          "create_room",
          this.room_name,
          this.room_description
        );
      } else {
        new Noty({
          type: "error",
          text: "Tên phòng không được để trống",
          timeout: 900
        }).show();
      }
      e.preventDefault();
    },
    change_room_name(e) {
      this.room_name = e.target.value;
    },
    getout() {
      this.$store.dispatch("get_out");
    },
    join_room(e) {
      this.$store.dispatch("join_room", e.target.dataset.room);
    },
    room_watcher(entries) {
      this.rooms = entries;
    }
  },
  computed: {
    ...mapGetters(["rooms"])
  },
  created() {
    client.event.subscribe("rooms/changes", data => {});
    window.onunload = e => {
      unsubscribe_rooms();
    };
  },
  filters: {
    room_name(value) {
      return value.split("/").pop();
    }
  }
};
</script>
