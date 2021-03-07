<template>
  <div id="app">
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          autofocus=""
          autocomplete="off"
          placeholder="What needs to be done?"
          v-model="newTodoRef"
          @keyup.enter="addTodo"
        />
      </header>
      <section class="main">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          v-model="allDoneRef"
        />
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          <li
            v-for="(todo, index) in filteredTodoListRef"
            :class="{
              completed: todo.isComplete,
              editing: todo === editingTodoRef,
            }"
            class="todo"
            :key="todo.id"
          >
            <div class="view">
              <input class="toggle" type="checkbox" v-model="todo.isComplete" />
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
              <button class="destroy" @click="removeTodo(index)"></button>
            </div>
            <input
              class="edit"
              type="text"
              v-model="todo.title"
              @blur="doneEdit(todo)"
              @keyup.enter="doneEdit(todo, index)"
              @keyup.esc="cancelEdit(todo, index)"
            />
          </li>
        </ul>
      </section>
      <footer class="footer" v-if="todoListRef.length">
        <span class="todo-count">
          <strong>{{ unCompleteTodoRef }}</strong>
          <span>item{{ unCompleteTodoRef === 1 ? "" : "s" }} left</span>
        </span>
        <ul class="filters">
          <li>
            <a href="#/all" :class="{ selected: visibilityRef === 'all' }"
              >All</a
            >
          </li>
          <li>
            <a href="#/active" :class="{ selected: visibilityRef === 'active' }"
              >Active</a
            >
          </li>
          <li>
            <a
              href="#/completed"
              :class="{ selected: visibilityRef === 'completed' }"
              >Completed</a
            >
          </li>
        </ul>
        <button
          class="clear-completed"
          v-if="completedRef !== 0"
          @click="clearCompletedTodo"
        >
          Clear completed
        </button>
      </footer>
    </section>
  </div>
</template>

<script>
import useTodoList from "./composition/useTodoList.js";
import useNewTodo from "./composition/useNewTodo.js";
import useFilter from "./composition/useFilter.js";
import useEditTodo from "./composition/useEditTodo.js";
import useRemoveTodo from "./composition/useRemoveTodo.js";
export default {
  setup() {
    const { todoListRef } = useTodoList();
    return {
      todoListRef,
      ...useNewTodo(todoListRef),
      ...useFilter(todoListRef),
      ...useEditTodo(todoListRef),
      ...useRemoveTodo(todoListRef),
    };
  },
};
</script>
