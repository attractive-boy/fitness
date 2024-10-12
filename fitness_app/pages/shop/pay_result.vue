<template>
  <view>
    <MNavbar
      title="支付结果"
      titleStyle="color:#fff;"
      bgColor="#FF914D"
      leftIconColor="#fff">
      <view slot="left"></view>
    </MNavbar>
    <view class="header_box">
      <u-icon name="checkmark-circle" color="#FFF" bold size="120rpx"></u-icon>
      <view class="text">支付成功</view>
    </view>
    <u-image
      :fade="false"
      src="/static/pay/img02.png"
      width="750rpx"
      height="auto"
      mode="widthFix"></u-image>
    <view class="body_box">
      <view class="info_row">
        <view>订单编号：</view>
        <view>{{ orderInfo.orderId || "" }}</view>
      </view>
      <view class="info_row">
        <view>订单流水号：</view>
        <view>{{ orderInfo.orderNumber || "" }}</view>
      </view>
      <view class="info_row">
        <view>下单时间：</view>
        <view>{{ formatTimestamp(orderInfo.createTime) }}</view>
      </view>
      <view class="info_row">
        <view>支付方式：</view>
        <view>微信支付</view>
      </view>
      <view class="info_row">
        <view>订单状态：</view>
        <view>待使用</view>
      </view>
      <view class="but_row">
        <u-button
          text="查看订单"
          @tap="goOrder()"
          :custom-style="{
            borderRadius: '15rpx',
            color: '#FF914D',
            border: '1rpx solid #FF914D',
          }"></u-button>
        <view style="width: 50rpx"></view>
        <u-button
          text="回到首页"
          @tap="goIndex()"
          :custom-style="{
            borderRadius: '15rpx',
            color: '#FFF',
            background: '#FF914D',
          }"></u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { formatTimestamp } from "@/utils/utils";
import { getOrderByIdApi } from "@/apis/order.js";
export default {
  data() {
    return {
      orderForm: {
        orderId: undefined,
      },
      orderInfo: {},
    };
  },
  onLoad(options) {
    this.orderForm.orderId = options.orderId;
    this.getOrderInfo();
  },
  methods: {
    formatTimestamp,
    getOrderInfo() {
      getOrderByIdApi(this.orderForm)
        .then((res) => {
          this.orderInfo = res;
          console.log(res);
        })
        .catch((e) => {
          console.error(e);
        });
    },
    goOrder() {
      uni.navigateTo({
        url: "/pages/order/details?orderId=" + this.orderInfo.orderId,
      });
    },
    goIndex() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header_box {
  width: 750rpx;
  background: #ff914d;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50rpx 0 0;

  .text {
    font-size: 28rpx;
    color: #fff;
    margin: 15rpx 0 0;
  }
}
.body_box {
  padding: 80rpx 80rpx;
  box-sizing: border-box;
  .info_row {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    margin-bottom: 30rpx;
    & view:first-child {
      color: #888;
    }
    & view:last-child {
      color: #444;
    }
  }
}
.but_row {
  display: flex;
  margin-top: 80rpx;
  // justify-content: space-between;
}
</style>
