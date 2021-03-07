import { ref } from "vue";
import { generateId } from "../utils/todoStorage";

export default function useNewTodo(todoListRef) {
  const newTodoRef = ref(""); // 新增任务的标题

  const addTodo = () => {
    // 新增一个任务
    const title = newTodoRef.value && newTodoRef.value.trim();
    if (!title) return;

    // 添加任务到任务列表
    // 1. 生成一个任务对象
    const todo = {
      title,
      id: generateId(),
      isComplete: false,
    };
    // 2. 将任务对象添加到任务列表
    todoListRef.value.push(todo);
    newTodoRef.value = "";
  };

  return {
    newTodoRef,
    addTodo,
  };
}
