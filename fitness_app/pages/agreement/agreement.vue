<template>
  <view>
    <MNavbar
      :title="title"
      titleStyle="color:#333;"
      bgColor="#FFF"
      leftIconColor="#333" />

    <view class="u-content">
      <u-parse
        :content="shopInfo[field]"
        :tagStyle="{ fontSize: '22rpx' }"></u-parse>
    </view>
  </view>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      title: "协议",
      field: "",
    };
  },
  computed: {
    ...mapGetters("systemModel", ["shopInfo"]),
  },
  onLoad(options) {
    let map = {
      safetyNotice: "健身安全须知协议书",
      agreement: "隐私协议",
    };
    this.field = options.field;
    this.title = map[options.field];
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.u-content {
  margin: 20rpx 20rpx;
  font-size: 26rpx;
  color: #333;
}
</style>
