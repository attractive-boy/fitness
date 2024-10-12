<template>
  <view>
    <MNavbar
      :title="prodInfo.prodName ? prodInfo.prodName : '信息'"
      titleStyle="color:#333;"
      bgColor="#fff"
      leftIconColor="#333" />
    <view class="card_box">
      <image :src="$formatImg(prodInfo.pic)" class="card"></image>
      <view class="title">{{ prodInfo.prodName || "" }}</view>
      <view>
        <text class="price">
          <text>￥</text>
          {{ prodInfo.price || "" }}
        </text>
        <text class="price2">￥{{ prodInfo.oriPrice || "" }}</text>
      </view>
    </view>
    <view class="box" style="margin-top: 20rpx">
      <view class="title">购买须知</view>
      <view
        class="info_row"
        v-for="(item, index) in prodInfo.attribute"
        :key="index">
        <view>{{ item.key || "" }}</view>
        <view>{{ item.value || "" }}</view>
      </view>
    </view>
    <view class="pay_button">
      <view style="padding-bottom: 20rpx">
        <u-button
          text="预约"
          @click="createOrder()"
          shape="circle"
          :custom-style="{
            color: '#FFF',
          }"
          color="#333"></u-button>
      </view>
    </view>
  </view>
</template>

<script>
import MNavbar from "@/components/MNavbar/MNavbar.vue";
import { getProdByIdApi } from "@/apis/prod.js";
import { createOrderApi } from "@/apis/order.js";
export default {
  data() {
    return {
      prodInfo: {},
      pageType: "1",
    };
  },
  components: {
    MNavbar,
  },
  onLoad(options) {
    this.getProdById(options.id);
  },
  methods: {
    getProdById(id) {
      getProdByIdApi(id)
        .then((res) => {
          res.attribute = res.attribute ? JSON.parse(res.attribute) : [];
          this.prodInfo = res;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    async createOrder() {
      try {
        let orderRes = await createOrderApi({ prodId: this.prodInfo.prodId });
        if (this.pageType === "1") {
          uni.navigateTo({
            url:
              "/pages/reservation/pay_reservation?orderId=" + orderRes.orderId,
          });
        }
      } catch (e) {}
    },
  },
};
</script>
<style>
page {
  background: #eee;
}
</style>
<style lang="scss" scoped>
.box {
  width: 750rpx;
  padding: 30rpx 30rpx;
  background-color: #fff;
  // min-height: 400rpx;
  .title {
    font-size: 28rpx;
    margin-bottom: 35rpx;
    font-weight: 700;
  }
  .info_row {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    font-size: 26rpx;
    & > view:first-child {
      color: #999;
      width: 130rpx;
    }
    & > view:last-child {
      color: #666;
    }
  }
}
.card_box {
  width: 750rpx;
  padding: 30rpx 30rpx;
  box-sizing: border-box;
  background: #fff;

  .card {
    width: 650rpx;
    height: 300rpx;
    border-radius: 30rpx;
    margin: 0 auto;
    display: block;
    // background: #E45F2B;
    // box-shadow: #ccc 5rpx 5rpx 5rpx;
  }

  .title {
    font-size: 30rpx;
    font-weight: 700;
    margin: 50rpx 0 10rpx;
  }
  .price {
    & text {
      font-size: 22rpx;
    }
    color: #df6b2e;
    font-size: 32rpx;
    font-weight: 700;
  }

  .price2 {
    text-decoration: line-through;
    color: #999;
    font-size: 24rpx;
    margin-left: 15rpx;
  }
}
.pay_button {
  background: #fff;
  position: fixed;
  width: 750rpx;
  bottom: 0;
  padding: 30rpx 30rpx;

  box-sizing: border-box;
  // 写在需要添加底部边距的盒子上
  padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
  padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
}
</style>
