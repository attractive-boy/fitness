<template>
  <view>
    <MNavbar
      title="请选择预约时间"
      titleStyle="color:#fff;"
      bgColor="#FF914D"
      leftIconColor="#333" />
    <view class="title_box">
      <view class="line"></view>
      <view class="text_box">
        <view class="title">请选择预约时间(可多选)</view>
      </view>
    </view>
    <view class="select_box">
      <view
        class="item"
        @tap="chooseTime(item, index)"
        v-for="(item, index) in dataList"
        :key="index"
        :class="
          item.available
            ? currentIndex.includes(index)
              ? 'choose_item'
              : ''
            : 'disable_itme'
        ">
        <view class="time">{{ item.time }}</view>
        <view class="info_row" style="margin: 10rpx 0 6rpx">
          <text>状态：</text>
          <text v-if="item.available">可预约</text>
          <text v-else>已约满</text>
        </view>
        <view class="info_row">
          <text>已约人数：</text>
          <text>{{ item.num }}</text>
        </view>
      </view>
    </view>
    <view style="height: 250rpx"></view>
    <view class="pay_button">
      <view style="padding: 20rpx 0">
        <u-button
          text="去购买"
          @click="goPay()"
          shape="circle"
          color="#FF914D"></u-button>
      </view>
      <view>
        <u-button
          text="跳过"
          @click="goPayPage()"
          shape="circle"
          :custom-style="{
            color: '#FF914D',
            borderColor: '#FF914D',
          }"></u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { createOrderApi } from "@/apis/order.js";
import { getRsvDateApi, handlerRsvApi } from "@/apis/reservation.js";
import { formatTimestamp } from "@/utils/utils";
export default {
  data() {
    return {
      currentIndex: [],
      dataList: [],
      orderId: undefined,
    };
  },
  onLoad(options) {
    this.orderId = options.orderId;
    this.setReservationDate();
  },
  methods: {
    // 选择时间
    chooseTime(item, index) {
      if (!item.available) return;
      if (!this.currentIndex.includes(index)) {
        this.currentIndex.push(index);
      } else {
        this.currentIndex = this.currentIndex.filter((item) => item != index);
      }
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
            let hours = new Date(key + " " + rangeTime[0]).getHours();
            if ((hours > curHours && key === todayStr) || key !== todayStr) {
              item.oriTime = item.time;
              item.oriDate = key;
              item.time = prefix + item.time;
              list.push(item);
            }
          });
          console.log(list);
          // 将数据推入 dataList
          this.dataList.push(...list);
        });
      });
    },
    // 预约操作
    async goPay() {
      let list = [];
      this.currentIndex.forEach((item) => {
        let data = this.dataList[item];
        console.log(item);
        let rangeTime = data.oriTime.split("-");

        list.push({
          startTime: data.oriDate + " " + rangeTime[0] + ":00",
          endTime: data.oriDate + " " + rangeTime[1] + ":00",
          id: data.rsvId,
        });
      });
      try {
        let res = await handlerRsvApi({
          list,
          orderId: this.orderId,
        });
        this.goPayPage();
      } catch (e) {
        console.error(e);
      }
    },
    // 前往支付
    goPayPage() {
      uni.navigateTo({
        url: "/pages/shop/pay?orderId=" + this.orderId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title_box {
  display: flex;
  align-items: center;
  margin: 40rpx 50rpx 25rpx;

  .line {
    width: 8rpx;
    height: 30rpx;
    background: #ff914d;
    border-radius: 8rpx;
  }

  .text_box {
    margin-left: 8rpx;
    display: flex;
    align-items: center;

    .title {
      font-size: 28rpx;
      color: #333;
      font-weight: 700;
    }

    .tips {
      font-size: 22rpx;
      color: #666;
      margin-left: 15rpx;
    }
  }
}

.pay_button {
  position: fixed;
  padding: 0 40rpx;
  bottom: 0;
  width: 750rpx;
  box-sizing: border-box;
  background: #fff;
  // padding-left: 50rpx;
  // padding-right: 50rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  /*兼容 IOS<11.2*/
  padding-bottom: env(safe-area-inset-bottom);
}

.select_box {
  padding: 0 50rpx 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @mixin item {
    width: 48%;
    box-sizing: border-box;
    padding: 25rpx 35rpx;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
  }

  .item {
    @include item;

    border: 2rpx solid #e45f2b;
    color: #333;

    .time {
      font-size: 28rpx;
      font-size: 28rpx;
      font-weight: 700;
    }

    .info_row {
      font-size: 22rpx;

      & text:first-child {
        color: #888;
      }

      & text:last-child {
        color: #888;
      }
    }
  }

  .choose_item {
    @include item;
    color: #fff;
    background: #e45f2b;

    .info_row {
      font-size: 22rpx;

      & text:first-child {
        color: #f5f5f5;
      }

      & text:last-child {
        color: #fff;
      }
    }
  }

  .disable_itme {
    color: #999;
    border: 2rpx solid #999;
    background: #eee;
    font-size: 22rpx;
  }
}
</style>
