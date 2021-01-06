<template>
	<view class="pb20" v-if="orderInfo">
		<view class="orderList">
			<view class="item">
				<view class="shopInfo flex align-center">
					<view class="shopImgBox">
						<image :src="orderInfo.storeLogo?orderInfo.storeLogo:'../../static/image/default_store.png'" lazy-load="true" class="shopImg"></image>
					</view>
					<view class="flex1 ovh">
						<view class="flex justify-between">
							<view class="text-cut">{{orderInfo.storeName}}</view>
							<view class="phoneCon flex align-center" @tap.stop="phone(orderInfo.storePhone)" v-if="(item.state==1||item.state==2||item.state==3)&&!item.refundMark">
								<image class="pimg" mode="scaleToFill" src="../../static/image/meal/phone.png"></image>
							</view>
						</view>
						<view class="time">{{orderInfo.orderTime | filterDate}}</view>
					</view>
				</view>
				<view class="flex align-center justify-between hd">
					<view class="flex align-center" v-if="orderInfo.state != 0 && orderInfo.dateValue">
						<view class="tag">{{orderInfo.dateValue | mealDate}} {{orderInfo.dateValue | filtersWeek}}</view>
						<view class="tag">{{orderInfo.serviceTypeName}}</view>
					</view>
					<view></view>
					<view>￥{{orderInfo.amount}}</view>
				</view>
				<!-- 订单状态 -->
				<!-- 0-待支付  1-已下单  2-已支付  3-已退款  4-已取消 -->
				<!-- 待支付 -->
				<view class="orderBtnBox" v-if="orderInfo.state == 0">
					<view class="orderBtn" @tap="cancleOrderTap(orderInfo.orderId)">取消订单</view>
					<view class="orderBtn bg-cyan" @tap="showModal" data-target="bottomModal" :data-sid="orderInfo.storeId" :data-pid="orderInfo.payType"
					 :data-oid="orderInfo.orderId">待支付
						{{timeData}}</view>
				</view>
				<!-- 已支付 -->
				<view class="orderBtnBox" v-else-if="orderInfo.state == 2&&orderInfo.refundMark">
					<view class="orderBtn bg-cyan" @tap="refundTap(orderInfo.orderId)">申请退款</view>
				</view>
				<!-- 已取消、已退款 -->
				<view class="orderBtnBox2 flex justify-end" v-else-if="orderInfo.state == 3 || orderInfo.state == 4">
					<button class="cu-btn">{{orderInfo.state == 3 ? '已退款' : '已取消'}}</button>
				</view>
			</view>
		</view>
		<view class="orderCard text-center" v-show="orderInfo.takeCode&&(orderInfo.state==1||orderInfo.state==2)">
			<view class="cardNum">{{orderInfo.takeCode}}</view>
			<view class="tipTxt">如可自行取餐，取餐时向工作人员出示该取餐号</view>
		</view>
		<!-- 已支付菜肴列表 -->
		<view class="orderCard" v-if="state==1||state==2||state==3">
			<view class="menuList flex justify-between align-center" v-for="(item,index) in orderInfo.productDtDetails" :key="index">
				<view class="name">{{item.productName}}</view>
				<view class="R flex justify-between align-center">
					<view class="c-4a">×{{item.count}}</view>
					<view class="c-ff4">￥{{item.price}}</view>
				</view>
			</view>
			<view class="totalP text-right">￥{{orderInfo.amount}}</view>
		</view>
		<!-- 待支付菜肴列表 -->
		<view class="orderCard" v-else>
			<scroll-view scroll-x class="nav dateCard" scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" :class="index==TabCur?'cur':''" v-for="(item,index) in orderInfo.productList" :key="index"
				 @tap="tabSelect" :data-id="index">
					{{item.dateValue | mealDate}}<text class="week">{{item.dateValue | filtersWeek}}</text>
				</view>
			</scroll-view>
			<view v-for="(item,index) in orderInfo.productList" :key="index" v-if="TabCur == index">
				<block v-for="(rep,repIndex) in item.serviceTypeViews" :key="repIndex">
					<!-- 餐次item start -->
					<view class="repastName">- {{rep.serviceTypeName}} -</view>
					<view class="menuList flex justify-between align-center" v-for="(meal,idx) in rep.productDtDetails" :key="idx">
						<view class="name">{{meal.productName}}</view>
						<view class="R flex justify-between align-center">
							<view class="c-4a">×{{meal.count}}</view>
							<view class="c-ff4">￥{{meal.price}}</view>
						</view>
					</view>
					<!-- 餐次item end -->
				</block>
				<view class="flex align-center justify-end">
					<view class="f14 c-2a">当日小结</view>
					<view class="currDayPrice">￥{{item.amount}}</view>
				</view>
			</view>
			<view class="totalPrice">￥{{orderInfo.amount}}</view>
		</view>
		<!-- 配送信息 -->
		<view class="orderCard">
			<view class="topBox">
				<image src="../../static/image/icon4.png" class="img"></image>配送信息
			</view>
			<view class="c-2a f15 lh24">{{orderInfo.district}}{{orderInfo.firstAddress}}{{orderInfo.secondAddress}}{{orderInfo.addRemark}}</view>
			<view class="f14 c-6a">{{orderInfo.contacts}} {{orderInfo.phone}}</view>
		</view>
		<view class="orderCard">
			<view class="topBox">
				<image src="../../static/image/icon5.png" class="img"></image>其他信息
			</view>
			<view class="flex align-center pb8">
				<view class="c-2a w68">订单号</view>
				<view class="c-4a">{{orderInfo.orderId}}</view>
			</view>
			<view class="flex align-center pb8">
				<view class="c-2a w68">支付方式</view>
				<view class="c-4a">{{orderInfo.payTypeName}}</view>
			</view>
			<view class="flex align-center pb8">
				<view class="c-2a w68">下单时间</view>
				<view class="c-4a">{{orderInfo.orderTime | filterDate}}</view>
			</view>
			<view class="flex align-start" v-if="orderInfo.remark">
				<view class="c-2a w68">订单备注</view>
				<view class="c-4a flex1">{{orderInfo.remark}}</view>
			</view>
		</view>
		<!-- 支付方式 -->
		<paymentList :payList="payList" :selectId="radio" :modalName="modalName" @reselectId="reselectId" @hideModal="hideModal"></paymentList>
		<!-- end -->
	</view>
