<template>
  <view>
    <MNavbar bgColor="#FFF" :autoBack="false">
      <view slot="left"></view>
      <view slot="center" style="color: #333">个人中心</view>
    </MNavbar>
    <view class="header_bg"></view>
    <view class="info_box">
      <view class="user_info">
        <u-avatar
          v-if="!accessToken"
          src=""
          size="110rpx"
          shape="circle"></u-avatar>
        <u-avatar
          v-else
          :src="$formatImg(userInfo.avatar)"
          size="110rpx"
          shape="circle"></u-avatar>
        <view class="user_centent">
          <view
            class="username"
            v-if="!accessToken"
            @tap="goPath('/pages/user/login', true)">
            点击登录
          </view>
          <view class="username" v-else>{{ userInfo.nickName || "" }}</view>
          <view class="user_tips">{{ userInfo.phonenumber || "" }}</view>
        </view>
      </view>
      <view
        class="edit_box"
        @tap="goPath('/pages/user/edit_info', accessToken)">
        <view>编辑个人资料</view>
        <view style="margin-left: 10rpx">
          <u-icon name="arrow-right" color="#333" size="26rpx"></u-icon>
        </view>
      </view>
    </view>
    <view
      v-if="flase"
      style="margin: -30rpx 0 0; position: relative; z-index: -1">
      <u-image
        src="/static/pay/img02.png"
        width="750rpx"
        height="auto"
        mode="widthFix"></u-image>
    </view>
    <view class="card_box">
      <view class="card_title">订单管理</view>
      <view class="order_box">
        <view
          class="order_item"
          @tap="goPath('/pages/order/order?type=1&current=0', accessToken)">
          <u-image
            src="/static/user/icon6.png"
            width="auto"
            height="45rpx"
            mode="heightFix"></u-image>
          <view>未支付</view>
        </view>
        <view
          class="order_item"
          @tap="goPath('/pages/order/order?type=2&current=1', accessToken)">
          <u-image
            src="/static/user/icon4.png"
            width="auto"
            height="45rpx"
            mode="heightFix"></u-image>
          <view>待使用</view>
        </view>
        <view
          class="order_item"
          @tap="goPath('/pages/order/order?type=3&current=2', accessToken)">
          <u-image
            src="/static/user/icon7.png"
            width="auto"
            height="45rpx"
            mode="heightFix"></u-image>
          <view>进行中</view>
        </view>
        <view
          class="order_item"
          @tap="goPath('/pages/order/order?type=4&current=3', accessToken)">
          <u-image
            src="/static/user/icon5.png"
            width="auto"
            height="45rpx"
            mode="heightFix"></u-image>
          <view>已完成</view>
        </view>
        <view
          class="order_item"
          @tap="goPath('/pages/order/order?type=6&current=4', accessToken)">
          <u-image
            src="/static/user/icon8.png"
            width="auto"
            height="45rpx"
            mode="heightFix"></u-image>
          <view>已取消</view>
        </view>
      </view>
    </view>
    <view class="tool_box">
      <view
        class="tool_item"
        @tap="goPath('/pages/reservation/list', accessToken)">
        <view class="to_item_body">
          <u-image
            src="/static/user/res.png"
            width="37rpx"
            height="auto"
            mode="widthFix"></u-image>
          <view class="tool_name">我的预约</view>
        </view>
        <u-icon name="arrow-right" color="#666" size="32rpx"></u-icon>
      </view>
      <view
        class="tool_item"
        @tap="goPath('/pages/feedback/feedback', accessToken)">
        <view class="to_item_body">
          <u-image
            src="/static/user/icon1.png"
            width="40rpx"
            height="auto"
            mode="widthFix"></u-image>
          <view class="tool_name">意见反馈</view>
        </view>
        <u-icon name="arrow-right" color="#666" size="32rpx"></u-icon>
      </view>
      <view class="tool_item" @tap="showClientInfo = true">
        <view class="to_item_body">
          <u-image
            src="/static/user/icon2.png"
            width="40rpx"
            height="auto"
            mode="widthFix"></u-image>
          <view class="tool_name">联系客服</view>
        </view>
        <u-icon name="arrow-right" color="#666" size="32rpx"></u-icon>
      </view>
      <view class="tool_item" @tap="logout">
        <view class="to_item_body">
          <u-image
            src="/static/user/icon3.png"
            width="40rpx"
            height="auto"
            mode="widthFix"></u-image>
          <view class="tool_name">退出登录</view>
        </view>
        <u-icon name="arrow-right" color="#666" size="32rpx"></u-icon>
      </view>
    </view>

    <!-- <MTabbar :currentTab="4" /> -->
    <!-- 客服弹框 -->
    <ClientService :show="showClientInfo" @close="showClientInfo = false" />
  </view>
