const LOCAL_KEY = "todolist";

/**
 * 生成一个任务 id（当前时间戳 + 六位随机数）
 */
export function generateId() {
  return Date.now() + Math.random().toString().slice(2, 8);
}

/**
 * 从 localStorage 中获取目前所有任务
 * @returns
 */
export function fetch() {
  const result = localStorage.getItem(LOCAL_KEY);

  if (result) {
    return JSON.parse(result);
  }
  return [];
}

/**
 * 保存任务到 localStorage
 * @param {*} todos 任务列表
 */
export function save(todos) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(todos));
}

/**
 * 根据 visibility 过滤列表
 * @param {*} todolist 原始列表
 * @param {*} visibility 过滤条件
 * @returns
 */
export function filterTodoList(todolist, visibility = "all") {
  if (visibility === "all") {
    return todolist;
  } else if (visibility === "active") {
    return todolist.filter((item) => !item.isComplete);
  } else if (visibility === "completed") {
    return todolist.filter((item) => item.isComplete);
  }

  throw new Error("Invalid visibility value");
}
