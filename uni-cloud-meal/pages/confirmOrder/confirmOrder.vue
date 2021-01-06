<template>
	<view>
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
			<view class="cardItem" @tap="addNotes" v-if="isRemarkObj.enabledOrderRemark">
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
					<view class="cu-item" :class="index==TabCur?'cur':''" v-for="(item,index) in orderMenulist" :key="index" @tap="tabSelect"
					 :data-id="index">
						{{item.orderDate.replace(/\"/g,'') | mealDate}}<text class="week">{{item.orderDate.replace(/\"/g,'') | filtersWeek}}</text>
					</view>
				</scroll-view>
				<view v-for="(item,index) in orderMenulist" :key="index" v-if="TabCur == index">
					<block v-for="(rep,repIndex) in item.repeatList" :key="repIndex">
						<!-- 餐次item start -->
						<view class="repastName">- {{rep.repastName.replace(/\"/g,'')}} -</view>
						<view class="menuList flex justify-between align-center" v-for="(meal,idx) in rep.menuList" :key="idx">
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
						<view class="currDayPrice">￥{{item.currDayAmount}}</view>
					</view>
				</view>
				<view class="totalPrice">￥{{totalPrice}}</view>
			</view>
			<view class="footer">
				<view class="flex align-center">
					<text>需支付</text>
					<text class="price">￥{{totalPrice}}</text>
				</view>
				<button class="cu-btn round bg-grey" :class="disabled?'':'bg-cyan'" :disabled="disabled" @tap="submitOrder">提交订单</button>
			</view>
			<!-- 支付方式 -->
			<paymentList :payList="payList" :selectId="radio" :modalName="modalName" @reselectId="reselectId" @hideModal="hideModal"></paymentList>
			<!-- end -->
		</view>
	</view>
</template>

<script>
	import {
		showToast,
		formatDate,
		getWeek,
		groupBy
	} from '../../common/util.js'
	import paymentList from "../../components/paymentList.vue";
	export default {
		components: {
			paymentList
		},
		data() {
			return {
				disabled: false,
				TabCur: 0,
				scrollLeft: 0,
				orderMenulist: [], //订单菜谱menuList
				totalPrice: 0, // 订单总价
				orderNote: '', //订单备注
				modalName: null,
				radio: '', //默认支付方式value
				payName: '', //支付方式的name
				payList: [], // 支付方式列表
				storeId: '', //门店id
				districtId: '', //地址id
				districtName: '', //name
				firstAddressId: '',
				firstAddressName: '',
				secondAddressId: '',
				secondAddressName: '',
				addRemark: '', // 详细地址
				addressStr: '', //地址串
				phone: '', //手机号
				userName: '', //联系人
				isRemarkObj: {}, //门店是否启用订单备注、详细地址
			};
		},
		filters: {
			mealDate(time) {
				let _date = formatDate(new Date(time), 'MM/dd');
				return _date;
			},
			filtersWeek(time) {
				let _date = formatDate(new Date(time), 'yyyy-MM-dd');
				return getWeek(_date);
			},
		},
		onShow() {
			this.orderNote = this.$store.state.orderNotes
			let _distributionInfo = this.$store.state.distributionInfo;
			console.log(`配送信息：${_distributionInfo}`)
			if (!_distributionInfo) {
				this.lastAddress()
			} else {
				let info = JSON.parse(_distributionInfo);
				this.addressStr = info.orderAddressStr;

				this.districtId = info.districtId;
				this.districtName = info.districtName;
				this.firstAddressId = info.firstAddressId;
				this.firstAddressName = info.firstAddressName;
				this.secondAddressId = info.secondAddressId;
				this.secondAddressName = info.secondAddressName;
				this.addRemark = info.addRemark;
				this.userName = info.name;
				this.phone = info.phone;
			}
		},
		onLoad(options) {
			this.storeId = options.storeId;
			this.getPayType()
			this.isRemark()
			let orderMenulist = this.getSubmitData()
			this.orderMenulist = orderMenulist
			console.log('提交订单菜谱列表↓↓↓↓↓↓')
			console.log(orderMenulist)
		},
		methods: {
			//提交订单后的菜谱数据
			getSubmitData() {
				// debugger
				var submitData = [];
				let menuList = this.$store.state.orderMenuList;
				menuList = menuList.filter(item => item.count > 0)
				var total = 0;
				menuList.forEach(function(a) {
					total += a.count * a.price;
				});
				this.totalPrice = total;
				let orderDayModeGroup = groupBy(menuList, (food) => {
					return food.orderDay
				})
				for (let orderDay in orderDayModeGroup) {
					let module = {
						orderDate: orderDay,
						currDayAmount: '', //当日小结
						repeatList: [] //餐
					}
					// debugger
					var curTotal = 0;
					orderDayModeGroup[orderDay].forEach(function(a) {
						curTotal += a.count * a.price;
					});
					module.currDayAmount = curTotal;
					let repastIdGroup = groupBy(orderDayModeGroup[orderDay], (food) => {
						return food.repastName
					})
					// debugger
					for (let index in repastIdGroup) {
						let repeat = {
							repastName: index,
							menuList: repastIdGroup[index]
						}
						module.repeatList.push(repeat)
						//repastIdGroup[index]
					}
					// debugger
					submitData.push(module)
				}
				return submitData
			},
			// 门店是否启用订单备注、手写地址
			isRemark() {
				this.$Api.isRemark({
					storeId: this.storeId
				}).then(res => {
					this.isRemarkObj = res.data
					this.$store.commit('setIsRemark', res.data)
				}, err => {})
			},
			//获取历史配送地址
			lastAddress() {
				this.$Api.lastAddress().then(res => {
					let data = res.data
					if (data) {
						this.addressStr = data.district + data.firstAddressName + data.secondAddressName + data.addRemark;

						this.districtId = data.districtId;
						this.districtName = data.district;
						this.firstAddressId = data.firstAddressId;
						this.firstAddressName = data.firstAddressName;
						this.secondAddressId = data.secondAddressId;
						this.secondAddressName = data.secondAddressName;
						this.addRemark = data.addRemark;
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
					let data = res.data;
					this.payList = data;
					this.radio = data[0].payType;
				}, err => {})
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			//跳转配送信息
			distriInfo() {
				uni.navigateTo({
					url: './distributionInfo?storeId=' + this.storeId
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
				this.radio = id;
				this.payName = this.payList.find(item => {
					return item.payType == id
				}).payName
			},
			// 提交订单
			submitOrder() {
				if (!this.addressStr) {
					showToast('请完善配送地址')
					return
				} else if (!this.payName) {
					showToast('请选择支付方式')
					return
				}
				this.disabled = true
				let _orderList = this.$store.state.orderMenuList.map((item, index) => {
					let {
						productId, //商品ID
						productName, //商品名称
						orderDay, //商品日期
						categoryId, //品类
						serviceTypeId, //餐别
						count,
						price
					} = item;
					return {
						productId,
						productName,
						orderDay,
						categoryId,
						serviceTypeId,
						count,
						price
					};
				})
				let params = {
					storeId: this.storeId,
					payType: this.radio,
					districtId: this.districtId,
					districtName: this.districtName,
					firstAddressId: this.firstAddressId,
					firstAddressName: this.firstAddressName,
					secondAddressId: this.secondAddressId,
					secondAddressName: this.secondAddressName,
					addRemark: this.addRemark, //自定义地址
					remark: this.orderNote, //订单备注
					contacts: this.userName,
					phone: this.phone,
					orderList: _orderList
				}
				console.log(JSON.stringify(params))
				// return
				this.$Api.orderSubmit(params).then(res => {
					let data = res.data;
					if (data) {
						if (this.radio == 2 || this.radio == 4) {
							this.orderPay(data.orderId);
						} else {
							uni.redirectTo({
								url: `../tips/tips?payType=${this.radio}`
							})
						}
					}
				}, err => {
					showToast(err.data.message)
					this.disabled = false
				})
			},
			/**订单支付
			 * @param {Object} orderId
			 * 到付-0  记账-1  微信支付-2  支付宝-3  职工卡-4
			 */
			orderPay(orderId) {
				this.$Api.orderPay({
					orderId: orderId
				}).then(res => {
					// #ifdef MP-WEIXIN
					if (res.data.paymentType == 4) {
						//职工卡支付成功
						uni.redirectTo({
							url: `../tips/tips?payType=4`
						})
					} else if (res.data.paymentType == 2) {
						//微信支付
						this.wechatPay(res.data, orderId)
					} else {
						uni.redirectTo({
							url: `../tips/tips?payType=${this.radio}&orderId=${orderId}&storeId=${this.storeId}`
						})
					}
					// #endif
				}, err => {})
			},
			//微信支付
			wechatPay(info, orderId) {
				var _this = this;
				wx.requestPayment({ //调起支付
					timeStamp: info.timeStamp,
					nonceStr: info.nonceStr,
					package: info.package,
					signType: 'MD5',
					paySign: info.paySign,
					success(res) {
						console.log(res);
						uni.redirectTo({
							url: `../tips/tips?payType=2`
						})
						// errMsg: "requestPayment:ok"
						// if (res.errMsg == 'requestPayment:ok') {
						// 	uni.redirectTo({
						// 		url: `../tips/tips?payType=2`
						// 	})
						// } else {
						// 	uni.redirectTo({
						// 		url: `../tips/tips?payType=2&orderId=${orderId}&storeId=${_this.storeId}`
						// 	})
						// }
					},
					fail(res) {
						// console.log(res)
						uni.redirectTo({
							url: `../tips/tips?payType=2&orderId=${orderId}&storeId=${_this.storeId}`
						})
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
	page {
		background: #FAFAFA;
	}

	.confirmOrderBox {
		padding: 28rpx 28rpx 108rpx;

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
