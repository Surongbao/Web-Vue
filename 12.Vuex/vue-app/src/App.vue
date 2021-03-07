<template>
  <div id="app">
    <div class="header">
      <div class="logo" @click="handleClick">渡一教育</div>
      <div class="nav-list">
        <router-link to="/home">首页</router-link>
        <router-link to="/learn">课程学习</router-link>
        <router-link to="/student">学员展示</router-link>
        <router-link to="/about">关于</router-link>
        <router-link to="/activity">社区</router-link>
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      this.$router.push({
        name: "home",
      });
    },
  },
};
</script>


<style scoped>
.header {
  height: 60px;
  background-color: #3385ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header .logo {
  margin-left: 200px;
  color: #fff;
  cursor: pointer;
}

.header .nav-list {
  margin-right: 200px;
}

.header .nav-list a {
  text-decoration: none;
  margin-left: 30px;
  color: #fff;
}

.main {
  margin-top: 60px;
  padding: 0 200px;
}

.link-exact {
  font-weight: bold;
}
</style>