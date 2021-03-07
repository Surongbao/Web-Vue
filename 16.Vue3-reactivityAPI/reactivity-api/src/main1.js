// 响应式数据

// import { reactive, readonly, ref, computed } from "vue";
// const state = reactive({ a: 1, b: 2 });
// const sum = computed(() => {
//   console.log("computed");
//   return state.a + state.b;
// });
// console.log(sum.value);
// state.a = 10;
// console.log(sum.value);
// const state = reactive({ a: 1, b: 2 });
// const readState = readonly({ x: 10, y: 20 });
// const readState = readonly(state);
// window.state = state;
// window.readState = readState;
// const count = ref(0);
// const count = ref({ a: 1, b: 2 });
// console.log(count);

// import { reactive, readonly, ref, computed } from "vue";

// const state = reactive({
//   firstName: "Xu Ming",
//   lastName: "Deng",
// });
// const fullName = computed(() => {
//   console.log("changed");
//   return `${state.lastName}, ${state.firstName}`;
// });
// console.log("state ready");
// console.log("fullname is", fullName.value);
// console.log("fullname is", fullName.value);
// const imState = readonly(state);
// console.log(imState === state);

// const stateRef = ref(state);
// console.log(stateRef.value === state);

// state.firstName = "Cheng";
// state.lastName = "Ji";

// console.log(imState.firstName, imState.lastName);
// console.log("fullname is", fullName.value);
// console.log("fullname is", fullName.value);

// const imState2 = readonly(stateRef);
// console.log(imState2);
// console.log(imState2.value === stateRef.value);

// import { readonly, reactive } from "vue";

// function useUser() {
//   const originUser = reactive({});
//   const user = readonly(originUser);

//   const setUserName = (name) => {
//     originUser.name = name;
//   };

//   const setUserAge = (age) => {
//     originUser.age = age;
//   };

//   // 在这里补全函数
//   return {
//     user, // 这是一个只读的用户对象，响应式数据，默认为一个空对象
//     setUserName, // 这是一个函数，传入用户姓名，用于修改用户的名称
//     setUserAge, // 这是一个函数，传入用户年龄，用户修改用户的年龄
//   };
// }

// window.user = useUser();

// import { readonly, reactive } from "vue";

// function useDebounce(obj, duration) {
//   // 在这里补全函数
//   const originObj = reactive(obj);
//   const value = readonly(originObj);
//   let timer = null;

//   const setValue = (o) => {
//     clearInterval(timer);
//     timer = setTimeout(() => {
//       console.log("值改变了");
//       Object.entries(o).forEach(([key, val]) => {
//         originObj[key] = val;
//       });
//     }, duration);
//   };

//   return {
//     value, // 这里是一个只读对象，响应式数据，默认值为参数值
//     setValue, // 这里是一个函数，传入一个新的对象，需要把新对象中的属性混合到原始对象中，混合操作需要在duration的时间中防抖
//   };
// }

// const { value, setValue } = useDebounce({}, 5000);

// window.value = value;
// window.setValue = setValue;
