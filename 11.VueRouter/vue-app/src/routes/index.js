import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },

  {
    path: "/home",
    name: "home",
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
    meta: {
      hasLogin: true,
    },
    component: () => import("../views/About.vue"),
  },
  {
    path: "/activity",
    meta: {
      hasLogin: true,
      // hasBack: true,
    },
    component: () =>
      import(/* webpackChunkName: 'academic' */ "../views/Activity.vue"),
    redirect: {
      name: "academic",
    },
    children: [
      {
        path: "academic",
        name: "academic",
        component: () =>
          import(/* webpackChunkName: 'academic' */ "../views/Academic.vue"),
      },
      {
        path: "personal",
        name: "personal",
        component: () => import("../views/Personal.vue"),
      },
      {
        path: "download",
        name: "download",
        component: () => import("../views/Download.vue"),
      },
    ],
  },
  {
    path: "/question/:questionId",
    name: "question",
    props: (route) => ({
      questionId: route.params.questionId,
    }),
    component: () => import("../views/Question.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
];

const router = new VueRouter({
  routes: routes,
  linkActiveClass: "link",
  linkExactActiveClass: "link-exact",
  mode: "history",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (to.hash) {
        return {
          selector: to.hash,
        };
      } else {
        return {
          x: 0,
          y: 0,
        };
      }
      // return {
      //   x: 0,
      //   y: 0,
      // };
    }
  },
});

router.beforeEach((to, from, next) => {
  const isExist = to.matched.some((item) => item.meta.hasLogin);
  if (isExist) {
    if (localStorage.isLogin) {
      next();
    } else {
      const result = confirm("登录之后才可以浏览");
      if (result) {
        next({
          name: "login",
        });
      } else {
        next(false);
      }
    }
  } else {
    next();
  }

  // if (from.matched[0].meta.hasBack) {
  //   const result = confirm("真的要离开么？不再看看了？");
  //   if (result) {
  //     next();
  //   } else {
  //     next(false);
  //   }
  // } else {
  //   next();
  // }
});

router.onError((error) => {
  console.log(error.message);
});

export default router;
