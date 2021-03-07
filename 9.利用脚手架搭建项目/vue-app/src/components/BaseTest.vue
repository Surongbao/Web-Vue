


<script>
// <template>
//   <div>
//     <slot name="header"></slot>
//     <slot></slot>
//     <slot name="footer"></slot>
//   </div>
// </template>

// <template>
//   <div class="demo">
//     <slot :text="'HelloWorld'"></slot>
//   </div>
// </template>

export default {
  render() {
    return (
      <div class="demo">
        {this.$scopedSlots.default({
          text: "hello vue",
        })}
      </div>
    );
    // return (
    //   <div>
    //     {this.$slots.header}
    //     test
    //     {this.$slots.default}
    //     test
    //     {this.$slots.footer}
    //   </div>
    // );
  },
};
</script>