<template>
  <div id="app">
    <div class="nav-container">
      <div class="logo" @click="handleClick">渡一教育</div>
      <nav class="nav-list">
        <router-link to="/home">首页</router-link>
        <router-link to="/learn">课程学习</router-link>
        <router-link to="/student">学员展示</router-link>
        <router-link to="/about">关于</router-link>
        <router-link to="/activity">社区</router-link>
      </nav>
    </div>

    <div class="main-container">
      <!-- <transition
        enter-active-class="animate__animated animate__fadeInRightBig"
      > -->
      <router-view></router-view>
      <!-- </transition> -->
    </div>
  </div>
</template>



<script>
export default {
  name: "App",
  components: {},
  methods: {
    handleClick() {
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
.logo {
  cursor: pointer;
}

.nav-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #3385ff;
  padding: 0 200px;
}

.nav-container .logo {
  color: #fff;
}

.nav-container .nav-list a {
  text-decoration: none;
  color: #fff;
  margin-left: 40px;
}

.main-container {
  margin-top: 60px;
  padding: 0 200px;
}

.nav-container .nav-list a.link {
  font-weight: bold;
}
</style>

