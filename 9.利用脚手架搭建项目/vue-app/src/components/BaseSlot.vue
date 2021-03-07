

<script>
// <div>
//   <slot :text="message"></slot>
// </div>
export default {
  data() {
    return {
      msg: "Hello World",
    };
  },

  render(h) {
    return h("div", [
      this.$scopedSlots.default({
        value: this.msg,
      }),
    ]);
  },
};
</script>