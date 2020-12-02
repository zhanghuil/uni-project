<template>
	<view>
		<image src="../../static/image/meal/timg.jpg" mode="center" class="response"></image>
		<view class="topWrapper">
			<view class="homeTop">
				<view class="flex align-center">
					<view class="logoImg">
						<image class="img"></image>
					</view>
					<view class="R">
						<view class="flex justify-between">
							<view class="text-cut">Noodle’s Truth面有道</view>
							<view class="phoneCon flex align-center">
								<image class="pimg" mode="scaleToFill" src="../../static/image/meal/phone.png"></image>
							</view>
						</view>
						<view class="notice flex align-start" @click="showModal" data-target="shopNoticeModal">
							<view>
								<image class="nimg" mode="scaleToFill" src="../../static/image/meal/notice.png"></image>
							</view>
							<text>早餐 00:00～7:00，午餐10:30～12:00，晚餐17:00～20:00</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 切换日期 -->
		<scroll-view scroll-x class="nav dateCard" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item" :class="index==TabCur?'cur':''" v-for="(item,index) in dateList" :key="index" @tap="tabSelect"
			 :data-id="index">
				{{item.orderDate}}<text class="week">周一</text>
			</view>
		</scroll-view>
		<!-- 餐次 -->
		<scroll-view scroll-x class="nav mealTimes" scroll-with-animation :scroll-left="scrollMLeft">
			<view class="cu-item" :class="index==mealTimesCur?'cur':''" v-for="(item,index) in mealTimesList" :key="index" @tap="mealTimeSelect"
			 :data-id="index">
				{{item.name}}
			</view>
		</scroll-view>
		<!-- 菜谱列表  start-->
		<view class="verticalBox" v-if="menuDate.length > 0">
			<!-- 左侧列表 -->
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop">
				<view class="cu-item" :class="index==currentLeft?'cur':''" v-for="(item,index) in leftText" :key="index" @tap="leftTap"
				 :data-index='index'>
					{{item.title}}
				</view>
			</scroll-view>
			<!-- 右侧列表 -->
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation :scroll-into-view="'main-'+mainCur" @scroll="verticalMain"
			 :scroll-top="scrollTop">
				<view class="padding-lr mainMeal" v-for="(item,index) in rightData" :key="index" :id="'main-'+index">
					<view class="title">{{item.title}}</view>
					<view class="menuList">
						<view class="item" v-for="(meal,idx) in item.content" :key="idx" @click="showModal" data-target="DrawerModalR">
							<view class="panel_left">
								<image src="../../static/image/meal/default.png" lazy-load="true"></image>
								<text class="tag">建议少食</text>
							</view>
							<view class="panel_right">
								<view class="mealName white_space_line_2">{{meal.title}}</view>
								<view class="desc">
									<!-- <view class="flex align-center"><image class="tipImg" src="../../static/image/meal/tip.png"></image>已售罄</view> -->
									<view>还剩10份</view>
								</view>
								<view class="mealCon">
									<view class="flex justify-between align-center">
										<view class="price">¥<text class="f18">19</text></view>
										<view class="cartcontrol-wrapper">
											<!-- 已售罄 -->
											<view class="cart-add soldOut">
												<text class="iconfont icon-jia"></text>
											</view>
											<!-- 在售 -->
											<view class="cart-decrease">
												<text class="iconfont icon-jianshao"></text>
											</view>
											<view class="cart-count">1</view>
											<view class="cart-add" @click.stop="addCart">
												<text class="iconfont icon-jia"></text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- end -->
		</view>
		<!-- 菜谱列表 end -->
		<!-- 购物车 -->
		<view class="shopcart justify-between" v-if="menuDate.length > 0">
			<view class="flex align-center">
				<view class="carCon">
					<image src="../../static/image/meal/car.png" mode="" class="carImg"></image>
					<view class="cu-tag badge">3</view>
				</view>
				<view class="price">¥54</view>
			</view>
			<view>
				<button class="cu-btn bg-gray bg-cyan round">去结算</button>
			</view>
		</view>
		<!-- 今日歇业 -->
		<view class="blankContent" v-if="menuDate.length == 0">
			<image class="img" src="../../static/image/meal/blank.png"></image>
			<view>今日歇业<br />
				暂不对外营业</view>
		</view>
		<!-- 店铺公告 -->
		<view class="cu-modal bottom-modal" :class="modalName=='shopNoticeModal'?'show':''">
			<view class="cu-dialog shopNoticeDialog">
				<view class="top" @tap="hideModal">
					<view class="txt text-cut">水秀餐厅（长逸路15号院区B区西边B区西</view>
					<view class="cuIcon-close"></view>
				</view>
				<view class="content">
					<view class="flex align-center">
						<image class="nImg" src="../../static/image/meal/notice.png"></image>店铺公告
					</view>
					<scroll-view scroll-y="true" class="txt">
						公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容。公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公容
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- 菜肴详情 -->
		<view class="foodDescDiv" :class="foodClass" v-show="food_detail_mask">
			<scroll-view scroll-y="true" class="foodDescScroll">
				我是菜肴详情
			</scroll-view>
		</view>
		<view class="cu-modal drawer-modal justify-end" :class="modalName=='DrawerModalR'?'show':''" @tap="hideModal">
			<view class="cu-dialog basis-lg" @tap.stop="" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
				<view class="cu-list menu text-left">
					<view class="cu-item arrow" v-for="(item,index) in 5" :key="index">
						<view class="content">
							<view>Item {{index +1}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				TabCur: 0,
				scrollLeft: 0,
				dateList: [{
						orderDate: '11/27'
					},
					{
						orderDate: '11/28'
					},
					{
						orderDate: '11/29'
					},
					{
						orderDate: '11/30'
					},
					{
						orderDate: '12/01'
					},
					{
						orderDate: '12/02'
					}
				],
				mealTimesCur: 0,
				scrollMLeft: 0,
				mealTimesList: [{
					id: 1,
					name: '早餐'
				}, {
					id: 2,
					name: '午餐'
				}, {
					id: 3,
					name: '晚餐'
				}],
				menuDate: [1.2],
				currentLeft: 0, //左侧选中的下标
				mainCur: 0,
				verticalNavTop: 0,

				heightArr: [], //右侧分类的高度累加数组
				distance: 0, //记录scroll-view滚动过程中距离顶部的高度

				scrollTop: 0, //到顶部的距离
				leftText: [{
						id: 1,
						title: '选项一'
					},
					{
						id: 2,
						title: '选项二选项二'
					},
					{
						id: 3,
						title: '选项三'
					},
					{
						id: 4,
						title: '选项四'
					},
					{
						id: 5,
						title: '选项五'
					},
					{
						id: 6,
						title: '选项六'
					},
					{
						id: 7,
						title: '选项七'
					}
				],
				rightData: [{
						id: 1,
						title: '选项一',
						content: [{
								title: "清蒸鸡胸肉+新鲜时蔬炒莜面+海鲜蛤蜊蒸鸡蛋+紫菜蛋花汤"
							},
							{
								title: "产品二"
							},
							{
								title: "产品三"
							},
							{
								title: "产品四"
							},
						]
					},
					{
						id: 2,
						title: '选项二',
						content: [{
								title: "产品一"
							},
							{
								title: "产品二"
							},
							{
								title: "产品三"
							},
							{
								title: "产品四"
							},
						]
					},
					{
						id: 3,
						title: '选项三',
						content: [{
								title: "产品一"
							},
							{
								title: "产品二"
							},
							{
								title: "产品三"
							},
							{
								title: "产品四"
							},
						]
					},
					{
						id: 4,
						title: '选项四',
						content: [{
								title: "产品一"
							},
							{
								title: "产品二"
							},
							{
								title: "产品三"
							},
							{
								title: "产品四"
							},
						]
					},
					{
						id: 5,
						title: '选项五',
						content: [{
								title: "产品一"
							},
							{
								title: "产品二"
							},
							{
								title: "产品三"
							},
							{
								title: "产品四"
							},
						]
					},
					{
						id: 6,
						title: '选项六',
						content: [{
								title: "产品一"
							},
							{
								title: "产品二"
							},
							{
								title: "产品三"
							},
							{
								title: "产品四"
							},
						]
					},
					{
						id: 7,
						title: '选项七',
						content: [{
							title: "选项七产品一"
						}]
					}
				],
				food_detail_mask: false,
				foodClass: '',
			};
		},
		created() {
			this.selectHeight();
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			mealTimeSelect(e) {
				this.mealTimesCur = e.currentTarget.dataset.id;
				this.scrollMLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			// 菜谱
			leftTap(e) {
				let index = e.currentTarget.dataset.index;
				this.currentLeft = index;
				this.mainCur = index
				this.verticalNavTop = (index - 1) * 48
			},
			//计算右侧每一个分类的高度，在数据请求成功后请求即可
			selectHeight() {
				let that = this;
				this.heightArr = [];
				let h = 0;
				const query = uni.createSelectorQuery();
				query.selectAll('.mainMeal').boundingClientRect()
				query.exec(function(res) {
					res[0].forEach((item) => {
						h += item.height;
						that.heightArr.push(h);
					})
					console.log(that.heightArr);
				})
			},
			//监听scroll-view的滚动事件
			verticalMain(event) {
				if (this.heightArr.length == 0) {
					return;
				}
				let scrollTop = event.detail.scrollTop;
				let current = this.currentLeft;
				if (scrollTop >= this.distance) { //页面向上滑动
					//如果右侧当前可视区域最底部到顶部的距离 超过 当前列表选中项距顶部的高度（且没有下标越界），则更新左侧选中项
					if (current + 1 < this.heightArr.length && scrollTop >= this.heightArr[current]) {
						this.currentLeft = current + 1
						this.verticalNavTop = (current - 1) * 48
					}
				} else { //页面向下滑动
					//如果右侧当前可视区域最顶部到顶部的距离 小于 当前列表选中的项距顶部的高度，则更新左侧选中项
					if (current - 1 >= 0 && scrollTop < this.heightArr[current - 1]) {
						this.currentLeft = current - 1
						this.verticalNavTop = (current - 1) * 48
					}
				}
				// console.log(this.distance)
				//更新到顶部的距离
				this.distance = scrollTop;
			},
			//end

			addCart() {
				console.log('加入购物车')
			},
			lookFood() {
				this.food_detail_mask = true
				this.foodClass = 'foodEnter'
				// uni.navigateTo({
				// 	url: './food'
				// })
			},
		},

	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.response {
		filter: blur(4px);
		height: 160rpx;
	}

	.topWrapper {
		width: 100%;
		height: 96rpx;
		position: relative;
	}

	.homeTop {
		background: #FFFFFF;
		box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.05);
		border-radius: 12rpx;
		margin: 0 28rpx;
		padding: 32rpx;
		font-size: 36rpx;
		color: #2A2A2A;
		position: absolute;
		top: -95rpx;

		.logoImg {
			width: 120rpx;
			height: 120rpx;
			border-radius: 4rpx;
			background: #EFA720;

			.img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 4rpx;
			}
		}

		.R {
			width: calc(100% - 120rpx);
			padding-left: 24rpx;

			.phoneCon {
				position: relative;
				padding-left: 30rpx;

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
					width: 32rpx;
					height: 32rpx;
				}
			}

			.notice {
				padding-top: 18rpx;
				font-size: 22rpx;
				color: #6A6A6A;

				.nimg {
					margin-right: 8rpx;
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
	}

	.dateCard {
		padding: 30rpx 0 32rpx 18rpx;

		.cu-item {
			height: auto;
			line-height: normal;
			font-size: 26rpx;
			color: #4EC09B;
			border: 2rpx solid #4EC09B;
			border-radius: 8rpx;
			padding: 11rpx 20rpx;

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

	.mealTimes {
		padding-bottom: 32rpx;

		.cu-item {
			height: 62rpx;
			line-height: 62rpx;
			font-size: 32rpx;
			margin: 0 30rpx 0 10rpx;
			color: #5a5959;
			position: relative;

			&.cur {
				color: #000;
				border-bottom: none;
				position: relative;

				&::after {
					position: absolute;
					bottom: 0;
					left: 50%;
					margin-left: -20rpx;
					content: '';
					width: 40rpx;
					height: 6rpx;
					background: #4EC09B;
					border-radius: 3rpx;
				}
			}
		}
	}

	// 菜谱列表 578rpx
	.verticalBox {
		display: flex;
		height: calc(100vh - 160rpx - 96rpx - 120rpx - 62rpx - 32rpx - 108rpx);

		.VerticalNav.nav {
			width: 180rpx;
			height: calc(100vh - 578rpx);
			white-space: initial;
		}

		.VerticalNav.nav .cu-item {
			width: 100%;
			text-align: center;
			background-color: #FAFAFA;
			margin: 0;
			border: none;
			height: 96rpx;
			line-height: 96rpx;
			position: relative;
			font-size: 28rpx;
			color: #6A6A6A;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
			word-break: break-all;
		}

		.VerticalNav.nav .cu-item.cur {
			background-color: #FFFFFF;
			color: #2A2A2A;
		}

		.VerticalNav.nav .cu-item.cur::after {
			content: "";
			width: 10rpx;
			height: 32rpx;
			border-radius: 0;
			position: absolute;
			background: #4EC09B;
			top: 0;
			left: 0;
			bottom: 0;
			margin: auto;
		}

		.VerticalMain {
			flex: 1;
			height: calc(100vh - 578rpx);

			.title {
				font-size: 30rpx;
				color: #4A4A4A;
				padding: 26rpx 0;
			}

			.menuList {
				.item {
					display: flex;
					margin: 0 0 36rpx;
					position: relative;

					.panel_left {
						position: relative;

						image {
							width: 160rpx;
							height: 160rpx;
							border-radius: 8rpx;
						}

						.tag {
							position: absolute;
							left: 0;
							top: 0;
							background: linear-gradient(to right, #FFD444, #FFB023);
							font-size: 20rpx;
							color: #FFFFFF;
							padding: 2rpx 10rpx;
							border: 2rpx solid #FFFFFF;
							border-radius: 8rpx 0 16rpx 0;
						}
					}

					.panel_right {
						flex: 1;
						position: relative;
						padding-left: 24rpx;

						.mealName {
							font-size: 32rpx;
							color: #2A2A2A;
						}

						.desc {
							font-size: 20rpx;
							color: #6A6A6A;
							padding-top: 4rpx;

							.tipImg {
								width: 24rpx;
								height: 24rpx;
								margin-right: 4rpx;
							}
						}

						.mealCon {
							width: 100%;
							position: absolute;
							bottom: 0;
							left: 0;
							padding-left: 28rpx;

							.price {
								font-size: 24rpx;
								color: #FF4D23;

								.f18 {
									font-size: 36rpx;
								}
							}

							.cartcontrol-wrapper {
								display: flex;
								align-items: center;

								.iconfont {
									font-size: 48rpx;
									color: #4EC09B;
								}

								.soldOut {
									display: none;

									.iconfont {
										color: #D6D6D6;
									}
								}

								.cart-count {
									font-size: 32rpx;
									color: #4A4A4A;
									padding: 4rpx 16rpx 0;
								}
							}
						}
					}
				}
			}
		}
	}

	//购物车
	.shopcart {
		height: 108rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		padding: 0 28rpx;
		border-top: 2rpx solid #F2F2F2;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.carCon {
			position: relative;

			.carImg {
				width: 60rpx;
				height: 56rpx;
			}

			.cu-tag.badge:not([class*="bg-"]) {
				background: #FF4D23;
				font-size: 26rpx;
				padding: 10rpx 8rpx;
			}

			.cu-tag.badge {
				top: -2rpx;
				right: -14rpx;
			}
		}

		.price {
			font-size: 52rpx;
			color: #FF4D23;
			margin-left: 48rpx;
		}

		.cu-btn {
			font-size: 32rpx;
			height: 80rpx;
			padding: 0 56rpx;
			margin-top: -6rpx;
		}

		.bg-gray {
			background: #C0C0C0;
			color: #FFFFFF;
		}
	}

	.blankContent {
		text-align: center;
		font-size: 28rpx;
		color: #6A6A6A;
		line-height: 42rpx;

		.img {
			width: 320rpx;
			height: 320rpx;
		}
	}

	.cu-modal.bottom-modal .cu-dialog {
		background-color: #FFFFFF;
		border-radius: 24rpx 24rpx 0 0;
	}

	.shopNoticeDialog {
		padding: 40rpx 28rpx;

		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.txt {
				flex: 1;
				font-size: 36rpx;
				color: #2A2A2A;
			}

			.cuIcon-close {
				color: #C0C0C0;
				font-size: 40rpx;
				width: 36rpx;
				margin-left: 42rpx;
			}
		}

		.content {
			text-align: left;
			padding: 50rpx 0 10rpx;
			font-size: 28rpx;
			color: #2A2A2A;

			.nImg {
				width: 44rpx;
				height: 44rpx;
				margin-right: 12rpx;
			}

			.txt {
				height: 400rpx;
				padding: 30rpx 0 0;
				font-size: 26rpx;
				color: #4A4A4A;
				line-height: 40rpx;
			}
		}
	}

	/* 菜肴详情 */
	.foodDescDiv {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 48px;
		z-index: 51;
		width: 100%;
		height: 100%;
		background: #fff;
		transform: translate3d(100%, 0, 0);
		transition: all 0.2s linear;
	}

	.foodDescScroll {
		height: 100%;
	}

	.foodDescScroll .name {
		font-size: 40rpx;
	}

	.foodEnter {
		transform: translate3d(0, 0, 0);
	}
</style>
