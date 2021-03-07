<template>
  <div class="login">
    <button @click="handleLogin">登录</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login: false,
    };
  },
  methods: {
    handleLogin() {
      const result = confirm("确定登录么？");
      if (result) {
        localStorage.setItem("isLogin", true);
        this.$router.go(-1);
      }
    },
  },
};
</script>