<template>
  <view>
    <MNavbar
      title="次卡"
      titleStyle="color:#333;"
      bgColor="#FFF"
      leftIconColor="#333" />
    <view class="card_list">
      <view
        class="card_box"
        v-for="(item, index) in list"
        :key="index"
        @tap="goPath('/pages/shop/shop?id=' + item.prodId)">
        <image
          :src="$formatImg(item.pic)"
          class="card_img"
          mode="widthFix"></image>
        <view class="card_body">
          <view class="left">
            <text>有效期：</text>
            <text>首次开门后{{ fomartLifespan(item.lifespan) }}</text>
          </view>
          <view class="right">
            <text>￥{{ item.oriPrice || "" }}</text>
            <text>￥{{ item.price || "" }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getProdsApi } from "@/apis/prod.js";
import { fomartLifespan } from "@/utils/utils";
export default {
  data() {
    return {
      img: "http://127.0.0.1:8080/profile/upload/2024/09/11/_Design%207%20(4)_20240911200121A016.png",
      list: [],
    };
  },
  onLoad() {
    this.getProds();
  },
  methods: {
    fomartLifespan,
    getProds() {
      uni.showLoading({
        title: "加载中",
      });
      getProdsApi({ type: 1 })
        .then((res) => {
          this.list = res;
          uni.hideLoading();
        })
        .catch((e) => {
          uni.hideLoading();
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
  background: #f8f8f8;
}
</style>
<style lang="scss" scoped>
.card_list {
  padding: 40rpx 0 0;
}
.card_box {
  width: 670rpx;
  margin: 0 auto;
  box-shadow: #ccc 0 0 10rpx;
  border-radius: 20rpx;
  background: #fff;
  overflow: hidden;
  margin-bottom: 30rpx;
  .card_img {
    width: 100%;
    height: auto;
    display: block;
  }
  .card_body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 20rpx 30rpx 20rpx;
    .left {
      font-size: 24rpx;
      color: #999;
    }
  }
  .right {
    & > text:first-child {
      font-size: 24rpx;
      color: #999;
      text-decoration: line-through;
    }
    & > text:last-child {
      font-weight: 700;
      font-size: 30rpx;
      color: #ff914d;
    }
  }
}
</style>
