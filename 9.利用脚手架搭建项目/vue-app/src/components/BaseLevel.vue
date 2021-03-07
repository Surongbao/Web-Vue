<template functional>
  <div>
    {{ props.level }}
    <slot></slot>
    <slot :txt="'hello'"></slot>
  </div>
</template>

<script>
export default {
  // JSX语法
  functional: true,

  render(h, context) {
    const { props, slots } = context;
    const tag = "h" + props.level;

    return <tag>{slots().default}</tag>;
  },

  // createElement函数语法
  // props: {
  //   level: {
  //     type: Number,
  //     required: true,
  //   },
  // },
  // render(createElement) {
  //   return createElement("h" + this.level, this.$slots.default);
  // },
};
</script>