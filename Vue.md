# Vue2

## 基本使用

vue.js 提供一个构造函数 Vue，用于创建 vue 实例，并且需要传递一个配置对象作为参数。

```html
<script src="../vue.js"></script>

<div id="app">{{ msg }}</div>
<script>
  const vm = new Vue({
    el: "#app",
    data: {
      msg: "hello vue",
    },
  });

  vm.$mount("#app");
</script>
```

- **`el`**：值是 css 选择器，用于选择元素，Vue 将控制该区域，该区域被称之为 “模板”。
- **`$mount`**：与 el 功能相同，用于延迟挂载，如果一起使用 el 的优先级较高。
- **`data`**：用于存放数据，并且数据是响应式的。（数据改变，页面重新渲染）
- **`{{ }}`**：用于渲染 data 中的数据，除了 data 中的数据还可以书写：基本类型值、数组、对象、函数、数学运算、逻辑表达式、三元表达式。

## 响应式

**响应式**

数据改变，页面重新渲染，Vue2.0 中使用 `Object.defineProperty` 实现。

为了更好的实现响应式（监测数据的变化），Vue 将我们定义的所有数据全部代理给了 vue 实例，通过 `vm.xxx` 即可访问数据。

为了防止命名冲突，Vue 将自己定义的成员加上了 `$` 或 `_` 前缀，`$xxx` 是我们可以使用的，`_xxx` 是 Vue 自己内部使用的。

**渲染页面**

渲染页面的操作是异步的，无论同步更改了多少次数据，渲染页面的操作只进行一次。

页面重新渲染后，Vue 会调用 **`vm.$nextTick(callback)`** 和 **`Vue.nextTick(callback)`** 这两个函数并执行相应的回调函数。

Vue 会等待同步代码执行完毕才会渲染页面，如果同步代码卡死，页面永远不会渲染。

- **`vm.$nextTick`**【推荐】：实例方法，内部的 this 指向 vue 实例。
- **`Vue.nextTick`**：静态方法，内部的 this 指向 window 对象。
- **`vm.$el`**：可以通过这个属性获取模板。

```html
<div id="app">{{ msg }}</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
  },
});

vm.msg = "Hello Kevin";

console.log(vm.msg); // => Hello Kevin
console.log(vm.$el.innerText); // => Hello Vue

vm.$nextTick(function () {
  console.log(this); // => vue 实例
  console.log(this.msg); // => Hello Kevin
  console.log(this.$el.innerText); // => Hello Kevin
});

Vue.nextTick(function () {
  console.log(this); // => window
  console.log(vm.msg); // => Hello Kevin
  console.log(vm.$el.innerText); // => Hello Kevin
});
```

- **`vm.$nextTick`** 和 **`Vue.nextTick`** 都可以作为 Promise 使用

```js
vm.$nextTick().then(() => {
  console.log(this); // => window
  console.log(vm.msg); // => Hello Kevin
  console.log(vm.$el.innerText); // => Hello Kevin
});

Vue.nextTick().then(() => {
  console.log(this); // => window
  console.log(vm.msg); // => Hello Kevin
  console.log(vm.$el.innerText); // => Hello Kevin
});
```

**异步队列**

异步队列分为微任务（相当于 VIP，优先执行）和宏任务（普通任务，稍后执行）

- 使用到的微任务：**`Promise.resolve`** 和 **`MutationObserver`**
- 使用到的宏任务：**`setImmediate`**（IE 的） 和 **`setTimeout`**
- 曾经用的宏任务：**`MessageChannel`**

```js
if (typeof Promise !== "undefined") {
  // ...
  Promise.resolve();
} else if (typeof MutationObserver !== "undefined") {
  // ...
} else if (typeof setImmediate !== "undefined") {
  // ...
} else {
  // ...
  setTimeout(() => {}, 0);
}
```

**不会渲染页面的情况**

- 使用对象中未经过声明的属性
- 已经声明了属性，但是未在模板中使用
- 某个属性的值为 null 或 undefined
- 通过索引添加或更改数组项
- 通过 length 更改数组长度
- 通过普通方式添加或删除对象的属性

**数组变异方法**

使用下面方法操作数组，Vue 会重新渲染页面，只是重写了原来数组的方法，功能并没有发生改变

- **`push`**
- **`pop`**
- **`shift`**
- **`unshift`**
- **`splice`**
- **`sort`**
- **`reverse`**

**操作对象**

通过以下方法操作对象，Vue 会重新渲染页面，因为数组的本质就是对象，所以数组也可以使用

- 添加属性：**`vm.$set(target, key, value)`** 或 **`Vue.set(target, key, value)`**
- 删除属性：**`vm.$delete(target, key)`** 或 **`Vue.delete(target, key)`**

**响应式原理**

- 使用 `Object.defineProperty` 监测对象属性的变化（使用递归深度监测）
- 使用数组变异方法监测数组的变化（数组的数据量通常较多，不适合使用递归）

**利用 `Object.defineProperty` 实现响应式的劣势**

- 天生就需要递归
- 监测不到数组中不存在的索引的变化
- 监测不到数组长度的变化
- 监测不到对象属性的添加和删除

## 相关指令

指令是具有特殊含义且拥有特殊功能的特性（行间属性），Vue 的指令都带有 `v-` 前缀，指令可以直接使用 data 中的数据。

#### v-pre 指令

拥有该指令的元素，Vue 会跳过对该元素及其子元素的编译过程

```html
<div v-pre>{{ msg }}</div>
```

#### v-cloak 指令

这个指令可以一直保持在元素的身上直到编译结束，配合 css 可以解决页面闪烁的问题

```html
<div v-cloak>{{ msg }}</div>
```

#### v-once 指令

拥有这个指令的元素及其子元素，只会被渲染一次，无论以后数据如何变化都不会重新渲染

```html
<div v-once>{{ msg }}</div>
```

#### v-text 指令

更新元素的 `textContent`，会将元素内容清空，并替换成指定的文本，优先级高于 `{{ }}`

```html
<div v-text="text">{{ msg }}</div>
```

- **`{{ }}`**：只替换自己，不清空元素内容。
- **`textContent`**：获取该元素内所有元素的文本，不受 css 影响，不会造成重排（ES）
- **`innerText`**：获取该元素内所有能看得见的文本，受 css 影响，会造成重排（IE）

#### v-html 指令

更新元素的 `innerHTML`，内容会按照普通的 HTML 插入，不会被 Vue 编译，优先级高于 `{{ }}`

保证只在可信的内容上使用这个指令，在用户提交的内容上永远不要使用，容易导致 XSS 攻击。

```html
<div v-html="html">{{ msg }}</div>
```

#### 条件渲染

- **`v-if`**：根据条件渲染元素（通过注释的方式切换），功能和 js 中的 if 判断相同。
- **`v-else-if`**：前一个兄弟元素必须带有 `v-if` 或 `v-else-if` 指令。
- **`v-else`**：前一个兄弟元素必须带有 `v-if` 或 `v-else-if` 指令。
- **`v-show`**：根据条件渲染元素（通过 css 属性切换），效果和 v-if 相同。

**基本使用**

```html
<div v-if="num === 1">Lorem, ipsum dolor.</div>
<div v-else-if="num === 2">Eos, laborum sint.</div>
<div v-else-if="num === 3">Sed, reprehenderit minus.</div>
<div v-else>Cumque, dolore praesentium.</div>
```

```html
<div v-show="show">Lorem, ipsum dolor.</div>
```

**template 元素**

这是一个不可见的包裹元素，如果需要同时切换多个元素的显示与隐藏，可以使用这个元素。

```html
<template v-if="show">
  <div>Lorem, ipsum dolor.</div>
  <div>Unde, minus numquam.</div>
  <div>Quo, laboriosam corrupti!</div>
</template>
```

**`v-if` 和 `v-show` 的区别**

- v-if 是惰性的，条件为真才渲染元素，v-show 不管条件是真是假都渲染元素。
- v-if 通过注释的方式切换元素显示与隐藏，v-show 通过 css 属性切换元素显示与隐藏。
- v-if 有更高的切换开销，v-show 有更高的渲染开销。
- v-if 支持 template 元素，v-show 不支持 template 元素。
- v-if 支持其他判断，v-show 不支持其他判断。

#### v-bind 指令

用于动态的绑定一个或多个特性，格式：` v-bind:特性名="特性值"`，

`: `后面绑定特性名，值是一个 js 表达式，，`v-bind:` 可以简写成 `:`

```html
<div v-bind:red="red" :green="green"></div>
<img :src="url" alt="" />
<img :src="'https://' + url" alt="" />
```

**动态的特性名**

将特性名定义到 data 中，可以动态的为元素绑定特性名【2.6.0+】

```html
<div :[attribute]="value"></div>
```

**绑定多个特性**

可以将 v-bind 指令赋值为一个包含键值对（特性名和特性值）的对象，此时 v-bind 不能使用简写形式，如果绑定的特性是 class 或 style，不可以使用数组或对象语法。

```html
<div v-bind="{ class: attr, id: 'game' }"></div>
```

**绑定 class**

可以使用对象语法或数组语法为 class 绑定多个类名，可以和已有 class 共存（添加）

- 对象语法：是否添加某个类名取决于它的值是否为真

```html
<div
  :class="{
      red: isRed,
      green: true,
      blue: false
    }"
  class="yellow"
></div>
```

- 数组语法：相当于绑定了一个类名列表，数组语法中还可以使用对象语法

```html
<div
  :class="[red,'green',  {
      blue: isBlue
    }]"
  class="yellow"
></div>
```

**绑定 style**

可以使用对象语法或数组语法绑定多个 style 样式，可以和已有的 style 样式共存（覆盖）

- 对象语法：类似于书写在 js 中的 style 样式对象，也可以定义到 data 中，通过数据使用

```html
<div
  :style="{
      color: 'red',
      backgroundColor: 'blue'
    }"
  style="font-size: 30px;"
>
  Lorem, ipsum dolor.
</div>

<!-- 定义到了 data 中 -->
<div :style="styles">Lorem, ipsum dolor.</div>
```

- 数组语法：可以使用 data 中的多个 style 样式

```html
<div :style="[styles1, styles2]">Lorem, ipsum dolor.</div>
```

- 绑定 style 时，Vue 会自动的为属性添加厂商前缀
- 绑定 style 时，可以支持多重值，会渲染数组中最后一个被当前浏览器支持的值。

```html
<div v-bind:style="{ display: ['-webkit-box', 'flex', '-ms-flexbox'] }"></div>
```

**修饰符**

指示该特性应该以什么特殊的形式绑定，格式：`v-bind:特性名.修饰符="data"`

- **`camel`**：HTML 特性会将大写字母转换成小写字母，该修饰符用于将特性名驼峰化。

```html
<svg :view-box.camel="viewBox"></svg>
```

- **`prop`**：用于设置 dom 属性，如：innerHTML、innerText、className 等。

```html
<div :text-content.prop=" 'kevin' "></div>
<div :class-name.prop="item"></div>
```

- **`sync`**：用于组件，详解请查看 “组件事件” 笔记

#### v-on 指令

该指令用于监听 DOM 事件，格式：`v-on:事件类型="事件处理函数"`

`:` 后面绑定事件类型，值是一个事件处理函数或 js 表达式，`v-bind:` 可以简写成 `@`

**基本使用**

```html
<div id="app">
  <button v-on:click="content++">点击</button>
  <p>{{content}}</p>
</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    content: 0,
  },
});
```

当事件需要处理复杂逻辑时，通常会将 js 代码封装到方法中，这时需要传递一个方法名称。

方法并不是一个数据，需要定义到配置对象中的 `methods` 配置项中，Vue 将所有方法全部代理给了 vue 实例，为了方便方法与方法之间的相互调用（方法中的 this 指向 vue 实例）

```html
<div id="app">
  <button v-on:click="handleClick">点击</button>
</div>
```

```js
const vm = new Vue({
  el: "#app",
  methods: {
    handleClick(event) {
      // event：事件对象
      console.log("按钮被点击了"); // => 按钮被点击了
    },
  },
});
```

**传递参数**

可以给方法传递参数，这里并不是在调用方法，参数会被依次传递到方法的形参中。

```html
<button v-on:click="handleClick(10)">点击</button>
```

```js
const vm = new Vue({
  el: "#app",
  methods: {
    handleClick(num) {
      console.log(num); // => 10
    },
  },
});
```

传递参数时，如果方法内部需要使用事件对象，可以利用 `$event` 将事件对象传递给方法。

```html
<button v-on:click="handleClick(10, $event)">点击</button>
```

```js
const vm = new Vue({
  el: "#app",
  methods: {
    handleClick(num, event) {
      console.log(num, event.target); // => 10 <button>点击</button>
    },
  },
});
```

**动态的事件类型**

将事件类型定义到 data 中，可以动态的绑定事件类型【2.6.0+】

```html
<div id="app">
  <button v-on:[event]="content++">点击</button>
  <p>{{content}}</p>
</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    event: "click",
    content: 0,
  },
});
```

**绑定多个事件**

不给 v-on 指令传递参数，给它赋值为一个键值对的对象，可以为元素绑定多个事件，此时方法不能传递参数，v-on 也不能使用简写形式【2.4.0+】

- **`key`**：事件类型
- **`value`**：事件处理函数

```html
<button
  v-on="{
      mouseenter: handleEnter,
      mouseleave: handleLeave
    }"
>
  按钮
</button>
```

```js
const vm = new Vue({
  el: "#app",
  methods: {
    handleEnter() {
      console.log("鼠标移入了");
    },
    handleLeave() {
      console.log("鼠标移出了");
    },
  },
});
```

**这种监听事件的好处**

- 通过 HTML 可以轻松、精准的定位到对应的方法
- JS 区域和 DOM 区域完全解耦，更有利于测试和代码维护
- 实例被销毁时，事件也会自动移除，无需手动操作

**修饰符**

Vue 认为事件处理函数执行时，内部应该只关注纯粹的数据逻辑，而不关注 DOM 事件的细节。

事件修饰符：`@事件类型.修饰符="事件处理函数"`

- **`.stop`**：阻止事件冒泡
- **`.prevent`**：阻止默认事件
- **`.capture`**：开启事件捕获
- **`.self`**：只有事件源是自己时才会触发事件
- **`.once`**：只会执行一次事件处理函数【2.1.4】
- **`.passive`**：告诉浏览器不要阻止事件的默认行为，可以提高移动端性能【2.3.0】（设置 addEventListener 的 passive 选项）

修饰符可以联用，但是顺序很重要

- `@click.prevent.self`：先阻止所有点击事件的默认行为，然后点击自身时触发什么事件。
- `@click.self.prevent`：只阻止自身点击事件的默认行为。
- prevent 和 passive 不要一起使用，如果一起使用 prevent 会被忽略，且会有警告。

```html
<!-- stop：阻止冒泡 -->
<div @click="handleClick('div')" :style="{backgroundColor: 'red'}">
  <button @click.stop="handleClick('button')">点击</button>
</div>

<!-- prevent：阻止默认行为 -->
<form @submit.prevent="onSubmit">
  <button type="submit">提交</button>
</form>

<!-- capture：开启捕获模式 -->
<div @click.capture="handleClick('div')" :style="{backgroundColor: 'red'}">
  <button @click="handleClick('button')">点击</button>
</div>

<!-- self：只有点击自己才会触发 -->
<div @click.self="handleClick('div')" :style="{backgroundColor: 'red'}">
  <button @click="handleClick('button')">点击</button>
</div>

<!-- once：事件只执行一次 -->
<div @click.once="handleClick('div')" :style="{backgroundColor: 'red'}">
  <button @click="handleClick('button')">点击</button>
</div>
```

按键修饰符：`@事件类型.按键名称|按键码="事件处理函数"`，按下指定按键时触发，按键名称需要使用短横线命名法。

- 按键名称：https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key/Key_Values
- **`.enter`**
- **`.tab`**
- **`.delete`**
- **`.esc`**
- **`.space`**
- **`.up`**
- **`.down`**
- **`.left`**
- **`.right`**

```html
<!-- 按下箭头下键时触发事件处理函数 -->
<input type="text" @keyup.arrow-down="handleInput" />

<!-- 按下回车键时触发事件处理函数 -->
<input type="text" @keyup.enter="handleInput" />
<input type="text" @keyup.13="handleInput" />
```

自定义按键别名

```html
<input type="text" @keyup.ab-cd="handleInput" />
```

```js
Vue.config.keyCodes = {
  // 按键别名: 按键码
  "ab-cd": 32, // 按下空格键执行
};
```

系统修按键饰符：`@事件类型.修饰符="事件处理函数"`，按住系统按键再按下其他按键时触发。

- **`.ctrl`**
- **`.alt`**
- **`.shift`**
- **`.meta`**
- **`.exact`**：精确按住某个系统按键时触发【2.5.0+】

```html
<!-- 按住的按键中包含指定系统按键时触发 -->
<input type="text" @keyup.ctrl="handleInput" />
<input type="text" @keyup.alt.shift="handleInput" />

<!-- 按住的按键中只有指定按键时触发 -->
<input type="text" @keyup.alt.exact="handleInput" />

<!-- 不按住任何系统按键时才会触发 -->
<input type="text" @keyup.exact="handleInput" />
```

鼠标按键修饰符：`@事件类型.修饰符="事件处理函数"`，按下鼠标指定按键时触发。【2.2.0+】

- **`.left`**
- **`.right`**
- **`.middle`**

```html
<div @click.left="handleClick">点击</div>
<div @click.right.prevent="handleClick">点击</div>
<div @click.middle="handleClick">点击</div>
```

**所有修饰符都可以联用，如果未达到预期效果，可以尝试更换修饰符位置**

#### v-for 指令

基于数据循环渲染元素，该元素内部任意位置都可以使用循环出来的数据。

**循环数组**：`v-for="(item, index) in items"`，in 可以使用 of 替代，更接近迭代器语法。

- **`items`**：需要循环的数组
- **`item`**：数组项
- **`index`**【选填】：数组项对应索引

```html
<li v-for="(user, index) in users">{{ user }} - {{ index }}</li>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    users: ["阿大", "阿二", "阿三"],
  },
});
```

**循环对象**：`v-for="(value, key, index) in user"`

- **`user`**：需要循环的对象
- **`value`**：属性值
- **`key`**【选填】：属性名
- **`index`**【选填】：属性名对应索引

```html
<li v-for="(value, key, index) in user">
  {{ value }} - {{ key }} - {{ index }}
</li>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    user: {
      name: "kevin",
      age: 18,
      gender: "male",
    },
  },
});
```

**循环数字**：`v-for="(num, index) in number"`

