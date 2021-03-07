<template>
  <div class="question" v-if="question">
    <div class="cur-question">{{ question.title }}</div>
    <div class="other-question">
      <div
        v-for="other in otherQuestionList"
        @click="handleClick(other.id)"
        :key="other.type"
        :class="other.type"
      >
        {{ other.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  beforeRouteUpdate(to, from, next) {
    this.getData(to.params.questionId);
    next();
  },

  created() {
    this.getData(this.questionId);
  },

  props: {
    questionId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      question: null,
    };
  },

  computed: {
    otherQuestionList() {
      const arr = [];

      if (this.question.prev) {
        arr.push({
          type: "prev",
          title: this.question.prev,
          id: this.question.prevId,
        });
      }

      if (this.question.next) {
        arr.push({
          type: "next",
          title: this.question.next,
          id: this.question.nextId,
        });
      }
      return arr;
    },
  },

  methods: {
    handleClick(id) {
      this.$router.push({
        name: "question",
        params: { questionId: id },
      });
    },

    getData(id) {
      this.$axios.get(`/question/${id}`).then((resp) => {
        this.question = resp;
      });
    },
  },

  // watch: {
  //   $route: {
  //     handler() {
  //       const { questionId } = this;
  //       this.$axios.get(`/question/${questionId}`).then((resp) => {
  //         this.question = resp;
  //       });
  //     },
  //     immediate: true,
  //   },
  // },
};
</script>

<style scoped>
.cur-question {
  margin-bottom: 100px;
}

.other-question .prev {
  cursor: pointer;
  float: left;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.other-question .next {
  cursor: pointer;
  float: right;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.other-question .prev:hover,
.other-question .next:hover {
  color: #3385ff;
}
</style>
