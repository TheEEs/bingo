<template>
    <div id='grid-builder' class='columns cc-6-m cc-4-l cc-4-xl cc-12-s cc-12-xs'>
        <!--div v-for="(row,row_index) in grid" :key='row_index'>
            <button @click='set_tile' v-for='(item,index) in row' :data-y='row_index' :data-x='index' :key='"number"+index'>
                {{grid[row_index][index]}}
            </button>
        </div>
        <hr-->
        <div class="columns cc-justify-center cc-12">
          <button @click='generate' class='btn cc-bg-orange cc-3-m cc-10-s cc-outlined'><icon icon='pencil-alt'/>Tạo bảng tự động</button>
          <button @click='clear' class='btn cc-bg-blue cc-3-m cc-5-s cc-outlined'> <icon icon='broom'/> Xóa bảng</button>
          <button :class='can_play_class' class='btn cc-bg-purple cc-3-m cc-5-s cc-outlined' @click='play'> <icon icon='play'/> Chơi</button>
            <!--button @click='generate'>auto-Generate</button>
            <button @click='clear'>Clear</button-->
        </div>
        <hr>
      
        <div class='columns cc-justify-center cc-12' v-for="(row,row_index) in grid" :key='row_index'>
          <Picker @click='set_tile' v-for='(item,index) in row' :y='row_index' :x='index' :key='`${index}`+ item' :number='grid[row_index][index]' />
        </div>
    </div>
</template>
<style scoped>
.picker-move {
  transition: transform 0.4s;
}
#grid-builder {
  margin-bottom: 5em;
}
button {
  margin-top: 6px;
  margin-bottom: 6px;
  margin-left: 3px;
  margin-right: 3px;
}
</style>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import Vue from "vue";
import Picker from "./UI/number_picker";
import {client} from '@/deepstream'
import _ from "lodash";
export default {
  components: {
    Picker
  },
  data: function() {
    return {
      grid: [[], [], [], [], []],
      number: 1
    };
  },
  beforeDestroy() {
    this.$store.commit("set_grid", {
      grid: _.cloneDeep(this.grid),
      number: this.number
    });
  },
  created() {
    this.grid = _.clone(this.$store.state.grid);
    this.number = this.$store.state.number;
  },
  computed: {
    ...mapGetters(["can_play"]),
    can_play_class() {
      return {
        "cc-disabled": this.number < 26 || !this.can_play 
      };
    }
  },
  methods: {
    play(e) {
      if (this.$store.state.number == 26 && this.can_play) {
        client.event.emit(`play/${this.$store.state.room_id}`, {
          user_id: this.$store.state.user_id,
          status: true
        });
        this.$store.commit("set_playing", true);
        this.$router.push("/playing");
      }
    },
    set_tile(e) {
      if (this.number == 26) return;
      const x = parseInt(e.x);
      const y = parseInt(e.y);
      if (this.grid[y][x] == 0) Vue.set(this.grid[y], x, this.number++);
      this.$store.commit("set_number", this.number);
    },
    generate(e) {
      let new_array = _.range(1, 26);
      new_array = _.shuffle(new_array);
      const chunked_array = _.chunk(new_array, 5);
      chunked_array.forEach((array, index) => {
        Vue.set(this.grid, index, array);
      });
      this.number = 26;
      this.$store.commit("set_number", this.number);
    },
    clear(e) {
      this.grid = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
      this.number = 1;
    }
  }
};
</script>
