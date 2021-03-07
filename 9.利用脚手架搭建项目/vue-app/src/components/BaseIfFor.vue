<script>
export default {
  props: {
    items: Array,
  },

  render(createElement) {
    if (this.items.length) {
      return createElement(
        "ul",
        this.items.map((item) =>
          createElement(
            "li",
            {
              key: item,
              ref: "li",
              refInFor: true,
            },
            item
          )
        )
      );
    } else {
      return createElement("p", "Hello World");
    }
  },
};
</script>