- **`number`**：需要循环的数字
- **`num`**：每次循环出来的数字，从 1 开始。
- **`index`**【选填】：数字对应索引

```html
<li v-for="(n, index) in 10">{{ n }} - {{ index }}</li>
```

**循环字符串**：`v-for="(str, index) in string"`

- **`string`**：需要循环的字符串
- **`str`**：每次循环出来的字符
- **`index`**【选填】：字符对应索引

```html
<li v-for="(str, index) in 'kevin'">{{ str }} - {{ index }}</li>
```

**template 元素**

可以在 template 元素上使用 v-for 指令来循环渲染出一段包含多个兄弟元素的内容

```html
<template v-for="item in items">
  <li>{{ item }}</li>
  <span>Lorem, ipsum dolor.</span>
  <hr />
</template>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    items: ["HTML", "CSS", "JS"],
  },
});
```

**key**

当使用 v-for 指令渲染列表时，Vue 默认使用 “就地更新” 策略，如果想改变这一行为，就需要使用 key，key 的值可以是：数字、字符串、布尔值、Symbol，不建议使用索引，相同父元素中子元素的 key 值必须是唯一的。

```html
<li v-for="(item, index) in items" :key="item">
  {{ item }}
  <input type="text" />
  <button @click="handle(index)">移动</button>
</li>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    items: ["HTML", "CSS", "JS", "Vue", "React"],
  },
  methods: {
    handle(index) {
      const delItem = this.items.splice(index, 1);
      this.items.splice(index + 1, 0, ...delItem);
    },
  },
});
```

使用索引作为 key 值：此时进行了翻转数组的操作，Vue 会根据翻转后的数组重新渲染页面，key 也会被重新赋值，此时 Vue 会发现，绑定 key 值的元素内容发生了变化，那么 Vue 会将原来的元素删除，再重新生成元素进行渲染页面。

使用其他唯一值作为 key 值：如果进行了以上操作，此时 Vue 会发现，绑定 key 值的元素内容未发生变化，那么 Vue 会移动元素位置重新渲染页面。

**和 v-if 一起使用**

永远不要将 v-for 和 v-if 同时用在同一个元素身上，因为 v-for 具有更高的优先级，无论条件是否满足，v-for 都会遍历整个列表。

- 渲染列表中满足条件的列表项：可以利用计算属性来实现。
- 避免渲染被隐藏的列表：将 v-if 置于 v-for 的外层元素上。

#### v-model 指令

在表单元素上创建双向数据绑定（数据驱动视图，视图更改数据），本质上是一个语法糖。

| 元素类型               | 绑定的事件 | 绑定的属性 | 绑定属性的类型 |
| :--------------------- | :--------- | :--------- | :------------- |
| input[type="text"]     | input      | value      | 字符串         |
| textarea               | input      | value      | 字符串         |
| input[type="checkbox"] | change     | checked    | 布尔值或数组   |
| input[type="radio"]    | change     | checked    | 字符串         |
| select                 | change     | value      | 字符串或数组   |

**基本使用**

- **`input[type="text"]`** && **`textarea`**：关注的是输入的内容【字符串】

```html
<div id="app">
  <input type="text" v-model="msg" />
  <textarea v-model="msg"></textarea>
</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "hello vue",
  },
});
```

- **`input[type="checkbox"]`**

单个复选框：关注是否选中【布尔值】

```html
<label> <input type="checkbox" v-model="checked" />kevin </label>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    checked: true,
  },
});
```

多个复选框：关注所有选中的元素的 value 值【数组】

```html
<label> <input type="checkbox" value="张三" v-model="checkList" />张三 </label>
<label> <input type="checkbox" value="李四" v-model="checkList" />李四 </label>
<label> <input type="checkbox" value="王五" v-model="checkList" />王五 </label>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    checkList: [],
  },
});
```

- **`input[type="radio"]`**：关注的是被选中元素的 value 值【字符串】

```html
<label> <input type="radio" value="男" v-model="picked" />男 </label>
<label> <input type="radio" value="女" v-model="picked" />女 </label>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    picked: "",
  },
});
```

- **`select`**

单选下拉列表：关注的是选中 option 的 value 值【字符串】

```html
<select v-model="select">
  <option value="请选择" disabled>请选择</option>
  <option value="张三">张三</option>
  <option value="李四">李四</option>
  <option value="王五">王五</option>
</select>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    select: "请选择",
  },
});
```

多选下拉列表：关注的是所有选中 option 的 value 值【数组】

```html
<select v-model="selectList" multiple>
  <option value="张三">张三</option>
  <option value="李四">李四</option>
  <option value="王五">王五</option>
</select>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    selectList: [],
  },
});
```

**修饰符**

- **`.lazy`**：将 input 事件替换成 change 事件，如果不需要输入时同步数据，可以使用这个修饰符。

```html
<input type="text" v-model.lazy="msg" />{{ msg }}
```

- **`.number`**：将输入的内容转换成数字类型

```html
<input type="text" v-model.number="msg" />{{ typeof msg }}
```

- **`.trim`**：祛除输入内容的首尾空白字符

```html
<input type="text" v-model.trim="msg" />{{ msg }}
```

#### v-slot 指令

详情请参照 “组件-插槽” 笔记。

## 计算属性

有时候我们在模板中使用了复杂的逻辑，导致代码难以阅读和维护，这时候就应该使用计算属性。

计算属性书写到 Vue 配置对象的 `computed` 配置项中，计算属性的值是一个函数，函数的返回值就是计算属性的值（计算属性本身不是函数，无法调用），Vue 将所有计算属性都代理给了 vue 实例，计算属性函数内部的 this 指向 vue 实例。

**基本使用**

```html
<div id="app">{{ reverseMsg }}</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
  },
  computed: {
    reverseMsg: function () {
      return this.msg.split("").reverse().join("");
    },
  },
});
```

**计算属性和方法的区别**

- 计算属性：数据基于响应式缓存，只有依赖的数据发生了变化，计算属性才会重新计算。
- 方法：只要页面重新渲染，方法就会执行（如果方法中的逻辑比较复杂，也会影响性能）

**计算属性的值是一个对象**

对象中包含一个 getter 函数和一个 setter 函数，它们内部的 this 指向 vue 实例。

- **`getter`**：当读取属性时运行（当计算属性的值是一个函数时，默认只有 getter）
- **`setter`**：当设置属性时运行（计算属性的值永远取决于 getter 函数的返回结果）

```html
<div id="app">{{ reverseMsg }}</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "去吧！皮卡丘",
  },
  computed: {
    reverseMsg: {
      get() {
        return this.msg.split("").reverse().join("");
      },
      set(value) {
        this.msg = value;
      },
    },
  },
});
```

> 即使给计算属性重新赋值，计算属性的值也不会发生变化，除非给数据重新赋值。

## 侦听器

侦听数据（data 和 computed 中的数据）的变化，当被侦听的数据发生变化时，会立即执行对应的函数，侦听器定义到 Vue 配置对象的 `watch` 配置项中，Vue 将所有计算属性代理给了 vue 实例，侦听器函数中的 this 指向 vue 实例。

**侦听器的值是一个函数**

被侦听的数据发生变化，会立即执行对应函数，该函数接受两个参数，第一个参数：新的值，第二个参数：原来的值。

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "hello vue",
  },

  watch: {
    msg(newVal, oldVal) {
      console.log("数据改变了", newVal, oldVal);
    },
  },
});
```

**侦听器的值是一个字符串**

该字符串是方法的名字，当数据发生变化时，会调用方法执行。

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "hello vue",
  },

  methods: {
    handleChange() {
      console.log("数据改变了");
    },
  },
  watch: {
    msg: "handleChange",
  },
});
```

**侦听器的值是一个对象**

- **`handler`**：数据发生变化时执行的函数，值是字符串或函数。
- **`deep`**【选填】：是否开启深度侦听，默认值 false；在侦听对象时，侦听器默认只侦听对象引用的变化，开启深度侦听后可以侦听对象中所有属性的变化（对象中属性太多时会增加性能的开销）
- **`immediate`**【选填】：侦听器函数会在侦听开始之后立即被调用一次，默认是 false。

```js
const vm = new Vue({
  el: "#app",
  data: {
    obj: {
      a: 1,
      b: 2,
      c: 3,
    },
  },

  watch: {
    obj: {
      handler() {
        console.log("数据变化了");
      },
      deep: true,
      immediate: true,
    },
  },
});
```

**侦听器的值是一个数组**

数组中可以书写以上多种侦听器的值（函数、字符串、对象），当侦听的数据变化时，里面的所有侦听器函数都会执行。

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "hello vue",
  },

  methods: {
    handleChange() {
      console.log("字符串：数据改变了");
    },
  },
  watch: {
    msg: [
      function () {
        console.log("函数：数据变化了");
      },
      "handleChange",
      {
        handler() {
          console.log("对象：数据变化了");
        },
        deep: true,
        immediate: true,
      },
    ],
  },
});
```

**侦听器的键是一个字符串**

表示侦听对象中某个属性的变化

```js
const vm = new Vue({
  el: "#app",
  data: {
    obj: {
      a: 1,
      b: 2,
    },
  },

  watch: {
    "obj.a"() {
      console.log("a属性变化了");
    },
  },
});
```

**vm.$watch**

实例化时会调用 $watch 函数，遍历 watch 对象中的每个属性。

两个参数：`vm.$watch("需要侦听的数据", { 选项对象 })`

```js
vm.$watch("msg", {
  handler() {
    console.log("msg 的值改变了");
  },
  deep: true,
  immediate: true,
});
```

三个参数：`vm.$watch("需要侦听的数据", handler, { 选项对象 })`

```js
vm.$watch(
  "obj.a",
  function () {
    console.log("obj.a 的值改变了");
  },
  {
    deep: true,
    immediate: true,
  }
);
```

需要侦听的数据位置可以书写一个函数，可以侦听多个数据的变化，函数的返回值就是需要侦听的数据。

```js
vm.$watch(
  function () {
    return this.msg + this.obj.a;
  },
  function () {
    console.log("多个数据的值变化了");
  },
  {
    deep: true,
    immediate: true,
  }
);
```

**取消侦听数据**

当侦听器函数执行完毕后，会返回一个函数，该函数用于取消侦听

```js
const unwatch = vm.$watch("msg", function () {
  unwatch();
  console.log("msg的值改变了");
});
```

如果侦听器带有 immediate 选项，不能在第一次执行侦听器函数时取消侦听，必须要判断取消侦听函数的可用性（此时取消侦听器函数必须以 `var` 声明，有变量提升）

```js
var unwatch = vm.$watch(
  "msg",
  function () {
    if (unwatch) {
      unwatch();
      return;
    }
    console.log("msg的值改变了");
  },
  {
    immediate: true,
  }
);
```

**侦听器和计算属性的区别**

- 通过一个数据引发多个数据变化时使用侦听器；通过多个数据得到一个数据时使用计算属性。
- 在侦听器内部可以使用异步函数；计算属性内部不能使用异步函数（必须 return 回数据）

## Axios

axios 是基于 Promise 的 HTTP 库，用于发送网络请求，返回一个 Promise，使用 npm 安装。

格式：`axios({ 配置对象 })` 或 `axios(url, { 配置对象 })`

**常用配置**

```js
axios({
  method: "", // 设置请求方式
  baseURL: "", // 设置基础路径
  url: "", // 设置请求路径
  params: {}, // 设置请求参数，拼在 url 后面的
  data: {}, // 设置请求体，post 请求时使用
  headers: {}, // 设置请求头
  timeout: 1000, // 设置超时时间，单位毫秒
});
```

```js
axios({
  method: "POST",
  url: "https://developer.duyiedu.com/vue/setUserInfo",
  data: {
    name: userName,
    mail: userEmail,
  },
});

axios({
  method: "GET",
  url: "https://developer.duyiedu.com/vue/getUserInfo",
});
```

**请求的别名**

- **`axios.get(url, [config])`**
- **`axios.post(url, [data], [config]])`**
- **`axios.delete(url, [config])`**
- **`axios.head(url, [config])`**
- **`axios.put(url, [data], [config])`**
- **`axios.patch(url, [data], [config]])`**
- **`axios.request(config)`**
- **`axios.options(url, [config])`**

**配置默认值**

全局配置：所有通过 axios 发送的请求都会使用这个配置。

```js
axios.defaults.baseURL = "https://developer.duyiedu.com/vue";
axios.defaults.timeout = 3000;

axios.get("/getUserInfo"); // 获取数据
```

实例配置：所有通过该实例发送的请求都会使用这个配置。

```js
const instance = axios.create({
  baseURL: "https://developer.duyiedu.com/vue",
});

instance.get("/getUserInfo"); // 获取数据
```

请求配置：先创建一个空的实例，使用实例请求时再进行具体配置。

```js
const instance = axios.create();

instance.get("/getUserInfo", {
  baseURL: "https://developer.duyiedu.com/vue",
});
```

优先级：请求配置 > 实例配置 > 全局配置

**并发请求**

同时进行多个请求，并将返回值进行统一处理

- **`axios.all(iterable)`**：同时进行多个请求。
- **`axios.spread(callback)`**：统一处理返回结果。

```js
axios.defaults.baseURL = "https://developer.duyiedu.com/vue";

axios
  .all([
    axios.get("/getUserInfo"),
    axios.post("/setUserInfo", {
      name: "lisi",
      mail: "lisi@qq.com",
    }),
  ])
  .then(
    axios.spread((getResp, setResp) => {
      console.log(getResp, setResp); // 请求返回的结果
    })
  );
```

**拦截器**

interceptors，用于在请求发出之前或响应回来之后做一些事情，axios 实例也可以使用拦截器。

请求拦截器：用于在请求发出之前做一些事情

```js
// axios 的请求拦截器
axios.interceptors.request.use((config) => {
  // config：请求的配置对象
  // 对请求的配置对象做一些处理
  return config;
});

// 实例的请求拦截器
const instance = axios.create();
instance.interceptors.request.use((config) => {
  return config;
});
```

响应拦截器：用于在响应结果回来之后做一些事情

```js
// axios 的响应拦截器
axios.interceptors.response.use((response) => {
  // response：服务器相应结果
  // 对响应结果做一些处理
  return response;
});

// 实例的响应拦截器
const instance = axios.create();
instance.interceptors.response.use((response) => {
  return response;
});
```

移除拦截器：每个拦截器都有返回值，将该返回值传递给移除方法即可。

```js
// 取消 axios 的请求拦截器
const interceptor = axios.interceptors.request.use((config) => {
  return config;
});
axios.interceptors.request.eject(interceptor); // 移除拦截器

// 取消实例的响应拦截器
const instance = axios.create();
const interceptor = instance.interceptors.response.use((response) => {
  return response;
});
instance.interceptors.response.eject(interceptor); // 移除拦截器
```

**取消请求**

用于主动的取消 axios 请求

```js
const source = axios.CancelToken.source(); // 1. 得到资源

axios
  .get("/getUserInfo", {
    cancelToken: source.token, // 2. 请求中传递参数
  })
  .then((resp) => {
    console.log(resp);
  })
  .catch((error) => {
    // 4. 错误信息是 error.message 的值
    console.log(error.message);
  });

source.cancel("取消了请求"); // 3. 用于取消请求，并传递错误信息
```

**错误处理**

当请求发生错误时，我们通常会在拦截器中（第二个参数）对错误进行统一处理，一般我们会在响应拦截器中处理错误。

error.request 和 error.response 是 error 的上下文

- 如果 error.response 有值，则说明是响应时发生了错误
- 如果 error.response 无值，则说明是请求时发生了错误
- 如果 error.response 和 error.request 都无值，则说明请求未发出，如：取消请求。

```js
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.log("响应时发生错误");
      return Promise.reject("xxx");
    } else if (error.request) {
      console.log("请求时发生错误");
      return Promise.reject("xxx");
    } else {
      console.log("请求被取消了");
      return Promise.reject("xxx");
    }
  }
);
```

**预检**

当 axios 的请求为非简单请求时，浏览器会发送 options 请求进行预检（询问服务器是否允许跨域），如果允许跨域，浏览器再进行正常的请求，如果不允许跨域，会报 405 错误。

## template 配置项

template 称之为模板，是 Vue 配置对象的一个选项，值是一个字符串，优先级高于 el 选项，template 的值会被 Vue 的 render 函数编译。

```js
const vm = new Vue({
  el: "#app",
  template: `<div id="app-template"></div>`,
});
```

## 生命周期

每个 vue 实例从创建到销毁的过程，在这个过程中会自动运行一些生命周期钩子函数，有了这些生命周期钩子函数，我们就可以在其中书写自己的代码，这些生命周期钩子函数直接书写到 Vue 的配置对象中即可。

所有生命周期钩子函数内部的 this 都指向 vue 实例（不能使用箭头函数）

**beforeCreate**

实例被创建之前调用，此时 vue 实例上只有自身的事件和生命周期，我们书写到 Vue 配置对象中的所有数据、方法、侦听器、计算属性等都不存在，可以在这个生命周期钩子函数中开启定时器。

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
  },

  beforeCreate() {
    console.log(this.msg); // => undefined
  },
});
```

**created**

实例被创建之后调用，此时我们书写到 Vue 配置对象中的所有数据、方法、侦听器、计算属性等都代理给了 vue 实例，在这个生命周期钩子函数中可以操作数据、进行网络请求，使用自己定义的方法等，但是挂载阶段还未开始，`vm.$el` 不可见。

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
  },

  created() {
    console.log(this.msg); // => Hello Vue
    console.log(this.$el); // => undefined
  },
});
```

**beforeMount**

挂载之前被调用，相关的 render 函数首次被调用，此时模板已经编译完成，但是 `vm.$el` 还是旧模板。

```html
<div id="app">{{ msg }}</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
  },

  beforeMount() {
    console.log(this.$el); // => <div id=​"app">​{{ msg }}​</div>​
  },
});
```

**mounted**

挂载之后被调用，此时 `vm.$el` 已经是编译后的模板，代表 vue 实例已经创建完毕，在这个生命周期钩子函数中可以第一时间操作 DOM。

```html
<div id="app">{{ msg }}</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
  },

  mounted() {
    console.log(this.$el); // => <div id="app">Hello Vue</div>
  },
});
```

**beforeUpdate**

虚拟 DOM 更新数据之前被调用，此时数据已经更新了，但是还没有渲染页面。

```html
<div id="app">{{ msg }}</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
  },

  beforeUpdate() {
    console.log(this.msg); // => Hello World
    console.log(this.$el.outerHTML); // => <div id="app">Hello Vue</div>
  },
});

