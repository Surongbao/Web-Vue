import { computed, ref, watchEffect } from "vue";
import gsap from "gsap";

const colors = ["#334552", "#B34335", "#6E9FA5", "#A2C3AC", "#C8846C"];

export default function useGdp(gdp, maxSize) {
  const maxValue = computed(() => {
    if (gdp.value.length) {
      return Math.max(...gdp.value.map((item) => item.value));
    }
    return 0;
  });

  // 数据的当前状态，会从当前状态逐渐变成最终状态
  const bars = ref([]);

  // 数据的最终状态
  const barsTarget = computed(() => {
    return gdp.value.map((item, index) => {
      return {
        ...item,
        color: colors[index % colors.length],
        size: (item.value / maxValue.value) * maxSize,
      };
    });
  });

  // 从 bars 状态变成 barsTarget 状态
  watchEffect(() => {
    for (let i = 0; i < barsTarget.value.length; i++) {
      // 重置数据
      if (!bars.value[i]) {
        bars.value[i] = {
          ...barsTarget.value[i],
          size: 0,
          value: 0,
        };
      }
      // bars[i] 的值逐渐增加到 barsTarget[i] 的值
      gsap.to(bars.value[i], {
        ...barsTarget.value[i],
        duration: 0.8,
      });
    }
  });

  return {
    bars,
  };
}
