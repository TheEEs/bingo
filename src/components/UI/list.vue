<template>
    <div>
      <transition-group name='room_list' enter-active-class="animated bounceIn" leave-active-class="animated bounceOutRight" tag='div'>
        <List v-for='item in lists' class='list-item' :key='item' @click.native='join' :data-room-id='item'> <icon icon='arrow-right' /> {{item | room_name}}</List>
      </transition-group>
    </div>
</template>

<style scoped>
.list-item {
  padding-bottom: 1rem;
  padding-top: 1rem;
  padding-left: 4rem;
  margin-top: 2px;
  margin-bottom: 4px;
  font-family: "Montserrat", sans-serif;
  padding-right: 5em;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>

<script>
import posed, { PoseTransition } from "vue-pose";
import { mapActions } from "vuex";
import _ from "lodash";
const COLOR = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#c0392b",
  "#d35400",
  "#f39c12"
];
function random_color() {
  return COLOR[_.random(0, COLOR.length - 1)];
}
export default {
  methods: {
    ...mapActions(["join_room"]),
    join(e) {
      this.join_room(e.target.dataset.roomId);
    }
  },
  props: {
    lists: {
      type: Array,
      required: true
    }
  },
  data: () => ({}),
  components: {
    List: posed.h5({
      hoverable: true,
      hover: {
        backgroundColor: random_color,
        transition: { duration: 300 }
      },
      init: {
        color: "#ecf0f1",
        backgroundColor: "#34495e"
      }
    }),
    PoseTransition
  },
  filters: {
    room_name(value) {
      return value.split("/").pop();
    }
  }
};
</script>
