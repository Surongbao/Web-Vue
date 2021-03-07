<template>
  <div class="demo">
    <button class="btn" @click="show = !show">切换</button>
    <transition
      enter-active-class="animate__animated animate__bounceOutUp"
      leave-active-class="animate__animated animate__fadeOutLeftBig"
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
    };
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

.enter,
.leave-to {
  opacity: 0;
}

.enter-active,
.leave-active {
  transition: all 1s;
}

.leave,
.enter-to {
  opacity: 1;
}
</style>


