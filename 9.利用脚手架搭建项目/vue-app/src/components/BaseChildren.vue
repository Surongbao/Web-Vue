

<script>
// <template>
//   <div>
//     <slot name="header"></slot>
//     <slot></slot>
//     <slot name="footer"></slot>
//   </div>
// </template>

export default {
  props: {
    name: String,
  },
  render(h) {
    return h("div", [
      this.name,
      this.$slots.header,
      this.$slots.default,
      this.$slots.footer,
    ]);
  },

  // mounted() {
  //   console.log(this.$slots);
  // },
  // render(createElement) {
  //   return createElement("h1", {}, [this.name]);
  // },
};
</script>