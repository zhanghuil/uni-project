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
						<view class="notice flex align-start">
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
		
		<!-- 菜谱列表 end -->
		<!-- end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
				}]
			};
		},
		methods: {
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			mealTimeSelect(e) {
				this.mealTimesCur = e.currentTarget.dataset.id;
				this.scrollMLeft = (e.currentTarget.dataset.id - 1) * 60
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
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
					// margin-top: 4rpx;
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
</style>
