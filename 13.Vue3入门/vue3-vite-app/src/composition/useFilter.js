import { ref, onMounted, onUnmounted, computed } from "vue";
import { filterTodoList } from "../utils/todoStorage";

// 正确 hash 值的数组
const correctHash = ["all", "active", "completed"];

/**
 * 根据 hash -> 确定筛选方式 -> 得到筛选列表
 * @param {*} todoListRef 任务列表
 * @returns
 */
export default function useFilter(todoListRef) {
  const visibilityRef = ref("all");
  // 1. 得到 hash 值
  const onHashChange = () => {
    const hash = location.hash.replace(/#\/?/, "");

    if (correctHash.includes(hash)) {
      // 输入的 hash 正确
      visibilityRef.value = hash;
    } else {
      // 输入的 hash 错误
      location.hash = "all";
      visibilityRef.value = "all";
    }
  };

  /**
   * 根据任务列表和过滤条件得到一个计算属性
   */
  const filteredTodoListRef = computed(() => {
    return filterTodoList(todoListRef.value, visibilityRef.value);
  });

  /**
   * 未完成的任务数量
   */
  const unCompleteTodoRef = computed(() => {
    return filterTodoList(todoListRef.value, "active").length;
  });

  /**
   * 已完成的任务数量
   */
  const completedRef = computed(() => {
    return filterTodoList(todoListRef.value, "completed").length;
  });

  console.log(filteredTodoListRef);

  // 组件挂载完成后运行的函数
  onMounted(() => {
    window.addEventListener("hashchange", onHashChange);
  });

  // 组件销毁后运行的函数
  onUnmounted(() => {
    window.removeEventListener("hashchange", onHashChange);
  });

  return {
    visibilityRef,
    filteredTodoListRef,
    unCompleteTodoRef,
    completedRef,
  };
}
