<template>
  <div class="activity">
    <div class="nav-list">
      <router-link :to="{ name: 'academic' }">学术讨论</router-link>
      <router-link :to="{ name: 'personal' }">个人中心</router-link>
      <router-link :to="{ name: 'download' }">资源下载</router-link>
    </div>

    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.nav-list a {
  display: inline-block;
  text-decoration: none;
  margin-right: 30px;
  padding: 5px 10px;
}

.nav-list a.link-exact {
  background-color: #3385ff;
  color: #fff;
}

.main-container {
  padding: 30px 10px;
}
</style>
