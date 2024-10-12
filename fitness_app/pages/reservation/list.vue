<template>
  <view>
    <MNavbar
      title="我的预约"
      titleStyle="color:#333;"
      bgColor="#fff"
      leftIconColor="#333" />
    <view class="list_box">
      <MescrollBody
        ref="mescrollRef"
        @init="mescrollInit"
        @down="downCallback"
        @up="upCallback"
        :up="upOptions"
        :down="downOption">
        <view
          class="list_item_box"
          v-for="(item, index) in dataList"
          :key="index">
          <view class="info_item">
            <view class="label">开始时间：</view>
            <view>{{ formatTimestamp(item.startTime) }}</view>
          </view>
          <view class="info_item">
            <view class="label">结束时间：</view>
            <view>{{ formatTimestamp(item.endTime) }}</view>
          </view>
          <view class="button_row" v-if="[2].includes(item.status)">
            <view style="width: 200rpx">
              <u-button
                @tap="updateRsr(item)"
                :custom-style="{
                  background: '#FF914D',
                  border: '2rpx solid #FF914D ',
                  color: '#FFF',
                  height: '48rpx',
                  borderRadius: '8rpx',
                }">
                <text style="font-size: 22rpx">取消预约</text>
              </u-button>
            </view>
          </view>
          <view class="status_box status_color1" v-if="item.status == 1">
            订单待付款
          </view>
          <view class="status_box status_color1" v-if="item.status == 2">
            待进行
          </view>
          <view class="status_box status_color2" v-if="item.status == 3">
            进行中
          </view>
          <view class="status_box status_color3" v-if="item.status == 4">
            已完成
          </view>
          <view class="status_box status_color3" v-if="item.status == 5">
            订单已取消
          </view>
        </view>
      </MescrollBody>
    </view>
  </view>
</template>

<script>
import MescrollMixin from "@/components/MescrollUni/mescroll-mixins.js";
import MescrollBody from "@/components/MescrollUni/mescroll-body.vue";
import MNavbar from "@/components/MNavbar/MNavbar.vue";
import { listByUserApi } from "@/apis/reservation.js";
import { formatTimestamp } from "@/utils/utils";
import { delRsrApi } from "@/apis/reservation.js";
export default {
  mixins: [MescrollMixin],
  components: {
    MescrollBody,
    MNavbar,
  },
  data() {
    return {
      queryForm: {
        status: "",
        pageNum: 1,
        pageSize: 10,
      },
      dataList: [],
      upOptions: {
        textNoMore: "暂无更多数据",
        empty: {
          tip: "暂无数据",
        },
      },
      downOption: {
        auto: false, //是否在初始化后,自动执行downCallback; 默认true
      },
    };
  },
  onShow() {
    this.mescroll.resetUpScroll();
  },
  methods: {
    formatTimestamp,
    /*下拉刷新的回调 */
    downCallback(mescroll) {
      this.mescroll.resetUpScroll();
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      this.queryForm.pageNum = page.num;
      this.queryForm.pageSize = page.size;
      listByUserApi(this.queryForm).then((res) => {
        let list = res.rows ?? [];
        this.mescroll.endByPage(list.length, 100);
        if (page.num == 1) this.dataList = [];
        this.dataList = this.dataList.concat(list);
      });
    },
    updateRsr(item) {
      delRsrApi({ id: item.id }).then((res) => {
        this.mescroll.resetUpScroll();
        uni.showToast({
          icon: "success",
          title: "取消成功",
        });
      });
    },
  },
};
</script>
<style>
page {
  background: #f5f5f5;
}
</style>
<style lang="scss" scoped>
.list_box {
  margin: 30rpx 30rpx;
  // width: 100%;
}
.list_item_box {
  width: 100%;
  box-shadow: #eee 5rpx 5rpx 5rpx;
  background: #fff;
  padding: 20rpx 40rpx;
  box-sizing: border-box;
  position: relative;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #333;
  overflow: hidden;
  margin-bottom: 20rpx;
  // font-weight: 700;

  .info_item {
    font-size: 27rpx;
    margin-bottom: 10rpx;
    display: flex;
    .label {
      color: #666;
    }
  }

  .status_box {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 22rpx;
    padding: 2rpx 7rpx;
    color: #fff;
  }
  .status_color1 {
    background: #ff9900;
  }
  .status_color2 {
    background: #2979ff;
  }
  .status_color3 {
    background: #19be6b;
  }

  .button_row {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
