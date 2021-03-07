<template>
  <div class="learning">
    <ul class="question-list">
      <router-link
        tag="li"
        :to="{ name: 'question', params: { questionId: question.id } }"
        class="question"
        v-for="question in questionList"
        :key="question.id"
      >
        {{ question.title }}
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionList: [],
    };
  },

  created() {
    this.$axios.get("/question").then((resp) => {
      this.questionList = resp;
    });
  },
};
</script>

<style scoped>
.question {
  margin-bottom: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.question:hover {
  color: #3385ff;
}
</style>