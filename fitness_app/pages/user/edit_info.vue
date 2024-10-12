<template>
  <view style="display: flex">
    <MNavbar
      bgColor="rgba(255,255,255,0)"
      title="编辑个人信息"
      leftIconColor="#333"
      titleStyle="color:#333;" />

    <view class="box">
      <view class="photo_box">
        <view style="width: 100%; height: 100%; position: relative">
          <view class="carera_box" @tap="uploadImg">
            <image src="/static/user/update_user1.png" class="photo_cara" />
          </view>
          <view
            class="empty_photo"
            @tap="uploadImg"
            v-if="$u.test.isEmpty(form.avatar)">
            <u-icon name="camera-fill" size="60rpx" color="#D3D4D6"></u-icon>
          </view>
          <image
            class="photo"
            @tap="uploadImg"
            :src="$formatImg(form.avatar)"
            v-else></image>
        </view>
      </view>
      <view class="title_row"></view>
      <view class="form_body">
        <view class="form_item">
          <view class="form_label">昵称</view>
          <input
            class="form_input"
            v-model="form.nickName"
            type="text"
            placeholder="请输入姓名"
            placeholder-style="font-size:28rpx;color:#999; " />
        </view>
        <view class="form_item">
          <view class="form_label">联系方式</view>
          <input
            class="form_input"
            v-model="form.phonenumber"
            type="text"
            placeholder="请输入联系方式"
            placeholder-style="font-size:28rpx;color:#999; " />
        </view>
        <view style="width: 100%; margin-top: 40rpx">
          <u-button
            :customStyle="{ height: '80rpx', color: '#FFF' }"
            @click="submit()"
            shape="circle"
            text="修改"
            color="linear-gradient(to right, #333, #333)"></u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import MNavbar from "@/components/MNavbar/MNavbar.vue";

import { mapGetters, mapActions } from "vuex";
import { mergeObjects } from "@/utils/utils.js";

import { uploadFileApi } from "@/apis/file.js";
import { updateUserApi } from "@/apis/user.js";
export default {
  data() {
    return {
      form: {
        nickName: "",
        phonenumber: "",
        avatar: "",
      },
      showPass: false,
    };
  },
  components: {
    MNavbar,
  },
  computed: {
    ...mapGetters("userModel", ["userInfo"]),
  },
  onLoad() {
    mergeObjects(this.userInfo, this.form);
  },
  methods: {
    ...mapActions("userModel", ["getUserInfoAsync"]),
    uploadImg() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          let tempFilePath = res.tempFilePaths[0];
          try {
            let saveRes = await uploadFileApi(tempFilePath);
            console.log(saveRes);
            this.form.avatar = saveRes.fileName;
          } catch (e) {
            console.error(e);
          }
        },
      });
    },
    submit() {
      let phonenumber = this.form.phonenumber;
      if (
        !uni.$u.test.isEmpty(phonenumber) &&
        !uni.$u.test.mobile(phonenumber)
      ) {
        uni.$u.toast("手机号格式错误");
        return;
      }
      updateUserApi(this.form)
        .then((res) => {
          console.log(uni.$u.toast);
          uni.$u.toast("修改成功");
          this.getUserInfoAsync();
          setTimeout(() => {
            uni.navigateBack();
          }, 700);
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>

<style>
page {
  background: #eee;
  /* background-image: linear-gradient(to bottom, #ff914d, #e4ab98, #ede0d9); */
}
</style>
<style lang="scss" scoped>
.passwod_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ebebeb;
  padding: 0 20rpx 0 0;
  margin-top: 10rpx;
  border-radius: 12rpx;
}

.box {
  background: #fff;
  // box-shadow: 0rpx 8rpx 8rpx 5rpx #eee;
  border-radius: 40rpx 40rpx 40rpx 40rpx;
  width: 690rpx;
  position: relative;
  padding: 0 0 30rpx;
  margin: 25vh auto;
}

.photo_box {
  width: 170rpx;
  height: 170rpx;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -120rpx;

  .photo {
    width: 170rpx;
    height: 170rpx;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }

  .empty_photo {
    width: 170rpx;
    height: 170rpx;
    border-radius: 50%;
    background-color: #f8f8f8;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .carera_box {
    width: 58rpx;
    height: 58rpx;
    background: rgba(51, 51, 51, 0.8);
    border-radius: 50rpx;
    position: absolute;
    right: -20rpx;
    bottom: 0;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;

    .photo_cara {
      width: 28rpx;
      height: 26rpx;
    }
  }
}

.title_row {
  padding: 50rpx 50rpx 55rpx;
  font-weight: bold;
  color: #333333;
  font-size: 40rpx;
}

.form_body {
  padding: 0 50rpx;

  .form_item {
    margin-bottom: 32rpx;

    .form_tips {
      font-size: 22rpx;
      margin-top: 5rpx;
      color: #f75c40;
    }

    .form_label {
      font-size: 28rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 48rpx;
    }

    .form_input {
      background: #f5f5f5;
      border-radius: 12rpx;
      height: 80rpx;
      padding: 0 32rpx;
      color: #333;
      margin-top: 12rpx;
      font-size: 28rpx;
      flex: 1;
    }
  }
}
</style>
