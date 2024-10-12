<template>
  <view>
    <MNavbar
      title=" "
      titleStyle="color:#fff;"
      :autoBack="false"
      bgColor="#FFF">
      <view slot="left"></view>
    </MNavbar>
    <view class="banner_box">
      <u-image
        :src="$formatImg(shopInfo.banner ? shopInfo.banner[0] : null)"
        width="100%"
        height="auto"
        mode="widthFix"></u-image>
    </view>
    <u-notice-bar :text="shopInfo.notice"></u-notice-bar>
    <view class="card_box">
      <view class="left" @tap="goPath('/pages/cards/cards')">
        <view>次卡</view>
      </view>
      <view
        class="right"
        @tap="goPath('/pages/shop/shop?id=' + prods[1].prodId)">
        <view>月卡</view>
      </view>
    </view>
    <view class="info_box">
      <view class="info_title">
        <view class="logo">
          <u-image
            :src="$formatImg(shopInfo.logo)"
            radius="75rpx"
            width="90rpx"
            height="90rpx"></u-image>
        </view>
        <view>{{ shopInfo.shopName || "" }}</view>
      </view>
      <view class="addr_box">
        <view class="left">
          <view>{{ shopInfo.address || "" }}</view>
          <view>
            <!-- <u-image
              src="/static/index/time.png"
              width="35rpx"
              height="35rpx"></u-image> -->
            <view style="margin-left: 10rpx">
              距离：999km
              <!-- <view
                v-for="(item, index) in shopInfo.openingHoursArr"
                :key="index">
                {{ item || "" }}
              </view> -->
            </view>
          </view>
        </view>
        <view class="right">
          <view>
            <u-image
              @tap="toMap()"
              src="/static/index/location.png"
              width="35rpx"
              height="35rpx"></u-image>
          </view>
          <view>
            <u-image
              src="/static/index/phone.png"
              width="35rpx"
              height="35rpx"
              @tap="call()"></u-image>
          </view>
        </view>
        <image
          src="/static/index/map02.png"
          mode="heightFix"
          class="map_img"></image>
      </view>
    </view>
    <view class="bulletin_box">
      <view class="title_box">
        <view class="line"></view>
        健身须知
      </view>
      <view class="u-content">
        <u-parse
          :content="shopInfo.bulletinContent"
          :tagStyle="{ fontSize: '22rpx' }"></u-parse>
      </view>
    </view>
    <u-modal
      :show="showOpen"
      title="温馨提示"
      closeOnClickOverlay
      @close="showOpen = false">
      <view style="text-align: center; padding: 20rpx 0 0">
        一人一开！一旦开门 订单不可退费 ！
      </view>
      <view slot="confirmButton">
        <view class="open_button" @tap="handlerOpen()">开门</view>
      </view>
    </u-modal>
    <view class="open_box" @tap="showOpen = true">
      <u-image
        src="/static/index/open.png"
        width="35rpx"
        height="35rpx"
        mode="widthFix"></u-image>
      <text class="open_box_text">开门</text>
    </view>
  </view>
</template>

