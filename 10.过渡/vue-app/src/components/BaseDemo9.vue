<template>
  <div class="demo">
    <button class="btn" @click="show = !show">切换</button>
    <transition
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="show" class="box"></div>
    </transition>
  </div>
</template>

<script>
import Velocity from "velocity-animate";
export default {
  data() {
    return {
      show: true,
      left: 0,
    };
  },

  methods: {
    beforeEnter(el) {
      el.style.opacity = 0;
    },
    enter(el, done) {
      Velocity(el, { opacity: 1 }, { duration: 500 });
      Velocity(el, { translateX: 200 }, { duration: 300 });
      Velocity(el, { translateY: 200 }, { duration: 300 });
      Velocity(el, { rotateZ: 45 }, { duration: 300 });
      Velocity(el, { rotateZ: -45 }, { duration: 300 });
      Velocity(el, { rotateZ: 0 }, { duration: 300 });
      Velocity(el, { opacity: 0 }, { duration: 300, loop: 3, complete: done });
    },
    afterEnter(el) {
      console.log("over");
      el.style.backgroundColor = "green";
    },
    leave(el, done) {
      Velocity(el, { rotateZ: 45 }, { duration: 300 });
      Velocity(el, { rotateZ: -45 }, { duration: 300 });
      Velocity(el, { rotateZ: 0 }, { duration: 300 });
      Velocity(el, { translateY: 0 }, { duration: 300 });
      Velocity(el, { translateX: 0 }, { duration: 300 });
      Velocity(el, { opacity: 0 }, { duration: 500, loop: 3, complete: done });
    },
    afterLeave(el) {
      console.log("完成");
      el.style.opacity = 1;
      el.style.backgroundColor = "pink";
    },
  },
};
</script>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: red;
}

.btn {
  margin-bottom: 10px;
}
</style>


