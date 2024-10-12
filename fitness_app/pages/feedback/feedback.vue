<template>
  <view>
    <MNavbar
      title="意见反馈"
      titleStyle="color:#333;"
      bgColor="#FFF"
      leftIconColor="#333" />
    <view class="fir_title">
      <view>反馈类型</view>
      <view>*</view>
    </view>
    <view class="cate_box">
      <view
        class="cate_item"
        @tap="currentCate = index"
        :class="currentCate === index ? 'choose_cate_item' : ''"
        v-for="(item, index) in cateList"
        :key="index">
        {{ item || "" }}
      </view>
    </view>
    <textarea
      class="content"
      v-model="form.content"
      placeholder="请输入内容"></textarea>
    <view class="title_box">上传图片</view>
    <view class="upload_box">
      <u-upload
        :fileList="fileList"
        @delete="deletePic"
        @afterRead="afterRead"
        name="3"
        multiple
        :maxCount="4"
        :previewFullImage="true"></u-upload>
    </view>
    <view class="title_box">联系方式</view>
    <view class="input_item">
      <input
        maxlength="11"
        v-model="form.telephone"
        type="text"
        class="input"
        placeholder="请输入手机号便于联系(非必填)" />
    </view>
    <view style="height: 90rpx"></view>
    <view class="sub_but">
      <u-button
        text="提交反馈"
        @click="submit()"
        :custom-style="{
          background: '#333',
          border: 'unset',
          color: '#fff',
          height: '90rpx',
        }"></u-button>
    </view>
  </view>
</template>

<script>
import { feedBackSubApi } from "@/apis/feedback.js";
import { validateObject } from "@/utils/utils.js";
import { uploadFileApi } from "@/apis/file.js";
const rule = {
  content: {
    rule: "empty",
    msg: "请输入要反馈的内容",
  },
};
export default {
  data() {
    return {
      currentCate: 0,
      cateList: ["产品建议", "功能故障", "其他问题"],
      fileList: [],
      form: {
        cate: "",
        content: "",
        telephone: "",
        imgs: "",
      },
    };
  },
  methods: {
    deletePic(e) {
      console.log(e);
    },
    async afterRead(e) {
      console.log(e.file);
      let lists = [].concat(e.file);
      let fileListLen = this.fileList.length;
      lists.map((item) => {
        this.fileList.push({
          ...item,
          status: "uploading",
          message: "上传中",
        });
      });
      for (let i = 0; i < lists.length; i++) {
        const result = await uploadFileApi(lists[i].url);
        let item = this.fileList[fileListLen];
        this.fileList.splice(
          fileListLen,
          1,
          Object.assign(item, {
            status: "success",
            message: "",
            file: result.fileName,
            url: result.url,
          })
        );
        fileListLen++;
      }
    },
    async submit() {
      uni.showLoading({
        title: "提交中....",
      });
      this.form.cate = this.cateList[this.currentCate];
      this.fileList.forEach((item) => {
        this.form.imgs += item.file + ",";
      });

      if (this.form.imgs.endsWith(",")) {
        // 如果是，使用 slice() 删除最后一个字符
        this.form.imgs = this.form.imgs.slice(0, -1);
      }
      let valid = validateObject(this.form, rule);
      if (valid != null) {
        uni.showToast({
          icon: "none",
          title: valid,
        });
        return;
      }
      if (this.form.telephone && !uni.$u.test.mobile(this.form.telephone)) {
        uni.showToast({
          icon: "none",
          title: "手机号格式错误",
        });
        return;
      }
      try {
        await feedBackSubApi(this.form);
        uni.showToast({
          icon: "success",
          title: "提交成功",
        });
        uni.navigateBack();
      } catch (e) {
        uni.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fir_title {
  display: flex;
  align-items: center;
  margin: 20rpx 40rpx 15rpx;
  & > view:first-child {
    color: #333;
    font-size: 28rpx;
    font-weight: 700;
  }
  & > view:last-child {
    color: #ff914d;
    margin-left: 7rpx;
  }
}
.title_box {
  color: #333;
  font-size: 28rpx;
  font-weight: 700;
  margin: 20rpx 40rpx 15rpx;
}
.cate_box {
  margin: 0 40rpx;
  font-size: 27rpx;
  display: flex;
  align-items: center;
  .cate_item {
    border-radius: 7rpx;
    padding: 7rpx 18rpx;
    margin-right: 30rpx;
    color: #a9aaae;
    background: #f3f3f3;
  }
  .choose_cate_item {
    border-radius: 7rpx;
    padding: 7rpx 18rpx;
    margin-right: 25rpx;
    color: #fff;
    background: #333;
  }
}
.content {
  width: 670rpx;
  background: #f3f3f3;
  margin: 15rpx auto 0;
  color: #161616;
  font-size: 26rpx;
  box-sizing: border-box;
  padding: 20rpx 20rpx;
  border-radius: 5rpx;
}
.upload_box {
  width: 670rpx;
  margin: 0 auto;
}
.input_item {
  width: 670rpx;
  margin: 0 auto;
  .input {
    font-size: 26rpx;
    border-bottom: 2rpx solid #ddd;
    padding: 10rpx 0 15rpx;
  }
}
.sub_but {
  width: 670rpx;
  left: 40rpx;
  bottom: 70rpx;
  position: fixed;
  padding-bottom: constant(safe-area-inset-bottom);
  /*兼容 IOS<11.2*/
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
