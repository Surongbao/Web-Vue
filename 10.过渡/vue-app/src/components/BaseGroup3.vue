<template>
  <div class="demo">
    <input type="text" v-model="query" />
    <transition-group tag="ul">
      <li v-for="person in personList" :key="person.id">
        {{ person.name }}
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      userList: [
        { name: "zhangsan", id: 0 },
        { name: "lisi", id: 1 },
        { name: "wangwu", id: 2 },
        { name: "zhaoliu", id: 3 },
        { name: "zhouqi", id: 4 },
        { name: "gaunyu", id: 6 },
        { name: "zhangfei", id: 7 },
        { name: "benshan", id: 8 },
        { name: "siye", id: 9 },
        { name: "wangcai", id: 10 },
      ],
    };
  },

  computed: {
    personList() {
      return this.userList.filter((user) => user.name.includes(this.query));
    },
  },
};
</script>

<style scoped>
ul,
li {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
  transition: all 0.3s;
}

.v-enter,
.v-leave-to {
  opacity: 0;
  height: 0;
}

.v-leave,
.v-enter-to {
  opacity: 1;
}

.v-leave-active {
  position: absolute;
}

.v-move {
  transition: transform 0.3s;
}
</style>