vm.msg = "Hello World"; // 更改数据
```

**updated**

虚拟 DOM 更新数据之后被调用，此时页面已经重新渲染，DOM 元素的内容和数据保持一致。

```html
<div id="app">{{ msg }}</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
  },

  updated() {
    console.log(this.msg); // => Hello World
    console.log(this.$el.outerHTML); // => <div id="app">Hello World</div>
  },
});

vm.msg = "Hello World"; // 更改数据
```

**activated**

被 keep-alive 缓存的组件激活时调用。

**deactivated**

被 keep-alive 缓存的组件停用时调用。

**beforeDestroy**

实例销毁之前被调用，此时实例仍然可用，通常在这个生命周期钩子函数中清除定时器。

```js
vm.$destroy();
```

**destroyed**

实例销毁之后被调用，该实例上的所有指令都被解绑、所有的事件都被移除、所有的子实例都被销毁。

**errorCaptured**【2.5.0+】

当捕获一个来后代组件的错误时被调用，它接受三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。

## 组件

#### 组件 - 基础

组件是一个可复用（任意次数）的 vue 实例，且具有一个名字，我们可以通过组件的名字在 Vue 的模板中使用这个组件，组件可以接受和 Vue 配置对象一样的配置项（除了 el 配置项）

**注册组件**

全局组件：`Vue.component("组件名字", { 配置对象 })`，可以在任意的 Vue 模板中使用。

```html
<div id="app">
  <cmp-global></cmp-global>
  <cmp-global></cmp-global>
  <cmp-global></cmp-global>
</div>
```

```js
Vue.component("cmp-global", {
  template: `
      <div>我是一个全局组件</div>
    `,
});

const vm = new Vue({
  el: "#app",
});
```

局部组件：通过 vue 实例的 components 选项注册（键是组件的名字，值是组件的配置对象），只能在当前的 Vue 模板中使用。

```html
<div id="app">
  <cmp-local></cmp-local>
  <cmp-local></cmp-local>
  <cmp-local></cmp-local>
</div>
```

```js
const vm = new Vue({
  el: "#app",
  components: {
    "cmp-local": {
      template: `
          <div>我是一个局部组件</div>
        `,
    },
  },
});
```

每个组件只能有一个根元素，当模板中的元素个数大于 1 时，可以将它们包裹到一个父元素内（不能使用 template 元素）

```js
Vue.component("cmp-global", {
  template: `
      <div>
        <div>我是组件的第一个元素</div>
        <div>我是组件的第二个元素</div>
      </div>
    `,
});
```

**组件的名字和使用**

组件名字：`cmp-global` 或 `CmpGlobal`

使用组件：`<cmp-global></cmp-global>` 或 `<CmpGlobal></CmpGlobal>`

在 DOM 模板中使组件，只能使用短横线（HTML 特性会将大写字母转换成小写字母），在 template 模板中两种都可以使用，推荐使用短横线，避免和未来的 HTML 元素冲突。

**自闭和组件**

`<cmp-global />`：自闭和组件表示该组件没有内容，就像 HTML 的空元素，这样使用能使代码更简洁。

HTML 只支持官方的自定义元素，并不支持自闭和组件，所以永远不要再 DOM 模板中使用自闭和组件。

自闭和组件可以书写到 template 模板、`.vue` 文件、`.jsx` 文件中。

**data 配置项**

组件中的 data 配置必须是一个函数，该函数返回一个对象，这样每个组件才能拥有一个独立的 data 配置项。

```js
Vue.component("cmp-global", {
  data() {
    return {
      count: 0,
    };
  },
  template: `
      <button @click="count++">点击了{{ count }}次</button>
    `,
});
```

#### prop 特性

组件默认是写好的结构、样式、行为，使用的数据应该由外界传递。

**基本使用**

在组件的 `props` 配置项中注册需要接收的特性，注册的特性和 data 中的数据一样，可以直接使用。

```js
Vue.component("video-item", {
  props: ["poster", "title", "play", "rank"],
  template: `
      <div class="video-item">
        <div class="poster">
          <img
            :src="poster"
            :alt="title"
          />
          <div class="info">
            <div class="play">{{ play }}</div>
            <div class="rank">{{ rank }}</div>
          </div>
        </div>
        <div class="title">{{ title }}</div>
      </div>
    `,
});
```

将组件需要的数据作为组件的自定义特性传递过去，数据可以是静态的也可以是动态的。

```html
<div id="app">
  <video-item
    v-for="video in videoList"
    :key="video.id"
    :poster="video.poster"
    :title="video.title"
    :play="video.play"
    :rank="video.rank"
  ></video-item>
</div>
```

**特性名的书写**

由于 HTML 特性，会将特性名的大写字母转换成小写字母，所以 DOM 模板中应该使用短横线的特性名，注册特性时应该使用小驼峰的特性名（template 模板中没有这样的限制）

```html
<my-cmp :small-camel="dataList"></my-cmp>
```

```js
Vue.component("my-cmp", {
  props: ["smallCamel"],
});
```

**传递对象的所有属性**

如果需要传递一个对象的所有属性，可以不给 `v-bind` 传递参数，直接将该对象赋值给 `v-bind`，那么该对象中的所有属性将全部传递给组件。

```html
<div id="app">
  <my-cmp v-bind="person"></my-cmp>
</div>
```

```js
Vue.component("my-cmp", {
  props: ["name", "age", "gender"],
  template: `
      <div>{{ name }} - {{ age }} - {{ gender }}</div>
    `,
});

const vm = new Vue({
  el: "#app",
  data: {
    person: {
      name: "kevin",
      age: 18,
      gender: "male",
    },
  },
});
```

HTML 代码等价于下面的写法

```html
<my-cmp :name="person.name" :age="person.age" :gender="person.gender"></my-cmp>
```

**类型检查**

组件可以对传入的特性进行类型检查（团队协作中非常有必要这么做），如果特性的类型不满足要求会给予警告，此时 props 的值不再是一个字符串数组，而是一个对象。

类型值可以是：`Sting`、`Number`、`Boolean`、`Array`、`Object`、`Date`、`Function`、`Promise`、`Symbol`、自定义构造函数、以上构造函数组成的数组（或者的关系），值为 `null` 或 `undefined` 的特性会通过任何类型的检查。

基础的类型检查

```js
Vue.component("my-cmp", {
  props: {
    videoList: Array,
  },
});
```

高级的类型检查

```js
Vue.component("my-cmp", {
  props: {
    list: {
      type: Array, // prop 的类型

      default: "lisi", // prop 的默认值
      // 如果默认值是数组或对象，必须由函数返回
      default() {
        return [] / {};
      },

      required: true, // porp 是否必须被传入

      // 自定义验证函数，是否通过取决于函数返回值的真假
      // prop：特性的值
      validator(prop) {
        return xxx;
      },
    },
  },
});
```

**单向数据流**

父组件特性值的更新会影响子组件的特性值，子组件特性值的更新不会影响父组件的特性值，这是为了防止子组件意外改变父组件的状态，从而导致数据的流向难以理解。

传递的特性值实际上是一个引用，如果传递的特性值是数组或对象类型，那么子组件的更新会影响父组件的状态，这样是不行的，并且 Vue 也会在控制台警告。

如果需要对传递的特性做更改，可以在组件内的 data 中定义数据，把传递的特性赋值给该数据，修改 data 中的数据即可。

如果想把特性值直接作为本地数据，可以将特性值直接赋值给 data 中的数据（引用类型需要深度克隆）

```js
Vue.component("my-array", {
  props: {
    array: Array,
    title: String,
  },

  data() {
    return {
      myTitle: this.title,
      myArray: [...this.array],
    };
  },
});
```

如果想把特性值进行转换后作为本地数据，可以根据该特性定义一个计算属性，操作该计算属性即可。

```js
Vue.component("my-array", {
  props: ["size"],
  computed: {
    normalizedSize() {
      return this.size.trim().toLowerCase();
    },
  },
});
```

#### 非 prop 特性

非 prop 特性：未被组件注册的特性，当组件接收一个非 prop 特性时，该特性会被添加到组件的根元素上，如果组件根元素上存在重名特性，则已有特性会被替换或合并（class 和 style）

```html
<div id="app">
  <my-cmp a="1" b="2" c="3" class="red" style="font-size: 20px"></my-cmp>
</div>
```

```js
Vue.component("my-cmp", {
  props: ["a"],
  template: `
      <div b="10" class="blue" style="color: red">组件</div>
    `,
});
```

页面元素结构如下

```html
<div id="app">
  <div b="2" class="blue red" c="3" style="color: red; font-size: 20px;">
    组件
  </div>
</div>
```

**禁用特性继承**

如果不希望组件的根元素继承特性，需要在组件的配置对象中书写配置项 `inheritAttrs: false`，该配置项不会对 class 和 style 产生影响。

禁用特性继承后，vue 实例上会有一个属性 `$attrs`，值是一个对象，该对象中记录了所有没有被继承的非 prop 特性，可以通过 `v-bind` 指令将非 prop 特性绑定到某个元素上。

```html
<div id="app">
  <my-cmp type="checkbox" a="1" b="2"></my-cmp>
</div>
```

```js
Vue.component("my-cmp", {
  inheritAttrs: false,
  template: `
      <label>
        请选择：<input :type="$attrs.type"/>  
        <div v-bind="$attrs"></div>
      </label>
    `,
});
```

页面元素结构如下

```html
<div id="app">
  <label>
    请选择：<input type="checkbox" />
    <div type="checkbox" a="1" b="2"></div
  ></label>
</div>
```

#### 组件 - 事件

和监听 DOM 元素事件一样监听组件事件即可。

```html
<div id="app">
  <my-cmp></my-cmp>
</div>
```

```js
Vue.component("my-cmp", {
  template: `
      <button @click="handleClick">点击</button>
    `,

  methods: {
    handleClick() {
      console.log("被点击了");
    },
  },
});
```

**自定义事件**

子组件触发事件，父组件需要做一些事情时，可以使用自定义事件。

子组件使用 `$emit` 将自定义事件抛出（第一个参数即是自定义事件的名字），父组件监听抛出的自定义事件即可。

```html
<div id="app">
  <my-cmp @cmp-event="handleEvent"></my-cmp>
</div>
```

```js
Vue.component("my-cmp", {
  template: `
      <button @click="$emit('cmp-event')">点击</button>
    `,
});
```

```js
const vm = new Vue({
  el: "#app",
  methods: {
    handleEvent() {
      console.log("子组件的自定事件");
    },
  },
});
```

**传递数据**

如果在抛出自定义事件的同时给父组件传递数据，可以使用 `$emit` 的后续参数

```js
Vue.component("my-cmp", {
  template: `
      <button @click="$emit('cmp-event', 100)">点击</button>
    `,
});
```

传递过来的数据会作为方法的参数传递给方法。

```html
<div id="app">
  <my-cmp @cmp-event="handleEvent"></my-cmp>
</div>
```

```js
const vm = new Vue({
  el: "#app",
  methods: {
    handleEvent(params) {
      console.log(params); // => 100
    },
  },
});
```

也可以通过 `$event` 访问传递过来的数据，组件中没有事件对象。

```html
<my-cmp @cmp-event="size += $event"></my-cmp> {{ size }}
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    size: 0,
  },
});
```

**事件名**

在抛出事件时，事件的名字是在 template 模板中书写的（不会将大写字母转换成小写字母），父元素监听事件时是在 DOM 模板中监听的（会将大写字母转换成小写字母），而监听的事件需要完全匹配抛出的事件，所以推荐使用短横线的事件名。

**使用原生事件**

监听组件的事件时，监听的都是组件抛出的自定义事件，有些时候，我们需要监听组件根元素的原生事件，这时可以使用 `v-on` 指令的 `.native` 修饰符。

```html
<div id="app">
  <my-input @focus.native="onFocus" @blur.native="onBlur"></my-input>
</div>
```

```js
Vue.component("my-input", {
  template: `<input />`,
});
```

```js
const vm = new Vue({
  el: "#app",

  methods: {
    onFocus() {
      console.log("聚焦了");
    },
    onBlur() {
      console.log("失焦了");
    },
  },
});
```

当组件的根元素不是 input 元素时，使用上面的方法会监听失败，这时我们将不再使用修饰符，而是使用 vue 实例提供的 `$listeners` 属性，该属性是一个对象，里面包含了作用于该组件上的所有监听器，通过 `v-on` 指令将监听器绑定到某个元素上。

```html
<div id="app">
  <base-input @focus="onFocus" @blur="onBlur"></base-input>
</div>
```

```js
Vue.component("base-input", {
  template: `
      <label>
        <input v-on="$listeners"/>  
      </label>
    `,

  mounted() {
    console.log(this.$listeners); // => {focus: ƒ, blur: ƒ}
  },
});
```

```js
const vm = new Vue({
  el: "#app",

  methods: {
    onFocus() {
      console.log("聚焦了");
    },
    onBlur() {
      console.log("失焦了");
    },
  },
});
```

**使用 v-model**

组件上的 `v-model` 指令，绑定的是 value 特性和自定义的 input 事件。

```html
<div id="app">
  <my-model v-model="msg"></my-model>
</div>
```

上面的 HTML 代码等价于下面的

```html
<div id="app">
  <my-model :value="msg" @input="msg = $event"></my-model>
</div>
```

组件内的代码必须满足以下要求

- 需要注册 value 特性。
- 将注册的 value 特性绑定到 input 元素的 value 特性上。
- 当组件内的 input 元素触发 input 事件时，抛出一个自定义的 input 事件，并把 value 值作为数据传递个父组件。

```js
Vue.component("my-model", {
  props: ["value"],
  template: `
      <div>
        <input 
          type="text" 
          :value="value" 
          @input="$emit('input', $event.target.value)" 
        />  
      </div>
    `,
});
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
  },
});
```

对于单选框或复选框，可以使用配置对象的 `model` 配置项来改变绑定的特性和监听的事件。

```html
<div id="app">
  <my-checkbox v-model="checked"></my-checkbox>
</div>
```

```js
Vue.component("my-checkbox", {
  props: ["checked"],
  model: {
    prop: "checked",
    event: "change",
  },
  template: `
      <label>
        请选择：
        <input 
          type="checkbox" 
          :checked="checked" 
          @change="$emit('change', $event.target.checked)" 
        />
      </label>
    `,
});
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    checked: true,
  },
});
```

**.sync** 修饰符

`v-bind` 指令的 `.sync` 修饰符也可以实现双向数据绑定，它是 xxx 特性和 `update:xxx` 事件的语法糖。（sync 无需 model 配置项）

```html
<my-sync :abc.sync="msg"></my-sync>
```

```js
Vue.component("my-sync", {
  props: {
    abc: String,
  },
  template: `
      <div>
        <input 
          type="text" 
          :value="abc" 
          @input="$emit('update:abc', $event.target.value)"
        />  
      </div>
    `,
});
```

与 `v-bind` 一起使用

```html
<my-sync :person.sync="person" :value.sync="msg"></my-sync>
```

```js
Vue.component("my-sync", {
  props: ["person", "value"],
  template: `
      <div>
       {{ person.name }}  
       {{ person.age }}  
       {{ person.gender }}  
       {{ value }}
      </div>
    `,
});
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
    person: {
      name: "kevin",
      age: 18,
      gender: "male",
    },
  },
});
```

- 带有 `.sync` 的 `v-bind` 指令，特性值只能是数据，不能是 js 表达式，如：`:value.sync="1 + 1"` 是无效的。
- 带有 `.sync` 的 `v-bind` 指令必须传参，如：`v-bind.sync="{ value: 'Hello Vue'}"` 是无效的。

> 在 Vue 1.x 时，就已经支持 .sync 语法，但是此时的 .sync 可以完全在子组件中修改父组件的状态，造成整个状态的变化很难追溯，所以官方在 Vue 2.0 时移除了这个特性。然后在 Vue 2.3 时，.sync 又回归了，跟以往不同的是，现在的 .sync 完完全全就是一个语法糖，跟 v-model 的实现原理是一样的，也不容易破环原有的数据模型，使用上更安全、方便。

**v-model 和 .sync 的区别**

- 两者都可以实现双向数据绑定，都是通过绑定特性名和事件的方式实现。
- 当一个组件对外只暴露一个受控状态且符合统一标准，通常使用 v-model。
- `.sync` 更加灵活，凡是需要使用双向数据绑定的地方，都可以使用。

#### 组件 - 插槽

用于向组件传递内容（HTML 元素、组件、数据等），组件内的 slot 元素将被传递的内容替换。

```html
<div id="app">
  <my-slot>
    组件内容
    <div>div元素</div>
  </my-slot>
</div>
```

```js
Vue.component("my-slot", {
  template: `
      <div>
        <slot></slot>
        xxx
        <slot></slot>
      </div>
    `,
});
```

父级模板中的所有内容都是在父级作用域中编译的；子模板中的所有内容都是在子作用域中编译的。

**后备内容**

就是插槽的默认内容，如果使用组件时传递了内容，就使用传递的，如果没有传递，则使用默认内容。

```html
<div id="app">
  <my-slot>点击</my-slot>
</div>
```

```js
Vue.component("my-slot", {
  template: `
      <button>
        <slot>提交</slot>
      </button>
    `,
});
```

**具名插槽**

有时我们需要把向组件传递的内容放入到不同的插槽中，这时候需要使用具名插槽

在组件内的 slot 元素上使用 name 特性给插槽起个名字，没有 name 特性的插槽为默认插槽，它的名字为 default。

```js
Vue.component("my-slot", {
  template: `
      <div class="header">
        <slot name="header"></slot>  
      </div>
      <div class="content">
        <slot></slot>  
      </div>
      <div class="footer">
        <slot name="footer"></slot>  
      </div>
    `,
});
```

在向具名插槽提供内容时，在 template 元素上使用 `v-slot` 指令，并以参数的形式提供插槽名，template 元素中的所有内容会被传递到对应的插槽中（对于没有书写 v-slot 指令或 v-slot 指令的参数是 default，则视为默认插槽内容），`v-slot:` 可以简称成 `#`

```html
<div id="app">
  <my-slot>
    <template v-slot:header>
      <h1>头部</h1>
    </template>
    <template v-slot:default>
      <p>主要内容</p>
    </template>
    <template #footer>
      <div>底部</div>
    </template>
  </my-slot>
</div>
```

v-slot 指令只能用在 template 元素或独占默认插槽语法的组件标签上。

**作用域插槽**

如果向组件传递的内容需要访问组件的数据，这时需要使用作用域插槽。

需要将组件内的数据作为 slot 元素的特性绑定到元素上，这种特性称之为：插槽 prop。

```js
Vue.component("my-slot", {
  data() {
    return {
      user: {
        name: "kevin",
        age: 18,
        gender: "male",
      },
    };
  },

  template: `
      <div>
        <slot :user="user"></slot>  
      </div>
    `,
});
```

