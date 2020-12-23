<template>
	<view>
		<!-- 成功 -->
		<view class="tipsBox text-center">
			<image src="../../static/image/meal/success.png" class="img"></image>
			<view class="pb40">支付成功</view>
			<view><button class="cu-btn round bg-cyan" @tap="goHome">回到首页</button></view>
			<view><button class="cu-btn round btn1" @tap="lookOrder">查看订单</button></view>
		</view>
		<!-- 失败 -->
		<view class="tipsBox text-center">
			<image src="../../static/image/meal/fail.png" class="img"></image>
			<view class="pb40">支付失败</view>
			<view><button class="cu-btn round bg-cyan btn3">重新支付</button></view>
			<view><button class="cu-btn round bg-cyan btn3">更换支付方式</button></view>
			<button class="cu-btn btn2">
				<text class="cuIcon-close icon"></text> 取消订单
			</button>
		</view>
		<!-- 到付 -->
		<view class="tipsBox text-center">
			<image src="../../static/image/meal/offline.png" class="img"></image>
			<view class="pb40 txt">
				<view>请在拿到商品后</view>
				<view>按工作人员指示进行线下付款</view>
			</view>
			<view><button class="cu-btn round bg-cyan" @tap="goHome">回到首页</button></view>
			<view><button class="cu-btn round btn1" @tap="lookOrder">查看订单</button></view>
		</view>
		<!-- 记账 -->
		<view class="tipsBox text-center">
			<image src="../../static/image/meal/booking.png" class="img"></image>
			<view class="pb40">记账成功</view>
			<view><button class="cu-btn round bg-cyan" @tap="goHome">回到首页</button></view>
			<view><button class="cu-btn round btn1" @tap="lookOrder">查看订单</button></view>
		</view>
		<!-- end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			goHome() {
				uni.switchTab({
					url: '../index/index'
				})
			},
			lookOrder() {
				uni.switchTab({
					url: '../order/order'
				})
			}
		},
	}
</script>

<style lang="scss">
	.tipsBox {
		font-size: 36rpx;
		color: #000000;

		.img {
			width: 320rpx;
			height: 320rpx;
			margin: 140rpx 0 48rpx;
		}

		.txt {
			font-size: 32rpx;
			color: #4A4A4A;
			line-height: 48rpx;
		}

		.cu-btn {
			height: 80rpx;
			padding: 0 96rpx;
			margin-bottom: 32rpx;
			line-height: 1.1;
			font-size: 32rpx;

			&.btn3 {
				width: 320rpx;
				padding: 0;
			}
		}

		.btn1 {
			background: none;
			color: #4EC09B;
		}

		.btn2 {
			margin-top: 48rpx;
			background: none;
			color: #C0C0C0;

			.icon {
				margin-right: 8rpx;
			}
		}
	}
</style>
