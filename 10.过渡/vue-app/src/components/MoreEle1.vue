<template>
  <div class="more">
    <button @click="show = !show">点击</button>
    <transition mode="out-in">
      <div :key="keyValue">Hello {{ keyValue }}</div>
      <!-- <div v-if="show" key="world">Hello World</div>
      <div v-else key="vue">Hello Vue</div> -->
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
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-leave-active,
.v-enter-active {
  transition: all 0.5s;
}

.v-leave,
.v-enter-to {
  opacity: 1;
}
</style>