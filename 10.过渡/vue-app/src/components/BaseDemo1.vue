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

.box-leave,
.box-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

.box-leave-active,
.box-enter-active {
  transition: opacity 1s, transform 1s;
}

.box-leave-to,
.box-enter {
  opacity: 0;
  transform: translateX(300px);
}
</style>


