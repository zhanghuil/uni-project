<template>
	<view>
		<view class="tit">您是我院的？</view>
		<view class="chooseBox">
			<radio-group class="chooseGroup" @change="identityChange">
				<label class="item" v-for="(item,index) in chooseList" :key="item.code">
					<image class="img" :src="item.code == 0 ? '../../static/image/workers.png' : '../../static/image/patient.png'"></image>
					<radio class='green radioSex' :class="radio==item.code?'checked':''" :checked="radio==item.code?true:false" :value="item.code"></radio>
					<view class="name">{{item.name}}</view>
				</label>
			</radio-group>
		</view>
		<view class="footer">
			<button class="cu-btn" type="default" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				radio: 0,
				chooseList: [], //0-患者  1-职工
				isNeedVerify: null, //是否需要验证
				crowdId: '', //身份id
			};
		},
		created() {
			this.getCompany()
		},
		methods: {
			getCompany() {
				this.$Api.getCompany().then(res => {
					let companyTit = res.data.title || '医院'
					this.$store.commit('setCompanyTit', companyTit)
					uni.setNavigationBarTitle({
						title: companyTit + '营养订餐'
					})
					this.chooseList = res.data.crowdTypeService
					this.radio = res.data.crowdTypeService[0].code
					this.isNeedVerify = res.data.crowdTypeService[0].isNeedVerify
					this.crowdId = res.data.crowdTypeService[0].crowdId
				}, err => {})
			},
			identityChange(e) {
				let val = e.detail.value
				console.log(`选择的：${val}`)
				this.radio = val
				this.isNeedVerify = this.chooseList.find(i => i.code == val).isNeedVerify;
				this.crowdId = this.chooseList.find(i => i.code == val).crowdId;
			},
			/**
			 * 0-患者  1-职工  确定按钮获取用户手机号
			 */
			decryptPhoneNumber(e) {
				var _this = this;
				let url, type;
				if (this.radio == 1) { //选择职工
					if (this.isNeedVerify) { //需要验证
						url = 'registerStaff'
					} else {
						url = 'registerPatient'
						type = 's'
					}
				} else { //患者
					url = 'registerPatient'
					type = 'p'
				}
				if (e.detail.errMsg == 'getPhoneNumber:fail:user cancel') { //微信账号没有绑定手机号 点击取消
					uni.navigateTo({
						url: `../${url}/${url}?agree=0&crowdId=${_this.crowdId}&type=${type}`
					})
					return;
				}
				console.log(e.detail.errMsg)
				if (e.detail.errMsg == 'getPhoneNumber:fail:user deny') {
					//用户拒绝 需要获取验证码  0-没有手机号  1-有手机号
					uni.navigateTo({
						url: `../${url}/${url}?agree=0&crowdId=${_this.crowdId}&type=${type}`
					})
				} else {
					// 如果用户同意授权 有手机号
					_this.$store.commit('setPhoneInfo', e)
					if (_this.radio == 0) { //患者直接注册
						_this.wechatphoneP(e)
					} else if (_this.radio == 1) { //职工微信获取手机号认证
						_this.wechatphone(e)
					}
				}

			},
			// 职工微信手机号认证 
			wechatphone(e) {
				var _this = this;
				let _sessionBagKey = uni.getStorageSync('sessionBagKey');
				let params = {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
					cloudID: e.detail.cloudID,
					sessionBagKey: _sessionBagKey,
					companyId: this.$store.state.companyID,
					crowdId: this.crowdId
				}
				this.$Api.wechatphone(params).then(res => {
					uni.setStorageSync('token', res.data.accessToken)
					if (!_this.isNeedVerify) {
						uni.switchTab({
							url: '../index/index',
						});
					} else { //职工需要验证
						uni.navigateTo({
							url: `../registerStaff/registerStaff?agree=1&crowdId=${_this.crowdId}`
						})
					}
				}, err => {})
			},
			// 患者注册  A：不需要验证，手机号注册成功后进入首页
			wechatphoneP(e) {
				var _this = this;
				let _sessionBagKey = uni.getStorageSync('sessionBagKey');
				let params = {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
					cloudID: e.detail.cloudID,
					sessionBagKey: _sessionBagKey,
					companyId: this.$store.state.companyID,
					crowdId: this.crowdId
				}
				this.$Api.wechatphoneP(params).then(res => {
					uni.setStorageSync('token', res.data.accessToken)
					uni.switchTab({
						url: '../index/index',
					});
				}, err => {})
			},
		}
	}
</script>

<style lang="scss">
	.tit {
		font-size: 36rpx;
		color: #4EC09B;
		padding: 48rpx 0 0;
		text-align: center;
	}

	.chooseBox {
		text-align: center;

		.item {
			display: block;
			position: relative;

			.img {
				width: 200rpx;
				height: 200rpx;
				margin-top: 80rpx;
			}

			.radioSex {
				font-size: 40rpx;
				color: #4EC09B;
				position: absolute;
				// bottom: 6rpx;
				// right: 10rpx;

				bottom: 100rpx;
				right: 30rpx;
			}

			.name {
				font-size: 30rpx;
				color: #2A2A2A;
				padding-top: 48rpx;
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;

		.cu-btn {
			border: none;
			background: #4EC09B;
			font-size: 30rpx;
			color: #FFFFFF;
			text-align: center;
			width: 100%;
			height: 90rpx;
			border-radius: 0;
		}
	}
</style>