在父作用域中可以使用 v-slot 指令来接收插槽 prop（default 位置是插槽的名字）

```html
<my-slot>
  <template #default="slotProps"> {{ slotProps }} </template>
</my-slot>
```

当且仅当向一种插槽（默认插槽、具名插槽）传递内容时，组件的标签可以当作 template 元素使用，可以将 v-slot 指令用于组件标签上（如果向多种插槽提供内容时，不能这么做，容易导致作用域不明确），如果数据来自于默认插槽，default 可以省略。

```html
<my-slot v-slot:default="slotProps"> {{ slotProps }} </my-slot>
```

可以对插槽 prop 使用解构语法，会使模板更简洁，还能对 prop 重命名、使用默认值等操作。

```html
<my-slot>
  <template v-slot:user="{ user }"> {{ user.name }} - {{ user.age }} </template>
</my-slot>
```

**动态的插槽名**【2.6.0+】

插槽名可以使用数据动态的绑定

```html
<my-cmp>
  <template v-slot:[slotName]> ... </template>
</my-cmp>
```

**废弃的语法**

具名插槽，2.6.0 被废弃

```html
<my-cmp>
  <template slot="header">
    <h1>头部</h1>
  </template>

  <template>
    <p>内容</p>
    <p>内容</p>
  </template>

  <template slot="footer">
    <p>底部</p>
  </template>
</my-cmp>
```

作用域插槽，2.6.0 被废弃

```html
<my-cmp>
  <template slot="default" slot-scope="slotProps">
    {{ slotProps.user.name }}
  </template>
</my-cmp>
```

#### 动态组件

在一个多标签的页面中实现不同组件之间的动态切换。

使用 component 元素的 is 特性进行不同组件的切换（is 特性的值可以是组件的名字也可以是组件的实例）

```html
<button v-for="post in posts" :key="post.id" @click="showCmp = post.cmp">
  {{ post.title }}
</button>
<component :is="showCmp"></component>
```

```js
Vue.component("cmp-post", {
  template: `
      <div>post</div>
    `,
});

Vue.component("cmp-more", {
  template: `
      <div>more</div>
    `,
});
```

```js
const mv = new Vue({
  el: "#app",
  data: {
    showCmp: "cmp-post",
    posts: [
      { title: "博客", cmp: "cmp-post", id: 0 },
      { title: "更多", cmp: "cmp-more", id: 1 },
    ],
  },
});
```

**keep-alive**

每次切换组件时都会创建一个新的组件实例，如果希望组件实例在第一次创建时被缓存下来，可以使用 keep-alive 组件将 component 元素包裹起来。

```html
<keep-alive>
  <component :is="showCmp"></component>
</keep-alive>
```

keep-alive 组件会缓存失活的组件实例，它要求被切换的组件必须有自己的名字（name 配置项配置或通过全局/局部注册），它不会渲染 DOM 元素，也不会出现在父组件链中。

当组件被切换时，keep-alive 的两个生命周期钩子函数会被对应执行。

- activated：组件激活时被调用
- deactivated：组件停用时被调用

#### 处理边界情况

需要对 Vue 规则做出一些小调整的情况，这些情况都是有劣势或有危险的，**能不用尽量不用**。

**访问根实例**：通过 `new Vue` 创建的实例

```js
this.$root;
```

**访问父组件实例**：直接父组件

```js
this.$parent;
```

**依赖注入**：可以在嵌套层级较深的组件中，为后代组件提供公共数据。

父组件通过 provide 配置项提供数据，该配置项是一个函数，返回一个公共数据对象。

```js
Vue.component("cmp-parent", {
  provide() {
    return {
      user: {
        name: "kevin",
        age: 18,
      },
    };
  },
  template: `
      <div><slot></slot></div>
    `,
});
```

后代组件通过 inject 配置项接收需要使用的公共数据，该配置项是一个数组。

```js
Vue.component("cmp-son", {
  inject: ["name", "age"],
  mounted() {
    console.log(this.user.name, this.user.age); // => kevin 18
  },
  template: `
      <div></div>
    `,
});
```

- 依赖注入的数据不是响应式的
- 将你应用程序中的组件与它们当前的组织方式耦合起来，使重构变得更加困难。
- 祖先组件不需要知道哪些后代组件使用它提供的属性
- 后代组件不需要知道被注入的属性来自哪里

**访问后代组件实例或元素**

通过 ref 特性为子组件赋予 ID 引用

```html
<my-cmp ref="cmp">
  <input type="text" ref="input" />
</my-cmp>
```

通过 `this.$refs.xxx` 访问子组件实例

```js
console.log(this.$refs); // => {input: input, cmp: VueComponent}
```

`$refs`：只在组件渲染完成后生效，它不是响应式的，应该避免在模板或计算属性中访问。

**程序化的事件监听**

除了使用 `v-on` 或 `$emit` 监听事件外，我们还可以使用下面的方法，这些方法通常用于在一个组件实例上手动监听事件（如：）

- **`$on(eventName, eventHandler)`**：监听事件
- **`$once(eventName, eventHandler)`**：监听一次性事件
- **`$off(eventName, eventHandler)`**：取消监听事件

**递归组件**：在自己的模板中调用自身，递归组件必须有出口

**组件间的循环引用**

全局组件不会出现悖论，局部组件会出现悖论

告诉模块系统，A 反正需要 B，但是可以先不去解析 B

```js
beforeCreate () {
  this.$options.components.CmpB = require('./tree-folder-contents.vue').default;
}
```

在 webpack 中可以异步导入一个模块

```js
components: {
  CmpB: () => import("./tree-folder-contents.vue");
}
```

**模板定义的替代品**：不推荐使用

内联模板：在使用组件时，写上特殊的特性：inline-template，就可以直接将里面的内容作为模板而不是被分发的内容（插槽）。

```html
<my-cmp inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-cmp>
```

X-Template：在一个类型为 `text/x-template` 的 script 元素中通过一个 id 将模板引用过去

```html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

```js
Vue.component("hello-world", {
  template: "#hello-world-template",
});
```

**控制更新**

- 强制更新：

当更改了某个数据，页面未重新渲染时，可以调用 `$forceUpdate` 来做一次强制更新（很多情况下不需要这么做）

- 通过 v-once 创建低开销的静态组件

渲染普通的 HTML 元素在 Vue 中是非常快速的，但有的时候你可能有一个组件，这个组件包含了大量静态内容。在这种情况下，你可以在根元素上添加 v-once 特性以确保这些内容只计算一次然后缓存起来（不要过度使用，带来的效果不是很明显）

#### 异步组件

在项目中，有些组件不会进入首屏时加载，而是当执行了某些操作时，才会加载进来，所以此时，我们可以将该组件设置成异步加载，什么时候用，什么时候加载，以达到提升首屏性能的目的。

```js
components: {
  AsyncCmp: () => import("组件路径"),
},
```

将多个同时加载的异步组件合并到一个文件中，可以设置 `webpackChunkName: '合并的文件名'`。

```js
components: {
  AsyncCmp1: () => import(/* webpackChunkName: 'async' */ "组件路径1"),
  AsyncCmp2: () => import(/* webpackChunkName: 'async' */ "组件路径2"),
},
```

异步加载的文件，会在 link 元素上设置 `rel="prefetch"`，浏览器会在空闲时间内下载对应的资源，使用时直接从缓存中读取。

同步加载的文件，会再 link 元素上设置 `rel="preload"`，会及时下载对应的资源。

#### 通信方式

- **prop**：父组件传递数据给子组件【推荐】
- **$emit**：子组件传递数据给父组件【推荐】
- **v-model & .sync**：双向数据绑定【推荐】
- **$arrts**：祖先组件通过非 prop 特性传递数据【不推荐】
- **$listeners**：后代组件执行祖先组件的函数实现数据传递【不推荐】
- **$root**：后代组件访问根实例【不推荐】
- **$parent**：子组件访问父组件实例【不推荐】
- **$children**：父组件访问子组件实例【不推荐】
- **ref**：祖先组件通过 `$refs` 访问后代组件实例【不推荐】
- **provide & inject**：祖先组件提供公共数据，后代组件按需注入【不推荐】，适用于小组件的编写。
- **eventBus**：自己定义的兄弟组件间的通信方式【不推荐】
- **Vuex**：Vue 的状态管理【中大型项目强烈推荐】

事件总线：实现组件 cmp-a 传递数据给组件 cmp-b

```html
<div id="app">
  <cmp-a></cmp-a>
  <cmp-b></cmp-b>
</div>
```

```js
// 1. 在 Vue 原型链上添加一个属性 $bus，这个属性是一个 vue 实例
Vue.prototype.$bus = new Vue();

Vue.component("cmp-a", {
  data() {
    return {
      name: "kevin",
    };
  },

  methods: {
    handleClick() {
      // 2. 当按钮被点击后，触发自定义事件 click，并传递数据
      // $bus 是一个 vue 实例，实例上有 $emit 方法
      this.$bus.$emit("click", this.name);
    },
  },

  template: `
      <button @click="handleClick">点击</button>
    `,
});

Vue.component("cmp-b", {
  mounted() {
    // 监听自定义的 click 事件，得到传递过来的数据
    // $bus 是一个 vue 实例，实例上有 $on 方法
    this.$bus.$on("click", (data) => {
      console.log(data);
    });
  },
  template: `
      <div></div>
    `,
});

const vm = new Vue({
  el: "#app",
});
```

## 混入

如果在一些组件中存在一些重复的数据或功能，我们可以将这些数据或功能提取到混入对象中，混入对象可以包含任意的组件配置项，当组件使用混入对象时，混入对象中所有的选项都会被混入到组件中。

**基本使用**

```html
<div id="app">
  <cmp-a></cmp-a>
</div>
```

```js
const mixin = {
  data() {
    return {
      name: "kevin",
    };
  },
};

Vue.component("cmp-a", {
  mixins: [mixin],
  mounted() {
    console.log(this.name); // => kevin
  },
  template: `<div>cmp-a</div>`,
});

const vm = new Vue({
  el: "#app",
});
```

**配置项合并**

当混入对象的配置项和组件本身的配置项有冲突时

- 数据：以组件内数据为准
- 钩子：将所有钩子合并成一个数组，先执行混入对象的钩子，再执行组件本身的钩子。
- 值为对象的配置项：合并成一个对象，键冲突时，以组件键值对为准。

`Vue.extend()` 也使用同样的策略进行合并。

**全局混入**

全局混入会影响其之后创建的每个 vue 实例（包括第三方组件），实例将自动使用全局混入，使用时需要格外小心。

```js
Vue.mixin({
  mounted() {
    console.log("global mixin");
  },
});
```

大多数情况下，全局混入只应当在拥有自定义选项的组件中使用。

```js
Vue.mixin({
  created() {
    const option = this.$options.option;
    if (option) {
      // 如果有自定义选项 option 再执行什么操作
      console.log(option); // => abc
    }
  },
});
```

```js
Vue.component("cmp-a", {
  option: "abc",
  template: `<div>cmp-a</div>`,
});
```

`this.$options`：获取组件内的所有配置项。

自定义选项合并将使用默认策略，即简单地覆盖已有值。

## 过滤器

用于处理一些常见的文本格式化，过滤器可以用于插值表达式和 v-bind 表达式，使用管道符分隔 `|`

**基本使用**

```html
<div id="app">
  <div>{{ msg | filter }}</div>
  <div v-bind:value="msg | filter"></div>
</div>
```

**全局过滤器**

通过 `Vue.filter` 注册全局过滤器。

```js
Vue.filter("myFilter", (val) => {
  return val.charAt(0).toUpperCase() + val.slice(1);
});
```

- 第一个参数：过滤器的名字
- 第二个参数：处理数据的函数，该函数的第一个参数是需要处理的数据（管道符前面的数据），第二个参数是过滤器的参数，该函数的返回值就是页面上最终显示的数据。

**局部过滤器**

通过实例的 `filters` 配置项注册局部过滤器

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "hello",
  },

  filters: {
    myFilter(val) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
  },
});
```

**过滤器函数的参数**

过滤器函数的第一个参数永远是需要处理的数据，第二个参数是过滤器的参数。

```html
<div>{{ msg | myFilter(100) }}</div>
```

```js
Vue.filter("myFilter", (val, params) => {
  console.log(val, params); // hello 100
});
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "hello",
  },
});
```

**过滤器串联**

```html
<div>{{ msg | filterA(100) | filterB(200) }}</div>
```

```js
Vue.filter("filterA", (value, num) => {
  console.log(value, num); // => hello 100
  return "AAA";
});

Vue.filter("filterB", (value, num) => {
  console.log(value, num); // => 'AAA' 200
  return "BBB";
});
```

**练习**

首字母大写

```html
<div>{{ msg | filterCamel}}</div>
```

```js
Vue.filter("filterCamel", (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
});
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "hello",
  },
});
```

显示银行卡余额

```html
<div>{{ money | toMoney }}</div>
```

```js
Vue.filter("toMoney", (money) => {
  return money.toLocaleString();
});
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    money: 5873897593841,
  },
});
```

如果数量超过一万显示 `xxx万`

```html
<div>{{ number | filterNumber }}</div>
```

```js
Vue.filter("filterNumber", (number) => {
  return (number / 10000).toFixed(1) + "万";
});
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    number: 824085,
  },
});
```

## 自定义指令

我们可以自定义一个指令去操作 DOM 元素，以达到代码复用的目的，在 DOM 元素上使用 `v-自定义指令名` 即可使用自定义指令。

**全局注册**

```js
Vue.directive("指令名", {
  // ... 自定义指令的生命周期钩子函数
});
```

**局部注册**

```js
const vm = new Vue({
  el: "#app",
  directives: {
    指令名字: {
      // ... 自定义指令的生命周期钩子函数
    },
  },
});
```

书写一个 input 框自动聚焦的自定义指令

```html
<input type="text" v-focus />
```

```js
Vue.directive("focus", {
  inserted(el) {
    el.focus();
  },
});
```

**生命周期钩子函数**

1. **`bind`**：只被调用一次，指令被绑定到元素时调用，可以进行一些初始化的设置。
2. **`inserted`**：被绑定元素插入父节点时调用，仅保证父节点已插入到页面，不保证被绑定元素插入到页面。
3. **`update`**：元素的虚拟 DOM 更新时被调用，但是可能在其子虚拟 DOM 更新之前。（自定义指令绑定的值更新虚拟 DOM 就更新了）
4. **`componentUpdated`**：元素的虚拟 DOM 及其子虚拟 DOM 更新完成后被调用。
5. **`unbind`**：只被调用一次，指令与元素解绑时被调用（被绑定的 DOM 元素被 Vue 移除）

生命周期钩子函数的参数

- **`el`**：指令所绑定的元素。
- **`binding`**
  - **`name`**：指令的名字
  - **`value`**：指令绑定的字符串表达式指向的值
  - **`oldValue`**：指令绑定的上一个值，仅在 update 和 componentUpdate 中可用。
  - **`expression`**：指令绑定的字符串表达式
  - **`arg`**：给指令传递的参数
  - **`modifiers`**：指令修饰符的对象
- **`vnode`**：Vue 编译生成的虚拟节点，`vnode.context` 指向 vue 实例。
- **`oldVnode`**：上一个虚拟节点，仅在 update 和 componentUpdate 中可用。

**动态的指令参数**

和动态的指令名一样，可以使用数据控制

```html
<input type="text" v-slice:[slicenum].number="msg" />{{msg}}
```

**钩子函数的简写**

当想在 bind 和 update 中触发相同的行为，而不书写其他钩子时，可以使用函数的简写形式。

```js
Vue.directive("slice", (el, binding, vnode, oldVnode) => {
  // bind 和 update 钩子函数
});
```

**对象字面量**

如果自定义指令需要多个值，可以传入一个对象（指令函数可以接收所有合法的 js 表达式），那么 binding 的 value 值就是这个对象

```html
<div v-test="{ a: 10, b: 20 }"></div>
```

```js
Vue.directive("test", {
  bind(el, binding) {
    console.log(binding.value.a); // => 10
    console.log(binding.value.b); // => 20
  },
});
```

## 安装脚手架

用于搭建 Vue 工程

**安装脚手架**

如果之前已经安装过旧版本的 vue-cli，需要卸载

```shell
npm uninstall -g vue-cli
yarn global remove vue-cli
```

安装新版本（3 版本） vue-cli

```shell
npm install -g @vue/cli
yarn global add @vue/cli
```

检查 vue-cli 版本

```shell
vue --version
```

**快速原型开发**（真实项目中不会使用）

```shell
npm install -g @vue/cli-service-global
yarn global add @vue/cli-service-global
```

运行 `.vue` 文件（当前 `.vue` 文件所在目录运行）

```shell
vue serve
```

**基本使用**

创建一个 `.vue` 文件，一个 `.vue` 文件就是一个组件，一个组件应该包含：结构、样式和行为

```html
<template>
  <div>
    <!-- 在这里书写 HTML，template模板，一个组件只有一个根元素 -->
  </div>
</template>

<script>
  export default {
    // 在这里书写 JS
  };
</script>

<style scoped>
  /* 在这里书写 CSS */
  /* scoped：CSS 的作用域，只在当前组件中有效，如果是通用样式则不需要该属性 */
  /* 拥有 scoped 的组件会加上一个标识，通过该标识设置 CSS 样式 */
</style>
```

组件的使用

```html
<template>
  <div>
    <!-- 使用 data 中的数据 -->
    {{ msg }}
    <!-- 普通的 DOM 元素 -->
    <p>我是app组件的p元素</p>

    <!-- 3. 使用其他组件 -->
    <other-cmp></other-cmp>
  </div>
</template>

<script>
  import otherCmp from "./Other"; // 1. 引入其他组件

  export default {
    components: {
      otherCmp, // 2. 注册组件，简写
      // otherCmp: otherCmp, // 注册组件，全写
    },
    data() {
      return {
        msg: "Hello Vue",
      };
    },
  };
</script>
```

**利用脚手架搭建项目**

使用命令创建项目

```shell
vue create 项目名称
```

## render 渲染函数

render 函数可以充分的使用 JS 的编程能力，优先级高于 template 选项，在组件中，template 元素的优先级高级 render 函数。

根据传入的 prop 特性来渲染不同级别的元素（h1 ~ h6）

```html
<!-- 父组件 -->
<template>
  <div id="app">
    <base-level :level="1">标题</base-level>
    <base-level :level="2">标题</base-level>
    <base-level :level="3">标题</base-level>
    <base-level :level="4">标题</base-level>
    <base-level :level="5">标题</base-level>
    <base-level :level="6">标题</base-level>
  </div>
</template>
```

