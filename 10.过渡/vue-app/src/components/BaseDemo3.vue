<template>
  <div class="demo">
    <button class="btn" @click="show = !show">切换</button>
    <transition
      enter-class="enter"
      enter-active-class="enter-active"
      enter-to-class="enter-to"
      leave-class="leave"
      leave-active-class="leave-active"
      leave-to-class="leave-to"
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


