<template>
  <div class="student-list">
    <div class="student-number">学生总人数：{{ studentNumber }}</div>
    <hr />
    <div class="title">学生列表：</div>
    <ul v-if="studentList.length">
      <li v-for="student in studentList" :key="student.id">
        姓名：{{ student.name }}，年龄：{{ student.age }}
      </li>
    </ul>
    <hr />
    <div class="small-student">
      <div>未成年学生列表：</div>
      <ul v-if="studentSmall.length">
        <li v-for="small in studentSmall" :key="small.id">
          姓名：{{ small.name }}，年龄：{{ small.age }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState(["studentList"]),
    ...mapGetters(["studentNumber", "studentSmall"]),
  },
};
</script>

<style scoped>
li {
  margin: 10px 0;
}
</style>