```html
<!-- 子组件 -->
<script>
  export default {
    props: {
      level: {
        type: Number,
        required: true,
      },
    },

    render(createElement) {
      return createElement("h" + this.level, this.$slots.default);
    },
  };
</script>
```

**节点树**

当浏览器阅读代码内容时，会建立一个 DOM 节点树来保持追踪所有内容，每个元素、文字、注释都是一个节点，每个节点还可以有子节点，就像一个家谱树一样。

**虚拟 DOM**

Vue 通过建立一个虚拟 DOM 来追踪要如何改变真实的 DOM，是由 Vue 组件树建立起来的整个虚拟节点（vNode）的统称。

#### CreateElement 函数

createElement 可以简写成 `h`

该函数会返回一个虚拟节点（vNode：节点描述 createNodeDescription），它所包含的信息会告诉 Vue 页面上需要渲染什么节点，也包括其子节点的描述信息。

**参数**

```js
createElement(参数一, 参数二, 参数三);
```

- 参数一【必填】：元素的名称，可以是字符串（元素名），也可以是一个组件对象。
- 参数二【选填】：与模板中特性对应的数据对象。
- 参数三【选填】：子级虚拟节点，可以是字符串（文本），也可以是一个数组（多个子节点）

**数据对象【第二个参数】**

```js
export default {
  render(createElement) {
    return createElement("div", {
      // 设置 class，与 v-bind:class 绑定相同
      class: {
        red: true,
        blue: false,
      },

      // 设置 style，与 v-bind:style 相同
      style: {
        color: "red",
        fontSize: "20px",
      },

      // 设置除 class 和 style 以外的特性
      attrs: {
        id: "app",
      },

      // 设置组件 prop 特性
      props: {
        name: "kevin",
      },

      // 设置 DOM 属性
      domProps: {
        innerHTML: "<span>innerHTML</span>",
      },

      // 设置事件监听，不支持修饰符
      on: {
        click: this.handleClick,
      },

      // 仅用于组件，监听原生事件，而非组件内部使用 vm.$emit 触发的自定义事件。
      nativeOn: {
        click: this.nativeClickHandler,
      },

      // 使用自定义指令，无需对 binding 中的 oldValue 赋值，Vue 已自动同步。
      directives: [
        {
          name: "slice", // 自定义指令的名字 v-slice
          expression: "content", // 指令的字符串表达式 v-slice="content"
          value: this.content, // 字符串表达式的值
          arg: 5, // 指令的参数 v-slice:5="content"
          // 指令的修饰符 v-slice:5.number="content"
          modifiers: {
            number: true,
          },
        },
      ],

      // 设置 v-for 中的 key 值
      key: "xxxkey",

      // 设置 ref 引用
      ref: "xxxref",

      // 将相同的 ref 引用都存放到一个数组中
      refInFor: true,

      // 设置插槽
      slot: "slotName",

      // 设置作用域插槽
      // default：插槽名字
      // props：插槽 prop
      scopedSlots: {
        default(props) {
          return h("span", props.value);
        },
      },
    });
  },
};
```

#### 使用 JS 代替指令功能

**v-if && v-for**

使用 if 判断和 for 循环代替 v-if 和 v-for 指令

```html
<!-- 需要渲染的最终样式 -->
<ul v-if="items.length">
  <li v-for="item in items">{{ item }}</li>
</ul>
<p v-else>No items found.</p>
```

```html
<!-- 实现上面的样式 -->
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
                key: item, // 绑定 key 值
                ref: "li", // 绑定 ref 引用
                refInFor: true, // 将多个相同的引用放在一个数组中
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
```

**v-model**

渲染函数中并没有与 v-model 的直接对应，需要自己实现逻辑。

```html
<input type="text" v-model="value" />
```

```html
<script>
  export default {
    data() {
      return {
        msg: "Hello Vue",
      };
    },

    render(h) {
      const self = this;
      return h("input", {
        attrs: {
          value: this.msg,
        },
        on: {
          input(e) {
            // 这里 this === null
            self.msg = e.target.value;
          },
        },
      });
    },
  };
</script>
```

**事件修饰符**

对于 `.passive`、`.capture` 和 `.once` 修饰符, Vue 提供了相应的私有前缀

- **`.passive`**：私有前缀 `&`
- **`.capture`**：私有前缀 `!`
- **`.once`**：私有前缀 `~`
- **`.capture.once`** 和 **`.once.capture`**：私有前缀 `~!`

```js
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

对于其他修饰符，私有前缀并不是必须的，因为可以在事件处理函数中进行处理

- **`.stop`**：`event.stopPropagation()`
- **`.prevent`**：`event.preventDefault()`
- **`.self`**：`if (event.target !== event.currentTarget) { return }`
- **`其他按键`**：`if (event.keyCode !== 按键别名|按键码) { return }`
- **`系统修饰符`**：`if (!event.系统按键名) { return }`

**插槽**

```html
<div>
  <slot name="header"></slot>
  <slot></slot>
  <slot name="footer"></slot>
</div>
```

通过 `this.$slots` 访问静态插槽内容，每个插槽都是一个 VNode 数组

```js
render(h) {
  return h("div", [
    this.$slots.header,
    this.$slots.default,
    this.$slots.footer,
  ]);
},
```

通过 `this.$scopedSlots` 访问作用域插槽，每个作用域插槽都是一个返回若干 VNode 的函数：

```html
<div>
  <slot :text="msg"></slot>
</div>
```

```js
export default {
  data() {
    return {
      msg: "Hello World",
    };
  },

  render(h) {
    return h("div", [
      this.$scopedSlots.default({
        text: this.msg,
      }),
    ]);
  },
};
```

实现下面这种结构

```html
<div id="app">
  <base-slot v-slot:default="slotProps">
    <span>{{ slotProps.value }}</span>
  </base-slot>
</div>
```

```js
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
          default(slotProps) {
            return h("span", slotProps.value);
          },
        },
      }),
    ]
  );
},
```

## JSX 语法

使用 createElement 函数创建元素结构过于复杂，使用 JSX 语法创建元素结构更接近于在 template 元素中书写的元素结构。

JSX 语法中：`< >` 中放置的是 HTML，`{ }` 中放置的是 JS

#### 基本使用

**创建一个元素**

如果多个元素需要换行书写，需要加上小括号。

```js
render() {
  return (
    <h1>标题</h1>
  );
},
```

**使用数据**

```js
data() {
  return {
    msg: "Hello Vue",
  };
},

render() {
  return <h1>{ this.msg }</h1>;
},
```

#### 使用 Vue

**指令**

**`v-html`**：JSX 语法不支持该指令，使用下面方法代替

```js
render() {
  return <h1 domPropsInnerHTML="<p>innerHTML</p>"></h1>;
},
```

**`v-text`**：JSX 语法不支持该指令，使用下面方法代替

```js
render() {
  return <h1 domPropsTextContent="<p>TextContent</p>"></h1>;
},
```

**`v-show`** JSX 语法支持该指令

```js
render() {
  return <h1 v-show={this.show}>标题</h1>;
},
```

**`v-if` `v-else-if` `v-else`**：JSX 语法不支持该指令，使用下面方法代替

```js
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
},

render() {
  return (
    <h1>
      /* v-if */
      {this.show && <div>div</div>}

      /* v-if、v-else */
      {this.show ? <div>div</div> : <span>span</span>}

      /* 借助函数完成 v-if、v-else-if、v-else 判断 */
      {this.showDom()}
    </h1>
  );
},
```

**`v-for`**：JSX 语法不支持该指令，使用下面方法代替

```js
this.list.map((item) => <div key={item}>{item}</div>);
```

**`v-on`**：JSX 语法不支持该指令，使用下面方法代替

```js
/* 普通的点击事件 */
<button onClick={this.handleClick}>点击</button>
<button on-click={this.handleClick}>点击</button>

/* 组件的原生事件 */
<base-test nativeOnClick={this.handleClick} />

/* 传递参数，需要使用函数包裹 */
<button onClick={() => {this.handleClick(10) }}>
  点我
</button>
```

**`v-bind`**：JSX 语法不支持该指令，使用下面方法代替

```js
<div value={this.value}></div>
<div class={"red"}></div>
<div class={["red", "green"]}></div>
<div class={{ red: true, green: false, yellow: true }}></div>
<div style={{ color: "red", fontSize: "30px" }}>div</div>
<div style={this.style}>div</div>
```

**`v-model`**：JSX 语法支持该指令

```js
<input v-model={this.msg}></input>
```

**`v-pre` `v-cloak` `v-once`**：不常使用，无替代方案

**ref 引用**

```js
this.list.map((item) => (
  <div ref="li" refInFor={true} key={item}>
    {item}
  </div>
));
```

**自定义指令**

并没有比 createElement 函数简洁多少

```js
render () {
  // 第一种使用方法
  return (
    <input v-splice={{value: this.value, modifiers: {number: true }}}/>
  )

  // 第二种使用方法
  const directives = [
    {
      name: 'splice',
      value: this.value,
      modifiers: {number: true }
    }
  ];

  return (
    <div {...{ directives} }></div>
  )
}
```

**过滤器**

```js
<div>{this.$options.filters.过滤器名(数据)}</div>
```

**普通插槽**

1. template 结构

```html
<div>
  <slot name="header"></slot>
  <slot></slot>
  <slot name="footer"></slot>
</div>
```

JSX 结构

```js
render() {
  return (
    <div>
      {this.$slots.header}
      test
      {this.$slots.default}
      test
      {this.$slots.footer}
    </div>
  );
},
```

2. template 结构

```html
<div id="app">
  <base-test>
    <template #header>
      <h3>头部</h3>
    </template>
    <template #default>
      <h3>主要内容</h3>
    </template>
    <template #footer>
      <h3>底部</h3>
    </template>
  </base-test>
</div>
```

JSX 结构

```js
<base-test>
  <h3 slot="header">头部</h3>
  <h3 slot="default">主要内容</h3>
  <h3 slot="footer">底部</h3>
</base-test>
```

**作用域插槽**

1. template 结构

```html
<div class="demo">
  <slot :text="'HelloWorld'"></slot>
</div>
```

JSX 结构

```js
render() {
  return (
    <div class="demo">
      {this.$scopedSlots.default({
        text: "hello vue",
      })}
    </div>
 );
},
```

2. template 结构

```html
<div class="app">
  <base-test v-slot="{ text }"> {{ text }} </base-test>
</div>
```

JSX 结构

```js
<div id="app">
  {
    <base-test
      {...{
        scopedSlots: {
          default: (props) => props.text,
        },
      }}
    ></base-test>
  }
</div>
```

或者

```js
render() {
    const scopedSlots = {
      scopedSlots: {
        default: (props) => props.text,
      },
    };

    return (
      <div id="app">
        <base-test {...scopedSlots}></base-test>
      </div>
    );
  },
```

#### 函数式组件

当一个组件不需要状态，不需要生命周期，只接收一些 prop 来显示组件时，可以为其标记成函数式组件，在配置对象中书写 `functional: true`，函数式组件的渲染开销更低。

在 Vue 2.3.0 之前，如果一个函数式组件想要接收 prop，则 props 配置项是必须的；在 Vue 2.3.0 之后，可以省略 props 选项，组件上的所有特性都会自动使用 prop。

为了弥补函数式组件缺少实例的问题，render 函数提供第二个参数 `context` 作为上下文，它包含以下字段

- **props**：是一个对象，包含所有的 prop 特性
- **slots**：是一个函数，返回一个包含所有非作用域插槽的对象。
- **scopedSlots**【2.6.0+】：包含所有作用域插槽的对象，并以函数形式暴露非作用域插槽。
- **data**：传递给组件的整个数据对象，作为 createElement 的第二个参数传入组件。
- **parent**：父组件实例的引用
- **listeners**【2.3.0+】：包含所有父组件为当前组件注册事件监听器的对象，它是 `data.on` 的别名。
- **injections**【2.3.0+】：如果使用了 `inject` 选项，则该对象包含了应该被注入的属性。
- **children**：子虚拟节点（除了非作用域插槽和非具名插槽之外的默认插槽）的数组

根据传入的级别渲染不同的元素（h1 ~ h6）

```html
<div class="app">
  <base-level :level="1">标题</base-level>
  <base-level :level="2">标题</base-level>
  <base-level :level="3">标题</base-level>
  <base-level :level="4">标题</base-level>
  <base-level :level="5">标题</base-level>
  <base-level :level="6">标题</base-level>
</div>
```

```js
functional: true,
render(h, context) {
  const { props, slots } = context;
  const tag = "h" + props.level;
  return <tag>{slots().default}</tag>;
},
```

**slots 和 children 的区别**

- children 中包含所有隐式定义的默认插槽和非作用域插槽
- slots().default：如果显示的定义了默认插槽，则其中仅包含显示定义的默认插槽，如果没有显示定义默认插槽，则其中包含所有隐式默认插槽。

**基于模板的函数式组件**

Vue 2.5.0+，在 template 元素上使用 functional 特性就可以在模板中编写函数式组件。

```html
<template functional>
  <div>
    {{ props.level }}
    <slot></slot>
    <slot :txt="'作用域插槽'"></slot>
  </div>
</template>
```

## Vue - 过渡

Vue 在插入、更新、移除 DOM 时，提供多种不同方式（CSS、JS）的过渡效果。

#### 单元素（组件）过渡

**基本使用**

需要哪个元素有过渡效果就在哪个元素外面套上 `transition` 组件，该组件最多只能有一个子元素。

```html
<div class="demo">
  <button class="btn" @click="show = !show">切换</button>
  <transition>
    <div v-show="show" class="box"></div>
  </transition>
</div>
```

使用不同的类名设置元素的不同状态（该类名会被自动添加到该元素的身上）

```css
.v-leave,
.v-enter-to {
  opacity: 1;
}

.v-leave-active,
.v-enter-active {
  transition: opacity 1s;
}

.v-leave-to,
.v-enter {
  opacity: 0;
}
```

**class 类名**

元素进入时的类名

- `.v-enter`：该类名在元素被插入之前生效，在元素被插入之后的下一帧移除。
- `.v-enter-active`：该类名在元素被插入之前生效，在过渡/动画完成之后移除。
- `.v-enter-to`：该类名在 v-enter 被移除的那一刻生效，在过渡/动画完成之后移除。

元素离开时的类名

- `.v-leave`：该类名在离开过渡被触发时立刻生效，下一帧被移除。
- `.v-leave-active`：该类名在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。
- `.v-leave-to`：该类名在 v-leave 被移除的那一刻生效，在过渡/动画完成之后移除。

**类名的前缀**

可以通过 `transition` 组件的 `name` 特性起一个名字，然后通过 `xxx-enter/xxx-leave` 给不同的元素设置不同的过渡效果（没有 name 的组件默认使用 `v-` 前缀）

```html
<div class="demo">
  <button class="btn" @click="show = !show">切换</button>
  <transition name="box">
    <div v-show="show" class="box"></div>
  </transition>
</div>
```

```css
.box-leave,
.box-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

.box-leave-active,
.box-enter-active {
  transition: opacity 1s, transform 1s;
}

.box-leave-to,
.box-enter {
  opacity: 0;
  transform: translateX(300px);
}
```

**CSS 动画**

使用关键帧定义元素状态，只需要使用 `active` 类名即可。

```css
.box-enter-active {
  animation: move 1s ease;
}

.box-leave-active {
  animation: move 1s ease reverse;
}

@keyframes move {
  0% {
    opacity: 0;
    transform: translateX(300px) rotateZ(0deg);
  }

  50% {
    opacity: 0.5;
    transform: translateX(150px) rotateZ(180deg);
  }

  100% {
    opacity: 1;
    transform: translateX(0px) rotateZ(0deg);
  }
}
```

**自定义过渡类名**

自己定义过渡类名，优先级高于普通类名，这就意味着我们可以使用第三方库来实现过渡。

```html
<transition
  enter-class="enter"
  enter-active-class="enter-active"
  enter-to-class="enter-to"
  leave-class="leave"
  leave-active-class="leave-active"
  leave-to-class="leave-to"
>
  <div v-show="show" class="box"></div>
</transition>
```

```css
.enter,
.leave-to {
  opacity: 0;
}

.enter-active,
.leave-active {
  transition: all 1s;
}

.leave,
.enter-to {
  opacity: 1;
}
```

**使用第三方库**

Animate.css 官网：https://daneden.github.io/animate.css/

安装 animate.css

```shell
npm i animate.css
```

引入第三方库

```js
import "animate.css";
```

animate.css 全部使用关键帧书写，所以只需要更改 `active` 类名即可

```html
<transition
  enter-active-class="animate__animated 进入的类名"
  leave-active-class="animate__animated 离开的类名"
>
  <div v-show="show" class="box"></div>
</transition>
```

**同时使用过渡和动画**

当同时使用过渡和动画时，由于设置的时间不同，会导致结束的时间不同（不协调），可以使用 `transition` 组件的 `type` 特性来规定总时间应该以哪个（过渡、动画）为准，如果以时间长的为准，则不需要设置该项。（取值：`animation` | `transition`）

```html
<transition type="animation">
  <div v-show="show" class="box"></div>
</transition>
```

**显示的设置过渡时长**

可以绑定 `duration` 特性来规定过渡的总时长（单位毫秒），通常用于子元素比父元素的过渡时间长的场景。（父元素需要使用 `v-show` 指令）

```html
<transition :duration="3000">
  <div v-show="show" class="box"></div>
</transition>
```

还可以分别设置进入的时间和离开的时间

```html
<transition
  :duration="{
    enter: 1000,
    leave: 3000,
  }"
>
  <div v-show="show" class="box"></div>
</transition>
```

**首次元素渲染的过渡效果**

可以通过 `transition` 组件的 appear 特性来设置，默认使用 `enter-active` 的过渡效果，也可以自行设置，appear 也可以自定义类名。

```html
<transition
  appear
  appear-active-class="animate__animated animate__bounceInRight"
  enter-active-class="animate__animated animate__shakeX"
  leave-active-class="animate__animated animate__shakeY"
>
  <div v-show="show" class="box"></div>
</transition>
```

**利用 JS 实现过渡**

通过 `transition` 组件的生命周期钩子实现过渡。

```html
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @enter-cancelled="enterCancelled"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
  @leave-cancelled="leaveCancelled"
>
  <div v-show="show" class="box"></div>
</transition>
```

- `@before-enter`：动画入场前，可以在其中设置元素开始动画之前的初始样式
- `@enter`：动画入场中，可以在其中写动画，必须使用 done，否则动画会立即结束（@leave 同理）
- `@after-enter`：动画完成后
- `@enter-cancelled`：取消动画，会在下一次过渡时提示上一次过渡被取消了（执行取消动画的函数）

```html
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
>
  <div v-show="show" class="box"></div>
