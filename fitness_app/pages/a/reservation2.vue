<template>
  <view>
    <MNavbar
      title="预约"
      titleStyle="color:#fff;"
      bgColor="#FF914D"
      leftIconColor="#fff">
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
        选择预约时间
      </view>
      <view class="re_row">
        <view
          class="re_row_item"
          @tap="showStartTime = true"
          :style="{ color: startTime ? '#333' : '' }">
          {{ startTime || "请选择开始时间" }}
        </view>
        <view>至</view>
        <view
          class="re_row_item"
          @tap="showEndTime = true"
          :style="{ color: endTime ? '#333' : '' }">
          {{ endTime || "请选择结束时间" }}
        </view>
      </view>
    </view>
    <u-picker
      @cancel="showStartTime = false"
      @confirm="confirmStart"
      :show="showStartTime"
      :columns="datePickerData"
      @change="dateTimeChange"></u-picker>
    <u-picker
      @cancel="showEndTime = false"
      @confirm="confirmEnd"
      :show="showEndTime"
      :columns="datePickerData"
      @change="dateTimeChange"></u-picker>
    <view class="info_box">
      <view class="title_box" style="margin-bottom: 10rpx">
        <view class="line"></view>
        预约概况
      </view>
      <view class="body_box">
        <view
          @tap="goCards(item)"
          class="item_box choose_item"
          v-for="(item, index) in timeData[currentTimes]"
          :class="!item.available ? 'disable_itme' : ''"
          :key="index">
          <view class="time_text">{{ item.oriTime || "" }}</view>
          <view class="item_text1" v-if="item.available">可预约</view>
          <view class="item_text1" v-else>
            {{ item.availableText || "" }}
          </view>
          <view>
            <view class="item_text1">已约人数：{{ item.num || "0" }}</view>
          </view>
        </view>
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
    <view style="height: 300rpx"></view>
    <view class="but_box">
      <u-button
        shape="circle"
        text="预约"
        @click="handlerReservation"
        :custom-style="{
          background: '#FF914D',
          color: '#FFF',
          height: '80rpx',
        }"></u-button>
      <u-button
        text="跳过"
        @click="goPayPage()"
        shape="circle"
        :custom-style="{
          color: '#FF914D',
          marginTop: '25rpx',
          borderColor: '#FF914D',
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
      currentIndex: [],
      orderId: undefined,
      times: [],
      currentTimes: 0, // 上面时间选项
      timeData: [], // 可预约时间总览
      startTime: null, // 开始时间
      showStartTime: false,
      endTime: null, // 结束时间
      showEndTime: false,
      currentDate: null, // 当前变化时间
      datePickerData: [],
    };
  },
  computed: {
    ...mapGetters("systemModel", ["shopInfo"]),
  },
  onLoad(options) {
    this.orderId = options.orderId;
    this.setReservationDate();
    this.setTimes();
  },
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
      dateList[dateList.length - 1].endTime = formatTimestamp(endTime, 5);
      let res = await handlerRsvApi({
        list: dateList,
        orderId: this.orderId,
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
          this.goPayPage();
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
    // 前往支付
    goPayPage() {
      uni.navigateTo({
        url: "/pages/shop/pay?orderId=" + this.orderId,
      });
    },
    // 时间变化
    dateTimeChange(e) {
      console.log(e);
      let value = e.value;
      let dataStr =
        value[0] +
        "/" +
        value[1] +
        "/" +
        value[2] +
        " " +
        value[3] +
        ":" +
        value[4] +
        ":" +
        value[5];
      let date = new Date(dataStr);
      this.currentDate = date.getDate();
      this.dateFilter(this.timeData, this.currentDate);
    },
    confirmStart(e) {
      let value = e.value;
      let dataStr =
        value[0] +
        "/" +
        value[1] +
        "/" +
        value[2] +
        " " +
        value[3] +
        ":" +
        value[4] +
        ":" +
        value[5];
      if (this.endTime) {
        let endTime = new Date(this.endTime);
        let startTime = new Date(dataStr);
        if (startTime > endTime) {
          uni.showToast({
            icon: "none",
            title: "开始时间不能大于结束时间",
            duration: 1500,
          });
          return;
        }
        if (isDiffOver2Hours(startTime, endTime)) {
          uni.showToast({
            icon: "none",
            title: "身体再好，也不能太累哦！",
          });
        }
      }
      this.startTime = dataStr;

      this.showStartTime = false;
    },
    confirmEnd(e) {
      let value = e.value;
      let dataStr =
        value[0] +
        "/" +
        value[1] +
        "/" +
        value[2] +
        " " +
        value[3] +
        ":" +
        value[4] +
        ":" +
        value[5];
      if (this.startTime) {
        let endTime = new Date(dataStr);
        let startTime = new Date(this.startTime);
        if (startTime > endTime) {
          uni.showToast({
            icon: "none",
            title: "结束时间不能小于开始时间",
          });
          return;
        }
        if (isDiffOver2Hours(startTime, endTime)) {
          uni.showToast({
            icon: "none",
            title: "身体再好，也不能太累哦！",
            duration: 1500,
          });
        }
      }
      this.endTime = dataStr;
      this.showEndTime = false;
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
            if ((hours > curHours && key === todayStr) || key !== todayStr) {
              item.availableText = "已约满";
            } else {
              item.available = false;
              item.availableText = "不可预约";
            }
            list.push(item);
          });
          // 将数据推入 dataList
          this.timeData.push(list);
          this.dateFilter(this.timeData, this.currentDate);
        });
      });
    },
    goCards(item) {
      console.log(item);
      return;
      if (!item.available) return;
      // uni.navigateTo({
      //   url: "/pages/cards/cards",
      // });
    },
    // 设置picker
    dateFilter(timeData, currentDate) {
      let data = [];
      let today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      // 年
      let lists = [];
      lists.push(today.getFullYear() + "");
      lists.push(tomorrow.getFullYear() + "");
      lists = Array.from(new Set(lists));
      data.push(lists);
      // 月
      lists = [];
      lists.push(
        today.getMonth() + 1 < 10
          ? "0" + (today.getMonth() + 1)
          : today.getMonth() + 1 + ""
      );
      lists.push(
        tomorrow.getMonth() + 1 < 10
          ? "0" + (tomorrow.getMonth() + 1)
          : tomorrow.getMonth() + 1 + ""
      );
      lists = Array.from(new Set(lists));
      data.push(lists);
      // 日
      lists = [];
      lists.push(
        today.getDate() < 10 ? "0" + today.getDate() : "" + today.getDate()
      );
      lists.push(
        tomorrow.getDate() < 10
          ? "0" + tomorrow.getDate()
          : "" + tomorrow.getDate()
      );
      lists = Array.from(new Set(lists));
      data.push(lists);
      // 时
      lists = [];
      if (uni.$u.test.isEmpty(currentDate)) {
        timeData[0].map((item) => {
          if (item.available) {
            lists.push(item.oriTime.split(":")[0]);
          }
        });
      } else {
        let oriData =
          today.getDate() == currentDate ? timeData[0] : timeData[1];

        oriData.map((item) => {
          if (item.available) {
            lists.push(item.oriTime.split(":")[0]);
          }
        });
      }
      data.push(lists);
      data.push(
        Array.from({ length: 60 }, (_, index) => {
          const paddedValue = index < 10 ? `0${index}` : `${index}`;
          return paddedValue;
        })
      );
      data.push(
        Array.from({ length: 60 }, (_, index) => {
          const paddedValue = index < 10 ? `0${index}` : `${index}`;
          return paddedValue;
        })
      );
      // lists = [];
      // if (key === "minute" || key === "minute") return data;
      this.datePickerData = data;
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
    // color: #e45f2b;
    // background: #e45f2b;
    // border: 2rpx solid #e45f2b;
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
