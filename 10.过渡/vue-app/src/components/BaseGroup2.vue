<template>
  <div class="demo">
    <div class="btns">
      <button @click="handleAdd">添加</button>
      <button @click="handleDel">删除</button>
      <button @click="handleSort">重排</button>
    </div>
    <transition-group tag="ul">
      <template v-if="show">
        <li class="item" v-for="item in itemList" :key="item">{{ item }}</li>
      </template>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      number: 0,
      itemList: [1, 2, 3],
    };
  },

  created() {
    this.number = this.itemList.length;
  },

  methods: {
    handleAdd() {
      this.number++;
      const index = this.getRandom(0, this.itemList.length);
      this.itemList.splice(index, 0, this.number);
    },

    handleDel() {
      const index = this.getRandom(0, this.itemList.length);
      const delDom = this.itemList.splice(index, 1);
      console.log(delDom);
    },

    handleSort() {
      this.itemList.sort(() => Math.random() - 0.5);
    },

    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
  },
};
</script>

<style scoped>
.item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}

.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.v-leave-active {
  position: absolute;
}

.v-enter-to,
.v-leave {
  opacity: 1;
  transform: translateY(0px);
}

.v-move {
  transition: transform 0.5s;
}
</style>