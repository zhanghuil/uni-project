<template>
	<view>
		<view class="infoH1 text-center">想要每餐都吃得健康？</view>
		<view class="infoH3 text-center">请花1分钟回答几个小问题吧！</view>
		<!-- 性别 -->
		<view class="infoH2 text-center mt16">性别</view>
		<radio-group class="sexGroup">
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
					<input class="inputNum" type="number" maxlength="3" placeholder="请输入" placeholder-class="placeholder" @input="getAge" />
				</view>
			</view>
			<view class="item">
				<view class="tit">身高</view>
				<view class="flex align-center px15">
					<input class="inputNum" type="number" maxlength="3" placeholder="请输入" placeholder-class="placeholder" @input="getHeight" />
					<text class="unit">cm</text>
				</view>
			</view>
			<view class="item">
				<view class="tit">体重</view>
				<view class="flex align-center px15">
					<input class="inputNum" type="number" maxlength="3" placeholder="请输入" placeholder-class="placeholder" @input="getWeight" />
					<text class="unit">kg</text>
				</view>
			</view>
		</view>
		<!-- 疾病类型 -->
		<view class="infoH2 text-center">有无以下特殊情况？</view>
		<view class="diseaseType">
			<view class="item" v-for="(item,index) in checkboxData" :key="index" :class="{'checked':checkActive(item)}"
			 @tap="changeCheckbox(item)">{{item.label}}</view>
		</view>
		<view class="footer">
			<view class="wrapper">
				<view class="btn btn1">跳过</view>
				<view class="btn btn2" @tap="confirmTap">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkboxData: [{
						'value': 0,
						'label': '高血糖'
					},
					{
						'value': 1,
						'label': '心脑血管'
					},
					{
						'value': 2,
						'label': '肿瘤'
					},
					{
						'value': 3,
						'label': '术后康复'
					},
					{
						'value': 4,
						'label': '孕妇'
					},
					{
						'value': 5,
						'label': '冠心病'
					},
					{
						'value': 6,
						'label': '脂肪肝'
					},
					{
						'value': 7,
						'label': '肾病'
					},
					{
						'value': 8,
						'label': '透析'
					},
					{
						'value': 9,
						'label': '骨质疏松'
					}
				],
				checkedArr: [], //复选框选中的值
				radio: 0,
				sexList: [{
					value: 0,
					name: '男',
					img: '../../static/image/sex0.png',
					checked: true
				}, {
					value: 1,
					name: '女',
					img: '../../static/image/sex1.png',
					checked: false
				}],
				age: '',
				height: '',
				weigth: ''
			}
		},
		methods: {
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
			},
			checkActive(item) {
				return this.checkedArr.indexOf(item) !== -1 //多选
			},
			sexChange(e) {
				this.radio = e.detail.value
			},
			getAge(e) {
				this.age = e.detail.value
			},
			getHeight(e) {
				this.height = e.detail.value
			},
			getWeight(e) {
				this.weigth = e.detail.value
			},
			confirmTap() {
				uni.navigateTo({
					url: './lookInfo'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
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

			.px15 {
				padding-left: 30rpx;
				padding-right: 30rpx;
			}

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
			color: #C0C0C0;
			background: #fff;
			border-radius: 40rpx;
			padding: 20rpx 0;
		}

		.btn2 {
			margin-left: 18rpx;
			background: #C0C0C0;
			color: #FFFFFF;
		}

		.confirmBtn {
			background: #4EC09B;
		}
	}
</style>
