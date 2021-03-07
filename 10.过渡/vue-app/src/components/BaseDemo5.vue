<template>
  <div class="demo">
    <button class="btn" @click="show = !show">切换</button>
    <transition
      type="animation"
      enter-active-class="animate__animated animate__shakeX v-enter-active"
      leave-active-class="animate__animated animate__shakeY v-leave-active"
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

.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 10s;
}

.v-leave,
.v-enter-to {
  opacity: 1;
}
</style>