</template>

<script>
// import MTabbar from '@/components/MTabbar/MTabbar.vue'
import MNavbar from "@/components/MNavbar/MNavbar.vue";
import ClientService from "./components/ClientService.vue";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    // MTabbar,
    MNavbar,
    ClientService,
  },
  computed: {
    ...mapGetters("userModel", ["userInfo", "accessToken"]),
  },
  data() {
    return {
      showClientInfo: false,
    };
  },
  onShareAppMessage() {},
  onShareTimeline() {},
  methods: {
    ...mapMutations("userModel", ["setAccessToken", "setUserInfo"]),
    goPath(url, isJump) {
      if (!isJump) {
        uni.$u.toast("请登录");
        return;
      }
      uni.navigateTo({
        url,
      });
    },
    logout() {
      uni.showModal({
        title: "系统提示",
        content: "是否要退出登录",
        success: ({ confirm }) => {
          if (confirm) {
            this.setAccessToken(null);
            this.setUserInfo(null);
            uni.clearStorageSync();
          }
        },
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
.header_bg {
  width: 750rpx;
  height: 100rpx;
  background: #fff;
  color: #333;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

// .body_box {
// 	position: relative;
// 	width: 750rpx;
// 	min-height: 150rpx;
// 	background: #fff;
// 	border-radius: 50rpx 50rpx;
// 	// margin-top: -75rpx;
// }

.info_box {
  width: 750rpx;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 60rpx 70rpx 40rpx;
  background: #fff;

  .user_info {
    display: flex;
    align-items: center;
    // padding: 0 0 30rpx;

    .user_centent {
      margin-left: 30rpx;

      .username {
        font-size: 28rpx;
        color: #333;
        font-weight: 700;
      }

      .user_tips {
        font-size: 23rpx;
        color: #333;
        line-height: 50rpx;
      }
    }
  }

  .edit_box {
    display: flex;
    color: #333;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    // line-height: 80rpx;
  }
}

.card_box {
  width: 660rpx;
  background-color: #fff;
  border-radius: 10rpx;
  margin: 30rpx auto 0;
  box-sizing: border-box;
  padding: 30rpx 40rpx;
  box-shadow: #ddd 0 0 20rpx;
  .card_title {
    font-size: 28rpx;
    font-weight: 700;
  }
  .order_box {
    padding: 0 25rpx;
    box-sizing: border-box;
    margin-top: 30rpx;
    display: flex;
    justify-content: space-between;
  }
  .order_item {
    display: flex;
    // flex: 1;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    font-size: 22rpx;
    color: #666;
    & > view {
      margin-top: 12rpx;
    }
  }
}

.tool_box {
  width: 660rpx;
  margin: 30rpx auto 0;
  background: #fff;
  box-sizing: border-box;
  padding: 15rpx 40rpx;
  border-radius: 10rpx;
  box-shadow: #ddd 0 0 20rpx;

  .title {
    font-size: 28rpx;
    font-weight: 700;
  }

  .tool_item {
    display: flex;
    justify-content: space-between;
    padding: 25rpx 0;
    box-sizing: border-box;

    .to_item_body {
      display: flex;
      align-items: center;
      color: #333;
      font-size: 28rpx;
    }

    .tool_name {
      margin-left: 15rpx;
    }
  }
}
</style>