</template>

<script>
	import {
		formatDate,
		getWeek
	} from '../../common/util.js'
	import paymentList from "../../components/paymentList.vue";
	export default {
		components: {
			paymentList
		},
		data() {
			return {
				orderId: '',
				state: '',
				orderInfo: {},
				TabCur: 0,
				scrollLeft: 0,

				timeData: '', //存放处理好的倒计时
				timer: '', //用来清除定时器
				modalName: null,
				radio: '',
				payList: [],
			};
		},
		onUnload() { //卸载页面清除定时器
			clearInterval(this.timer)
		},
		filters: {
			filterDate(time) {
				let _date = formatDate(new Date(time), 'yyyy-MM-dd hh:mm');
				return _date;
			},
			mealDate(time) {
				let _date = formatDate(new Date(time), 'MM/dd');
				return _date;
			},
			filtersWeek(time) {
				let _date = formatDate(new Date(time), 'yyyy-MM-dd');
				return getWeek(_date);
			},
		},
		onLoad(options) {
			this.orderId = options.orderId;
			let state = options.state;
			this.state = state;
			if (state == 0 || state == 4) {
				this.orderPayDetail()
			} else {
				this.orderDetail()
			}
		},
		methods: {
			// 订单未支付详情 
			orderPayDetail() {
				let that = this
				this.$Api.orderPayDetail({
					orderId: this.orderId
				}).then(res => {
					this.orderInfo = res.data;
					if (res.data.state == 0) {
						this.getTimeList()
						var timer = setInterval(function() {
							that.getTimeList()
						}, 1000)
						this.timer = timer
					}
				}, err => {})
			},
			// 订单已支付详情 
			orderDetail() {
				let that = this
				this.$Api.orderDetail({
					orderId: this.orderId
				}).then(res => {
					this.orderInfo = res.data;
					if (res.data.state == 0) {
						this.getTimeList()
						var timer = setInterval(function() {
							that.getTimeList()
						}, 1000)
						this.timer = timer
					}
				}, err => {})
			},
			/**
			 * 未支付订单倒计时
			 */
			getTimeList() {
				var nowdate = new Date().getTime() //获取当前时间毫秒数
				var time = formatDate(new Date(this.orderInfo.payTime)).replace(new RegExp("-", "gm"), "/")
				var enddate = new Date(time).getTime() //处理好格式之后获取结束时间的毫秒数
				let totaltime = enddate - nowdate //获取时间差
				this.totaltime(totaltime) //这是下面封装的方法，将毫秒数处理成"xx时xx分xx秒"
			},
			totaltime(a) { //计算单个剩余时间
				let totaltime = a
				let that = this
				var h, m, s, d

				function test(num) {
					if (num < 10) {
						num = "0" + num
					}
					return num
				}
				if (totaltime > 0) {
					d = Math.floor(totaltime / 1000 / 60 / 60 / 24) * 24
					h = Math.floor(totaltime / 1000 / 60 / 60 % 24)
					m = Math.floor(totaltime / 1000 / 60 % 60)
					s = Math.floor(totaltime / 1000 % 60)
					//获取时分秒
					h = d + h
					h = test(h)
					m = test(m)
					s = test(s)
					this.timeData = `${m}:${s}` // 每个时间的显示格式
				} else {
					//超时未支付的订单 取消订单
					this.cancleOrder(this.orderInfo.orderId)
				}
			},
			//获取支付方式
			getPayType(sid) {
				this.$Api.getPayType({
					storeId: sid
				}).then(res => {
					this.payList = res.data;
				}, err => {})
			},
			//弹起支付选择框
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target;
				let storeId = e.currentTarget.dataset.sid;
				let payId = e.currentTarget.dataset.pid;
				this.orderId = e.currentTarget.dataset.oid;
				this.radio = payId;
				this.getPayType(storeId);
			},
			hideModal(e) {
				this.modalName = e
			},
			//修改支付方式后点击确定按钮
			reselectId(id) {
				console.log(`父组件接收的支付方式id：${id}`)
				this.$Api.updOrderPayment({
					orderId: this.orderId,
					payment: id
				}).then(res => {
					console.log('修改支付方式')
					// 0-到付  1-记账  2-微信支付 3-支付宝 4-职工卡
					if (id == 0 || id == 1) { //支付成功
						if (this.state == 0 || this.state == 4) {
							this.orderPayDetail()
						} else {
							this.orderDetail()
						}
					} else if (id == 2 || id == 4) { //调支付接口
						this.againPay()
					}
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
						this.orderList();
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
							if (_this.state == 0 || _this.state == 4) {
								_this.orderPayDetail()
							} else {
								_this.orderDetail()
							}
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
			// 拨打电话
			phone(num) {
				uni.makePhoneCall({
					phoneNumber: num
				});
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			//申请退款确认框
			refundTap(id) {
				var _this = this;
				uni.showModal({
					content: '申请退款？',
					cancelText: '取消',
					confirmText: '确定',
					success: function(res) {
						if (res.confirm) {
							// 用户点击确定
							_this.refund(id)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//退费
			refund(id) {
				this.$Api.refund({
					subOrderId: id
				}).then(res => {
					if (this.state == 0 || this.state == 4) {
						this.orderPayDetail()
					} else {
						this.orderDetail()
					}
				}, err => {})
			},
			//取消订单确认框
			cancleOrderTap(id) {
				var _this = this;
				uni.showModal({
					content: '取消订单？',
					cancelText: '暂不取消',
					confirmText: '确定取消',
					success: function(res) {
						if (res.confirm) {
							// 用户点击确定
							_this.cancleOrder(id)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			/**
			 * 取消订单
			 */
			cancleOrder(id) {
				this.$Api.orderCancel({
					orderId: id
				}).then(res => {
					if (this.state == 0) {
						this.orderPayDetail()
					} else {
						this.orderDetail()
					}
				}, err => {})
			}
		}
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
</style>
