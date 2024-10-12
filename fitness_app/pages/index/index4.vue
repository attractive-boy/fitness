<template>
	<view>
		<MNavbar title="健身房"  titleStyle="color:#FFF;" :autoBack="false" bgColor="#303942">
			<view slot="left"></view>
		</MNavbar>
		<view class="banner_box">
			<u-image src="/static/index/banner.png" radius="15rpx" width="100%" height="500rpx" ></u-image>
		</view>
		<view class="info_box">
			<view class="info_title">
				<view class="logo">
					<u-image src="/static/index/banner.png"  radius="75rpx" width="90rpx" height="90rpx"></u-image>
				</view>
				<view>自助健身房</view>
			</view>
			<view class="addr_box" >
				<view class="left">
					<view >吉林市船营区自助健身房</view>
					<view>
						<u-image src="/static/index/time.png" width="25rpx" height="25rpx"></u-image>
						<view style="margin-left: 5rpx;">
							营业时间 08:00-22:00
						</view>
					</view>
				</view>
				<view class="right">
					<view>
						<u-image src="/static/index/location.png" width="35rpx" height="35rpx"></u-image>
					</view>
					<view>
						<u-image src="/static/index/phone.png" width="35rpx" height="35rpx"></u-image>
					</view>
					
				</view>
				<!-- <image src="/static/index/banner.png" class="bg_img" style="left: 0;bottom: 0;height: 50%;"></image> -->
			</view>
		</view>
		<view class="card_box">
			<view class="left" style="height: 250rpx;">
				<u-image src="/static/index/img5.png"></u-image>
				<view class="price">
					<text style="font-size: 22rpx;">￥</text>
					19.9
				</view>
				<view class="mask"></view>
				<image src="/static/index/banner.png"  class="bg_img"></image>
			</view>
			<view class="right">
				<view class="left">
					<u-image src="/static/index/img5.png"></u-image>
					<view class="price">
						<text style="font-size: 22rpx;">￥</text>
						19.9
					</view>
					<image src="/static/index/img2.jpg" mode="center" class="bg_img"></image>
					
				</view>
				<!-- <view class="left" style="margin-top: 20rpx;">
					<view style="margin-bottom: 30rpx;">联系客服</view>
					<view class="mask"></view>
					<image src="/static/index/banner.png" mode="center" class="bg_img"></image>
				</view> -->
			</view>
		
		</view>
	</view>
</template>

<script>
	import MNavbar from '@/components/MNavbar/MNavbar.vue'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		components: {
			MNavbar
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>
<style>
	page {
		background: #303942;
	}
</style>
<style lang="scss" scoped>
	.banner_box {
		width: 750rpx;
		margin: 0 auto;
	}
	.info_box {
		position: relative;
		z-index: 9999;
		width: 690rpx;
		margin: -150rpx auto 0;
		box-sizing: border-box;
		// padding: 0 20rpx;
		background: #F5F5F5;
		border-radius: 15rpx;
		min-height: 150rpx;
		.info_title {
			box-sizing: border-box;
			padding: 20rpx 50rpx 0;
			display: flex;
			align-items: center;
			font-size: 32rpx;
			font-weight: 600;
			
			.logo {
				// margin-top: -35rpx;
				margin-right: 20rpx;
			}
			& > view:last-child {
				// margin-top: 10rpx;
			}
		}
		
		.addr_box {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx 40rpx;
			.left {
				& > view:first-child {
					font-size: 28rpx;
					font-weight: 400;
					
				}
				& > view:last-child {
					padding: 15rpx 0 0;
					font-size: 22rpx;
					color: #666;
					display: flex;
					align-items: center;
				}

			}
			.right {
				height: 100%;
				display: flex;
				align-items: center;
				& > view {
					width: 56rpx;
					height: 56rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					
				}
				& > view:first-child {
					background: #E1FDEF;
					border-radius: 50rpx;
					margin-right: 35rpx;
				}
				& > view:last-child {
					background: #D8F9FE;
					border-radius: 50rpx;
				}
			}
		}
	}
	
	.card_box {
		width: 690rpx;
		margin: 20rpx auto 0;
		display: flex;
		justify-content: space-between;
		.left {
			width: 330rpx;
			height: 250rpx;
			position: relative;
			color: #F5F5F5;
			border-radius: 15rpx;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: flex-start;
			.bg_img {
				width: 100%;
				height: 100%;
				position: absolute;
				z-index: -2;
				opacity: 0.1;
			}
				
			.mask {
				position: absolute;
				width: 100%;
				height: 60%;
				bottom: 0;
				left: 0;
				z-index: -1;
				// background: linear-gradient(to top, rgba(33, 33, 33, 1) , rgba(33,33,33,0));;
			}
			& > view:first-child {
				font-weight: 700;
				font-size: 30rpx;
				margin-left: 30rpx;
				
			}
			.price {
				// font-weight: 700;
				font-size: 30rpx;
				margin-left: 30rpx;
				margin-bottom: 30rpx;
				
			}
		}
	}
</style>