export default {
  state: {
    studentList: [],
  },

  getters: {
    studentNumber: (state) => state.studentList.length,
    studentSmall: (state) =>
      state.studentList.filter((student) => student.age < 18),
  },
};