</transition>
```

```js
methods: {
  beforeEnter(el) {
    // 使用过渡的元素
    if (this.timer) {
      return;
    }
    this.left = 300;
    el.style.transform = `translateX(${this.left}px)`;
  },
  enter(el, done) {
    // done.canceled = true; // 取消过渡
    this.timer = setInterval(() => {
      this.left -= 10;
      if (this.left <= 0) {
        this.left = 0;
        clearInterval(this.timer);
        this.timer = null;
        done(); // 当运动到头，调用 done 函数，此时 afterEnter 函数才会执行
      }
      el.style.transform = `translateX(${this.left}px)`;
    }, 16);
  },
  afterEnter(el) {
    console.log("over");
    el.style.backgroundColor = "green";
  },
},
```

对于仅使用 JS 过渡的元素添加 `v-bind:css="false"`，Vue 会跳过 CSS 的检测，也可以避免过渡过程中 CSS 对过渡的影响。

```html
<transition :css="false">
  <div v-show="show" class="box"></div>
</transition>
```

设置了 `appear` 特性的 `transition` 组件，也存在自定义生命周期钩子函数。

```html
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <div v-show="show" class="box"></div>
</transition>
```

**使用第三方库**

Velocity.js 官网地址：http://velocityjs.org/

```shell
npm install velocity-animate ## 安装
```

组件中引入该库

```js
import Velocity from "velocity-animate";
```

在时间处理函数中使用 Velocity 函数

```js
// 已一个函数为例，其他函数使用方法相同。
enter(el, done) {
  // el：需要运动的元素
  // done：当过渡结束后手动调用，否则没有过渡效果
  Velocity(el, { translateX: 200 }, { duration: 300, loop: 3, complete: done });
  // Velocity 可以书写多个，下一个会等到前一个运动完成后才会执行
  // 第二个参数：书写 CSS 样式，如果是 transform 的值，可直接书写，单位可省略
  // 第三个参数：书写运动的配置，如时间，循环次数等
  // complete：表示过渡已经结束，可以让它执行 done 函数
  // 只有执行了 done 函数，过渡才算完成，元素才能从页面删除
},
```

#### 多元素（组件）过渡

**多元素过渡**

当切换展示的元素名称相同时，需要给每个元素设置不同的 key 值，否则 Vue 会就地复用。

可以使用 v-if 配合 v-else 指令切换元素，也可以使用不同的 key 值来切换元素。

- 使用 v-if 配合 v-else 切换元素

```html
<div class="more">
  <button @click="show = !show">点击</button>
  <transition>
    <div v-if="show" key="world">Hello World</div>
    <div v-else key="vue">Hello Vue</div>
  </transition>
</div>
```

```js
data() {
  return {
    show: true,
  };
},
```

- 使用不同的 key 值切换元素

```html
<div class="more">
  <button @click="show = !show">点击</button>
  <transition>
    <div :key="keyValue">Hello {{ keyValue }}</div>
  </transition>
</div>
```

```js
data() {
  return {
    show: true,
  };
},
computed: {
  keyValue() {
    return this.show ? "vue" : "world";
  },
},
```

可以使用 `transition` 组件的 `mode` 特性来规定多个元素的过渡模式，mode 的值如下：

- `in-out`：新元素先进行过渡，完成之后当前元素再过渡离开
- `out-in`：当前元素先进行过渡，完成之后新元素再过渡进入

```html
<div class="more">
  <button @click="show = !show">点击</button>
  <transition mode="out-in">
    <div :key="keyValue">Hello {{ keyValue }}</div>
  </transition>
</div>
```

**多组件过渡**

使用动态组件实现多组件过渡，可以使用 v-if 配合 v-else 切换组件，也可以使用 component 组件的 is 特性绑定不同的组件实现

- 使用 v-if 配合 v-else 切换组件

```html
<div class="more">
  <button class="btn" @click="show = !show">点击</button>
  <transition mode="in-out">
    <component v-if="show" :is="'MoreEle1'"></component>
    <component v-else :is="'MoreEle2'"></component>
  </transition>
</div>
```

- 使用 component 组件的 is 特性绑定不同的组件实现

```html
<div class="more">
  <button class="btn" @click="show = !show">点击</button>
  <transition>
    <component :is="showCmp"></component>
  </transition>
</div>
```

```js
components: {
  MoreEle1,
  MoreEle2,
},

data() {
  return {
    show: true,
  };
},
computed: {
  showCmp() {
    return this.show ? "MoreEle1" : "MoreEle2";
  },
},
```

#### 列表过渡

如果需要给多个元素添加过渡效果时，可以使用 `transition-group` 组件，该组件可以有 N 个子元素，每个子元素必须有一个唯一的 key 值，新添加的元素也会有过渡效果。

**该组件的特性**

- 该组件最终会渲染成 span 元素，可以通过 tag 特性更改为其他元素。
- 过渡模式不可用，因为我们不再相互切换元素。
- 内部的所有元素必须拥有一个唯一的 key 值。
- 类名将会应用到组件内所有的元素，而不是容器。

```html
<transition-group tag="ul">
  <li v-for="item in itemList" :key="item">{{ item }}</li>
</transition-group>
```

**列表的排序过渡**

transition-group 组件和 transition 组件拥有相同的类名，并且还提供了一个额外的类名 `v-move`，该类名会在子元素改变定位的过程中被应用，也可以更改类名前缀。

当移除一个列表元素时，需要将被移除的元素脱离文档流，否则，被移除的元素在移除过渡中一直处于文档流中，会影响到后面元素的 move 过渡效果。

Vue 使用了一个叫 `FLIP` 简单的动画队列，使用 `transform` 属性将元素从之前的位置平滑过渡到新的位置。

使用 `FLIP` 过渡的元素不能是 `display: inline` 的元素，可以是 `inline-block` 或放置于 flex 中的元素。

```css
.item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}

.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 元素离开的过程中脱离文档流 */
.v-leave-active {
  position: absolute;
}

.v-enter-to,
.v-leave {
  opacity: 1;
  transform: translateY(0px);
}

/* 元素改变定位有过渡效果 */
.v-move {
  transition: transform 0.5s;
}
```

**其他使用请参考 transition 组件**

#### 复用过渡效果

过渡可以通过 Vue 的组件系统实现复用，要创建一个可复用过渡组件，需要将 `transition` 或 `transition-group` 作为根元素，将任何子组件放置在其中即可。

```html
<template>
  <transition name="single">
    <slot></slot>
  </transition>
</template>
```

```html
<style scoped>
.single-enter,
.single-leave-to {
  opacity: 0;
}

.single-enter-active,
.single-leave-active {
  transition: all 1s;
}

.single-enter-to,
.single-leave {
  opacity: 1;
}
```

使用函数式组件实现，效率会更高，此时不能设置 css 作用域

```html
<!-- 如果是多元素过渡，不要忘记使用 key 值 -->
<copy-transition>
  <div key="vue" v-if="show" class="box">Hello Vue</div>
  <div key="world" v-else class="box">Hello World</div>
</copy-transition>
```

```jsx
functional: true,
render(h, context) {
  const { slots } = context; // 函数式组件中没有 this
  return (
    <transition name="single">
      { slots().default }
    </transition>
  );
},
```

```html
<!-- 不能设置 css 作用域 -->
<style>
  .single-enter,
  .single-leave-to {
    opacity: 0;
  }

  .single-enter-active,
  .single-leave-active {
    transition: all 1s;
  }

  .single-enter-to,
  .single-leave {
    opacity: 1;
  }
</style>
```

列表过渡

```html
<copy-transition>
  <template v-if="show">
    <li v-for="num in 5" :key="num">{{ num }}</li>
  </template>
</copy-transition>
```

```jsx
functional: true,
render(h, context) {
  const { slots } = context;
  return (
    <transition-group name="single" tag="ul">
      {slots().default}
    </transition-group>
  );
},
```

```html
<style>
  .single-enter,
  .single-leave-to {
    opacity: 0;
  }

  .single-enter-active,
  .single-leave-active {
    transition: all 1s;
  }

  .single-enter-to,
  .single-leave {
    opacity: 1;
  }
</style>
```

## VueRouter

VueRouter 是 Vue 的路由，可以根据不同的 url 地址展示不同的页面或内容。

随着 ajax 的出现，页面不用刷新就可以获取数据，因此前端也可以管理 url 地址，前端路由从此诞生。

前端路由更多用于单页应用，简称 SPA（Single Page Application），在单页应用中，页面只有一个，是通过不同的数据渲染不同的页面内容。

#### 基本使用

**安装路由**

```shell
npm i vue-router
```

**入口模块中**

1. 导入路由
2. Vue 使用路由
3. 创建路由组件并导入（可以使用异步组件）
4. 配置路由
5. 创建路由实例并传入路由的配置
6. 将路由实例挂载到根实例中

```js
import VueRouter from "vue-router"; // 1. 导入路由
Vue.use(VueRouter); // 2. Vue 使用路由

// 3. 创建路由组件并导入
import Home from "./components/Home";
import Learn from "./components/Learn";
import Student from "./components/Student";
import About from "./components/About";
import Activity from "./components/Activity";

// 4. 配置路由
const routes = [
  {
    path: "/", // url中显示的路径
    component: Home, // 使用的组件
  },
  {
    path: "/learn", // http://localhost:8080/#/learn
    component: Learn,
  },
  {
    path: "/student",
    conponent: Student,
  },
  {
    path: "/about",
    conponent: About,
  },
  {
    path: "/activity",
    conponent: Activity,
  },
];

// 5. 创建路由实例并传入路由的配置
const router = new VueRouter({
  routes: routes, // 可简写
});

// 6. 将路由实例挂载到根实例中
new Vue({
  render: (h) => h(App),
  router: router, // 可简写
}).$mount("#app");
```

**根组件中**

- **`router-link`**：该组件用来导航组件，最终会被渲染成 a 元素。
  - `to`：对应路由配置的 `path` 配置项。
  - `tag`：该组件最终会被渲染成什么元素。
- **`router-view`**：该组件用来渲染路由匹配组件的内容，对应路由配置的 `conponent` 配置项

```html
<div id="app">
  <router-link to="/" tag="div">首页</router-link>
  <router-link to="/learn">课程学习</router-link>
  <router-link to="/student">学员展示</router-link>
  <router-link to="/about">关于</router-link>
  <router-link to="/activity">社区</router-link>

  <router-view></router-view>
</div>
```

**路由的类名**

- **`router-link-active`**：该类名在当前路径包含路由 to 特性时，被添加到 router-link 身上。
- **`router-link-exact-active`**：该类名在当前路径完全匹配路由 to 特性时，被添加到 router-link 身上。

如果嫌类名过长，可以使用下面的方式将类名更改成你喜欢的类名

```js
const router = new VueRouter({
  linkActiveClass: "link",
  linkExactActiveClass: "link-exact",
});
```

**history 模式**

vue-router 默认使用 hash 模式：`http://localhost:8080/#/learn`。

hash 模式看起来并不像一个 url，可以将其更改成 history 模式

```js
const router = new VueRouter({
  mode: "history",
});
```

history 模式下的 url 是这样的：`http://localhost:8080/learn`，history 模式利用 `history.pushState` 来完成 url 跳转。

history 模式下，如果访问一个不存在的页面，则会返回 404，如果需要处理这种情况，可以让后端返回一个正常的错误的页面。hash 模式下不存在这样的情况。

**优化上面的代码**

1. 将路由的代码全部放入到单独文件中 `routes/index.js`
2. 将路由组件使用异步加载 `component: () => import("../views/Learn.vue")`
3. 将页面级的组件全部放入 views 目录中，components 目录中只放置普通组件。

#### 嵌套路由

一个被 router-view 渲染的组件想要包含自己的 router-view 时，可以使用嵌套路由。

在该路由配置中使用 children 配置项配置该组件的子路由。

```js
{
 path: "/activity",
 component: () => import("../views/Activity.vue"),
 children: [
   {
     path: "/activity/academic",
     component: () => import("../views/Academic.vue"),
   },
   {
     path: "/activity/personal",
     component: () => import("../views/Personal.vue"),
   },
   {
     path: "/activity/download",
     component: () => import("../views/Download.vue"),
   },
 ],
},
```

```html
<div class="activity">
  <router-link to="/activity/academic">学术讨论</router-link>
  <router-link to="/activity/personal">个人中心</router-link>
  <router-link to="/activity/download">资源下载</router-link>

  <router-view></router-view>
</div>
```

**子路由路径简写**

子路由配置中的路径可以简写，但是 router-link 中的 to 特性对应路径不能简写（需要使用命名路由才可以）

```js
{
  path: "academic", // 但是不能这样：path: "/academic"，会认为是根路径下的组件
  component: () => import("../views/Academic.vue"),
},
```

空路由：当访问 `/activity` 路径时，如果想默认渲染指定子组件，可以使用空路径 + 指定子组件。

```js
children: [
  {
    path: "", // 空路径
    component: () => import("../views/Academic.vue"), // 默认渲染的子组件
  },
],
```

#### 命名路由

可以通过一个名字标识路由，通过路由配置的 name 配置项进行配置。

```js
{
  path: "academic",
  name: "academic", // 命名路由
  component: () => import("../views/Academic.vue"),
},
```

在跳转一个命令路由时，绑定 to 属性，传入一个对象，name 属性赋值为想要跳转的路由名字即可

```html
<div class="activity">
  <router-link :to="{ name: 'academic' }">学术讨论</router-link>
</div>
```

#### 路由重定向

当点击一个路由时，重定向到其他路由，通过路由配置的 `redirect` 配置项进行配置，此时不能使用空路由，否则重定向会失败（会改变 url）

- 通过路由路径跳转，值是一个字符串

```js
{
  path: "/activity",
  component: () => import("../views/Activity.vue"),
  redirect: "/activity/academic", // 当点击社区时重定向到学术讨论，值是路由路径
  children: [
    {
      path: "academic",
      name: "academic",
      component: () => import("../views/Academic.vue"),
    }
  ],
},
```

- 通过路由名字跳转，值是一个对象

```js
redirect: {
  name: "academic", // 通过名字跳转
},
```

- 动态返回重定向目标，值是一个函数，该函数接收一个参数 `to`（被点击的路由），该函数返回一个字符串或对象

```js
redirect(to) {
  console.log(to); // 社区路由信息
  return "/activity/academic"; // 通过路径跳转
  return {
    name: "academic", // 通过名字跳转
  };
},
```

#### 路由别名

当我们点击社区下面的子路由时，社区的加重字体没了，是因为我们使用完全匹配的类名设置样式，这时需要改成包含的类名，但是这时我们定义的 `home` 路由使用 `/` 路径匹配，当点击所有路由时，home 组件一直处于加重字体的样式，因为所有的路径都包含是 `/`，这时我们的 home 路由就不能是 `/` 路径，需要改成 `/home`，路由的 to 属性也应该改成 `/home`，但是，我们在访问别的网站时，不用输入：`www.baidu.com/home`，就能打开百度首页，这时我们就需要路由别名。

重定向会改变 url，路由别名不会，`/a` 的别名是 `/b`，意味着，当用户访问 `/b` 时，url 会保持为 `/b`，但是路由匹配则为 `/a`，就像用户访问 `/a` 一样。

通过路由配置的 `alias` 配置项给路由设置别名

```js
{
  path: "/home",
  alias: "/", // 设置别名
  component: Home,
},
```

使用了路由别名，虽然成功跳转了，但是首页字体没有加粗效果，也就是没有匹配到类名，还是推荐使用重定向来做这个功能。

```js
{
  // 再写一个路由
  path: "/",
  redirect: "/home", // 当访问 / 路径时，重定向到 /home 路径
},

{
  path: "/home",
  component: Home,
},
```

#### 编程式的导航

当路由实例被挂载到根实例中时，`$router` 和 `$route` 两个属性会被注入到每个子组件中。

**$router**：

我们配置的路由实例对象

除了使用 `router-link`（声明式的导航）实现路由跳转外，还可以通过路由实例对象中提供的方法来实现。

- **`$router.push`**

该方法接收和 to 特性一样的参数，该方法会向 history 栈末尾添加一条新的记录，当用户点击回退按钮时，可以回到之前的 url，使用 router-link 的 to 特性实现跳转时，内部会调用这个方法。

```js
this.$router.push("/home");
this.$router.push({ path: "/home" });
this.$router.push({ name: "home" });
```

- **`$router.replace`**

这个方法也可以实现路由跳转，与 push 方法不同的是它将替换掉当前的 history 记录。

```js
this.$router.replace("/home");
this.$router.replace({ name: "home" });
this.$router.replace({ path: "/home" });
```

- **`$router.go`**

这个方法也可以实现路由跳转，它的参数是一个整数，表示在 history 记录中前进或后退多少条记录（正数表示前进，负数表示后退），相当于 `window.history.go(n)`，如果前进或后退的步数超过了 history 的记录范围，它将什么也不做（跳转失败）

```js
this.$router.go(1); // 等同于 window.history.forward()
this.$router.go(-1); // 等同于 window.history.back()
```

**$route**

当前路由（当前 url 里显示哪个路由就是哪个路由）的信息，属性都是只读的，跳转之前是前一个的路由信息，跳转之后是跳转到的路由信息。

- **`$route.path`**

当前路由的路径，是一个字符串 `/activity/academic`

- **`$route.params`**

动态路由的动态路径参数，是一个包含键值对的对象，如果没有参数，则是一个空对象。

- **`$route.query`**

url 的查询参数，是一个包含键值对的对象，如果没有参数，则是一个空对象。

- **`$route.hash`**

路径的 hash 值，包含 `#`，如果没有 hash 值，则是一个空字符串。

- **`$route.fullPath`**

路径的完整字符串，端口号后面的所有东西。

- **`$route.matched`**

包含当前路由的所有嵌套路由的数组，`/a/b/c` => `['/a', '/a/b', '/a/b/c']`。

- **`$route.name`**

如果当前路由有名字，值为当前路由的名字

- **`$route.redirectedFrom`**

如果存在重定向，值为重定向来源路由的路径。

#### 动态路由

动态路由：同种模式下的所有路由都使用同一个组件渲染。

例如：我们有一个 User 组件，对于 ID 各不相同的用户都使用这个组件渲染，我们可以使用路由的 “动态路径参数” 来实现。

```js
{
  path: "/about/:xxx", // about 路径下的所有直接子路径都使用下面的组件渲染
  component: () => import("../views/About.vue"),
},
```

路由配置：`path: "/about/:aboutId"`

url 中输入：`http://localhost:8080/about/123000`

About 组件内： `console.log(this.$route.params); => {aboutId: "123000"}`

**示例：**

路由中配置

