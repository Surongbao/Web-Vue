<template>
  <div class="check-editor">
    <div class="check-editor-inner">
      <div
        class="checkbox"
        @click="handleChecked"
        :class="{
          checked: modelValue,
        }"
      ></div>
      <input :value="title" type="text" class="editor" @input="handleInput" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    titleModifiers: {
      default: () => ({}),
    },
  },

  setup(props, context) {
    const handleChecked = () => {
      context.emit("update:modelValue", !props.modelValue);
    };

    const handleInput = (e) => {
      let value = e.target.value;
      if (props.titleModifiers.trim) {
        value = value.trim();
      }
      context.emit("update:title", value);
    };

    return {
      handleChecked,
      handleInput,
    };
  },
};
</script>


<style scoped>
.check-editor {
  cursor: pointer;
}
.check-editor-inner {
  display: flex;
  align-items: center;
}
.checkbox {
  width: 15px;
  height: 15px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  border-radius: 3px;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkbox:hover,
.checkbox.checked {
  border-color: #409eff;
}
.checkbox.checked::after {
  content: "";
  border-radius: 2px;
  width: 9px;
  height: 9px;
  background: #409eff;
}
.editor {
  border: none;
  outline: none;
  margin-left: 5px;
  border-bottom: 1px solid #dcdfe6;
  font-size: inherit;
}
</style>