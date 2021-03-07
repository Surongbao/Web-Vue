import Vue from "vue";
import Vuex from "vuex";
import { CHANGE_OBJ, UPDATE_VALUE } from "./mutationTypes";

import count from "./modules/count";
import student from "./modules/student";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  modules: {
    count,
    student,
  },

  state: {
    obj: {
      a: 1,
    },
    value: "123",
  },

  mutations: {
    [CHANGE_OBJ](state) {
      Vue.set(state.obj, "b", 100);
    },
    [UPDATE_VALUE](state, { value }) {
      state.value = value;
    },
  },
});

export default store;
