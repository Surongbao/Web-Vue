<template>
  <div class="more">
    <button class="btn" @click="show = !show">点击</button>
    <transition mode="in-out">
      <div class="box" :key="keyValue">Hello {{ keyValue }}</div>
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
  computed: {
    keyValue() {
      return this.show ? "vue" : "world";
    },
  },
};
</script>

<style scoped>
.btn {
  display: block;
  margin-bottom: 10px;
}

.box {
  display: inline-block;
}

.v-enter {
  transform: translateX(100px);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.1s;
}

.v-enter-to {
  transform: translateX(0px);
}
.v-leave {
  transform: translateX(0px);
}
.v-leave-to {
  transform: translateX(-100px);
}
</style>