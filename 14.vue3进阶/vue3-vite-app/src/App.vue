<template>
  <div class="container">
    <div class="list">
      <strong>编辑：</strong>
      <div class="list">
        <check-editor
          v-for="good in goodList"
          :key="good.id"
          v-model="good.sell"
          v-model:title="good.title"
        />
      </div>
    </div>
    <div class="list">
      <strong>销售中:</strong>
      <div>
        <template v-for="(good, index) in filterList" :key="good.id">
          <span>{{ index + 1 }}.</span>
          <strong>{{ good.title }}</strong>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CheckEditor from "./components/CheckEditor.vue";
import { ref, computed } from "vue";

const data = [
  { id: 1, sell: true, title: "iphone12" },
  { id: 2, sell: false, title: "xiaomi" },
  { id: 3, sell: true, title: "huawei" },
  { id: 4, sell: true, title: "vivo" },
];

export default {
  name: "App",
  components: {
    CheckEditor,
  },

  setup() {
    const goodListRef = ref(data);

    const filterListRef = computed(() =>
      goodListRef.value.filter((item) => item.sell)
    );

    return {
      goodList: goodListRef,
      filterList: filterListRef,
    };
  },
};
</script>


<style scoped>
.container {
  margin-top: 50px;
  width: 980px;
  margin: 50px auto;
}
.list {
  display: flex;
  margin: 1em 0;
  align-items: center;
}
strong {
  margin-right: 1em;
}
</style>