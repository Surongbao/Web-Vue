<template>
  <div class="demo">
    <button class="btn" @click="show = !show">切换</button>
    <transition name="box">
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

.box-enter-active {
  animation: move 1s ease;
}

.box-leave-active {
  animation: move 1s ease reverse;
}

@keyframes move {
  0% {
    opacity: 0;
    transform: translateX(300px) rotateZ(0deg);
  }

  50% {
    opacity: 0.5;
    transform: translateX(150px) rotateZ(180deg);
  }

  100% {
    opacity: 1;
    transform: translateX(0px) rotateZ(0deg);
  }
}
</style>


