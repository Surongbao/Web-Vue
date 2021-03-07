// import { watch, watchEffect, reactive, ref } from "vue";

// const count = ref(0);
// const state = reactive({ a: 1, b: 2 });

// watch([count, () => state.a], ([nv1, nv2], [ov1, ov2]) => {
//   console.log(nv1, nv2, ov1, ov2);
// });

// count.value++;
// count.value++;
// count.value++;
// state.a++;
// state.a++;
// state.a++;

// state.b++;
// state.b++;
// state.b++;

// watch(
//   () => state.a,
//   (nv, ov) => {
//     console.log(nv, ov);
//   }
// );

// state.a++;
// state.a++;
// state.a++;
// state.a++;
// state.a++;

// watch(count, (nv, ov) => {
//   console.log("新：", nv, "旧：", ov);
// });

// count.value++;
// count.value++;
// count.value++;
// count.value++;

// watchEffect(() => {
//   console.log(count.value, state.a);
// });

// count.value++;
// count.value++;
// count.value++;
// count.value++;
// count.value++;
// state.a++;
// state.a++;
// state.a++;
// state.a++;
// state.a++;

// state.b++;
// state.b++;
// state.b++;
// state.b++;
// state.b++;

// import { reactive, watchEffect, watch } from "vue";
// const state = reactive({
//   count: 0,
// });
// watchEffect(() => {
//   console.log("watchEffect", state.count);
// });
// watch(
//   () => state.count,
//   (count, oldCount) => {
//     console.log("watch", count, oldCount);
//   }
// );
// console.log("start");
// setTimeout(() => {
//   console.log("time out");
//   state.count++;
//   state.count++;
// });
// state.count++;
// state.count++;

// console.log("end");

import { ref, reactive, unref, toRef, toRefs } from "vue";

const state = reactive({ a: 1, b: 2 });
// const result = toRef(state, "a");
const result = toRefs(state);

console.log(result);
