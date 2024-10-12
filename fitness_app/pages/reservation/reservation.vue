<template>
  <view>
    <MNavbar
      title="预约"
      titleStyle="color:#333;"
      bgColor="#FFF"
      leftIconColor="#333">
      <view slot="left"></view>
    </MNavbar>
    <view class="time_box">
      <view
        class="time_item"
        @tap="currentTimes = index"
        :class="currentTimes === index ? 'choose_item' : ''"
        v-for="(item, index) in times"
        :key="index">
        <view>{{ item.title || "" }}</view>
        <view>{{ item.date || "" }}</view>
        <view class="bottom_line"></view>
      </view>
    </view>
    <!-- 预约操作 -->
    <view class="info_box">
      <view class="title_box" style="margin-bottom: 10rpx">
        <view class="line"></view>
        预约概况
      </view>
      <view class="body_box">
        <template v-for="(item, index) in timeData[currentTimes]">
          <view
            v-if="item.status == 3"
            @tap="goCards(item, index)"
            class="item_box choose_item2"
            :key="index">
            <view class="time_text">{{ item.oriTime || "" }}</view>
            <view class="item_text1">已预约</view>
            <view>
              <view class="item_text1">已约人数：{{ item.num || "0" }}</view>
            </view>
          </view>
          <view
            v-else-if="chooseTime[currentTimes].includes(index)"
            @tap="goCards(item, index)"
            class="item_box choose_item"
            :key="index">
            <view class="time_text">{{ item.oriTime || "" }}</view>
            <view class="item_text1">可预约</view>
            <view>
              <view class="item_text1">已约人数：{{ item.num || "0" }}</view>
            </view>
          </view>
          <view
            v-else-if="!item.available"
            @tap="goCards(item, index)"
            class="item_box disable_itme"
            :key="index">
            <view class="time_text">{{ item.oriTime || "" }}</view>

            <view class="item_text1">
              {{ item.availableText || "" }}
            </view>
            <view>
              <view class="item_text1">已约人数：{{ item.num || "0" }}</view>
            </view>
          </view>
          <view
            v-else
            @tap="goCards(item, index)"
            class="item_box"
            :key="index">
            <view class="time_text">{{ item.oriTime || "" }}</view>
            <view class="item_text1">可预约</view>
            <view>
              <view class="item_text1">已约人数：{{ item.num || "0" }}</view>
            </view>
          </view>
        </template>
      </view>
    </view>
    <view class="info_box">
      <view class="title_box" style="margin-bottom: 10rpx">
        <view class="line"></view>
        预约注意事项
      </view>
      <view class="u-content">
        <u-parse
          :content="shopInfo.reservation"
          :tagStyle="{ fontSize: '22rpx' }"></u-parse>
      </view>
    </view>
    <view style="height: 150rpx"></view>
    <view class="but_box">
      <u-button
        shape="circle"
        text="预约"
        @click="handlerReservation"
        :custom-style="{
          background: '#333',
          border: 'unset',
          color: '#fff',
          height: '80rpx',
        }"></u-button>
    </view>
  </view>
</template>

