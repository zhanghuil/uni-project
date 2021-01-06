<template>
	<view>
		<view class="infoH1 text-center">想要每餐都吃得健康？</view>
		<view class="infoH3 text-center">请花1分钟回答几个小问题吧！</view>
		<!-- 性别 -->
		<view class="infoH2 text-center mt16">性别</view>
		<radio-group class="sexGroup" @change="sexChange">
			<label class="item" v-for="(item,index) in sexList" :key="item.value">
				<image class="img" :src="item.img"></image>
				<radio class='green radioSex' :class="radio==item.value?'checked':''" :checked="radio==item.value?true:false"
				 :value="item.value"></radio>
			</label>
		</radio-group>
		<view class="infoGroup">
			<view class="item">
				<view class="tit">年龄</view>
				<view>
					<input class="inputNum" type="number" maxlength="3" placeholder="请输入" placeholder-class="placeholder" v-model="age" />
				</view>
			</view>
			<view class="item">
				<view class="tit">身高</view>
				<view class="flex align-center px15">
					<input class="inputNum" type="digit" data-type="height" @input="checkInput" placeholder="请输入" placeholder-class="placeholder"
					 v-model="height" />
					<text class="unit">cm</text>
				</view>
			</view>
			<view class="item">
				<view class="tit">体重</view>
				<view class="flex align-center px15">
					<input class="inputNum" type="digit" data-type="weight" @input="checkInput" placeholder="请输入" placeholder-class="placeholder"
					 v-model="weight" />
					<text class="unit">kg</text>
				</view>
			</view>
		</view>
		<!-- 疾病类型 -->
		<view class="infoH2 text-center">有无以下特殊情况？</view>
		<view class="diseaseType">
			<view class="item" v-for="(item,index) in checkboxData" :key="index" :class="{'checked':checkActive(item)}" @tap="changeCheckbox(item)">{{item.value}}</view>
		</view>
		<view class="footer">
			<!-- 个人中心进入 -->
			<view class="wrapper" v-if="from=='info'">
				<view class="btn btn1" @tap="returnTap">返回</view>
				<button class="btn cu-btn round ml9" @click="confirmTap" :class="isLogin ? 'bg-cyan' : 'bg-gray'" :disabled="!isLogin">确定</button>
			</view>
			<!-- 门店进入 -->
			<view class="wrapper" v-else>
				<view class="btn btn1" @tap="skipTap">跳过</view>
				<button class="btn cu-btn round ml9" @click="confirmTap" :class="isLogin ? 'bg-cyan' : 'bg-gray'" :disabled="!isLogin">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		checkNum
	} from '../../common/util.js'
	export default {
		data() {
			return {
				from: null,
				id: '',
				checkboxData: [],
				checkedArr: [], //复选框选中的值
				radio: 1,
				sexList: [{
					value: 1,
					name: '男',
					img: '../../static/image/sex0.png',
					checked: true
				}, {
					value: 2,
					name: '女',
					img: '../../static/image/sex1.png',
					checked: false
				}],
				age: null,
				height: '',
				weight: '',
				diseaseArr: []
			}
		},
		onLoad(options) {
			console.log(options)
			if (options.id)
				uni.setStorageSync('setStoreId', options.id)

			this.diseaseDictionary();
			this.from = options.from
			this.id = options.id || uni.getStorageSync('setStoreId')
		},
		computed: {
			isLogin() {
				return !!this.age && !!this.height && !!this.weight
			},
		},
		methods: {
			checkInput(e) {
				let type = e.currentTarget.dataset.type;
				let num = e.detail.value;
				num = checkNum(num, 3, 1);
				this.$nextTick(() => {
					if (type == 'height') this.height = num
					else this.weight = num
				});
			},
			//返回-todo
			returnTap() {
				// uni.navigateBack({
				// 	delta: 1
				// })
				uni.reLaunch({
					url: './my'
				})
			},
			//跳过-到门店主页
			skipTap() {
				uni.redirectTo({
					url: `../home/home?id=${this.id}`
				});
			},
			diseaseDictionary() {
				this.$Api.diseaseDictionary().then(res => {
					this.checkboxData = res.data
					this.lookInfo()
				}, err => {})
			},
			lookInfo() {
				this.$Api.lookInfo().then(res => {
					let data = res.data
					this.radio = data.sex || 1
					this.age = data.age
					this.height = data.height
					this.weight = data.weight

					let newArr = this.checkboxData.filter(item =>
						data.physicalCondition.indexOf(item.code) > -1
					)

					this.checkedArr = newArr
					this.diseaseArr = newArr.map(item => item.code)
				}, err => {})
			},
			// 疾病类型多选
			changeCheckbox(item) {
				if (this.checkedArr.indexOf(item) === -1) {
					// 当前数组中没有该值则push到数组
					this.checkedArr.push(item)
				} else {
					//当前数组中有该值，找到该值下标并删除
					this.checkedArr.splice(this.checkedArr.indexOf(item), 1)
				}
				console.log(this.checkedArr)
				this.diseaseArr = this.checkedArr.map(item => item.code)
			},
			checkActive(item) {
				return this.checkedArr.indexOf(item) !== -1 //多选
			},
			sexChange(e) {
				console.log(`选择的性别：${e.detail.value}`)
				this.radio = e.detail.value
			},
			confirmTap() {
				let params = {
					sex: this.radio,
					age: this.age,
					height: this.height,
					weight: this.weight,
					physicalCondition: this.diseaseArr
				}
				this.$Api.infoGather(params).then(res => {
					uni.navigateTo({
						url: `./lookInfo?id=${this.id}&from=${this.from}`
					})
				}, err => {})
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-bottom: 120rpx;
	}

	.infoH1 {
		font-size: 36rpx;
		color: #4EC09B;
		padding: 48rpx 0 20rpx;
	}

	.infoH3 {
		font-size: 28rpx;
		color: #4A4A4A;
	}

	.infoH2 {
		font-size: 30rpx;
		color: #2A2A2A;
		padding: 48rpx;
	}

	.diseaseType {
		display: flex;
		flex-wrap: wrap;
		padding: 0 0 40rpx 40rpx;

		.item {
			background: #F3F3F3;
			border-radius: 26rpx;
			padding: 11rpx 20rpx;
			font-size: 26rpx;
			color: #6A6A6A;
			margin: 0 20rpx 20rpx 0;

			&.checked {
				background: #4EC09B;
				color: #FFFFFF;
			}
		}

	}

	.sexGroup {
		display: flex;
		justify-content: center;
		padding: 0 0 64rpx;

		.item {
			position: relative;
			margin: 0 28rpx;

			&:last-child {
				margin: 0;
			}

			.radioSex {
				font-size: 40rpx;
				color: #4EC09B;
				position: relative;
				bottom: 10rpx;
				right: 20rpx;
			}
		}

		.img {
			background: #D5EFE6;
			width: 160rpx;
			height: 160rpx;
			border-radius: 8rpx;
		}
	}

	.infoGroup {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		color: #4A4A4A;
		padding: 0 24rpx 50rpx;

		.item {
			text-align: center;
			padding: 0 28rpx;

			.tit {
				font-size: 30rpx;
				color: #2A2A2A;
				padding: 0 0 48rpx 0;
			}

			// .px15 {
			// 	padding-left: 30rpx;
			// 	padding-right: 30rpx;
			// }

			.inputNum {
				font-size: 48rpx;
				color: #4EC09B;
				vertical-align: top;
			}

			.unit {
				margin-left: 12rpx;
			}
		}

	}

	.footer {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;

		.wrapper {
			border-top: 2rpx solid #F2F2F2;
			padding: 14rpx 28rpx;
			width: 100%;
			display: flex;
			justify-content: space-between;
		}

		.btn {
			flex: 1;
			text-align: center;
			font-size: 32rpx;
			border-radius: 40rpx;
			padding: 20rpx 0;

			&.btn1 {
				color: #C0C0C0;
				background: #fff;
			}

			&.bg-gray {
				background: #C0C0C0;
				color: #FFFFFF;
			}
		}

		.ml9 {
			margin-left: 18rpx;
		}
	}
</style>
