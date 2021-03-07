<template>
  <div class="date-picker" v-show-panel>
    <div class="picker-input">
      <span class="iconfont icon-date" />
      <input type="text" v-model="chooseDate" />
    </div>
    <div class="picker-panel" v-if="showPanel">
      <div class="picker-arrow" />
      <div class="picker-main">
        <div class="picker-header">
          <div
            class="picker-btn iconfont icon-prev-year"
            @click="changeYear('prev')"
          />
          <div
            class="picker-btn iconfont icon-prev-month"
            @click="changeMonth('prev')"
          />
          <div class="cur-date">
            {{ panelDate.year }}年{{ panelDate.month + 1 }}月
          </div>
          <div
            class="picker-btn iconfont icon-next-month"
            @click="changeMonth('next')"
          />
          <div
            class="picker-btn iconfont icon-next-year"
            @click="changeYear('next')"
          />
        </div>
        <div class="picker-content">
          <div class="picker-weeks">
            <div class="week" v-for="week in weeks" :key="week">
              {{ week }}
            </div>
          </div>
          <div class="picker-days">
            <div
              @click="changeChooseDate(date)"
              class="day"
              v-for="date in panelDays"
              :key="date.getTime()"
              :class="{
                'other-month': !isCurMonth(date).month,
                'cur-day': isCurMonth(date).curDay,
                'choose-day': isCurMonth(date).chooseDay,
              }"
            >
              {{ date.getDate() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "date",
    event: "choose-date",
  },
  props: {
    date: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },

  data() {
    return {
      weeks: ["日", "一", "二", "三", "四", "五", "六"],
      showPanel: false, // 控制是否显示日历面板
      panelDate: {}, // 日历面板中的日期
    };
  },

  directives: {
    "show-panel": {
      bind(el, binding, vnode) {
        const vm = vnode.context;

        document.onclick = function (e) {
          const clickEle = e.target;
          const isElChild = el.contains(clickEle);

          if (isElChild && !vm.showPanel) {
            vm.handlePanel(true);
          } else if (!isElChild && vm.showPanel) {
            vm.handlePanel(false);
          }
        };
      },
    },
  },

  methods: {
    /**
     * 显示日历面板
     */
    handlePanel(flag) {
      this.showPanel = flag;
    },

    /**
     * 根据日期对象得到年月日
     */
    getYearMonthDay(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      return {
        year,
        month,
        day,
      };
    },

    /**
     *  给panelDate赋值
     */
    showPanelDate(date) {
      const { year, month, day } = this.getYearMonthDay(date);
      this.panelDate = {
        year,
        month,
        day,
      };
    },

    /**
     * 判断是否是当月
     */

    isCurMonth(date) {
      const { year, month, day } = this.getYearMonthDay(date); // 根据传入的日期对象得到年月日
      const { year: panelYear, month: panelMonth } = this.panelDate; // 得到数据中的年月
      const {
        year: curYear,
        month: curMonth,
        day: curDay,
      } = this.getYearMonthDay(new Date()); // 得到当前年月日

      const chooseDate = new Date(this.chooseDate); // 根据选择的日期字符串得到日期对象
      const {
        year: chooseYear,
        month: chooseMonth,
        day: chooseDay,
      } = this.getYearMonthDay(chooseDate);

      return {
        month: panelYear === year && panelMonth === month, // 当月和下月的样式
        curDay: curYear === year && curMonth === month && curDay === day, // 当前日期的样式
        chooseDay:
          chooseYear === year && chooseMonth === month && chooseDay === day, // 被选中日期的样式
      };
    },

    changeYear(flag) {
      const moveYear = flag === "prev" ? -1 : 1;
      this.panelDate.year += moveYear;
    },

    changeMonth(flag) {
      const { year, month, day } = this.panelDate;
      const moveMonth = flag === "prev" ? -1 : 1;
      const newDate = new Date(year, month, day);
      newDate.setMonth(month + moveMonth);
      const {
        year: panelYear,
        month: panelMonth,
        day: panelDay,
      } = this.getYearMonthDay(newDate);
      this.panelDate.year = panelYear;
      this.panelDate.month = panelMonth;
      this.panelDate.day = panelDay;

      // if (flag === "next") {
      //   this.panelDate.month++;
      //   if (this.panelDate.month === 12) {
      //     this.panelDate.month = 0;
      //     this.panelDate.year++;
      //   }
      // } else if (flag === "prev") {
      //   this.panelDate.month--;
      //   if (this.panelDate.month === -1) {
      //     this.panelDate.month = 11;
      //     this.panelDate.year--;
      //   }
      // }
    },

    changeChooseDate(date) {
      this.$emit("choose-date", date);
      this.handlePanel(false);
      this.showPanelDate(date);
    },
  },

  computed: {
    /**
     * 在input上显示的日期
     */
    chooseDate() {
      const { year, month, day } = this.getYearMonthDay(this.date);
      return `${year}-${month + 1}-${day}`;
    },

    /**
     * 面板中的天数
     */
    panelDays() {
      const { year, month } = this.getYearMonthDay(this.date);
      const firstDay = new Date(year, month, 1); // 得到一个月中的第一天
      const week = firstDay.getDay(); // 得到第一天在本月中是周几
      const startDay = firstDay - week * 24 * 60 * 60 * 1000; // 得到本月是从哪天开始的

      const days = [];
      for (let i = 0; i < 42; i++) {
        days.push(new Date(startDay + i * 24 * 60 * 60 * 1000)); // 根据时间戳生成日期对象
      }
      return days;
    },
  },

  created() {
    this.showPanelDate(this.date);
  },
};
</script>

<style scoped>
@import "./assets/font.css";

.date-picker {
  color: #666;
  display: inline-block;
}

.picker-input {
  position: relative;
  background-color: #fff;
}

.picker-input input {
  height: 40px;
  padding: 0 30px;
  border: 1px solid #ddd;
  outline: none;
  border-radius: 4px;
}

.picker-input .icon-date {
  position: absolute;
  width: 35px;
  height: 40px;
  text-align: center;
  line-height: 40px;
}

.picker-panel {
  width: 322px;
  height: 332px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 10px;
  position: absolute;
  padding: 10px;
  box-sizing: border-box;
  user-select: none;
  background-color: #fff;
}

.picker-panel .picker-arrow {
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-bottom-color: #ddd;
  position: absolute;
  left: 30px;
  top: -20px;
}

.picker-panel .picker-arrow::after {
  content: "";
  display: block;
  border: 10px solid transparent;
  border-bottom-color: #fff;
  position: absolute;
  left: -10px;
  top: -9px;
}

.picker-main .picker-header {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.picker-main .picker-header .picker-btn {
  cursor: pointer;
}

.picker-main .picker-header .cur-date {
  width: 150px;
  text-align: center;
}

.picker-content .picker-weeks {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.picker-content .picker-days {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.picker-content .picker-days .day {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
  margin: 4px 6px;
  font-size: 12px;
  cursor: pointer;
}

.picker-content .picker-days .day:hover {
  color: #409eff;
}

.picker-content .picker-days div.day.choose-day {
  font-weight: bold;
  background-color: #409eff;
  color: #fff;
}

.picker-content .picker-days .day.cur-day {
  color: #409eff;
  font-weight: bold;
}

.picker-content .picker-days .day.other-month {
  color: #c0c4cc;
}
</style>
