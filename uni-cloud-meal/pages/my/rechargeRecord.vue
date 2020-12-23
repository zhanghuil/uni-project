<template>
	<view>
		<view class="list">
			<view class="item">
				<view>
					<view>2020-11-02</view>
					<view class="time">12:00</view>
				</view>
				<view>
					<view class="price">￥126</view>
				</view>
			</view>
			<view class="item">
				<view>
					<view>2020-11-20</view>
					<view class="time">12:00</view>
				</view>
				<view>
					<view class="price">￥126</view>
					<view class="tip">充值失败</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.list {
		padding: 0 28rpx;

		.item {
			padding: 28rpx 0;
			font-size: 30rpx;
			color: #2A2A2A;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #F4F4F4;
			;

			.time {
				font-size: 28rpx;
				color: #6A6A6A;
				padding-top: 8rpx;
			}

			.price {
				font-size: 40rpx;
				color: #2A2A2A;
			}

			.tip {
				font-size: 24rpx;
				color: #FF4D23;
				padding-left: 10rpx;
			}
		}
	}
</style>
