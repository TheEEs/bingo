<template>
    <div class='player_board cc-center columns cc-10-m cc-6-l cc-6-xl cc-12-s cc-12-xs'>
      <div class="columns cc-12">
        <h1  class="cc-6 cc-offset-3-m cc-offset-0-s cc-offset-0-xs title">BINGO</h1>
      </div>
       <h6 class="subtitle cc-12 cc-12-s cc-10-m cc-offset-3-m">ID của bạn : <b>{{ $store.state.user_id }}</b></h6>
       <div class="cc-12 columns cc-justify-center" >
         <button @click='get_out' id='exit-btn' class="btn cc-bg-blue cc-2 cc-4-s cc-4-xs" ><icon style='padding-right:4px' icon='minus-circle'/>Thoát</button>
       </div>
       <h6 class="subtitle cc-12 cc-12-s cc-10-m cc-offset-3-m">Number of lines : <b>{{ total_line }}</b></h6>
        <div class="columns cc-12 cc-justify-center" v-for="(row,row_index) in formated_room" :key='row_index'>
          <button class='cc-1-m cc-1-l cc-1-xl cc-2 picker' @click="select" :class="{disabled: grid[row_index][index]}" v-for='(item,index) in row' :data-y='row_index' :data-x='index' :key='"number"+index'>
              {{item}}
          </button>
        </div>
    <button hidden id='fire-modal' data-target="win-lose" class="cc-bg-primary modal-open">Click me</button>
    <div id="win-lose" data-disabled-overlay class="modal">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            Thông báo
        </div>
        <div class="modal-body">
            <h4 class="subtitle">{{notification}}</h4>
        </div>
        <div class="modal-footer">
            <a href="javascript:void(0)" @click='go_home' class="btn cc-bg-red" data-close-modal>Close</a>
        </div>
    </div>
</div>
    </div>
</template>
<style scoped>
#exit-btn {
  margin-left: 9px;
  font-family: "Nunito", sans-serif;
  margin-bottom: 4em;
}
.disabled {
  background-color: black;
  color: white;
}
button.picker {
  font-family: "Nunito", sans-serif;
  font-size: 1.3em;
  box-sizing: border-box;
  margin: 3px 3px 3px 3px;
}
button.picker:hover {
  background-color: #f1c40f;
}
div.player_board {
  margin-bottom: 50px;
}
.subtitle {
  padding-top: 0px;
  font-family: "Nunito", sans-serif;
}
.title {
  text-align: left;
  padding-left: 12px;
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 5em;
  content: "BINGO";
  font-family: "Montserrat", sans-serif;
}
</style>

<script>
import store from "@/store";
import Vue from "vue";
import { client } from "@/deepstream.js";
import { mapGetters, mapActions } from "vuex";
import { room_lists } from "@/store";
import Noty from "noty";
const WINNING_TARGET = 5;
export default {
  methods: {
    ...mapActions(["get_out"]),
    check_line(x, y) {
      let [horizontal_line, vertical_line] = [0, 0];
      let [diagonal_line, inverse_diagonal_line] = [0, 0];
      for (let i = 0; i < 5; i++) {
        horizontal_line += this.grid[y][i] ? 1 : 0;
      }
      this.total_line += horizontal_line == 5 ? 1 : 0;
      for (let i = 0; i < 5; i++) {
        vertical_line += this.grid[i][x] ? 1 : 0;
      }
      this.total_line += vertical_line == 5 ? 1 : 0;
      if (x == y) {
        for (let i = 0; i < 5; i++) {
          diagonal_line += this.grid[i][i] ? 1 : 0;
        }
        this.total_line += diagonal_line == 5 ? 1 : 0;
      } else if (x == 4 - y) {
        for (let i = 0; i < 5; i++) {
          inverse_diagonal_line += this.grid[i][4 - i] ? 1 : 0;
        }
        this.total_line += inverse_diagonal_line == 5 ? 1 : 0;
      }
    },
    select(e) {
      if (this.your_turn && this.$store.state.other_playing) {
        const y = e.target.dataset.y;
        const x = e.target.dataset.x;
        if (this.grid[y][x]) return;
        Vue.set(this.grid[y], x, true);
        client.event.emit(
          `player_picks/${this.$store.state.room_id}/${
            this.$store.state.user_id
          }`,
          { number: this.formated_room[y][x] }
        );
        this.check_line(x, y);
        if (this.total_line == WINNING_TARGET)
          client.event.emit(`winning_the_game/${this.$store.state.room_id}`, {
            player_id: this.$store.state.user_id
          });
        client.event.emit(`turn_change/${this.$store.state.room_id}`, {
          player_id: this.$store.getters.other_player
        });
      } else {
        new Noty({
          type: "warning",
          text: "<b>Chưa đến lượt của bạn!</b>",
          timeout: 900
        }).show();
      }
    },
    go_home(value) {
      this.$store.dispatch("get_out");
    }
  },
  data: function() {
    return {
      total_line: 0,
      notification: "Thua sấp mặt",
      your_turn: true,
      grid: [
        new Array(5).fill(false),
        new Array(5).fill(false),
        new Array(5).fill(false),
        new Array(5).fill(false),
        new Array(5).fill(false)
      ]
    };
  },
  computed: {
    ...mapGetters(["formated_room", "players"])
  },
  created() {
    client.event.subscribe(
      `player_picks/${this.$store.state.room_id}/${
        this.$store.getters.other_player
      }`,
      data => {
        let [x, y] = [0, 0];
        for (y = 0; y < this.formated_room.length; y++) {
          if ((x = this.formated_room[y].indexOf(data.number)) > -1) {
            Vue.set(this.grid[y], x, true);
            this.check_line(x, y);
            if (this.total_line == WINNING_TARGET)
              client.event.emit(
                `winning_the_game/${this.$store.state.room_id}`,
                {
                  player_id: this.$store.state.user_id
                }
              );
            return;
          }
        }
      }
    );
    client.event.subscribe(
      `winning_the_game/${this.$store.state.room_id}`,
      data => {
        const fire_modal = document.getElementById('fire-modal')
        if (this.$store.state.playing)
          if (data.player_id == this.$store.state.user_id) {
            this.notification = "Vì ăn may nên bạn đã thắng";
            const e = new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: false
            });
            fire_modal.dispatchEvent(e);
          } else {
            this.notification = "Bạn đã thua sấp mặt";
            const e = new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: false
            });
            fire_modal.dispatchEvent(e);
          }
        this.$store.commit("set_playing", false);
      }
    );
    client.event.subscribe(`turn_change/${this.$store.state.room_id}`, data => {
      if (data.player_id == this.$store.state.user_id) {
        this.your_turn = true;
        new Noty({
          type: "warning",
          text: "Lượt của bạn",
          timeout: 900
        }).show();
      } else this.your_turn = false;
    });
  },
  beforeRouteEnter(to, from, next) {
    if (!store.state.playing) next(from.path);
    else {
      next();
    }
  }
};
</script>