```js
{
  path: "/question/:questionId",
  name: "question",
  component: () => import("../views/Question.vue"),
},
```

跳转时传递参数

```html
<router-link :to="{ name: 'question', params: { questionId: question.id } }">
</router-link>
```

如果页面没有更新，则需要侦听 `$route` 的变化。

#### 命名视图

如果需要同时展示多个视图（router-view 组件），并且每个视图展示不同的组件，这时可以使用命名视图。

使用 router-view 组件的 name 特性给视图起个名字，没有名字的视图默认名字为 default

```html
<router-view name="student"></router-view>
```

想让这个命名视图在哪个路径中显示，就在哪个路由配置中的 components 配置项中配置，如下：

```js
{
  path: "/learn",
  components: {
    default: () => import("../views/Learn.vue"),
    // learn路径下除了渲染一个默认视图，还渲染一个student视图
    student: () => import("../views/Student.vue"),
  },
},
```

#### 路由组件传参

在组件中使用 `$route` 会使该组件和对应的路由形成高度耦合，从而使组件只能在特性的 url 上使用，限制了组件的灵活性。

在路由配置中使用 props 配置项进行配置，可以使路由和组件解耦。

```js
{
  path: "/question/:questionId",
  name: "question",
  props: true, // 将 $route.params 传递给组件
  component: () => import("../views/Question.vue"),
},
```

组件内将传递的参数作为 prop 特性注册

```js

props: {
  questionId: {
    type: [String, Number],
  },
},
```

可以在任意组件中使用这个组件，传递一个 questionId 即可使用。

```html
<base-question :questionId="90878976"></base-question>
```

**props 的取值**

- 布尔值：`$route.params` 的值将传递给组件。
- 对象：将该对象传递给组件，当 porps 是静态的时候有用，这个不常用。
- 函数：布尔值只传递 params，如果组件还需要使用其他 `$route` 中的属性，需要使用函数。

```js
props: (route) => ({
  name: route.name,
  questionId: route.params.questionId,
}),
```

#### 导航守卫

通过跳转或取消的方式守卫导航（路由正在发生变化），导航守卫就是一些钩子函数。

导航守卫分为三种：全局守卫、路由独享守卫、组件内守卫。

**全局守卫**

路由实例上的钩子函数，所有路由在跳转时都会触发。

```js
const router = new VueRouter({ ... })
```

**`beforeEach`**：全局前置守卫，路由跳转前触发，一般用于登录验证。

```js
router.beforeEach((to, from, next) => { ... });
```

- to：要到哪去，当前路由的信息对象
- from：从哪来，当前路由的信息对象
- next：是否允许跳转，是一个函数，必须调用这个方法才能执行以后的钩子。

```js
router.beforeEach((to, from, next) => {
  next(); // 允许一切路由跳转
  next(false); // 禁止一些路由跳转
  next("/about"); // 跳转到别的路径，接收的参数和 this.$router.push 方法一致
  next(new Error("不能跳转哦~~~!"));
  // 跳转抛出错误会终止跳转，错误对象会传递给 router.onError 的回调函数。
});

router.onError((error) => {
  console.log(error.message); // => 不能跳转哦~~~!
});
```

**`beforeResolve`**：全局解析守卫，路由跳转前、beforeEach 后触发。

这个钩子函数接收的参数以及参数的作用与 beforeEach 一致，只是运行时间晚了一点。

```js
router.beforeResolve((to, from, next) => { ... });
```

**`afterEach`**：全局后置守卫，路由跳转完成后触发。

这个钩子没有 next 方法，因为守卫的是正在跳转的导航，其他参数以及参数的作用一致。

```js
router.afterEach((to, from) => { ... });
```

**路由独享守卫**

在路由配置的时候添加的守卫，只有跳转到该路由时才会触发。

**`beforeEnter`**

和 beforeEach 完全一致，如果同时设置了，会紧跟着 beforeEach 执行。

```js
{
  path: "/learn",
  components: {
    default: () => import("../views/Learn.vue"),
    student: () => import("../views/Student.vue"),
  },
  beforeEnter: (to, from, next) => {
    // ...
  },
},
```

**组件内守卫**

组件内的钩子函数（在原来的生命周期钩子函数的基础上增加了一些生命周期钩子函数），组件被用到哪个路径，哪个路径就会被守卫，只有页面级的组件才有组件内守卫。

- **`beforeRouteEnter`**

路由进入之前触发，在该钩子函数中访问不到组件实例（this 的值是 undefined），它和 beforeEach 一样，唯一不同的是 next 方法。

这个钩子函数的 next 方法可以接收一个回调函数，该回调函数接收一个参数，这个参数就是组件的 vue 实例，该回调函数在 mounted 钩子函数后执行。

```js
data() {
  return {
    value: "hello vue",
  };
},

beforeRouteEnter(to, from, next) {
    // ... 在此发送网络请求
    console.log(this.value); // => Cannot read property 'value' of undefined
    next((vm) => {
      // 在此将请求的数据赋值给data中的数据
      console.log(vm.value); // => hello vue
    });
  },
```

- **`beforeRouteUpdate`**

当前路由改变时、并且该组件被复用过（动态路由相互跳转、路由的 query 变更）的时候调用，该钩子函数中有 this。

```js
beforeRouteUpdate(to, from, next) { ... },
```

- **`beforeRouteLeave`**

路由离开前被调用，也可以访问 this。一般用于退出确认，防止用户误操作。

```js
beforeRouteLeave(to, from, next) { ... },
```

**完整的导航流程**

1. 导航被触发
2. 在失活的组件内调用组件内守卫 `beforeRouteLeave`
3. 调用全局前置守卫 `beforeEach`
4. 在重用的组件内调用组件内守卫 `beforeRouteUpdate`
5. 在路由的配置中调用路由独享守卫 `beforeEnter`
6. 解析异步路由组件
7. 在被激活的组件内调用组件内守卫 `beforeRouteEnter`
8. 调用全局解析守卫 `beforeResolve`
9. 导航被确认
10. 调用全局后置守卫 `afterEach`
11. 触发 DOM 更新（生命周期钩子函数）
12. 用创建好的实例调用组件内守卫 `beforeRouteEnter` 并把实例对象传递给 next 方法的回调函数。

#### 路由元信息

可以在路由配置时，使用 meta 配置项在路由上存放的一些自定义信息。

```js
{
  path: "/about",
  component: () => import("../views/About.vue"),
  meta: {
    a: 1,
    b: 2,
  },
},
```

我们可以在该组件内得到它

```js
mounted() {
  console.log(this.$route.meta); // => {a: 1, b: 2}
},
```

#### 过渡动效

router-view 组件使用 transition 组件

```html
<transition enter-active-class="animate__animated animate__fadeInRightBig">
  <router-view></router-view>
</transition>
```

#### 滚动行为

当从一个组件切换到另一个组件时，如果目标页面有足够的高度，那么不会跳转到目标页面的顶部（因为时单页应用），但是我们希望到目标页面的顶部。

在 router 实例中加入 `scrollBehavior` 方法，这个功能只在支持 `history.pushState` 的浏览器中可用。

```js
const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0, // 想要到目标页面的X坐标
        y: 0, // 想要到目标页面的Y坐标
      };
    }
  },
});
```

- to：到哪里去
- from：从哪里来
- savedPosition：离开页面时保存的位置信息，当且仅当 popstate 导航 (通过浏览器的 “前进/后退” 按钮触发) 时才可用。

如果去到的页面中有 hash，则直接回跳转到该 hash 的位置

```js
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition; // 如果保存了位置信息就用保存的位置信息
  } else {
    if (to.hash) {
      // 如果去到的页面有 hash 会直接定位到拥有 hash 值元素的位置
      return {
        selector: to.hash, // selector的值时一个选择器
      };
    } else {
      // 如果都没有则返回 0, 0 坐标
      return {
        x: 0,
        y: 0,
      };
    }
  }
},
```

如果需要根据不同的值确定是否滚动 0, 0 坐标，可以定义路由元信息。

## Vuex

Vuex 是 Vue 的状态管理工具，为了更方便的实现多个组件共享状态。

**安装**

```shell
npm i vuex
```

**使用**

1. 引入 Vue 和 Vuex
2. Vue 使用 Vuex
3. 创建 Vuex 实例对象
4. 导出 Vuex 实例对象
5. 将实例对象挂载到根实例中

```js
// store.js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex); // Vue 使用 Vuex

// 创建 Vuex 实例对象（使用 Vuex 中的 Store 构造函数创建）
const store = new Vuex.Store({
  state: {
    count: 0,
  },
});

export default store; // 将实例对象导出
```

```js
// main.js
import store from "./store"; // 导入 Vuex 实例对象

new Vue({
  store, // 将 Vuex 实例对象挂载到根实例中
  render: (h) => h(App),
}).$mount("#app");
```

#### state

相当于 store 的 data：单一状态树，是一个对象，包含了所有需要共享的数据。

当把 store 实例挂载到根实例中时，该 store 实例会被注入到根实例下的每个组件中，可以在组件中使用 `this.$store` 访问 store 实例对象

```js
created() {
 console.log(this.$store); // 配置的 store 实例对象
},
```

**基本使用**

```js
const store = new Vuex.Store({
  state: {
    count: 0,
  },
});
```

获取 store 中 state 的数据

```html
<div class="home">{{ $store.state.count }}</div>
```

如果我们想通过状态数据得到一个初始值，可以将状态数据定义到本地的 data 中。

```js
data() {
  return {
    count: this.$store.state.count,
  };
},
```

如果我们想本地数据和状态数据同步，可以使用计算属性

```js
computed: {
  count() {
    return this.$store.state.count;
  },
},
```

**mapState 辅助函数**

如果状态中有很多数据，我们就会在计算属性中书写太多的 `this.$store.state.xxx` 这种代码，过于冗余，我们可以借助辅助函数，辅助函数会帮助我们生成计算属性，辅助函数接收一个数组作为参数，需要状态中的哪个属性就书写到数组中，它会返回一个对象。

```js
import { mapState } from "vuex"; // 引入辅助函数

computed: mapState(["count"]), //
```

如果我们还需要使用自己的计算属性，可以将辅助函数返回的对象解构，然后再书写我们自己的计算属性。

```js
computed: {
  ...mapState(["count", "aaa"]),
  bbb() {
    return 'BBB';
  },
},
```

如果本地的 data 数据和状态中的数据同名，可以将本地 data 中的数据修改名称，也可以给状态中的数据重命名

```js
computed: {
  ...mapState({
    // 计算属性名：函数。该函数接收 state 作为参数，返回 state 中的某个数据即可，也可以在函数中做一些其他操作。
    stateCount: (state) => state.count,
    stateA: "a", // 如果不需要对 state 中的数据做一些其他操作，可以简写。
  }),
},
```

#### Getter

相当于 store 的计算属性，也有依赖缓存，函数的第一个参数就是 state。

**基本使用**

```js
const store = new Vuex.Store({
  getters: {
    countDouble(state) {
      return state.count * 2;
    },

    // countDouble: (state) => state.count * 2, // 简写
  },
});
```

组件中访问 getters 中的计算属性

```html
<div class="home">{{ $store.getters.countDouble }}</div>
```

也可以给 getters 中的计算属性传递参数。

```html
<div class="home">{{ countAdd(10) }}</div>
```

```js
getters: {
  countAdd(state) {
    return function(num) {
      return state.count + num;
    };
  },

  // countAdd: (state) => (num) => state.count + num, // 简写
},
```

**mapGetters 辅助函数**

使用起来和 mapState 辅助函数一样。

```js
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["countDouble", "countAdd"]),
  },
};
```

也可以重命名

```js
...mapGetters({
  stateCountDouble: "countDouble",
  stateCountAdd: "countAdd",
}),
```

#### Mutation

在 Vuex 的严格模式下，如果要更改 state 中的数据，必须要提交 mutation（单向数据流）。

**严格模式**

严格模式下，会深度监测状态树（监测不合规的状态变更），所以不要在生产环境中开启严格模式，避免性能浪费。

```js
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production", // 开启 Vuex 的严格模式
});
```

**基本使用**

定义 mutation

```js
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",

  state: {
    count: 0,
  },

  mutations: {
    countAdd(state) {
      state.count++;
    },
  },
});
```

提交 mutation

```js
handleClick() {
  this.$store.commit("countAdd"); // 传入 mutation 的名字即可
},
```

**mapMutations 辅助函数**

mutation 是方法，需要在 methods 中使用。

```js
import { mapMutations } from "vuex";

methods: {
  ...mapMutations(["countAddMutation"]),
  handleClick() {
    this.countAddMutation(); // 会作为该组件的方法，直接调用即可
  },
},
```

> 通过 this.xxx 调用函数，无法一眼就看出是在提交 mutation，所以不建议使用辅助函数。

**传递参数（载荷 Payload）**

在提交 mutation 时使用第二个参数传递参数

```js
this.$store.commit("countAdd", 10);
```

```js
mutations: {
  countAddMutation(state, num) {
    console.log(num) // => 10
    state.count += num;
  },
},
```

一般情况下，会将第二个参数书写成一个对象。

```js
this.$store.commit("countAddMutation", {
  name: "kevin",
  age: 18,
});
```

```js
mutations: {
  countAddMutation(state, { name, age }) {
    console.log(name, age); // 输出解构之后的值
  },
},
```

**对象风格提交 mutation**

提交时整个对象会作为参数传递给 mutation 函数

```js
this.$store.commit({
  type: "countAddMutation", // 提交 mutation 方法的名字

  // 传递参数
  payload: {
    title: "hello",
    num: 10,
  },
});
```

```js
mutations: {
  countAddMutation(state, { payload }) {
    console.log(payload); // => {title: "hello", num: 10}
  },
},
```

**使用常量定义 mutation 的事件类型**

将常量放入到单独的文件中，整个项目使用的 mutation 将一目了然，具体要不要这么做，还需要看团队的要求。

在 store 目录中新建 `mutationType.js` 文件

```js
export const COUNT_ADD_MUTATION = "COUNT_ADD_MUTATION";
```

store 中引入并定义 mutation

```js
import { COUNT_ADD_MUTATION } from "./mutationTypes";

const store = new Vuex.Store({
  mutations: {
    [COUNT_ADD_MUTATION](state, { payload }) {
      console.log(payload);
      state.count++;
    },
  },
});
```

组件中引入并使用

```js
import { COUNT_ADD_MUTATION } from "@/store/mutationTypes";

// 提交 mutation
this.$store.commit(COUNT_ADD_MUTATION, {
  payload: {
    title: "Hello Vue",
    num: 10,
  },
});
```

**遵守 Vue 的响应式规则**

state 中的数据是响应式的，这就意味这，数据变更了，组件也会自动更新。

- 最好在本地 data 中初始化好所需数据。
- 当操作数组或对象时，应该使用 Vue 提供的方法。

**双向数据绑定**

在 Vuex 中使用 v-model，由于会直接改变 state 中的数据，会报错。

我们可以通过绑定 value 值和监听 input 事件来模拟实现 v-model 指令，在 input 事件中提交 mutation 即可。

```html
<input type="text" :value="value" @input="handleInput" />{{ value }}
```

```js
handleInput(e) {
  this.$store.commit(CHANGE_VALUE, { value: e.target.value });
},
```

可以利用 v-model 指令配合计算属性实现，在计算属性的 setter 函数中提交 mutation。

```html
<input type="text" v-model="myValue" />{{ value }}
```

```js
computed: {
  myValue: {
    get() {
      return this.value;
    },
    set(val) {
      this.$store.commit(UPDATE_VALUE, { value: val });
    },
  },
},
```

```js
mutations: {
  [UPDATE_VALUE](state, { value }) {
    state.value = value;
  },
},
```

> mutation 函数必须是同步函数，在异步函数中变更 state 中的数据，会导致在 mutation 函数外修改状态，会报错，也会导致 devtools 中不好调试，如果需要异步操作，请使用 action 配置项。

#### Action

Action 类似 Mutation，但是有所区别，Action 也是方法

- Action 用于分发 Mutation，而不是用于变更状态，这也是能执行异步的原因。
- Action 中可以随便使用异步操作，例如：向后台异步请求数据、定时器等。

Action 的第一个参数 context，拥有和 `$store` 相同的方法和属性

```js
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",

  state: {
    count: 0,
  },

  mutations: {
    [COUNT_ADD_MUTATION](state, { payload }) {
      console.log(payload); // => {title: "Hello Vue", num: 10}
      state.count++;
    },
  },

  actions: {
    countAddAction(context, payload) {
      // 提交一个 mutation 并传递参数
      context.commit(COUNT_ADD_MUTATION, payload);
    },
  },
});
```

使用 dispatch 方法分发 Action，第一个参数是 Action 的函数名字，第二个参数是需要传递的数据对象

```js
this.$store.dispatch("countAddAction", {
  payload: {
    title: "Hello Vue",
    num: 10,
  },
});
```

其实 Action 和 Mutation 使用起来一样，一个使用 commit 方法提交，一个使用 dispatch 方法分发。

异步操作也是没有问题的，devtools 也不会受到影响，因为是在一秒之后才提交的 mutation，而且更改 state 中数据也是 mutation 完成的。

```js
countAddAction(context, payload) {
  setTimeout(() => {
    context.commit(COUNT_ADD_MUTATION, payload);
  }, 1000);
},
```

action 是异步的，那么我们怎么知道它结束了呢？可以通过返回一个 Promise 来处理这种需求。

```js
countAddAction(context, payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      context.commit(COUNT_ADD_MUTATION, payload);
      resolve('完成了');
    }, 1000);
  });
},
```

```js
this.$store
  .dispatch("countAddAction", {
    payload: {
      title: "Hello Vue",
      num: 10,
    },
  })
  .then((msg) => {
    console.log(msg); // => 完成了
  });
```

#### Module

由于使用单一状态树，应用的所有状态都会集中到一个对象中，当项目非常复杂时，store 对象会变的十分庞大。

为了解决上面的问题，Vuex 允许将 store 对象分割成模块，每个模块拥有自己的 `state` `getter` `mutation` `action`。

1. 抽离功能到单独文件

```js
// 抽离功能
export default {
  // student.js中的内容
};

export default {
  // count.js中的内容
};
```

2. 导入模块，在 modules 配置项中书写导入的模块

```js
import count from "./modules/count";
import student from "./modules/student";

const store = new Vuex.Store({
  modules: {
    count,
    student,
  },
});
```

模块化后的获取方式

