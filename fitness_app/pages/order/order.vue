<template>
  <view>
    <MNavbar
      title="我的订单"
      titleStyle="color:#333;"
      bgColor="#fff"
      leftIconColor="#333" />
    <view class="tab_box">
      <u-tabs
        :current="currentTab"
        :list="tabList"
        @click="clickTab"
        lineColor="#FF914D"
        :activeStyle="{
          color: '#303133',
          fontWeight: 'bold',
          transform: 'scale(1.05)',
        }"
        :inactiveStyle="{ color: '#777', transform: 'scale(0.9)' }"></u-tabs>
    </view>
    <view class="list_box">
      <MescrollBody
        ref="mescrollRef"
        @init="mescrollInit"
        @down="downCallback"
        @up="upCallback"
        :up="upOptions"
        :down="downOption">
        <view class="list_item" v-for="(item, index) in dataList" :key="index">
          <view class="list_item_top">
            <view>订单编号：{{ item.orderId || "" }}</view>
            <view class="tip_box tip_color1" v-if="item.status === 1">
              待支付
            </view>
            <view class="tip_box tip_color2" v-else-if="item.status === 2">
              待使用
            </view>
            <view class="tip_box tip_color3" v-else-if="item.status === 3">
              进行中
            </view>
            <view class="tip_box tip_color4" v-else-if="item.status === 4">
              已完成
            </view>
            <view class="tip_box tip_color1" v-else-if="item.status === 6">
              超时取消
            </view>
          </view>
          <view class="item_body">
            <view class="item_body_left">
              <u-image
                :src="$formatImg(item.tzProd.pic)"
                width="230rpx"
                height="180rpx"
                radius="15rpx"></u-image>
            </view>
            <view class="item_body_right">
              <view class="item_title">{{ item.prodName }}</view>
              <view
                class="info_tow"
                style="margin: 0 0 5rpx"
                v-if="!item.endTime">
                <text>付款时间：</text>
                <text>{{ formatTimestamp(item.createTime) }}</text>
              </view>
              <view
                class="info_tow"
                v-if="item.status === 1"
                style="margin: 0 0 5rpx">
                <text>状态：</text>
                <text>待付款</text>
              </view>
              <view
                class="info_tow"
                v-else-if="item.status === 2"
                style="margin: 0 0 5rpx">
                <text>状态：</text>
                <text>待使用</text>
              </view>
              <view
                class="info_tow"
                v-if="item.status == 3 || item.status == 4"
                style="margin: 0 0 5rpx">
                <text>开始时间：</text>
                <text>{{ formatTimestamp(item.dvyTime) || "" }}</text>
              </view>
              <view
                class="info_tow"
                v-if="(item.endTime && item.status == 3) || item.status == 4"
                style="margin: 0 0 5rpx">
                <text>结束时间：</text>
                <text>{{ formatTimestamp(item.endTime) || "" }}</text>
              </view>
              <view
                class="info_tow"
                v-if="item.status == 6"
                style="margin: 0 0 5rpx">
                <text>取消时间：</text>
                <text>{{ formatTimestamp(item.cancelTime) || "" }}</text>
              </view>
              <view class="info_price">
                <text>￥</text>
                <text>{{ item.actualTotal || "" }}</text>
              </view>
            </view>
          </view>
          <view class="item_footer">
            <view style="width: 145rpx" v-if="item.status == 1">
              <u-button
                @tap="goPay(item)"
                :custom-style="{
                  border: 'unset',
                  background: '#FF914D ',
                  color: '#FFF',
                  height: '48rpx',
                  borderRadius: '8rpx',
                  width: '145rpx',
                }">
                <text style="font-size: 22rpx">去付款</text>
              </u-button>
            </view>
            <view style="width: 145rpx" v-if="item.status == 2">
              <u-button
                @tap="refundOrder(item)"
                :custom-style="{
                  border: '2rpx solid #FF914D ',
                  color: '#FF914D',
                  height: '48rpx',
                  borderRadius: '8rpx',
                  width: '145rpx',
                }">
                <text style="font-size: 22rpx">取消订单</text>
              </u-button>
            </view>
            <view
              style="width: 145rpx"
              v-if="item.status == 2 || item.status == 3 || item.status == 4">
              <u-button
                @tap.stop="goDetails(item)"
                :custom-style="{
                  border: 'unset',
                  background: '#FF914D ',
                  color: '#FFF',
                  height: '48rpx',
                  borderRadius: '8rpx',
                  width: '145rpx',
                  marginLeft: '10rpx',
                }">
                <text style="font-size: 22rpx">查看详情</text>
              </u-button>
            </view>
          </view>
        </view>
      </MescrollBody>
    </view>
  </view>
