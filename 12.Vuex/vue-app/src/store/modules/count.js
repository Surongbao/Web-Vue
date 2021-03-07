import { COUNT_ADD_MUTATION } from "../mutationTypes";

export default {
  namespaced: true,
  state: {
    count: 0,
  },

  getters: {
    countDouble(state, getters, rootState) {
      console.log(getters, rootState);
      return state.count * 2;
    },
    countAdd: (state) => (num) => state.count + num,
  },

  mutations: {
    [COUNT_ADD_MUTATION](state, { payload }) {
      console.log(payload);
      state.count++;
    },
  },

  actions: {
    countAddAction(context, payload) {
      context.commit(COUNT_ADD_MUTATION, payload);
      // return new Promise((resolve) => {
      //   setTimeout(() => {
      //     context.commit(COUNT_ADD_MUTATION, payload);
      //     resolve("完成了");
      //   }, 1000);
      // });
    },
  },
};
