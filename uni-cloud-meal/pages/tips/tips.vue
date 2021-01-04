<template>
	<view>
		<!-- 到付 -->
		<view class="tipsBox text-center" v-if="payType == 0">
			<image src="../../static/image/meal/offline.png" class="img"></image>
			<view class="pb40 txt">
				<view>请在拿到商品后</view>
				<view>按工作人员指示进行线下付款</view>
			</view>
			<view><button class="cu-btn round bg-cyan" @tap="goHome">回到首页</button></view>
			<view><button class="cu-btn round btn1" @tap="lookOrder">查看订单</button></view>
		</view>
		<!-- 记账 -->
		<view class="tipsBox text-center" v-else-if="payType == 1">
			<image src="../../static/image/meal/booking.png" class="img"></image>
			<view class="pb40">记账成功</view>
			<view><button class="cu-btn round bg-cyan" @tap="goHome">回到首页</button></view>
			<view><button class="cu-btn round btn1" @tap="lookOrder">查看订单</button></view>
		</view>
		<!-- 成功 -->
		<view class="tipsBox text-center" v-else-if="(payType == 2 || payType == 4)&&!payFail">
			<image src="../../static/image/meal/success.png" class="img"></image>
			<view class="pb40">支付成功</view>
			<view><button class="cu-btn round bg-cyan" @tap="goHome">回到首页</button></view>
			<view><button class="cu-btn round btn1" @tap="lookOrder">查看订单</button></view>
		</view>
		<!-- 失败 -->
		<view class="tipsBox text-center" v-else-if="(payType == 2 || payType == 4)&&payFail">
			<image src="../../static/image/meal/fail.png" class="img"></image>
			<view class="pb40">支付失败</view>
			<view><button class="cu-btn round bg-cyan btn3" @tap="againPay">重新支付</button></view>
			<view><button class="cu-btn round bg-cyan btn3" @tap="changePay" data-target="bottomModal">更换支付方式</button></view>
			<button class="cu-btn btn2" @tap="cancelTap">
				<text class="cuIcon-close icon"></text> 取消订单
			</button>
		</view>
		<!-- end -->
		<!-- 支付方式 -->
		<paymentList :payList="payList" :selectId="radio" :modalName="modalName" @reselectId="reselectId" @hideModal="hideModal"></paymentList>
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
				payType: '', //支付方式
				payFail: false, //默认支付成功
				orderId: '', // 订单id

				modalName: null,
				radio: '', //默认支付方式value
				payList: [], // 支付方式列表
			};
		},
		onLoad(options) {
			//清空购物车缓存
			uni.removeStorageSync('selectfood_storage_key');
			
			console.log(options)
			this.payType = options.payType;
			let _orderId = options.orderId;
			this.orderId = _orderId;
			this.payFail = _orderId ? true : false;

			this.getPayType(options.storeId)
		},
		methods: {
			// 获取支付方式
			getPayType(storeId) {
				if (!storeId) return
				this.$Api.getPayType({
					storeId: storeId
				}).then(res => {
					let data = res.data;
					this.payList = data;
					this.radio = data[0].payType;
				}, err => {})
			},
			hideModal(e) {
				this.modalName = e
			},
			// 修改支付方式
			reselectId(id) {
				console.log(`父组件接收的支付方式id：${id}`)
				this.radio = id;
				this.$Api.updOrderPayment({
					orderId: this.orderId,
					payment: id
				}).then(res => {
					console.log('修改支付方式')
					if (id == 0) { //支付成功
						this.payType = 0
					} else if (id == 1) {
						this.payType = 1
					} else if (id == 2 || id == 4) { //调支付接口
						this.againPay()
					}
				}, err => {})
			},
			changePay(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			goHome() {
				uni.switchTab({
					url: '../index/index'
				})
			},
			lookOrder() {
				uni.switchTab({
					url: '../order/order'
				})
			},
			// 取消订单
			cancelTap() {
				this.$Api.orderCancel({
					orderId: this.orderId
				}).then(res => {
					uni.showModal({
						content: '订单取消成功',
						showCancel: false,
						buttonText: '好的',
						success: (res) => {
							if (res.confirm) {
								uni.switchTab({
									url: '../order/order'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					})
				}, err => {})
			},
			//重新支付
			againPay() {
				this.$Api.orderPay({
					orderId: this.orderId
				}).then(res => {
					// #ifdef MP-WEIXIN
					if (res.data.paymentType == 4) {
						//职工卡支付成功
						this.payType = 4
						this.payFail = false
					} else if (res.data.paymentType == 2) {
						//微信支付
						this.wechatPay(res.data)
					}
					// #endif
				}, err => {})
			},
			//微信支付
			wechatPay(info) {
				var _this = this;
				wx.requestPayment({
					timeStamp: info.timeStamp,
					nonceStr: info.nonceStr,
					package: info.package,
					signType: 'MD5',
					paySign: info.paySign,
					success(res) {
						console.log(res);
						if (res.errMsg == 'requestPayment:ok') {
							_this.payType = 2
							_this.payFail = false
						}
					},
					fail(res) {
						// console.log(res)
					},
					complete(res) {
						// console.log(res)
					}
				})
			},
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
