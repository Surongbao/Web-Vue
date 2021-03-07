import { ref, watchEffect } from "vue";
import { fetch, save } from "../utils/todoStorage";

export default function useTodoList() {
  const todoListRef = ref(fetch());
  window.todoListRef = todoListRef.value;
  watchEffect(() => {
    save(todoListRef.value);
  });

  return {
    todoListRef,
  };
}
