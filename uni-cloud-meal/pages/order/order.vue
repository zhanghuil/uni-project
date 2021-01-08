<template>
	<view>
		<!-- <view class="orderTop">
			<view class="L flex align-center">
				<image src="../../static/image/icon3.png"></image>
				2020年11月
			</view>
			<view class="R">
				<text>消费合计：</text>
				<text class="price">268.50</text>
			</view>
		</view> -->
		<view v-for="(itemTop,indexTop) in orderMonthAmountList" :key="indexTop" v-if="itemTop.OrderList&&itemTop.OrderList.length>0">
			<view class="orderTop">
				<view class="L flex align-center">
					<image src="../../static/image/icon3.png"></image>
					{{itemTop.mounth}}
				</view>
				<view class="R">
					<text>消费合计：</text>
					<text class="price">{{itemTop.amount}}</text>
				</view>
			</view>
			<view class="orderList">
				<view class="item" v-for="(item,index) in itemTop.OrderList" :key="index">
					<view class="shopInfo flex align-center" @tap="lookTap(item.orderId,item.subOrderId,item.state)">
						<view class="shopImgBox">
							<image :src="item.storeLogo?item.storeLogo:'../../static/image/default_store.png'" lazy-load="true" class="shopImg"></image>
						</view>
						<view class="flex1 ovh">
							<view class="flex justify-between">
								<view class="text-cut">{{item.storeName}}</view>
								<view class="phoneCon flex align-center" @tap.stop="phone(ittem.storePhone)" v-if="(item.state==1||item.state==2||item.state==3)&&!item.refundMark">
									<image class="pimg" mode="scaleToFill" src="../../static/image/meal/phone.png"></image>
								</view>
							</view>
							<view class="time">{{item.orderTime | filterDate}}</view>
						</view>
					</view>
					<view class="flex align-center justify-between hd">
						<view class="flex align-center" v-if="item.state != 0 && item.dateValue">
							<view class="tag">{{item.dateValue | mealDate}} {{item.dateValue | filtersWeek}}</view>
							<view class="tag">{{item.serviceTypeName}}</view>
						</view>
						<view></view>
						<view class="">￥{{item.amount}}</view>
					</view>
					<!-- 0-待支付  1-已下单  2-已支付  3-已退款  4-已取消 -->
					<!-- 待支付 -->
					<view class="orderBtnBox" v-if="item.state == 0">
						<view class="orderBtn" @tap="cancleOrderTap(item.orderId)">取消订单</view>
						<view class="orderBtn bg-cyan" @tap="showModal" data-target="bottomModal" :data-sid="item.storeId" :data-pid="item.payType"
						 :data-oid="item.orderId">待支付
							{{item.end_time1}}</view>
						<!-- <uni-countdown :show-day="false" :show-hour="false" :minute="10" :second="00" /> -->
					</view>
					<!-- 已支付 -->
					<view class="orderBtnBox" v-else-if="item.state == 2&&item.refundMark">
						<view class="orderBtn bg-cyan" @tap="refundTap(item.subOrderId)">申请退款</view>
					</view>
					<!-- 已取消、已退款 -->
					<view class="orderBtnBox2 flex justify-end" v-else-if="item.state == 3 || item.state == 4">
						<button class="cu-btn">{{item.state == 3 ? '已退款' : '已取消'}}</button>
					</view>
				</view>
			</view>
		</view>
		<view v-show="isLoadMore">
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
		<!-- 支付方式 -->
		<paymentList :payList="payList" :selectId="radio" :modalName="modalName" @reselectId="reselectId" @hideModal="hideModal"></paymentList>
		<!-- end -->
	</view>
</template>

