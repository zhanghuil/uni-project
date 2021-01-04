<template>
	<view class="contenter">
		<view class="cardItem">
			<view class="cardTxt text-center">
				<view class="txt">职工卡余额</view>
				<!-- 正常显示 -->
				<view class="f20" v-if="cardInfoObj.balance">￥<text class="f30">{{cardInfoObj.balance}}</text></view>
				<!-- 系统异常 -->
				<block v-else>
					<view class="f20">- -</view>
					<view class="padding-top">
						<text class="tips">查询系统异常，暂无法查到最新余额</text>
					</view>
				</block>
			</view>
			<image src="../../static/image/bg1.png" class="bg-img"></image>
		</view>
		<view class="inputBox">
			<view class="unit">￥</view>
			<input class="ipt" type="digit" placeholder="输入充值金额，最低0.01元，最高1000元" placeholder-class="placeholder" v-model="amount"
			 @input="checkInput" />
		</view>
		<view class="rechargeBtn text-center">
			<button class="cu-btn round" :class="amount>0?'bg-cyan':'bg-gray'" @tap="rechargeTap" :disabled="!amount">充值</button>
		</view>
		<view class="footBox" @click="lookTap">
			<view>在线充值记录</view>
		</view>
	</view>
</template>

<script>
	import {
		checkNum,
		showToast
	} from '../../common/util.js'
	export default {
		data() {
			return {
				amount: null,
				cardInfoObj: {},
			};
		},
		onLoad() {
			this.cardInfo()
		},
		methods: {
			cardInfo() {
				this.$Api.cardInfo().then(res => {
					this.cardInfoObj = res.data;
				}, err => {
					console.log(err.statusCode)
				})
			},
			checkInput(e) {
				let price = e.detail.value;
				price = checkNum(price, 4, 2);
				this.$nextTick(() => {
					this.amount = price;
				});
			},
			rechargeTap() {
				if (this.amount <= 0) return;
				if (this.amount > 1000 || this.amount <= 0) {
					showToast('充值金额最低0.01元，最高1000元，请输入正确金额');
					return;
				}
				this.$Api.recharge({
					rechargeMoney: this.amount
				}).then(res => {
					// #ifdef MP-WEIXIN
					this.wechatPay(res.data)
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
							_this.cardInfo()
							_this.amount = null
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
				height: 52rpx;
				font-size: 52rpx;
				line-height: 52rpx;
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
