

<script>
// <template>
//   <div id="app">
//     <base-level :level="1">标题</base-level>
//     <base-level :level="2">标题</base-level>
//     <base-level :level="3">标题</base-level>
//     <base-level :level="4">标题</base-level>
//     <base-level :level="5">标题</base-level>
//     <base-level :level="6">标题</base-level>
//     <base-render></base-render>
//     <base-slot v-slot:default="slotProps">
//       {{ slotProps.value }}
//     </base-slot>
//   </div>
// </template>

// import BaseLevel from "./components/BaseLevel";
// import BaseRender from "./components/BaseRender";
import BaseSlot from "./components/BaseSlot";

export default {
  name: "App",
  components: {
    // BaseLevel,
    // BaseRender,
    BaseSlot,
  },

  render(h) {
    return h(
      "div",
      {
        attrs: {
          id: "app",
        },
      },
      [
        h("base-slot", {
          scopedSlots: {
            default(props) {
              return h("span", props.value);
            },
          },
        }),
      ]
    );
  },
};
</script>