<script>
	import {
		formatDate,
		getWeek,
		judgeTime,
		groupBy
	} from '../../common/util.js'
	import paymentList from "../../components/paymentList.vue";
	export default {
		components: {
			paymentList
		},
		data() {
			return {
				timeData: '', //存放每条数据的处理好的倒计时
				timer: '', //用来清除定时器
				modalName: null,
				radio: '',
				payList: [],
				orderMonthAmountList: [], //最近两个月统计
				orderId: '', //订单id
				lastOrderCode: '', //分页使用最后的订单id
				isLoadMore: false, //是否加载中
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
		onLoad() {
			// this.orderList();
			// this.getMonthAmount();
		},
		onShow() {
			this.firstLoad();
		},
		computed: {
			// showList:{
			// 	this.orderMonthAmount.forEach(n=>{

			// 	});
			// }
		},
		methods: {
			firstLoad() {
				this.orderMonthAmountList = [];
				this.isLoadMore = false;
				this.lastOrderCode = '';
				// this.orderList();
				this.getMonthAmount();
			},
			// 获取月消费合计
			getMonthAmount() {
				this.$Api.getMonthAmount().then(res => {
					//todo
					if (!res.data || res.data.length <= 0) return;

					res.data.forEach(n => {
						let orderMonthAmount = n;
						orderMonthAmount.OrderList = [];
						this.orderMonthAmountList.push(orderMonthAmount);
					})

					this.orderList(true);
				}, err => {})
			},
			//上拉触底函数
			onReachBottom() {

				if (!this.isLoadMore) { //此处判断，上锁，防止重复请求
					// this.isLoadMore = true
					// this.pageNo += 1
					this.orderList();
				}
			},
			/**
			 * 订单列表 
			 * state为0,4未支付详情传orderId；其余1,2,3已支付传 subOrderId
			 * 0-待支付  1-已下单  2-已支付  3-已退款  4-已取消
			 */
			orderList(isFirstLoad) {
				let that = this
				this.$Api.orderList({
					subOrderCode: this.lastOrderCode || ''
				}).then(res => {
					if (!res.data || res.data.length <= 0) {
						if (isFirstLoad) {
							that.orderMonthAmountList = [];
						}
						that.isLoadMore = true;
						return;
					}

					let orderListGroup = groupBy(res.data, (n) => {
						return n.month
					});

					for (let n in orderListGroup) {
						let orderMonthAmount = that.orderMonthAmountList.find(m => m.mounth == n.replace(/\"/g, ''));
						if (!orderMonthAmount) return true;

						orderMonthAmount.OrderList = [...orderMonthAmount.OrderList, ...orderListGroup[n]];
						// debugger
					}

					that.lastOrderCode = res.data.slice(-1)[0].subOrderCode;

					that.getTimeList()
					// console.log(that.orderMonthAmountList);
					var timer = setInterval(function() {
						that.getTimeList()
					}, 1000)
					that.timer = timer


				}, err => {})
			},
			/**
			 * 未支付订单倒计时
			 */
			getTimeList() {
				let that = this
				that.orderMonthAmountList.forEach(n => {
					n.OrderList.forEach((item) => {
						let state = item.state;
						if (state == 0) { //未支付
							// debugger
							var dtNow = new Date();
							var nowdate = dtNow.getTime() //获取当前时间毫秒数
							var time = formatDate(new Date(item.payTime)).replace(new RegExp("-", "gm"), "/")

							// console.log({'dtNow':dtNow,'time':time});
							var enddate = new Date(time).getTime() //处理好格式之后获取结束时间的毫秒数

							var totaltime = enddate - nowdate //获取时间差
							// if(totaltime>600000) totaltime=600000;
							that.totaltime(totaltime, item.orderId) //这是下面封装的方法，将毫秒数处理成"xx时xx分xx秒"
							item.end_time1 = that.timeData //处理好的单个时间安排到item上（重要）
						}
					})
				})

			},
			totaltime(a, id) { //计算单个剩余时间
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
					// if(totaltime>600000) totaltime=600000;
					// console.log({'totaltime':totaltime})
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
					this.cancleOrder(id)
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
				uni.hideTabBar()
				this.modalName = e.currentTarget.dataset.target;
				let storeId = e.currentTarget.dataset.sid;
				let payId = e.currentTarget.dataset.pid;
				this.orderId = e.currentTarget.dataset.oid;
				this.radio = payId;
				this.getPayType(storeId);
			},
			hideModal(e) {
				this.modalName = e
				uni.showTabBar()
			},
			//修改支付方式后点击确定按钮
			reselectId(id) {
				console.log(`父组件接收的支付方式id：${id}`)
				this.$Api.updOrderPayment({
					orderId: this.orderId,
					payment: id
				}).then(res => {
					console.log('修改支付方式')
					if (id == 0 || id == 1) { //支付成功
						this.firstLoad();
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
						this.firstLoad();
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
							_this.firstLoad();
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
			/**
			 * @param {Object} id（0,4 未支付详情传orderId）
			 * @param {Object} orderId（1,2,3 都是已支付传subOrderId）
			 * @param {Object} state 订单状态
			 */
			lookTap(id, orderId, state) {
				// let _orderId = null;
				// if (state == 0 || state == 4) {
				// 	_orderId = id
				// } else {
				// 	_orderId = orderId
				// }
				uni.navigateTo({
					url: `./orderDetail?orderId=${id}&state=${state}&subOrderId=${orderId}`
				})
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
					this.firstLoad();
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
					this.firstLoad();
					// this.orderList(true);
				}, err => {})
			}
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
			margin-bottom: 32rpx;

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
