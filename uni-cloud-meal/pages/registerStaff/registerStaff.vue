<template>
	<view class="staff-form-group">
		<view class="item">
			<view class="title">姓名</view>
			<input type="text" class="ipt" placeholder="请输入" placeholder-class="placeholder" maxlength="15" v-model="userName" />
		</view>
		<!-- #ifndef MP-ALIPAY -->
		<view class="item">
			<view class="title">部门</view>
			<picker mode="multiSelector" @change="multiChange" @columnchange="columnchange" :value="multiIndex" :range="multiArray">
				<view class="uni-input">{{multiArray[1][multiIndex[1]] ? multiArray[1][multiIndex[1]] : '请选择'}}</view>
			</picker>
			<view class="flex align-center mt7">
				<image src="../../static/image/meal/tip.png" class="tipImg"></image>
				<text class="f12 c-6a">找不到您的部门时，请选择“默认部门”</text>
			</view>
		</view>
		<!-- #endif -->
		<!--  #ifdef MP-ALIPAY -->
		<view>部门只能单列选择</view>
		<!--  #endif -->
		<view v-if="agree == 0">
			<view class="item">
				<view class="title">手机号</view>
				<input type="number" class="ipt" placeholder="请输入" placeholder-class="placeholder" maxlength="11" v-model="phone" />
			</view>
			<view class="item">
				<view class="title">验证码</view>
				<view class="flex align-center justify-between">
					<input type="number" class="ipt" maxlength="4" placeholder="请输入" placeholder-class="placeholder" v-model="code" />
					<view class="codeTxt" @click="getCode" :class="!phone? 'c-c0' : 'c-4e'">{{!codeTime?'获取验证码':codeTime+'s'}}</view>
				</view>
			</view>
		</view>
		<view class="text-center rel">
			<view class="toast" :class="txtType == 'success' ? 'success' : ''" v-if="toastTxt">{{toastTxt}}</view>
			<button class="cu-btn round submitBtn" @click="submitTap" :class="isLogin ? 'bg-cyan' : 'bg-gray'" :disabled="!isLogin">确定</button>
		</view>
		<!-- 验证失败 -->
		<view class="cu-modal" :class="modalName=='failedModal'?'show':''">
			<view class="cu-dialog rel">
				<view class="action closeBtn" @tap="hideModal">
					<text class="cuIcon-close"></text>
				</view>
				<view class="padding-lr-xl text-center">
					<image src="../../static/image/fail.png" class="failImg"></image>
					<view class="f16 c-2a">验证失败</view>
					<view class="failTxt">
						<view>如果您确认填写信息无误，</view>
						<view>请至<text class="c-4e">{{errMsg}}</text>找工作人员处理。</view>
					</view>
					<view class="flex justify-between failBtnBox">
						<button class="cu-btn round btn1" @tap="hideModal">暂时放弃验证</button>
						<button class="cu-btn bg-cyan round btn2" @tap="retryTap">重试</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				errMsg: '',
				modalName: null,
				agree: '',
				userName: '',
				phone: '',
				code: '',
				codeTime: 0,
				crowdId: '',
				txtType: 'success',
				toastTxt: '',
				multiArray: [
					['亚洲', '欧洲'],
					['中国', '日本']
				], // 二维数组数据
				multiIndex: [0, 0], // 默认的下标
			};
		},
		onLoad(option) {
			console.log(option)
			this.agree = option.agree
			this.crowdId = option.crowdId
			this.getDept()
		},
		computed: {
			isLogin() {
				if (this.agree == 0) {
					//表单全部校验不能为空--没有获取到手机号
					return !!this.userName && !!this.phone && !!this.code
				} else {
					//只验证姓名部门
					return !!this.userName
				}
			},
		},
		methods: {
			getDept() {
				this.$Api.getDept({
					companyId: this.$store.state.companyID
				}).then(res => {
					let _data = res.data
					var areaList = [..._data] // 放在一个数组里面
					var areaArr = _data.map((item) => {
						return item.name
					}) // 此方法将校区名称区分到一个新数组中

					this.multiArray = [areaArr, []], // 更新二维数组 更新后长这样 [['静安区', '宝山区'],[]]
						this.areaList = areaList
					this.areaArr = areaArr

					this.getBranch(_data[0].id) // 获取部门数据
					this.area_id = _data[0].id;
					this.departmentId = _data[0].dept[0].id;
				}, err => {})
			},
			getBranch(id) { //获取部门数据
				var $this = this;
				if (id) {
					this.area_id = id
					let branchList = this.areaList.find(item => {
						return item.id == id;
					})

					let branchArr = branchList.dept.map(item => {
						return item.name;
					})
					this.multiArray = [this.areaArr, branchArr], // 更新二维数组 更新后长这样 [['静安区', '宝山区'],['科室1','科室二']]
						this.branchList = branchList.dept
					this.branchArr = branchArr
				}
			},
			multiChange(e) {
				let branchList = this.branchList;
				let select_key = e.detail.value[1];

				this.multiIndex = e.detail.value
				this.departmentId = branchList[select_key]['id']
			},
			columnchange(e) {
				var column = e.detail.column // 当前改变的列
				let data = {
					multiArray: this.multiArray,
					multiIndex: this.multiIndex
				};
				data.multiIndex[column] = e.detail.value;


				var area_id_session = this.area_id; // 保持之前的校区id 与新选择的id 做对比，如果改变则重新请求数据
				switch (column) { // 处理不同的逻辑
					case 0: // 第一列更改 就是院区的更改
						var areaList = this.areaList;
						var area_id = areaList[e.detail.value]['id'];
						if (area_id_session != area_id) { // 与之前保持的校区id做对比，如果不一致则重新请求并赋新值
							this.getBranch(area_id);
						}
						data.multiIndex[1] = 0;
						break;
				}
				data.multiArray = this.multiArray
				// this.multiArray = data.multiArray;
				// this.multiIndex = data.multiIndex;
			},
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
				if (this.agree == 0) { //全部验证
					if (this.phone.length < 11) {
						this.showToast('请将手机号输入完整', 'error')
						return;
					} else if (this.code.length < 4) {
						this.showToast('请将验证码输入完整', 'error')
						return;
					}

					let _sessionBagKey = uni.getStorageSync('sessionBagKey');
					let params = {
						phone: this.phone,
						name: this.userName,
						districtId: this.area_id,
						departmentId: this.departmentId,
						smsCode: this.code,
						sessionBagKey: _sessionBagKey,
						companyId: this.$store.state.companyID,
						crowdId: this.crowdId
					}
					this.$Api.phoneStaff(params).then(res => {
						uni.setStorageSync('token', res.data.accessToken)
						// 注册成功并进入首页
						this.showToast('验证成功', 'success')
						setTimeout(() => {
							uni.switchTab({
								url: '../index/index'
							})
						}, 1500)
					}, err => {
						if (err.data.errCode == 20200) {
							// 验证失败
							this.modalName = 'failedModal'
							this.errMsg = err.data.message
						} else {
							this.showToast(err.data.message, 'error')
						}
					})
				} else { //只验证姓名&部门
					let params = {
						name: this.userName,
						districtId: this.area_id,
						departmentId: this.departmentId
					}
					this.$Api.StaffName(params).then(res => {
						this.showToast('验证成功', 'success')
						setTimeout(() => {
							uni.switchTab({
								url: '../index/index'
							})
						}, 1500)
					}, err => {
						if (err.data.errCode == 20200) {
							// 验证失败
							this.modalName = 'failedModal'
							this.errMsg = err.data.message
						} else {
							this.showToast(err.data.message, 'error')
						}
					})
				}
			},
			showToast(txt, type) {
				this.toastTxt = txt
				this.txtType = type
				setTimeout(() => {
					this.toastTxt = ''
				}, 1500)
			},
			hideModal(e) {
				this.modalName = null
			},
			retryTap() {
				this.modalName = null
				// this.submitTap()
			}
		},
	}
