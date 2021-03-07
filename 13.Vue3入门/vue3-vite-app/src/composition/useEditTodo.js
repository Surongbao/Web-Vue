import { ref, computed } from "vue";

export default function useEdit(todoListRef) {
  const editingTodoRef = ref(null); // 当前正在修改的任务
  let oldTitle = null; // 缓存之前的 title 值

  // 修改任务
  const editTodo = (todo) => {
    oldTitle = todo.title;
    editingTodoRef.value = todo;
  };

  // 完成修改
  const doneEdit = (todo, index) => {
    editingTodoRef.value = null;
    const title = todo.title.trim();
    if (title) {
      todo.title = title;
    } else {
      if (index) {
        todoListRef.value.splice(index, 1);
      }
    }
  };

  // 取消修改
  const cancelEdit = (todo) => {
    editingTodoRef.value = null;
    todo.title = oldTitle;
  };

  // 全部完成 & 全部取消
  const allDoneRef = computed({
    get() {
      return todoListRef.value.filter((todo) => !todo.isComplete).length === 0;
    },
    set(checked) {
      todoListRef.value.forEach((todo) => {
        todo.isComplete = checked;
      });
    },
  });

  return {
    editingTodoRef,
    editTodo,
    doneEdit,
    cancelEdit,
    allDoneRef,
  };
}
