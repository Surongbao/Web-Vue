import { createRouter, createWebHistory } from "vue-router";
import routes from "./route";

export default createRouter({
  history: createWebHistory(),
  routes,
});
