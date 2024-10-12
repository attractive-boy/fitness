<template>
  <view>
    <MNavbar
      title="订单详情"
      titleStyle="color:#fff;"
      bgColor="#FF914D"
      leftIconColor="#FFF" />

    <view class="header_box">
      <u-steps :current="orderInfo.status - 1" activeColor="#FF914D">
        <u-steps-item title="待付款"></u-steps-item>
        <u-steps-item title="待使用"></u-steps-item>
        <u-steps-item title="进行中"></u-steps-item>
        <u-steps-item title="已完成"></u-steps-item>
      </u-steps>
    </view>

    <view class="prod_box">
      <view class="prod_body">
        <view>
          <u-image
            :src="$formatImg(orderInfo.tzProd.pic)"
            radius="8rpx"
            width="230rpx"
            height="200rpx"></u-image>
        </view>
        <view class="prod_info">
          <view class="title">{{ orderInfo.prodName || "" }}</view>
          <view class="price">
            <text>￥</text>
            {{ orderInfo.actualTotal || "" }}
          </view>
        </view>
      </view>
      <view class="info_item" style="margin-top: 80rpx">
        <view class="info_label">订单编号</view>
        <view class="info_content">{{ orderInfo.orderId || "" }}</view>
      </view>
      <view class="info_item" style="margin-top: 30rpx">
        <view class="info_label">订单流水号</view>
        <view class="info_content">{{ orderInfo.orderNumber || "" }}</view>
      </view>
      <view class="info_item" style="margin-top: 30rpx">
        <view class="info_label">支付方式</view>
        <view class="info_content">微信支付</view>
      </view>
      <view
        class="info_item"
        style="margin-top: 30rpx"
        v-if="orderInfo.createTime">
        <view class="info_label">下单时间</view>
        <view class="info_content">
          {{ formatTimestamp(orderInfo.createTime) }}
        </view>
      </view>
      <view
        class="info_item"
        style="margin-top: 30rpx"
        v-if="orderInfo.payTime">
        <view class="info_label">支付时间</view>
        <view class="info_content">
          {{ formatTimestamp(orderInfo.payTime) }}
        </view>
      </view>
      <view
        class="info_item"
        style="margin-top: 30rpx"
        v-if="orderInfo.dvyTime">
        <view class="info_label">开始时间</view>
        <view class="info_content">
          {{ formatTimestamp(orderInfo.dvyTime) }}
        </view>
      </view>
      <view
        class="info_item"
        style="margin-top: 30rpx"
        v-if="orderInfo.endTime">
        <view class="info_label">结束时间</view>
        <view class="info_content">
          {{ formatTimestamp(orderInfo.endTime) }}
        </view>
      </view>
      <view class="info_item2" style="margin-top: 30rpx">
        <view class="info_label">备注</view>
        <view class="info_content" style="margin: 18rpx 3rpx; font-size: 25rpx">
          {{ orderInfo.remarks || "" }}
        </view>
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
      orderInfo: {
        status: 1,
        tzProd: {
          pic: null,
        },
      },
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
          if (res.dvyTime) {
            let dvyTime = new Date(res.dvyTime);
            res.endTime = new Date(
              dvyTime.getTime() + res.tzProd.lifespan * 60 * 60 * 1000
            );
          }
          this.orderInfo = res;
          console.log(res);
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.header_box {
  padding: 40rpx 0;
}
.prod_box {
  margin: 0 30rpx;
  box-sizing: border-box;
  box-shadow: #ddd 5rpx 5rpx 30rpx;
  border-radius: 8rpx;
  padding: 20rpx 40rpx 30rpx;
}
.prod_body {
  display: flex;
  .prod_info {
    margin: 20rpx 20rpx;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // align-items: center;

    .title {
      color: #333;
      font-size: 30rpx;
      font-weight: 700;
    }

    .price {
      display: flex;
      // justify-content: flex-end;
      color: #ff914d;
      font-size: 26rpx;
      margin-left: 7rpx;
      font-weight: 700;
      & > text:first-child {
        font-size: 22rpx;
      }
    }
  }
}
.info_item {
  padding: 0 5rpx;
  display: flex;
  font-size: 27rpx;
  justify-content: space-between;
  align-items: center;
}
.info_item2 {
  padding: 0 5rpx;
  font-size: 27rpx;
}
.info_label {
  color: #999;
}
.info_content {
  color: #666;
}
</style>
