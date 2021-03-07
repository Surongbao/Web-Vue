
<script>
// <template>
//   <div id="app">
//     <base-test>
//       <template #header>
//         <h3>头部</h3>
//       </template>
//       <template #default>
//         <h3>主要内容</h3>
//       </template>
//       <template #footer>
//         <h3>底部</h3>
//       </template>
//     </base-test>
//   </div>
// </template>

// <template>
//   <div class="app">
//     <base-test v-slot="{ text }">
//       {{ text }}
//     </base-test>
//   </div>
// </template>

import BaseTest from "./components/BaseTest";

export default {
  components: {
    BaseTest,
  },

  data() {
    return {
      msg: "Hello Vue",
      show: true,
      number: 21218021,
      list: [1, 2, 3, 4, 5],
      value: "haha",
      style: {
        color: "red",
        backgroundColor: "green",
      },
    };
  },

  methods: {
    showDom() {
      if (this.number === 1) {
        return <h1>{this.number}</h1>;
      } else if (this.number === 2) {
        return <h3>{this.number}</h3>;
      } else {
        return <h5>{this.number}</h5>;
      }
    },

    handleClick(num) {
      console.log(num);
    },
  },

  filters: {
    toMoney(number) {
      return number.toLocaleString();
    },
  },

  render() {
    // return <h1 domPropsTextContent="<p>TextContent</p>"></h1>;
    // return <h1 v-show={this.show}>标题</h1>;
    const scopedSlots = {
      scopedSlots: {
        default: (props) => props.text,
      },
    };

    return (
      <div id="app">
        {<base-test {...scopedSlots}></base-test>}
        {
          // <base-test
          //   {...{
          //     scopedSlots: {
          //       default: (props) => props.text,
          //     },
          //   }}
          // ></base-test>
        }
        {/*  <base-test>
            <h3 slot="header">头部</h3>
            <h3 slot="default">主要内容</h3>
            <h3 slot="footer">底部</h3>
          </base-test> */}
        {/* <div>{this.$options.filters.toMoney(this.number)}</div> */}

        {/* <input v-model={this.msg}></input> */}
        {/* this.msg */}

        {/* this.show && <div>显示</div> */}
        {/* this.show ? <div>div</div> : <p>p</p> */}
        {/* this.showDom() */}
        {/* this.list.map((item) => (
          <div ref="li" refInFor={true} key={item}>
            {item}
          </div>
        )) */}
        {/* <button onClick={this.handleClick}>点击</button> */}
        {/* <button on-click={this.handleClick}>点击</button> */}
        {/* <base-test nativeOnClick={this.handleClick} /> */}
        {/* <button
            onClick={() => {
              this.handleClick(10);
            }}
          >
            点我
          </button> */}
        {/* <div value={this.value}></div> */}
        {/* <div class={{ red: true, green: false, yellow: true }}></div> */}
        {/* <div style={{ color: "red", fontSize: "30px" }}>div</div> */}
        {/* <div ref="div" style={this.style}>
            div
          </div> */}
      </div>
    );
  },

  mounted() {
    // console.log(this.$options);
  },
};
</script>