<template>
	<view class="contenter">
		<view class="cardItem">
			<view class="cardTxt text-center">
				<view class="txt">职工卡余额</view>
				<!-- 系统异常 -->
				<view class="f20">- -</view>
				<view class="padding-top">
					<text class="tips">查询系统异常，暂无法查到最新余额</text>
				</view>
				<!-- 正常显示 -->
				<!-- <view class="f20">￥<text class="f30">200.00</text></view> -->
			</view>
			<image src="../../static/image/bg1.png" class="bg-img"></image>
		</view>
		<view class="inputBox">
			<view class="unit">￥</view>
			<input class="ipt" type="number" placeholder="输入充值金额，最低1元，最高1000元" placeholder-class="placeholder" />
		</view>
		<view class="rechargeBtn text-center">
			<button class="cu-btn bg-gray bg-cyan round">充值</button>
		</view>
		<view class="footBox" @click="lookTap">
			<view>在线充值记录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			lookTap() {
				uni.navigateTo({
					url: './rechargeRecord'
				})
			}
		}
	}
</script>

<style lang="scss">
	.contenter {
		height: 100vh;
		position: relative;
		padding: 32rpx 40rpx;

		.cardItem {
			height: 240rpx;
			font-size: 32rpx;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			background-image: linear-gradient(90deg, #9FD9C7 0%, #6ECCAE 100%);
			border-radius: 8rpx;

			.bg-img {
				position: absolute;
				width: 184rpx;
				height: 148rpx;
				right: 0;
				bottom: 0;
			}

			.cardTxt {
				position: relative;
				z-index: 1;
			}

			.f20 {
				font-size: 40rpx;
			}

			.f30 {
				font-size: 60rpx;
			}

			.txt {
				padding-bottom: 18rpx;
			}

			.tips {
				font-size: 24rpx;
				color: #FF4D23;
				opacity: 0.9;
				background: #FFFFFF;
				border-radius: 4rpx;
				padding: 8rpx 24rpx;
			}
		}

		.inputBox {
			margin: 80rpx 0 64rpx;
			padding: 0 32rpx;
			background: #FAFAFA;
			border-radius: 50rpx;
			height: 100rpx;
			display: flex;
			align-items: center;

			.unit {
				font-size: 36rpx;
				color: #2A2A2A;
				margin-right: 32rpx;
			}

			.ipt {
				flex: 1;
				font-size: 52rpx;
				color: #2A2A2A;
			}
		}

		.rechargeBtn {
			.cu-btn {
				padding: 0 128rpx;
				font-size: 32rpx;
				color: #fff;
				height: 80rpx;

				&.bg-gray {
					background: #C0C0C0;
				}
			}
		}

		.footBox {
			text-align: center;
			font-size: 28rpx;
			color: #C0C0C0;
			width: 100%;
			position: absolute;
			left: 0;
			bottom: 64rpx;
		}
	}
</style>
