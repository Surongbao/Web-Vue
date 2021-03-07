<template>
  <div class="student-list">
    <div class="title">添加学生：</div>
    <div class="name">
      <label> 姓名：<input type="text" v-model="name" /> </label>
    </div>
    <div class="age">
      <label> 年龄：<input type="text" v-model.number="age" /> </label>
    </div>
    <button @click="handleAdd">添加</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      name: "",
      age: null,
    };
  },

  computed: mapState(["studentList"]),

  methods: {
    handleAdd() {
      let { name, age, studentList } = this;

      if (name === "" || age === "" || typeof age !== "number") {
        return;
      }

      const isAdd = studentList.every((item) => item.name !== name);
      if (isAdd) {
        studentList.push({
          id: Math.floor(Math.random() * 100000000),
          name,
          age,
        });
        this.name = "";
        this.age = null;
      }
    },
  },
};
</script>

<style scoped>
.student-list div {
  margin-bottom: 20px;
}
</style>