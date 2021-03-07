<template>
  <ul class="tree">
    <li class="tree-node" v-for="(item, index) in list" :key="item.label">
      <i
        v-if="item.children"
        class="iconfont"
        :class="{
          'icon-down': !showList[index],
          'icon-right': showList[index],
        }"
      ></i>
      <span @click="handleClick(index)" class="label">{{ item.label }}</span>
      <keep-alive>
        <base-tree
          v-if="showList[index] && item.children"
          :data="item.children"
        />
      </keep-alive>
    </li>
  </ul>
</template>


<script>
export default {
  name: "base-tree",
  props: {
    data: {
      type: Array,
    },
  },

  data() {
    return {
      list: this.data,
      showList: [],
    };
  },

  methods: {
    handleClick(index) {
      this.$set(this.showList, index, !this.showList[index]);
    },
  },
};
</script>

<style scoped>
@import "./font.css";

li {
  list-style: none;
  cursor: pointer;
  margin: 10px 0;
}
</style>