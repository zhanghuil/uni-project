<template>
	<view class="regBox">
		<view class="tit">手机号</view>
		<view class="input-wrapper">
			<input type="number" class="ipt" maxlength="11" placeholder="请输入" placeholder-class="placeholder" v-model="phone"
			 @input="" />
		</view>
		<view class="tit">验证码</view>
		<view class="input-wrapper">
			<input type="number" class="ipt" maxlength="4" placeholder="请输入" placeholder-class="placeholder" v-model="code" />
			<view class="codeTxt" @click="getCode" :class="!phone? 'c-c0' : 'c-4e'">{{!codeTime?'获取验证码':codeTime+'s'}}</view>
		</view>
		<view class="text-center rel">
			<view class="toast" :class="txtType == 'success' ? 'success' : ''" v-if="toastTxt">{{toastTxt}}</view>
			<button class="cu-btn round submitBtn" @click="submitTap" :class="isLogin ? ' bg-cyan' : 'bg-gray'">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				code: '',
				codeTime: 0,
				txtType: 'success',
				toastTxt: ''
			};
		},
		created() {
			uni.setNavigationBarTitle({
				title: '上海新华医院营养订餐'
			})
		},
		computed: {
			isLogin() {
				return !!this.phone && !!this.code
			},
		},
		methods: {
			getCode() {
				if (this.codeTime > 0 || !this.phone) {
					return;
				} else if (this.phone.length < 11) {
					this.showToast('请将手机号输入完整', 'error')
					return
				}

				this.$Api.smscode({
					phone: this.phone
				}).then(res => {
					console.log(res)
					if (res.data.succeed) {
						this.showToast(res.data.message, 'success')
						this.codeTime = 60
						let timer = setInterval(() => {
							this.codeTime--;
							if (this.codeTime < 1) {
								clearInterval(timer);
								this.codeTime = 0
							}
						}, 1000)
					} else {
						this.showToast(res.data.message, 'error')
					}
				}, err => {})
			},
			submitTap() {
				if (!this.phone || !this.code) {
					return;
				} else if (this.phone.length < 11) {
					this.showToast('请将手机号输入完整', 'error')
					return;
				} else if (this.code.length < 4) {
					this.showToast('请将验证码输入完整', 'error')
					return;
				}
				// 注册成功并进入首页
				let _sessionBagKey = uni.getStorageSync('sessionBagKey');
				let params = {
					phone: this.phone,
					smsCode: this.code,
					sessionBagKey: _sessionBagKey,
					companyId: this.$store.state.companyID
				}
				this.$Api.phonePatient(params).then(res => {
					uni.setStorageSync('token', res.data.accessToken)
					this.showToast('验证成功', 'success')
					setTimeout(() => {
						uni.switchTab({
							url: '../index/index'
						})
					}, 1500)
				}, err => {})
			},
			showToast(txt, type) {
				this.toastTxt = txt
				this.txtType = type
				setTimeout(() => {
					this.toastTxt = ''
				}, 1500)
			}
		},
	}
</script>

<style lang="scss">
	.regBox {
		padding: 32rpx 80rpx;
	}

	.tit {
		font-size: 15px;
		color: #2A2A2A;
		padding: 64rpx 0 30rpx;
	}

	.input-wrapper {
		padding: 0 40rpx;
		background: #FAFAFA;
		border-radius: 40rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.ipt {
			font-size: 28rpx;
			color: #4A4A4A;
		}

		.codeTxt {
			font-size: 26rpx;
			position: relative;
			padding-left: 38rpx;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 2rpx;
				height: 32rpx;
				background: #F4F4F4;
			}
		}
	}

	.submitBtn {
		margin-top: 160rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		height: 80rpx;
		padding: 0 128rpx;

		&.bg-gray {
			background: #C0C0C0;
		}
	}

	.toast {
		background: #FF946B;
		border-radius: 8rpx;
		font-size: 12px;
		color: #FFFFFF;
		padding: 16rpx 32rpx;
		position: absolute;
		top: 82rpx;
		left: 50%;
		transform: translateX(-50%);


		&.success {
			background: #4EC09B;
		}
	}
</style>
