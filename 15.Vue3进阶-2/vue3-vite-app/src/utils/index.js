import { defineAsyncComponent, h } from "vue";
import Loading from "../components/Loading.vue";
import Error from "../components/Error.vue";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
NProgress.configure({
  trickleSpeed: 30, // 每隔多少毫秒增长一点
  showSpinner: false, // 关闭旋转指针
});

export function delay(duration = getRandom(1000, 5000)) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, duration);
  });
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 根据一个路径创建一个异步组件
 * @param {*} path
 * @returns
 */
export function getAsyncComponent(path) {
  return defineAsyncComponent({
    loader: async () => {
      await delay();
      if (Math.random() < 0.5) {
        throw new TypeError();
      }
      return import(path);
    },
    loadingComponent: Loading,
    errorComponent: {
      render() {
        return h(Error, "出错了");
      },
    },
  });
}

/**
 * 根据一个路径创建一个异步页面
 * @param {*} path
 * @returns
 */
export function getAsyncPage(path) {
  return defineAsyncComponent({
    loader: async () => {
      NProgress.start();
      await delay();
      NProgress.done();
      return import(path);
    },
    loadingComponent: Loading,
  });
}
