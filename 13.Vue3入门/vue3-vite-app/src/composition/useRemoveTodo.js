export default function useRemoveTodo(todoListRef) {
  const removeTodo = (index) => {
    todoListRef.value.splice(index, 1);
  };

  const clearCompletedTodo = () => {
    todoListRef.value = todoListRef.value.filter((todo) => !todo.isComplete);
  };

  return {
    removeTodo,
    clearCompletedTodo,
  };
}
