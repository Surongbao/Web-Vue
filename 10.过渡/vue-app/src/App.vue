<template>
  <div id="app">
    <!-- <base-demo></base-demo> -->
    <!-- <more-ele></more-ele> -->
    <!-- <base-group></base-group> -->
    <!-- <button @click="show = !show">点击</button> -->
    <!-- <copy-transition>
      <div v-if="show" class="box"></div>
    </copy-transition>
    <copy-transition>
      <div v-if="show" class="box"></div>
    </copy-transition> -->
    <!-- <copy-transition>
      <div key="vue" v-if="show" class="box">Hello Vue</div>
      <div key="world" v-else class="box">Hello World</div>
    </copy-transition> -->
    <!-- <copy-transition>
      <template v-if="show">
        <li v-for="num in 5" :key="num">{{ num }}</li>
      </template>
    </copy-transition> -->

    <button @click="show = true">加载</button>

    <async-cmp1 v-if="show"></async-cmp1>
    <async-cmp2 v-if="show"></async-cmp2>
  </div>
</template>

<script>
// import MoreEle from "./components/MoreEle3";
// import BaseDemo from "./components/BaseDemo9";
// import BaseGroup from "./components/BaseGroup3";
// import CopyTransition from "./components/CopyTransition";

export default {
  name: "App",
  components: {
    // BaseDemo,
    // MoreEle,
    // BaseGroup,
    // CopyTransition,
    AsyncCmp1: () =>
      import(/* webpackChunkName: 'async' */ "./components/AsyncCmp1"),
    AsyncCmp2: () =>
      import(/* webpackChunkName: 'async' */ "./components/AsyncCmp2"),
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>


<style scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  margin-bottom: 10px;
}
</style>


