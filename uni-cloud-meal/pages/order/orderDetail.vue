<template>
	<view class="pb20">
		<view class="orderList">
			<view class="item">
				<view class="shopInfo flex align-center">
					<view class="shopImgBox">
						<image src="../../static/image/default_store.png" class="shopImg"></image>
					</view>
					<view class="flex1 ovh">
						<view class="flex justify-between">
							<view class="text-cut">Noodle’s Truth面有道劲道酸爽超级爆款拉面江杨南路店</view>
							<view class="phoneCon flex align-center" @tap.stop="phone">
								<image class="pimg" mode="scaleToFill" src="../../static/image/meal/phone.png"></image>
							</view>
						</view>
						<view class="time">2020-11-05 10:30</view>
					</view>
				</view>
				<view class="flex align-center justify-between hd">
					<view class="flex align-center">
						<view class="tag">02/19 周二</view>
						<view class="tag">早餐</view>
					</view>
					<view>￥126</view>
				</view>
			</view>
		</view>
		<view class="orderCard text-center">
			<view class="cardNum">A001</view>
			<view class="tipTxt">如可自行取餐，取餐时向工作人员出示该取餐号</view>
		</view>
		<view class="orderCard">
			<view class="menuList flex justify-between align-center">
				<view class="name">老上海糖醋排骨</view>
				<view class="R flex justify-between align-center">
					<view class="c-4a">×1</view>
					<view class="c-ff4">￥18</view>
				</view>
			</view>
			<view class="menuList flex justify-between align-center">
				<view class="name">早餐套餐A（咸豆花1碗+无汞油条1根+茶叶蛋1个）</view>
				<view class="R flex justify-between align-center">
					<view class="c-4a">×1</view>
					<view class="c-ff4">￥18</view>
				</view>
			</view>
			<view class="totalP text-right">￥126</view>
		</view>
		<view class="orderCard">
			<view class="topBox">
				<image src="../../static/image/icon4.png" class="img"></image>配送信息
			</view>
			<view class="c-2a f15 lh24">东部2号楼6楼608心胸外科手术</view>
			<view class="f14 c-6a">祝健康 17182898718</view>
		</view>
		<view class="orderCard">
			<view class="topBox">
				<image src="../../static/image/icon5.png" class="img"></image>其他信息
			</view>
			<view class="flex align-center pb8">
				<view class="c-2a w68">订单号</view>
				<view class="c-4a">78264892924209402</view>
			</view>
			<view class="flex align-center pb8">
				<view class="c-2a w68">支付方式</view>
				<view class="c-4a">微信支付</view>
			</view>
			<view class="flex align-center pb8">
				<view class="c-2a w68">下单时间</view>
				<view class="c-4a">2020-11-29 12:20</view>
			</view>
			<view class="flex align-start">
				<view class="c-2a w68">订单备注</view>
				<view class="c-4a flex1">请麻烦尽快送到，给我们科长。少辣，不要葱姜蒜，多加醋</view>
			</view>
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
			phone() {
				uni.makePhoneCall({
					phoneNumber: '114' //仅为示例
				});
			}
		},
		created() {},
	}
</script>

<style lang="scss">
	page {
		background: #FAFAFA;
	}

	.orderList {
		padding: 32rpx 28rpx;

		.item {
			background: #FFFFFF;
			box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.05);
			border-radius: 12rpx;
			padding: 32rpx 32rpx 0;

			.shopInfo {
				font-size: 32rpx;
				color: #2A2A2A;

				.shopImgBox {
					width: 100rpx;
					height: 100rpx;
					margin-right: 24rpx;
				}

				.shopImg {
					width: 100rpx;
					height: 100rpx;
					border-radius: 8rpx;
				}

				.time {
					margin-top: 14rpx;
					font-size: 24rpx;
					color: #6A6A6A;
				}

				.phoneCon {
					position: relative;
					padding-left: 30rpx;
					margin-left: 30rpx;

					&::after {
						content: '';
						position: absolute;
						left: 0;
						top: 6rpx;
						width: 2rpx;
						height: 40rpx;
						background: #E8E8E8;
					}

					.pimg {
						margin-top: 6rpx;
						width: 32rpx;
						height: 32rpx;
					}
				}
			}

			.hd {
				font-size: 40rpx;
				color: #FF4D23;
				padding: 24rpx 0;

				.tag {
					font-size: 26rpx;
					color: rgba(78, 192, 155, 0.8);
					background: rgba(78, 192, 155, 0.1);
					border-radius: 30rpx;
					padding: 9rpx 24rpx;
					margin-right: 16rpx;
				}
			}
		}
	}

	.orderCard {
		margin: 0 28rpx 32rpx;
		background: #FFFFFF;
		box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.05);
		border-radius: 12rpx;
		padding: 32rpx 28rpx;
		font-size: 26rpx;

		.cardNum {
			font-size: 80rpx;
			color: #4EC09B;
			padding: 20rpx 0;
		}

		.tipTxt {
			font-size: 28rpx;
			color: #4A4A4A;
			padding-bottom: 8rpx;
		}

		.menuList {
			font-size: 26rpx;
			color: #4A4A4A;
			padding-bottom: 16rpx;

			.name {
				width: 420rpx;
			}

			.R {
				flex: 1;
				padding-left: 56rpx;
			}
		}

		.totalP {
			margin-top: 14rpx;
			padding: 30rpx 0 0;
			border-top: 2rpx solid #F4F4F4;
			;
			font-size: 48rpx;
			color: #FF4D23;
		}

		.topBox {
			display: flex;
			align-items: center;
			font-size: 30rpx;
			color: #2A2A2A;
			padding-bottom: 20rpx;

			.img {
				width: 36rpx;
				height: 36rpx;
				margin-right: 8rpx;
			}
		}

		.w68 {
			width: 136rpx;
		}
	}
</style>
