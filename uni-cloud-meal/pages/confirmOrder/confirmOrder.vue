<template>
	<view class="confirmOrderBox">
		<view class="cardItem" @tap="distriInfo">
			<view class="flex align-center">
				<image src="../../static/image/meal/icon1.png" class="img"></image>
				<view class="f15 c-2a">配送信息</view>
			</view>
			<view class="arrow mt12">
				<view class="defaultTxt" v-if="!addressStr">请添加配送信息</view>
				<!-- 有值 -->
				<block v-else>
					<view class="f15 c-2a">{{addressStr}}</view>
					<view class="f14 c-6a">{{userName}} {{phone}}</view>
				</block>
			</view>
		</view>
		<view class="cardItem" @tap="showModal" data-target="bottomModal">
			<view class="flex align-center justify-between arrow">
				<view class="flex align-center">
					<image src="../../static/image/meal/icon2.png" class="img"></image>
					<view class="f15 c-2a">支付方式</view>
				</view>
				<view class="defaultTxt" v-if="!payName">请选择支付方式</view>
				<view class="payTxt" v-else>{{payName}}</view>
			</view>
		</view>
		<view class="cardItem" @tap="addNotes">
			<view class="flex align-center justify-between arrow">
				<view class="flex align-center w100">
					<image src="../../static/image/meal/icon3.png" class="img"></image>
					<view class="f15 c-2a">订单备注</view>
				</view>
				<view class="defaultTxt" v-if="!orderNote">点击填写备注</view>
				<view class="text-cut flex1 text-right" v-else>{{orderNote}}</view>
			</view>
		</view>
		<view class="cardItem">
			<scroll-view scroll-x class="nav dateCard" scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" :class="index==TabCur?'cur':''" v-for="(item,index) in dateList" :key="index" @tap="tabSelect"
				 :data-id="index">
					{{item.orderDate}}<text class="week">周一</text>
				</view>
			</scroll-view>
			<view v-if="TabCur === 0">
				<!-- 餐次item start -->
				<view class="repastName">- 早餐 -</view>
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
				<view class="flex align-center justify-end">
					<view class="f14 c-2a">当日小结</view>
					<view class="currDayPrice">￥126</view>
				</view>
				<view class="totalPrice">￥126</view>
				<!-- 餐次item end -->
			</view>
		</view>
		<view class="footer">
			<view class="flex align-center">
				<text>需支付</text>
				<text class="price">￥126</text>
			</view>
			<button class="cu-btn round bg-grey bg-cyan">提交订单</button>
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
				TabCur: 0,
				scrollLeft: 0,
				dateList: [{
						orderDate: '11/27'
					},
					{
						orderDate: '11/28'
					}
				],
				orderNote: '', //订单备注
				modalName: null,
				radio: '1',
				payName: '',
				payList: [{
					payType: 4,
					payName: "职工卡在线付"
				}],
				storeId: '', //门店id
				addressStr: '', //地址串
				phone: '', //电话
				userName: '', //姓名

			};
		},
		onShow() {
			this.orderNote = this.$store.state.orderNotes
		},
		onLoad(options) {
			this.storeId = options.storeId;
			this.lastAddress()
			this.getPayType()
		},
		methods: {
			lastAddress() {
				this.$Api.lastAddress().then(res => {
					let data = res.data[0]
					if (data) {
						this.addressStr = data.area + data.firstAddressName + data.secondAddressName + data.addRemark;
						this.phone = data.phone;
						this.userName = data.contacts;
					}
				}, err => {})
			},
			// 获取支付方式
			getPayType() {
				this.$Api.getPayType({
					storeId: this.storeId
				}).then(res => {
					let data = res.data
					this.payList = data
				}, err => {})
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			//配送信息
			distriInfo() {
				uni.navigateTo({
					url: './distributionInfo'
				})
			},
			//添加备注
			addNotes() {
				uni.navigateTo({
					url: './orderNote'
				})
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = e
			},
			reselectId(id) {
				console.log(`父组件接收的支付方式id：${id}`)
				this.payName = this.payList.find(item => {
					return item.payType == id
				}).payName
			},
		},
	}
</script>

<style lang="scss">
	page {
		background: #FAFAFA;
	}

	.confirmOrderBox {
		padding: 28rpx 28rpx 32rpx;

		.cardItem {
			background: #FFFFFF;
			box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.05);
			border-radius: 12rpx;
			padding: 32rpx 28rpx;
			margin-bottom: 32rpx;
			font-size: 26rpx;

			.img {
				width: 36rpx;
				height: 36rpx;
				margin-right: 8rpx;
				margin-top: 2rpx;
			}

			.arrow {
				position: relative;
				padding-right: 40rpx;

				&:before {
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					display: block;
					margin: auto;
					width: 15px;
					height: 15px;
					color: #6A6A6A;
					content: "\e6a3";
					text-align: center;
					font-size: 17px;
					font-family: cuIcon;
					line-height: 15px;
				}
			}

			.w100 {
				width: 200rpx;
			}

			.defaultTxt {
				color: #C0C0C0;
			}

			.payTxt {
				color: #FF4D23;
			}

			.text-cut {
				color: #4A4A4A;
			}

			.dateCard {
				padding: 0 0 32rpx 4rpx;

				.cu-item {
					height: auto;
					line-height: normal;
					font-size: 26rpx;
					color: #4EC09B;
					border: 2rpx solid #4EC09B;
					border-radius: 8rpx;
					padding: 11rpx 20rpx;
					margin: 0 20rpx 0 0;

					.week {
						padding-left: 8rpx;
					}

					&.cur {
						border-bottom: none;
						background: #4EC09B;
						color: #FFFFFF;
					}
				}
			}

			.repastName {
				font-size: 32rpx;
				color: #4A4A4A;
				padding-bottom: 24rpx;
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

			.currDayPrice {
				padding-left: 16rpx;
				font-size: 40rpx;
				color: #FF4D23;
			}

			.totalPrice {
				margin-top: 30rpx;
				border-top: 2rpx solid #F4F4F4;
				font-size: 48rpx;
				color: #FF4D23;
				text-align: right;
				padding: 26rpx 0 0;
			}
		}
	}

	.footer {
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 0 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 2rpx solid #F2F2F2;
		height: 108rpx;
		font-size: 28rpx;
		color: #2A2A2A;

		.price {
			font-size: 44rpx;
			color: #FF4D23;
			padding-left: 16rpx;
		}

		.cu-btn {
			color: #FFFFFF;

			&.bg-grey {
				background: #C0C0C0;
			}

			&.bg-cyan {
				background-color: #4EC09B;
			}
		}
	}
</style>
