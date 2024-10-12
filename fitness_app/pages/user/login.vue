<template>
  <view>
    <MNavbar title="微信登录" />
    <view class="box">
      <u-image
        src="/static/user/img1.png"
        width="400rpx"
        height="auto"
        mode="widthFix"></u-image>
      <view style="margin-top: 50rpx; width: 100%">
        <u-button
          color="#FF914D"
          @click="login()"
          icon="weixin-fill"
          iconColor="#F2F2F2"
          :customStyle="{ height: '90rpx', color: '#F2F2F2' }"
          text="微信一键登录" />
      </view>
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
          @tap="goPath('/pages/agreement/agreement?field=agreement')">
          《用户协议》
        </text>
      </view>
    </view>
  </view>
</template>
<!--  -->
<script>
import { mapMutations } from "vuex";
import { wechartLogin } from "@/apis/user.js";
import MNavbar from "@/components/MNavbar/MNavbar.vue";
export default {
  components: {
    MNavbar,
  },
  data() {
    return {
      flag: [],
    };
  },
  methods: {
    ...mapMutations("userModel", ["setUserInfo", "setAccessToken"]),
    checkChange(e) {
      this.flag = e.target.value ?? [];
    },
    goPath(url) {
      uni.navigateTo({
        url,
      });
    },
    login() {
      if (uni.$u.test.isEmpty(this.flag)) {
        uni.showToast({
          icon: "none",
          title: "请确认已阅读隐私协议",
        });
        return;
      }
      uni.login({
        success: async ({ code }) => {
          try {
            let loginRes = await wechartLogin(code);

            this.setAccessToken(loginRes.token);
            this.setUserInfo(loginRes);
            uni.$u.toast("登录成功");
            setTimeout(() => {
              uni.navigateBack();
            }, 500);
          } catch (e) {
            console.error(e);
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  margin: 13vh auto;
  width: 690rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.check_box {
  margin-top: 15rpx;
  width: 100%;
  font-size: 24rpx;
  display: flex;
  align-items: center;
}
</style>