<script>
import MNavbar from "@/components/MNavbar/MNavbar.vue";
import { mapActions, mapGetters } from "vuex";
import { getProdsApi } from "@/apis/prod.js";
import { remoteCmdApi } from "@/apis/device";
export default {
  data() {
    return {
      prods: [], // 商品列表
      showOpen: false,
    };
  },
  components: {
    MNavbar,
  },
  computed: {
    ...mapGetters("systemModel", ["shopInfo"]),
  },
  onLoad() {
    this.getProds();
    this.getShopInfo();
  },
  onShareAppMessage() {},
  onShareTimeline() {},
  methods: {
    ...mapActions("systemModel", ["getShopInfoAsync"]),
    // 获取商品
    getProds() {
      getProdsApi()
        .then((res) => {
          this.prods = res;
          console.log(res);
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 获取店铺基础信息
    getShopInfo() {
      this.getShopInfoAsync();
    },
    // 拨打电话
    call() {
      uni.makePhoneCall({
        phoneNumber: this.shopInfo.telephone,
        fail: () => {
          uni.showToast({
            title: "拨打电话失败",
            icon: "error",
          });
        },
      });
    },
    // 前往店铺
    toMap() {
      wx.openLocation({
        latitude: this.shopInfo.lat * 1,
        longitude: this.shopInfo.lng * 1,
        scale: 16, // 缩放比例
        name: this.shopInfo.shopName,
        address: "", // 这个可能会影响地图的定位，所以可以选择不填
        success(data) {
          console.log(data);
        },
        fail(err) {
          console.log(err);
        },
      });
    },
    // 开门操作
    handlerOpen() {
      remoteCmdApi().then((res) => {
        this.showOpen = false;
        uni.showToast({
          icon: "success",
          title: "开门成功",
        });
      });
    },
    goPath(url) {
      uni.navigateTo({
        url,
      });
    },
  },
};
</script>
<style>
page {
  background: #f9f9f9;
}
</style>
<style lang="scss" scoped>
.u-content {
  margin: 10rpx 20rpx;
  font-size: 26rpx;
  color: #333;
}
.banner_box {
  width: 750rpx;
  margin: 0 auto;
}

.info_box {
  position: relative;
  z-index: 9999;
  width: 690rpx;
  margin: 20rpx auto 0;
  box-sizing: border-box;
  // padding: 0 20rpx;
  box-shadow: #e5e5e5 0 0 20rpx;
  background: #ffffff;
  border-radius: 15rpx;
  min-height: 150rpx;
  .map_img {
    position: absolute;
    right: 0;
    top: 0;
    width: atuo;
    height: 100%;
    z-index: -1;
  }
  .info_title {
    box-sizing: border-box;
    padding: 20rpx 50rpx 0;
    display: flex;
    align-items: center;
    font-size: 32rpx;
    font-weight: 600;

    .logo {
      // margin-top: -35rpx;
      margin-right: 20rpx;
    }

    & > view:last-child {
      // margin-top: 10rpx;
    }
  }

  .addr_box {
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx 40rpx;

    .left {
      & > view:first-child {
        font-size: 28rpx;
        font-weight: 400;
      }

      & > view:last-child {
        padding: 15rpx 0 0;
        font-size: 22rpx;
        color: #666;
        display: flex;
        align-items: center;
      }
    }

    .right {
      height: 100%;
      display: flex;
      align-items: center;

      & > view {
        width: 56rpx;
        height: 56rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      & > view:first-child {
        background: #e1fdef;
        border-radius: 50rpx;
        margin-right: 35rpx;
      }

      & > view:last-child {
        background: #d8f9fe;
        border-radius: 50rpx;
      }
    }
  }
}

.card_box {
  width: 690rpx;
  margin: 20rpx auto 0;
  display: flex;
  justify-content: space-between;

  .left,
  .right {
    width: 330rpx;
    height: 180rpx;
    color: #333;
    border-radius: 15rpx;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: #e5e5e5 0 0 20rpx;
    background: #fff;
    color: #333;
    .bg_img {
      width: 100%;
      height: 80%;
      opacity: 0.8;
    }

    & > view:first-child {
      font-weight: 700;
      font-size: 75rpx;
      letter-spacing: 10rpx;
      text-align: center;
      // margin: 0 20rpx 0 50rpx;

      .price_row {
        font-size: 28rpx;
        color: #df6b2e;
      }
    }
  }

  .left {
    // background: #F5FCEC;
    // border-radius: 70rpx 0 70rpx 0;
    // color:#9DE650
  }
}
.open_box {
  z-index: 9999;
  position: fixed;
  right: 50rpx;
  bottom: 200rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #333;
  box-shadow: #333 5rpx 5rpx 5rpx;
  .open_box_text {
    font-size: 20rpx;
    color: #fff;
  }
}
.bulletin_box {
  width: 690rpx;
  margin: 20rpx auto 20rpx;
  border-radius: 20rpx;
  background: #fff;
  padding: 20rpx 20rpx;
  box-sizing: border-box;
  box-shadow: #e5e5e5 0 0 20rpx;
}
.title_box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #333;
  font-size: 30rpx;
  padding: 0 15rpx;
  box-sizing: border-box;
  font-weight: 700;
  margin-bottom: 10rpx;
  .line {
    display: none;
    width: 8rpx;
    height: 35rpx;
    border-radius: 8rpx;
    background: #ff914d;
    margin-right: 7rpx;
  }
}
.open_button {
  width: 100%;
  height: 80rpx;
  color: #fff;
  font-size: 27rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff914d;
  margin: 0 auto;
  border-radius: 50rpx;
}
</style>
