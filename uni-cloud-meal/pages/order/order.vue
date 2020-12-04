<template>
	<view>
		<view class="orderTop">
			<view class="L flex align-center">
				<image src="../../static/image/icon3.png"></image>
				2020年11月
			</view>
			<view class="R">
				<text>消费合计：</text>
				<text class="price">268.50</text>
			</view>
		</view>
		<view class="orderList">
			<view class="item">
				<view class="shopInfo flex align-center" @tap="lookTap">
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
				<!-- 待支付 、已支付-->
				<view class="orderBtnBox">
					<view class="orderBtn" @tap="cancleOrder">取消订单</view>
					<view class="orderBtn bg-cyan" @tap="showModal" data-target="bottomModal">待支付 09:20</view>
					<view class="orderBtn bg-cyan">申请退款</view>
				</view>
				<!-- 已取消、已退款 -->
				<!-- <view class="orderBtnBox2 flex justify-end">
					<button class="cu-btn">已取消</button>
				</view> -->
			</view>
		</view>
		<!-- 支付方式 -->
		<paymentList :payList="payList" :selectId="radio" :modalName="modalName" @reselectId="reselectId" @hideModal="hideModal"></paymentList>
		<!-- end -->
	</view>
</template>

<script>
	import paymentList from "../../components/paymentList.vue";
	export default {
		components: {
			paymentList
		},
		data() {
			return {
				modalName: null,
				radio: '1',
				payList: [{
						paymentId: 1,
						paymentName: "职工卡在线付"
					},
					{
						paymentId: 2,
						paymentName: "微信支付"
					},
					{
						paymentId: 3,
						paymentName: "到付"
					},
					{
						paymentId: 4,
						paymentName: "记账"
					}
				]
			};
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = e
			},
			reselectId(id) {
				console.log(`父组件接收的支付方式id：${id}`)
			},
			phone() {
				uni.makePhoneCall({
					phoneNumber: '114' //仅为示例
				});
			},
			lookTap() {
				uni.navigateTo({
					url: './orderDetail'
				})
			},
			cancleOrder() {
				uni.showModal({
					content: '取消订单？',
					cancelText: '暂不取消',
					confirmText: '确定取消',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
		},
	}
</script>

<style lang="scss">
	page {
		background: #FAFAFA;
	}

	.orderTop {
		background: #FFFFFF;
		padding: 0 28rpx;
		height: 78rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.L {
			font-size: 30rpx;
			color: #2A2A2A;

			image {
				margin-right: 8rpx;
				margin-top: 6rpx;
				width: 36rpx;
				height: 36rpx;
			}
		}

		.R {
			font-size: 26rpx;
			color: #6A6A6A;

			.price {
				font-size: 30rpx;
				color: #FF4D23;
			}
		}
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

			.orderBtnBox {
				border-top: 2rpx solid #F4F4F4;
				display: flex;
				justify-content: flex-end;
				padding: 24rpx 0;

				.orderBtn {
					border: 2rpx solid #4EC09B;
					height: 60rpx;
					padding: 0 24rpx;
					border-radius: 40rpx;
					font-size: 14px;
					color: #4EC09B;
					display: inline-flex;
					align-items: center;
					line-height: 1;
					margin-left: 24rpx;

					&.bg-cyan {
						color: #FFFFFF;
					}
				}
			}

			.orderBtnBox2 {
				padding: 0 0 24rpx;

				.cu-btn {
					background: #C0C0C0;
					color: #FFFFFF;
					font-size: 26rpx;
					height: 52rpx;
					padding: 0 25rpx;
					border-radius: 4rpx;
				}
			}
		}
	}
</style>
