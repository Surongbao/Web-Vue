<template>
  <div class="home">
    首页
    {{ count }} - {{ $store.state.count.count }}?
    <!-- {{ $store.getters.countDouble }} -->

    <!-- {{ countDouble }} -->
    <!-- {{ countAdd(10) }} -->

    {{ stateCountDouble }} - {{ $store.getters["count/countDouble"] }} -
    {{ stateCountAdd(10) }}
    {{ obj }}

    <!-- <input type="text" :value="value" @input="handleInput" />{{ value }} -->

    <!-- <input type="text" v-model="myValue" />{{ value }} -->

    <!-- <button @click="$store.state.count++">点击</button> -->
    <button @click="handleClick">点击</button>
  </div>
</template>

<script>
import {
  // COUNT_ADD_MUTATION,
  CHANGE_OBJ,
  UPDATE_VALUE,
} from "@/store/mutationTypes";

import { mapState, mapGetters /* mapMutations */ } from "vuex";
export default {
  computed: {
    ...mapState("count", ["count", "obj", "value"]),
    // ...mapGetters(["countDouble", "countAdd"]),
    ...mapGetters("count", {
      stateCountDouble: "countDouble",
      stateCountAdd: "countAdd",
    }),

    myValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$store.commit(UPDATE_VALUE, { value: val });
      },
    },
  },

  methods: {
    // ...mapMutations(["countAddMutation"]),

    handleInput(e) {
      this.$store.commit(UPDATE_VALUE, { value: e.target.value });
    },

    handleClick() {
      this.$store.dispatch("count/countAddAction", {
        payload: {
          title: "Hello Vue",
          num: 10,
        },
      });
      // .then((msg) => {
      //   console.log(msg);
      // });
      // this.$store.commit(COUNT_ADD_MUTATION, {
      //   params: {
      //     title: "Hello Vue",
      //     num: 10,
      //   },
      // });

      this.$store.commit(CHANGE_OBJ);
      // this.$store.commit("countAddMutation", {
      //   name: "kevin",
      //   age: 18,
      // });
      // this.countAddMutation();

      // this.$store.commit({
      //   type: COUNT_ADD_MUTATION,
      //   params: {
      //     title: "hello",
      //     num: 10,
      //   },
      // });
    },
  },
};
</script>

