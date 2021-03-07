<template>
  <div class="demo">
    <button class="btn" @click="show = !show">切换</button>
    <transition
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @enter-cancelled="enterCancelled"
    >
      <div v-show="show" class="box"></div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      left: 0,
    };
  },

  methods: {
    beforeEnter(el) {
      if (this.timer) {
        return;
      }
      this.left = 300;
      el.style.transform = `translateX(${this.left}px)`;
    },
    enter(el, done) {
      console.log(el);
      // done.canceled = true;
      this.timer = setInterval(() => {
        this.left -= 10;
        if (this.left <= 0) {
          this.left = 0;
          clearInterval(this.timer);
          this.timer = null;
          done();
        }
        el.style.transform = `translateX(${this.left}px)`;
      }, 16);
    },
    afterEnter(el) {
      console.log("over");
      el.style.backgroundColor = "green";
    },
    enterCancelled() {
      console.log("取消动画");
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


