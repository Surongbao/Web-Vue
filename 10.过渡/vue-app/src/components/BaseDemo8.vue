<template>
  <div class="demo">
    <button class="btn" @click="show = !show">切换</button>
    <transition
      appear
      v-on:before-appear="customBeforeAppearHook"
      v-on:appear="customAppearHook"
      v-on:after-appear="customAfterAppearHook"
      v-on:appear-cancelled="customAppearCancelledHook"
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
    customBeforeAppearHook(el) {
      this.left = 300;
      el.style.transform = `translateY(${this.left}px)`;
    },
    customAppearHook(el, done) {
      let timer = setInterval(() => {
        this.left -= 10;
        el.style.transform = `translateY(${this.left}px)`;
        if (this.left <= 0) {
          clearInterval(timer);
          timer = null;
          done();
        }
      }, 16);
    },
    customAfterAppearHook(el) {
      console.log("over");
      el.style.backgroundColor = "pink";
    },
    customAppearCancelledHook() {},
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


