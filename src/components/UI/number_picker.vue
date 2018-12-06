<template>
    <div id='border' class='columns cc-2 cc-justify-center cc-align-center'>
        <MyText @click.native='clicked' class=''>{{number ? number: ''}}</MyText>
    </div>
</template>
<style scoped>
h5 {
  text-align: center;
  background-color: #e67e22;
  border-radius: 9px;
  color: white;
  vertical-align: baseline;
  max-height: 6rem;
  font-family: "Nunito", sans-serif;
  margin-top: 0px;
  margin-bottom: 0px;
  cursor: pointer;
}
#border {
  margin-top: 2rem;
  margin-left: 5px;
  margin-right: 5px;
}
</style>
<script>
import posed from "vue-pose";
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
    clicked(e) {
      this.$emit("click", { x: this.x, y: this.y });
    }
  },
  props: {
    number: {
      type: Number,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  },
  data: () => ({}),
  components: {
    MyText: posed.h5({
      init: {
        backgroundColor: random_color,
        borderStyle: "solid",
        borderWidth: "1.78px",
        borderColor: "#34495e",
        verticalAlign: "baseline",
        textAlign: "center",
        maxWidth: "6rem",
        maxHeight: "6rem",
        borderRadius: "23px",
        color: "white",
        fontFamily: '"Montserrat",san-serif',
        cursor: "pointer",
      },
      hoverable: true,
      hover: {
        backgroundColor: "#2c3e50"
      }
    })
  }
};
</script>
