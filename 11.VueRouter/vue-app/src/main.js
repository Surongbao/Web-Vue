import Vue from "vue";
import App from "./App.vue";
import "./assets/reset.css";
import router from "./routes/index";
import axios from "./http/axios";
import "animate.css";

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

new Vue({
  render: (h) => h(App),
  router: router,
}).$mount("#app");
