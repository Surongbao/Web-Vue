<script>
export default {
  data() {
    return {
      msg: "Hello Vue",
    };
  },

  updated() {
    console.log(this.msg);
  },

  render(h) {
    const self = this;
    return h("input", {
      attrs: {
        value: this.msg,
      },
      on: {
        input(e) {
          self.msg = e.target.value;
        },
      },
    });
  },
};
</script>