<script>
import { createOrderApi } from "@/apis/order.js";
import {
  getRsvDateApi,
  handlerRsvApi,
  createRsvApi,
} from "@/apis/reservation.js";
import { formatTimestamp, isDiffOver2Hours } from "@/utils/utils";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      orderId: undefined,
      times: [],
      currentTimes: 0, // 上面时间选项
      timeData: [], // 可预约时间总览
      startTime: null, // 开始时间
      endTime: null, // 结束时间
      chooseTime: [[], []],
    };
  },
  computed: {
    ...mapGetters("systemModel", ["shopInfo"]),
  },
  onLoad(options) {
    this.orderId = options.orderId;
  },
  onShow() {
    this.timeData = [];
    this.times = [];
    this.setReservationDate();

    this.setTimes();
  },
  onShareAppMessage() {},
  onShareTimeline() {},
  methods: {
    // 预约操作
    async handlerReservation() {
      if (
        uni.$u.test.isEmpty(this.startTime) ||
        uni.$u.test.isEmpty(this.endTime)
      ) {
        uni.showToast({
          icon: "none",
          title: "请选择预约时间",
        });
        return;
      }
      // 提取中间时间段
      let dateList = [];
      let startTime = new Date(this.startTime);
      let endTime = new Date(this.endTime);
      this.timeData.forEach((val) => {
        val.forEach((item) => {
          let itemDate = new Date(item.oriDate + " " + item.oriTime + ":00");
          if (itemDate >= startTime && itemDate <= endTime) {
            dateList.push({
              startTime: item.oriDate + " " + item.oriTime + ":00",
              endTime:
                item.oriDate + " " + item.oriTime.split(":")[0] + ":59:59",
            });
          }
        });
      });
      let res = await handlerRsvApi({
        list: dateList,
      });
      if (res.code == 200) {
        uni.showToast({
          icon: "success",
          title: "预约成功",
        });
        this.startTime = null;
        this.endTime = null;
        setTimeout(() => {
          this.setReservationDate();
          this.timeData = [];
          this.chooseTime = [[], []];
        }, 500);
      } else if (res.code == 50001) {
        uni.showModal({
          title: "温馨提示",
          content: "暂无可用订单，是否前去购买",
          success: ({ confirm }) => {
            if (confirm) {
              uni.navigateTo({
                url: "/pages/cards/cards",
              });
            }
          },
        });
      } else {
        uni.showToast({
          icon: "none",
          title: res.msg,
          duration: 2000,
        });
      }
      console.log(dateList);
    },

    // 设置分类时间
    setTimes() {
      let today = new Date();
      let tomorrow = new Date();
      // 确保明天的日期增加一天
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.times.push({
        date: formatTimestamp(today, 0),
        title: "今天",
      });
      this.times.push({
        date: formatTimestamp(tomorrow, 0),
        title: "明天",
      });
    },
    // 设置可预约时间
    setReservationDate() {
      this.timeData = [];
      let today = new Date();
      let tomorrow = new Date();
      // 确保明天的日期增加一天
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 格式化日期字符串
      let todayStr = formatTimestamp(today, 0);
      let tomorrowStr = formatTimestamp(tomorrow, 0);

      // 调用 API 获取预约数据
      getRsvDateApi([
        {
          date: todayStr,
        },
        {
          date: tomorrowStr,
        },
      ]).then((res) => {
        // 获取返回对象的键并排序
        const sortedKeys = Object.keys(res ?? {}).sort();
        let curHours = new Date().getHours();
        // 遍历排序后的键
        sortedKeys.forEach((key) => {
          let prefix = key === todayStr ? "今天 " : "明天 ";
          let list = [];
          // 遍历日期对应的时间段并添加时间前缀
          res[key].forEach((item) => {
            let rangeTime = item.time.split("-");
            let newKey = key.replace(/-/g, "/");
            let hours = new Date(newKey + " " + rangeTime[0]).getHours();
            item.oriTime = item.time;
            item.oriDate = newKey;
            item.time = prefix + item.time;
            if (!((hours > curHours && key === todayStr) || key !== todayStr)) {
              item.available = false;
              item.availableText = "超过预约时间";
            }
            if (item.status == 3) {
              item.availableText = "已预约";
            } else if (item.status == 2) {
              item.availableText = "已约满";
            }
            list.push(item);
          });
          // 将数据推入 dataList
          this.timeData.push(list);
        });
      });
    },
    goCards(item, index) {
      if (!item.available) {
        uni.showToast({
          icon: "none",
          title: item.availableText,
        });
        return;
      }
      // 当前数据
      let currentChoose = this.chooseTime[this.currentTimes];
      // 判断是今天还是明天
      const isFirstDay = this.currentTimes === 0;
      if (this.currentTimes == 0) {
        this.chooseTime.splice(1, 1, []);
      }
      // 元素中没有数组是加入操作
      if (!currentChoose.includes(index)) {
        // 加入操作
        currentChoose.push(index);
        // 选定范围，批量插入
        if (currentChoose.length >= 2) {
          const minValue = Math.min(...currentChoose);
          const maxValue = Math.max(...currentChoose);
          let data = [];
          for (let i = minValue; i <= maxValue; i++) {
            data.push(i);
          }
          this.chooseTime.splice(this.currentTimes, 1, data);
        }
        // 当点击明天时，需判断今天数组中是否有数据
        let todayData = this.chooseTime[0];
        if (this.currentTimes === 1 && todayData.length > 0) {
          // 设置今天数据
          const todayMinValue = Math.min(...todayData);
          let newTodayData = [];
          this.timeData[0].forEach((item, index) => {
            if (item.available && todayMinValue <= index)
              newTodayData.push(index);
          });
          this.chooseTime.splice(0, 1, newTodayData);
          // 设置明天数据
          const minValue = Math.min(...currentChoose);
          for (let i = 0; i < minValue; i++) {
            currentChoose.push(i);
          }
        }
      } else {
        let data = currentChoose.filter((item) => item < index);
        this.chooseTime.splice(this.currentTimes, 1, data);
        if (this.currentTimes == 0) {
          this.chooseTime.splice(1, 1, []);
        }
      }
      // 找到最大预约时间和最小预约时间
      let todayData = this.chooseTime[0];
      let tomorrowData = this.chooseTime[1];

      let todayMin = todayData.length > 0 ? Math.min(...todayData) : Infinity;
      let todayMax = todayData.length > 0 ? Math.max(...todayData) : -Infinity;
      let tmrMin =
        tomorrowData.length > 0 ? Math.min(...tomorrowData) : Infinity;
      let tmrMax =
        tomorrowData.length > 0 ? Math.max(...tomorrowData) : -Infinity;

      let startItem =
        todayMin !== Infinity
          ? this.timeData[0][todayMin]
          : tmrMin !== Infinity
          ? this.timeData[1][tmrMin]
          : null;
      let endItem =
        tmrMax !== -Infinity
          ? this.timeData[1][tmrMax]
          : todayMax !== -Infinity
          ? this.timeData[0][todayMax]
          : null;
      if (startItem && endItem) {
        this.startTime = startItem.oriDate + " " + startItem.oriTime + ":00";
        this.endTime = endItem.oriDate + " " + endItem.oriTime + ":00";
      }
      let endDate = new Date(this.endTime);
      endDate.setMinutes(59);
      if (isDiffOver2Hours(new Date(this.startTime), endDate)) {
        uni.showToast({
          icon: "none",
          title: "身体再好，也不能太累哦！",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.time_box {
  width: 750rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-sizing: border-box;
  border-bottom: 2rpx solid #eee;

  .time_item {
    padding: 10rpx 0 0;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    color: #353535;
    font-size: 28rpx;

    & > view:last-child {
      margin-top: 7rpx;
    }

    .bottom_line {
      height: 4rpx;
      width: 200rpx;
    }
  }

  .choose_item {
    color: #e45f2b;
    font-weight: 700;

    .bottom_line {
      height: 4rpx;
      width: 200rpx;
      background: #e45f2b;
    }
  }
}

.body_box {
  margin: 0 30rpx;
  display: grid;
  padding-top: 20rpx;
  grid-template-columns: 1fr 1fr 1fr;
  grid-row-gap: 20rpx;

  .item_box {
    margin-right: 10rpx;
    // width: 150rpx;
    height: 140rpx;
    border: 2rpx solid #ddd;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-size: 27rpx;

    .time_text {
      color: #333;
      font-weight: 700;
      margin-bottom: 10rpx;
    }

    .item_text1 {
      font-size: 24rpx;
      color: #666;
    }
  }

  .choose_item {
    background: #ff914d;
    border: 2rpx solid #ff914d;
    .time_text,
    .item_text1 {
      color: #fff;
    }
  }

  .choose_item2 {
    background: #333;
    border: 2rpx solid #333;
    .time_text,
    .item_text1 {
      color: #fff;
    }
  }

  .disable_itme {
    color: #666;
    border: 2rpx solid #999;
    background: #ccc;
  }
}

.info_box {
  margin: 40rpx 30rpx 0;
}

.title_box {
  display: flex;
  align-items: center;
  width: 100%;
  color: #333;
  font-size: 30rpx;
  padding: 0 15rpx;
  box-sizing: border-box;
  font-weight: 700;

  .line {
    width: 8rpx;
    height: 30rpx;
    border-radius: 12rpx;
    background: #ff914d;
    margin-right: 7rpx;
  }
}

.but_box {
  padding: 0 30rpx;
  box-sizing: border-box;
  width: 750rpx;
  position: fixed;
  bottom: 50rpx;
}
.re_row {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  margin: 0 30rpx;
  color: #999;
  .re_row_item {
    flex: 1;
    text-align: center;
    padding: 10rpx;
    border-bottom: 2rpx solid #ccc;
  }
}
.u-content {
  margin: 0 20rpx;
  font-size: 26rpx;
  color: #333;
}
</style>
