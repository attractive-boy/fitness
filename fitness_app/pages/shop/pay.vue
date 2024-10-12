<template>
  <view>
    <MNavbar
      title="购买"
      titleStyle="color:#333;"
      bgColor="#fff"
      leftIconColor="#333" />
    <!-- 自助训练单次卡 -->
    <view class="box">
      <view class="title">{{ orderInfo.prodName || "" }}</view>
      <view class="info_row">
        <view>下单日期</view>
        <view>{{ formatTimestamp(orderInfo.createTime) }}</view>
      </view>
      <view class="info_row">
        <view>有效期</view>
        <view v-if="orderInfo.tzProd">
          首次使用后{{ fomartLifespan(orderInfo.tzProd.lifespan) }}后到期
        </view>
      </view>
    </view>
    <view class="box">
      <view class="info_row">
        <view>还需支付</view>
        <view style="color: #e45f2b">¥{{ orderInfo.actualTotal || "" }}</view>
      </view>
      <view class="info_row">
        <view>备注</view>
        <view>
          <input
            v-model="orderForm.remarks"
            type="text"
            placeholder="请输入备注内容"
            class="input" />
        </view>
      </view>
    </view>
    <view class="pay_button">
      <view class="check_box">
        <checkbox-group @change="checkChange" v-model="flag">
          <checkbox
            value="1"
            color="#FF914D"
            activeBackgroundColor="#FF914D"
            style="transform: scale(0.7)" />
        </checkbox-group>
        我已阅读，并同意遵守
        <text
          style="color: #ff914d"
          @tap="goPath('/pages/agreement/agreement?field=safetyNotice')">
          《健身安全须知协议书》
        </text>
      </view>
      <view style="padding-bottom: 20rpx">
        <u-button
          text="支付"
          shape="circle"
          @click="handlerPay()"
          :custom-style="{
            background: '#333',
            border: 'unset',
            color: '#fff',
            height: '80rpx',
          }"></u-button>
      </view>
    </view>
  </view>
</template>

<script>
import MNavbar from "@/components/MNavbar/MNavbar.vue";
import { getOrderByIdApi, handlerPayApi } from "@/apis/order.js";
import { formatTimestamp, fomartLifespan } from "@/utils/utils";

export default {
  data() {
    return {
      flag: [],
      orderForm: {
        orderId: undefined,
        remarks: "",
      },
      orderInfo: {
        remarks: "",
      },
    };
  },
  components: {
    MNavbar,
  },
  onLoad(options) {
    this.orderForm.orderId = options.orderId;
    this.getOrderInfo();
  },
  methods: {
    formatTimestamp,
    fomartLifespan,
    checkChange(e) {
      this.flag = e.target.value ?? [];
    },
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
    goPath(url) {
      uni.navigateTo({
        url,
      });
    },
    async handlerPay() {
      if (uni.$u.test.isEmpty(this.flag)) {
        uni.showToast({
          icon: "none",
          title: "请阅读健身安全须知协议书",
        });
        return;
      }
      try {
        let res = await handlerPayApi(this.orderForm);
        let payRes = res.payRes;
        let order = res.order;
        console.log({
          timeStamp: payRes.timeStamp,
          nonceStr: payRes.nonceStr,
          package: payRes.packageVal,
          signType: payRes.signType,
          paySign: payRes.paySign,
        });
        uni.requestPayment({
          provider: "wxpay",
          timeStamp: payRes.timeStamp,
          nonceStr: payRes.nonceStr,
          package: payRes.packageVal,
          signType: payRes.signType,
          paySign: payRes.paySign,
          success: async (res) => {
            if (res.errMsg == "requestPayment:ok") {
              uni.navigateTo({
                url: "/pages/shop/pay_result?orderId=" + order.orderId,
              });
            }
          },
          fail(res) {
            console.log(res);
          },
        });
      } catch (e) {
        console.error(e);
      }
      // createOrderApi()
    },
  },
};
</script>
<style>
page {
  background-color: #f1f1f1;
}
</style>
<style lang="scss" scoped>
.check_box {
  width: 100%;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}
.box {
  width: 720rpx;
  box-sizing: border-box;
  border-radius: 10rpx;
  margin: 30rpx auto;
  background: #fff;
  // box-shadow: #eee 5rpx 5rpx 5rpx;
  padding: 20rpx 40rpx;

  .title {
    font-size: 32rpx;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #ddd;
  }
}

.info_row {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  padding: 20rpx 0;

  & > view:first-child {
    color: #888;
  }

  & > view:last-child {
    color: #333;
  }

  .price {
    color: red;
  }
}

.input {
  font-size: 26rpx;
  text-align: right;
  color: #333;
}

.pay_button {
  background: #fff;
  position: fixed;
  width: 750rpx;
  bottom: 0;
  padding: 30rpx 30rpx 30rpx;

  box-sizing: border-box;
  // 写在需要添加底部边距的盒子上
  padding-bottom: constant(safe-area-inset-bottom);
  /*兼容 IOS<11.2*/
  padding-bottom: env(safe-area-inset-bottom);
  /*兼容 IOS>11.2*/
}
</style>
