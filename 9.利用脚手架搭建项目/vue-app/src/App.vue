<template>
  <div class="app">
    <base-level :level="1" v-slot="{ txt }"
      >标题1
      <h1>{{ txt }}</h1>
    </base-level>
    <base-level :level="2">标题2</base-level>
    <base-level :level="3">标题3</base-level>
    <base-level :level="4">标题4</base-level>
    <base-level :level="5">标题5</base-level>
    <base-level :level="6">标题6</base-level>
  </div>
</template>

<script>
import BaseLevel from "./components/BaseLevel";
export default {
  components: {
    BaseLevel,
  },
};
</script>

<style scoped>
</style>