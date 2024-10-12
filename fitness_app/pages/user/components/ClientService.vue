<template>
  <view>
    <u-popup :show="show" @close="close">
      <view class="box">
        <view class="title">联系客服</view>
        <view @longpress="scanCode()">
          <u-image
            :src="$formatImg(shopInfo.wechartCode)"
            class="code_img"
            width="450rpx"
            height="auto"
            mode="widthFix"></u-image>
        </view>
        <view style="margin-top: 8rpx; font-size: 22rpx; color: #999">
          长按可添加微信
        </view>
        <view class="row">
          <view class="left">
            <text>联系电话：</text>
            <text>{{ shopInfo.telephone || "" }}</text>
          </view>
          <view class="but c_phone" @tap="call()">拨打电话</view>
        </view>
        <!-- <view class="row">
					<view class="left">
						<text>微信号：</text>
						<text>{{shopInfo.telephone || ''}}</text>
					</view>
					<view class="but w_number">
						复制微信
					</view>
				</view> -->
        <view style="padding: 30rpx 0">
          <u-icon
            @tap="handleClose"
            name="close-circle-fill"
            size="70rpx"></u-icon>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("systemModel", ["shopInfo"]),
  },
  methods: {
    close() {
      console.log("关闭弹框");
    },
    handleClose() {
      console.log(111);
      this.$emit("close");
    },
    // 长按识别二维码
    scanCode() {
      uni.scanCode({});
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
  },
};
</script>

<style lang="scss" scoped>
.box {
  padding: 30rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}
.row {
  width: 600rpx;
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  margin-top: 30rpx;
  .left {
    & text:first-child {
      display: inline-block;
      width: 130rpx;
      color: #999;
    }
  }
}
.but {
  padding: 7rpx 12rpx;
  border-radius: 5rpx;
  color: #fff;
}

.c_phone {
  background: #43b061;
}
.w_number {
  background: #df6b2e;
}
</style>