- 读取 state 中的值：`this.$store.state.模块化文件的名字.xxx`，和没有模块化之前的获取方式不一样
- 读取 getters 中的计算属性：`this.$store.getters.xxx`，和没有模块化之前的获取方式相同
- 提交 mutation：`this.$store.commit("xxx")`，和没有模块化之前的提交方式相同
- 分发 action：`this.$store.dispatch("xxx")`，和没有模块化之前的分发方式相同
- 通过辅助函数只能直接拿到 getters、mutations、actions，而不能拿到 state 中的数据，如果向直接拿到 state 中对象的数据，需要加上命名空间。

**命名空间**

值需要在模块的配置中书写 `namespaced: true` 即可。

```js
export default {
  namespaced: true,
};
```

当使用命名空间后，mapState 在获取状态数据时，需要加上第一个参数，该参数为模块的名字

```js
computed: {
  ...mapState("count", ["count", "obj", "value"]),
},
```

一旦模块使用了命名空间，那么该模块中的 getter 也会有命名空间，这个 getter 属于该模块，而不属于根模块，所以 mapGetters 也应该加上模块的名字

```js
computed: {
  ...mapGetters("count", {
    stateCountDouble: "countDouble",
    stateCountAdd: "countAdd",
  }),
},
```

此时如果模块内使用了 action，action 也会有命名空间，需要在 action 名字前面加上 `模块名/action名`

```js
this.$store.dispatch("count/countAddAction", {
  payload: {
    title: "Hello Vue",
    num: 10,
  },
});
```

此时，一切都恢复了正常。

- 获取 state：`this.$store.state.模块名称.xxx`
- 获取 getter：`this.$store.getters["模块名称/xxx"]`
- 提交 mutation：`this.$store.commit("模块名称/xxx")`
- 分发 action：`this.$store.dispatch("模块名称/xxx")`
- 可以通过辅助函数正常获取 state、getters、mutations、actions。

**局部状态**

对于模块内部的 getter 和 mutation 的第一个参数 state，是模块内部的状态对象。

对于 action 的第一个参数 context：局部状态通过 `context.state` 访问，根模块状态通过 `context.rootState` 访问。

```js
actions: {
  countAddAction(context) {
    console.log(context.state); // 局部状态
    console.log(context.rootState); // 根模块状态
  },
},
```

对于模块内的 getter 如果也想访问根模块的状态，可以通过 getter 的第三个参数访问

```js
getters: {
  countDouble(state, getters, rootState) {
    console.log(getters, rootState);
    // getters：该模块中所有的 getter 对象
    // rootState：根模块的状态对象
    return state.count * 2;
  },
},
```

# Vue3

## vue3 入门

#### 使用 vite 搭建工程

临时使用 vite-app 搭建工程

```shell
npm init vite-app 项目名称
```

进入工程目录安装依赖

```shell
npm install
```

启动项目

```shell
npm run dev
```

#### Vue3 的重大变化

**Vue2**

- 从 vue 中默认导出 Vue 构造函数，利用这个构造函数创建 vue 实例对象，将 `#app` 挂载到 vue 实例对象上。
- 使用 `Vue.use(xxx)` 使用插件
- 组件内的方法、计算属性等内部的 this 执行 vue 实例
- 使用 option api

**Vue3**

- 没有 Vue 构造函数，取而代之的是 createApp 函数，该函数接收一个根组件，返回一个 vue 实例，将 `#app` 挂载到这个 vue 实例上。
- 使用 `createApp(APP).use(xxx)` 使用插件
- 组件内部的方法、计算属性等内部的 this 指向代理（vue 实例对象的代理）
- 使用 composition api（低耦合，高内聚）

```html
<div>
  <button @click="count++">count: {{ count }}</button>
</div>
```

```js
import { ref } from "vue"; // 引入 ref
export default {
  setup() {
    let count = ref(0);
    // count：在 setup 函数中是一个对象，在模板中是 count.value 的值。
    // ref：接收初始值，返回响应数据
    return {
      count, // 返回的数据会附着到 vue 实例中
    };
  },
};
```

- **`setup`**

该函数会在所有的生命周期钩子函数之前被自动调用，只执行一次
该函数内部的 this 是 undefined，该函数的返回的对象会挂载到组件实例中。
通过 ref 得到一个响应数据，ref 的返回值在 setup 中是一个对象，在 HTML 模板中是返回值的 value。

- **`watchEffect`**

这是一个普通函数，接收了一个函数作为参数，当响应式数据变化时，会自动运行参数函数

```js
watchEffect(() => {
  save(todoListRef.value);
});
```

- **`computed`**：计算属性的普通函数，会返回一个计算属性

```js
// 只有 getter 的计算属性
const filteredTodoListRef = computed(() => {
  return filterTodoList(todoListRef.value, visibilityRef.value);
});

// 有 getter 和 setter 的计算属性
const allDoneRef = computed({
  get() {
    return todoListRef.value.filter((todo) => !todo.isComplete).length === 0;
  },
  set(checked) {
    todoListRef.value.forEach((todo) => {
      todo.isComplete = checked;
    });
  },
});
```

- **`onMounted`**：组件挂载完成后运行的普通函数，接收一个函数作为参数

```js
onMounted(() => {
  window.addEventListener("hashchange", onHashChange);
});
```

- **`onUnmounted`**：组件销毁后运行的普通函数，接收一个函数作为参数

```js
onUnmounted(() => {
  window.removeEventListener("hashchange", onHashChange);
});
```

## Vue3 进阶

#### vite 原理

- webpack 会先打包，然后启动开发服务器，请求服务器时直接给予打包结果；而 vite 是直接启动开发服务器，请求哪个模块再对该模块进行实时编译。
- 由于现代浏览器本身就支持 ES Module，会自动向依赖的 Module 发出请求。vite 充分利用这一点，将开发环境下的模块文件，就作为浏览器要执行的文件，而不是像 webpack 那样进行打包合并。
- 由于 vite 在启动的时候不需要打包，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。当浏览器请求某个模块时，再根据需要对模块内容进行编译。这种按需动态编译的方式，极大的缩减了编译时间，项目越复杂、模块越多，vite 的优势越明显。
- 在 HMR 方面，当改动了一个模块后，仅需让浏览器重新请求该模块即可，不像 webpack 那样需要把该模块的相关依赖模块全部编译一次，效率更高。
- 当需要打包到生产环境时，vite 使用传统的 rollup 进行打包，因此，vite 的主要优势在开发阶段。
- 另外，由于 vite 利用的是 ES Module，因此在代码中不可以使用 CommonJS

#### 效率的提升

**静态提升**

`@vue/compiler-sfc`：Vue3 的编译器

编译器会把模板编译成 render 函数，发现里面的静态节点和静态属性，将其提升。

静态节点通过 `createVNode('h1', null, 'Hello Vue')` 创建，只创建一次，之后在 render 函数中重复使用即可。

**预字符串化**

当编译器遇到大量连续的内容（20 个连续的静态节点）会将其编译成一个普通的字符串

**缓存事件处理函数**

`_cache`：缓存对象，缓存事件处理函数，如果缓存中存在直接使用，保证事件处理函数只被生成一次。

**Block Tree**

Vue2 在对比新旧树时，不知道哪些是静态节点，哪些是动态节点，因此只能一层一层的比较，在对比静态节点的时候就会浪费大量的时间。

Vue3 的编译器会在根节点数组中记录哪些节点是动态的，当重新渲染时直接找到该数组，遍历该数组，这样就跳过了大量的静态节点的编译。

**PatchFlag**

Vue2 在对比每个节点时，并不知道这个节点的哪些信息会发生变化，因此只能将所有信息依次对比。

Vue3 在每个节点中进行了标记，标记这个这点的哪些属性是动态的： 1：内容是动态的，2：class 是动态的，3：class 和内容是动态的，等等。

**项目越大，提升越明显，静态内容越多，提升越明显**

#### API 和数据响应式的变化

**删除了 Vue 构造函数**

Vue 构造函数的问题：当页面上有多个 Vue 应用程序时，使用 `Vue.use`、`Vue.mixin` `Vue.component` 时，无法区别要用到哪个 Vue 应用中，会带来隐患。

在 Vue3 中直接删除了 Vue 构造函数，使用 `createApp` 创建 Vue 应用，可以实现链式编程，每个方法都会返回 Vue 的实例对象。

```js
createApp(根组件).use().mixin().component().mount("#app1");
createApp(根组件).use().mount("#app2");
```

**对比响应式数据**

Vue2 使用 `Object.defineProperty` 实现数据的响应式，Vue3 使用 `Proxy` 实现数据的响应式，都是在 `beforeCreate` 生命周期钩子函数中完成的。

Object.defineProperty，会递归遍历对象的每个属性，监听每个属性的变化，因为是在 `beforeCreate` 生命周期钩子函数中完成的这步操作，所以对于新增的属性要使用特定的方法。

Proxy：当访问对象属性的时候，代理直接把对象的属性返还给你。

Vue3 中访问属性是动态的，当访问属性时才读取或设置，提升了组件初始化阶段的效率。

Proxy 可以监听到对象所有属性的新增和删除，因此在 Vue3 中新增属性、删除属性、索引访问、通过 length 修改长度都会触发重新渲染，而不需要使用那些乱七八糟的方法。

**模板中的变化**

在 `vue3` 中，去掉了 `.sync` 修饰符，只需要使用 `v-model` 进行双向绑定即可。

为了让`v-model`更好的针对多个属性进行双向绑定，`vue3` 作出了以下修改

```html
<!-- vue2 -->
<ChildComponent :value="pageTitle" @input="pageTitle = $event" />
<!-- 简写为 -->
<ChildComponent v-model="pageTitle" />

<!-- vue3 -->
<ChildComponent
  :modelValue="pageTitle"
  @update:modelValue="pageTitle = $event"
/>
<!-- 简写为 -->
<ChildComponent v-model="pageTitle" />
```

去掉了`.sync`修饰符，它原本的功能由 `v-model` 的参数替代

```html
<!-- vue2 -->
<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
<!-- 简写为 -->
<ChildComponent :title.sync="pageTitle" />

<!-- vue3 -->
<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
<!-- 简写为 -->
<ChildComponent v-model:title="pageTitle" />
```

做出了上面的更改后，不在需要 `model` 配置项，所以将其移除了

允许自定义 `v-model` 修饰符，修饰符的功能需要手动书写。

```html
<check-editor v-model="checked" v-model:title.trim="title" />
```

使用了修饰符，会在 props 中生成一个 `titleModifiers` 对象

```js
props: {
  title: {
    type: String,
  },
  // 属性的名字固定为：绑定的属性名 + Modifiers
  titleModifiers: {
    default: () => ({}),
  },
},
```

```js
setup(props, context) {
  console.log(props.titleModifiers); // => {trim: true}

  const handleInput = (e) => {
    let value = e.target.value;
    if (props.titleModifiers.trim) {
      // 如果存在修饰符，则取消首尾空格
      value = value.trim();
    }
    context.emit("update:title", value);
  };

  return {
    handleInput,
  };
},
```

**v-if & v-for**

v-if 的优先级高于 v-for 了

**key**

当使用 template 元素循环时，需要将 key 绑定到 template 元素而不是子元素。

当使用 v-if v-else-if v-else 不再需要绑定 key 值，Vue3 会自动给每个分支一个唯一的 key 值。

即使要手动给 key 值，也必须给每个分支一个唯一的 key 值，不能因为重用分支给予相同的 key 值。

**Fragment**

Vue3 中允许组件中出现多个根节点

#### 组件

**路由**

安装 Vue 的路由

```shell
npm i vue-router@next
```

在 Vue3 中 VueRouter 构造函数也被删除了，使用 createRouter 创建路由

```js
import { createRouter, createWebHistory } from "vue-router";

// 创建一个路由
export default createRouter({
  history: createWebHistory(), // 以前的 history 模式，baseURL 可以作为该函数的参数
  routes, // 使用路由配置
});
```

main.js 中使用插件

```js
createApp(App).use(router).mount("#app");
```

**异步组件**

使用 defineAsyncComponent 创建一个异步组件，该函数返回一个 Promise 即可。

第一种配置

```js
const Block3 = defineAsyncComponent(() => import("../components/Block3.vue"));
```

第二种配置

```js
import delay from "../utils";

const Block3 = defineAsyncComponent(async () => {
  await delay();
  return import("../components/Block3.vue");
});
```

第三种配置，传入一个对象

```js
import { defineAsyncComponent, h } from "vue";
import delay from "../utils";
import Loading from "../components/Loading.vue";
const Block3 = defineAsyncComponent({
  // 加载完成显示的组件
  loader: async () => {
    await delay();
    if (Math.random() < 0.5) {
      throw new TypeError(); // 出错了
    }
    return import("../components/Block3.vue");
  },

  // Promise 是 pending 状态时显示的组件
  loadingComponent: Loading,

  // 出错时显示的组件
  errorComponent: {
    render() {
      return h(Error, "出错了");
    },
  },
});
```

Teleport 该元素会将该元素内部的元素扔到 to 属性对应的元素中

#### Reactivity API

用于处理响应式数据，可以脱离组件单独使用

**获取响应式数据**

- **`reactive`**

传入一个普通对象，返回一个对象代理，深度代理对象中的所有成员。

```js
import { reactive } from "vue";
const state = reactive({ a: 1, b: 2 });
```

- **`readonly`**

传入一个普通对象或 proxy，返回一个对象代理，深度代理对象的所有成员，只读属性

```js
import { readonly } from "vue";
const readState = readonly({ x: 10, y: 20 });
const readState = readonly(state); // 通过普通代理可以修改数据，通过只读代理不能修改数据
```

- **`ref`**

传入任何类型的值，返回一个 ref 对象，里面的 value 属性指向传入的值。

- 如果传入的是原始类型，会通过 getter 和 setter 进行包装，返回响应数据。
- 如果传入的是对象，会使用 reactive 函数函数进行代理
- 如果传入的是代理，则直接使用该代理

- **`computed`**

传入一个函数，返回一个 ref 对象，当读取 value 值时，根据情况（有缓存）决定是否运行该函数。

```js
const state = reactive({ a: 1, b: 2 });

const sum = computed(() => {
  console.log("computed");
  return state.a + state.b;
});

console.log(sum.value);
```

**`响应式数据的最佳实践`**

- 如果想将一个对象变成响应式数据，可以使用 reactive 或 ref
- 如果想将一个对象中的属性设置成只读属性，可以使用 readonly
- 如果想将一个非对象数据变成响应式数据，可以使用 ref
- 如果想根据已知的响应式数据变成另一个响应式数据，可以使用 computed

**监听数据的变化**

- **`watchEffect`**

该函数需要传递一个参数，会立即执行一次，当依赖的响应式数据发生变化时再次执行，会放入到异步队列。

```js
import { watchEffect, reactive, ref } from "vue";

const count = ref(0);
const state = reactive({ a: 1, b: 2 });

watchEffect(() => {
  console.log(count.value, state.a);
});
```

**`watch`**

该函数需要传递需要监测的数据和一个函数，该函数不会立即执行，当依赖的响应式数据发生变化时运行，会放入到异步队列执行。

```js
import { watch, reactive, ref } from "vue";

const count = ref(0);
const state = reactive({ a: 1, b: 2 });

// 监测 ref 对象
watch(count, (nv, ov) => {
  console.log("新：", nv, "旧：", ov);
});

// 使用函数监测对象属性
watch(
  () => state.a, // 不能直接书写表达式的值，因为无法监测数据 1 的变化
  (nv, ov) => {
    console.log(nv, ov);
  }
);

// 使用数组监测多个属性的变化
watch([count, () => state.a], ([nv1, nv2], [ov1, ov2]) => {
  console.log(nv1, nv2, ov1, ov2);
});
```

**`监听数据的变化的最佳实践`**

首先，他们都是在微队列中异步执行的，除非有以下场景，否则都推荐使用 `watchEffect` 进行数据监听。

- 不希望回调函数立即执行。
- 数据变化时需要参考之前的值。
- 需要监听一些回调函数中不会使用的数据。

**用于判断的函数**

- **`isProxy`**：用于判断某个数据是不是通过 `reactive` 或 `readonly` 创建的
- **`isReactive`**：用于判断某个数据是不是通过 reactive 创建的
- **`isReadonly`**：用于判断某个数据是不是通过 readonly 创建的
- **`isRef`**：用于判断某个数据是不是 ref 对象

**用于转换的函数**

- **`unref`**

```js
function userTodo(todos) {
  todos = unref(todos); // 等同于 `todos = isRef(todos) ? todos.value : todos`
  // ...
}
```

- **`toRef`**

把某个响应式对象的某个属性变成 ref 格式。

```js
const state = reactive({ a: 1, b: 2 });
const result = toRef(state, "a");

console.log(result.value); // => 1
```

- **`toRefs`**

把某个响应式对象的所有属性都变成 ref 格式，然后包装到一个普通对象中

```js
const state = reactive({ a: 1, b: 2 });
const result = toRefs(state);

console.log(result); // 包含 a 和 b 的 ref 对象的普通对象
```

应用

```js
setup(){
  const state1 = reactive({a:1, b:2});
  const state2 = reactive({c:3, d:4});
  return {
    ...state1, // lost reactivity
    ...state2 // lost reactivity
  }
}

setup(){
  const state1 = reactive({a:1, b:2});
  const state2 = reactive({c:3, d:4});
  return {
    ...toRefs(state1), // reactivity
    ...toRefs(state2) // reactivity
  }
}
// composition function
function usePos(){
  const pos = reactive({x:0, y:0});
  return pos;
}

setup(){
  const {x, y} = usePos(); // lost reactivity
  const {x, y} = toRefs(usePos()); // reactivity
}
```

**最佳实践（降低心智负担）**

所有的`composition function`均以`ref`的结果返回，以保证`setup`函数的返回结果中不包含`reactive`或`readonly`直接产生的数据

```js
function usePos(){
  const pos = reactive({ x:0, y:0 });
  return toRefs(pos); //  {x: refObj, y: refObj}
}
function useBooks(){
  const books = ref([]);
  return {
    books // books is refObj
  }
}
function useLoginUser(){
  const user = readonly({
    isLogin: false,
    loginId: null
  });
  return toRefs(user); // { isLogin: refObj, loginId: refObj }  all ref is readonly
}

setup(){
  // 在setup函数中，尽量保证解构、展开出来的所有响应式数据均是ref
  return {
    ...usePos(),
    ...useBooks(),
    ...useLoginUser()
  }
}
```

#### CompositionAPI

不能脱离组件存在。

**setup 函数**

一个组件中该函数只运行一次，在组件属性初始化完成后运行。

```js
// component
export default {
  setup(props, context) {
    // 该函数在组件属性被赋值后立即执行，早于所有生命周期钩子函数
    // props 是一个对象，包含了所有的组件属性值
    // context 是一个对象，提供了组件所需的上下文信息
  },
};
```
