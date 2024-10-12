<template>
  <view class="page_box">
    <MNavbar
      title="健身须知"
      titleStyle="color:#fff;"
      bgColor="#FF914D"
      leftIconColor="#333" />

    <view class="img_box">
      <u-image
        :src="$formatImg(shopInfo.bulletinCover)"
        width="100%"
        radius="20rpx"
        height="300rpx"></u-image>
    </view>
    <view class="info_box">
      <view class="info_title">详情介绍</view>
      <view class="u-content">
        <u-parse
          :content="shopInfo.bulletinContent"
          :tagStyle="{ fontSize: '22rpx' }"></u-parse>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      text: ``,
    };
  },
  computed: {
    ...mapGetters("systemModel", ["shopInfo"]),
  },
  methods: {},
};
</script>

<style>
page {
  background: #f2f2f2;
}
</style>
<style lang="scss" scoped>
.page_box {
  width: 750rpx;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.img_box {
  width: 750rpx;
  box-sizing: border-box;
  // background: #fff;
  padding: 35rpx 20rpx 20rpx;
}
.info_box {
  flex: 1;
  width: 750rpx;
  box-sizing: border-box;
  background: #fff;
  padding: 35rpx 30rpx 30rpx;
  .info_title {
    text-align: center;
    font-size: 32rpx;
    font-weight: 700;
    margin-bottom: 15rpx;
  }
  .u-content {
    font-size: 26rpx;
    color: #333;
  }
}
</style>
