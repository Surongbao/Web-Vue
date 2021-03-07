



<script>
// <template>
//   <transition name="single">
//     <slot></slot>
//   </transition>
// </template>

export default {
  functional: true,
  render(h, context) {
    const { slots } = context;
    // return <transition name="single">{slots().default}</transition>;
    return (
      <transition-group name="single" tag="ul">
        {slots().default}
      </transition-group>
    );
  },
};
</script>

<style>
.single-enter,
.single-leave-to {
  opacity: 0;
}

.single-enter-active,
.single-leave-active {
  transition: all 1s;
}

.single-enter-to,
.single-leave {
  opacity: 1;
}
</style>