</script>

<style lang="scss">
	.staff-form-group {
		padding: 0 28rpx;

		.item {
			padding: 32rpx 0;
			border-bottom: 1rpx solid #EEEFF3;

			.title {
				font-size: 30rpx;
				color: #2A2A2A;
				padding-bottom: 24rpx;
			}

			.ipt {
				font-size: 28rpx;
				color: #6A6A6A;
			}

			.f12 {
				font-size: 24rpx;
			}

			.mt7 {
				margin-top: 14rpx;
			}

			.tipImg {
				width: 28rpx;
				height: 28rpx;
				margin-right: 8rpx;
			}

			.uni-input {
				font-size: 28rpx;
				color: #6A6A6A;
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

	.cu-dialog {
		border-radius: 24rpx;
		background: #FFFFFF;
	}

	.closeBtn {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
		font-size: 40rpx;
	}

	.failImg {
		width: 134rpx;
		height: 134rpx;
		margin: 48rpx 0 16rpx;
	}

	.failTxt {
		line-height: 42rpx;
		font-size: 28rpx;
		color: #4A4A4A;
		padding: 48rpx 32rpx 64rpx;
	}

	.failBtnBox {
		padding: 0 28rpx 48rpx;

		.cu-btn {
			padding: 0 76rpx;
			height: 80rpx;

			&.btn1 {
				padding: 0 0 0 20rpx;
				background: none;
				color: #C0C0C0;
			}
		}
	}
</style>
