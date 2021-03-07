import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/home",
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/learn",
    component: () => import("../views/Learn.vue"),
  },
  {
    path: "/student",
    component: () => import("../views/Student.vue"),
  },
  {
    path: "/about",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/activity",
    component: () => import("../views/Activity.vue"),
  },
];

export default new VueRouter({
  routes,
  mode: "history",
  linkActiveClass: "link-active",
  linkExactActiveClass: "link-exact",
});
