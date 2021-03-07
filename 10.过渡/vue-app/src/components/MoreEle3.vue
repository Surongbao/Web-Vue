<template>
  <div class="more">
    <button class="btn" @click="show = !show">点击</button>
    <transition>
      <!-- <div class="box" :key="keyValue">Hello {{ keyValue }}</div> -->

      <!-- <component v-if="show" :is="'MoreEle1'"></component>
      <component v-else :is="'MoreEle2'"></component> -->

      <component :is="cmp"></component>
    </transition>
  </div>
</template>

<script>
import MoreEle1 from "./MoreEle3-1";
import MoreEle2 from "./MoreEle3-2";

export default {
  components: {
    MoreEle1,
    MoreEle2,
  },

  data() {
    return {
      show: true,
    };
  },
  computed: {
    cmp() {
      return this.show ? "MoreEle1" : "MoreEle2";
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

.v-enter-to {
  transform: translateX(0px);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.1s;
}

.v-leave {
  transform: translateX(0px);
}
.v-leave-to {
  transform: translateX(-100px);
}
</style>