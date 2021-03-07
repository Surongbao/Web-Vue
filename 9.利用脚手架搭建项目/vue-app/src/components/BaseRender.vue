

<script>
import BaseChildren from "./BaseChildren";
import BaseIfFor from "./BaseIfFor";
import BaseModel from "./BaseModel";

export default {
  components: {
    BaseChildren,
    BaseIfFor,
    BaseModel,
  },

  data() {
    return {
      name: "zhangsan",
    };
  },

  directives: {
    slice: (el, binding, vnode) => {
      const vm = vnode.context;
      let { value, expression, arg, modifiers } = binding;

      if (modifiers.number) {
        value = value.replace(/[^0-9]/g, "");
      }

      el.value = value.slice(0, arg);
      vm[expression] = value.slice(0, arg);

      el.oninput = function () {
        let inputVal = el.value;

        if (modifiers.number) {
          inputVal = inputVal.replace(/[^0-9]/g, "");
        }

        el.value = inputVal.slice(0, arg);
        vm[expression] = inputVal.slice(0, arg);
      };
    },
  },

  methods: {
    handleClick() {
      console.log("render");
    },
  },

  render(createElement) {
    return createElement(
      "div",
      {
        class: {
          red: true,
          blue: false,
        },

        style: {
          color: "red",
          fontSize: "20px",
        },

        attrs: {
          id: "app",
        },

        on: {
          // click: this.handleClick,
        },
      },
      [
        "Hello Vue",
        createElement(
          "base-children",
          {
            props: {
              name: "kevin",
            },

            nativeOn: {
              click: this.handleClick,
            },
          },
          [
            createElement(
              "h3",
              {
                slot: "footer",
              },
              "底部"
            ),
            createElement(
              "h3",
              {
                slot: "default",
              },
              "主要内容"
            ),
            createElement(
              "h3",
              {
                slot: "header",
              },
              "头部"
            ),
          ]
        ),
        createElement("div", {
          domProps: {
            innerHTML: "<span>innerHTML</span>",
          },

          on: {
            // click: this.handleClick,
          },
        }),
        createElement("input", {
          directives: [
            {
              name: "slice",
              value: "zhangsan",
              expression: "value",
              arg: 3,
              modifiers: {
                number: true,
              },
            },
          ],
        }),
        createElement("base-if-for", {
          props: {
            items: [1, 2, 3, 4, 5],
          },
        }),
        createElement("base-model"),
      ]
    );
  },
};
</script>