</template>

<script>
import { getOrdersApi, refundOrderApi } from "@/apis/order.js";
import MescrollMixin from "@/components/MescrollUni/mescroll-mixins.js";
import MescrollBody from "@/components/MescrollUni/mescroll-body.vue";
import { formatTimestamp } from "@/utils/utils";
export default {
  mixins: [MescrollMixin],
  components: {
    MescrollBody,
  },
  data() {
    return {
      currentTab: 0,
      tabList: [
        {
          name: "未支付",
          value: "1",
        },
        {
          name: "待使用",
          value: "2",
        },
        {
          name: "进行中",
          value: "3",
        },
        {
          name: "已完成",
          value: "4",
        },
        {
          name: "已取消",
          value: "6",
        },
      ],
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
  onLoad(options) {
    let type = options.type;
    let current = options.current;
    type = parseInt(type);
    current = parseInt(current);
    this.currentTab = current;
    this.queryForm.status = type;
  },
  methods: {
    formatTimestamp,
    refundOrder(item) {
      refundOrderApi(item.orderId).then((res) => {
        console.log(res);
        uni.showToast({
          icon: "success",
          title: "退款申请已提交！",
        });
      });
    },
    clickTab({ value }) {
      if (value !== "-1") {
        this.queryForm.status = value;
        this.mescroll.resetUpScroll();
      } else {
        this.queryForm.status = "";
        this.mescroll.resetUpScroll();
      }
    },
    goPay(item) {
      uni.navigateTo({
        url: "/pages/shop/pay?orderId=" + item.orderId,
      });
    },
    /*下拉刷新的回调 */
    downCallback(mescroll) {
      this.mescroll.resetUpScroll();
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      this.queryForm.pageNum = page.num;
      this.queryForm.pageSize = page.size;
      getOrdersApi(this.queryForm).then((res) => {
        let list = res.rows ?? [];
        list.forEach((item) => {
          item.tzProd.attribute = item.tzProd.attribute
            ? JSON.parse(item.tzProd.attribute)
            : {};
          if (item.dvyTime) {
            let dvyTime = new Date(item.dvyTime);
            item.endTime = new Date(
              dvyTime.getTime() + item.tzProd.lifespan * 60 * 60 * 1000
            );
          }
        });
        this.mescroll.endByPage(list.length, 100);
        if (page.num == 1) this.dataList = [];
        this.dataList = this.dataList.concat(list);
      });
    },
    goDetails(item) {
      uni.navigateTo({
        url: "/pages/order/details?orderId=" + item.orderId,
      });
    },
  },
};
</script>

<style>
page {
  background: #f2f2f2;
}
</style>
<style lang="scss" scoped>
.tab_box {
  margin: 0 30rpx;
}

.list_box {
  margin: 20rpx 20rpx;
}

.list_item {
  border-radius: 10rpx;
  background: #fff;
  box-sizing: border-box;
  padding: 25rpx 35rpx;
  margin-bottom: 20rpx;

  .list_item_top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > view:first-child {
      font-size: 24rpx;
      color: #666;
      margin-bottom: 10rpx;
    }

    .tip_box {
      font-size: 22rpx;
      padding: 3rpx 10rpx;
      border-radius: 7rpx;
      color: #fff;
    }

    .tip_box {
      font-size: 20rpx;
      padding: 6rpx 10rpx;
      border-radius: 7rpx;
      color: #fff;
    }

    .tip_color1 {
      background: #ff914d;
    }

    .tip_color2 {
      background: #f8b043;
    }
    .tip_color3 {
      background: #0582ff;
    }
    .tip_color4 {
      background: #a0e448;
    }
  }

  .item_body {
    display: flex;
    align-items: center;
  }

  .item_footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    border-top: 2rpx solid #eee;
    margin-top: 20rpx;
    box-sizing: border-box;
    padding: 10rpx 20rpx 0;
  }

  .item_body_right {
    flex: 1;
    height: 180rpx;
    margin: 10rpx 0 0 20rpx;

    .item_title {
      font-weight: 700;
      color: #333;
      font-size: 28rpx;
      margin: 0 0 15rpx;
    }

    .info_tow {
      font-size: 24rpx;

      & > text:first-child {
        color: #888;
      }

      & > text:last-child {
        color: #333;
      }
    }

    .info_price {
      color: #e45f2b;
      margin-top: 5rpx;

      & > text:first-child {
        font-size: 22rpx;
      }

      & > text:last-child {
        font-weight: 700;
        font-size: 28rpx;
      }
    }
  }
}
</style>
