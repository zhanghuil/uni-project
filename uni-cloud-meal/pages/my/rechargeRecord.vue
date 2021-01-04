<template>
	<view>
		<view class="list">
			<view class="item" v-for="(item,index) in rechargeList" :key="index">
				<view>
					<view>{{item.rechargeTime | filterDate}}</view>
					<view class="time">{{item.rechargeTime | filterDateTime}}</view>
				</view>
				<view>
					<view class="price text-right">￥{{item.rechargeMoney}}</view>
					<view class="tip" v-if="item.state == 2">充值失败</view>
					<view class="tip" v-else-if="item.state == 3">充值作废</view>
				</view>
			</view>
		</view>
		<view v-show="isLoadMore&&totalPage>1">
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import {
		formatDate
	} from '../../common/util.js'
	export default {
		data() {
			return {
				totalPage: 0, //总页码
				pageNo: 1, //当前页码
				pageSize: 10, //每页显示多少条数据
				rechargeList: [],
				loadStatus: 'loading', //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore: false, //是否加载中
			};
		},
		onLoad() {
			this.getRechargeRecordAll()
		},
		onReachBottom() { //上拉触底函数
			if (!this.isLoadMore) { //此处判断，上锁，防止重复请求
				// this.isLoadMore = true
				this.pageNo += 1
				this.getRechargeRecordAll()
			}
		},
		filters: {
			filterDate(time) {
				let _date = formatDate(new Date(time), 'yyyy-MM-dd')
				return _date
			},
			filterDateTime(time) {
				let _date = formatDate(new Date(time), 'hh:mm')
				return _date
			},
		},
		methods: {
			getRechargeRecordAll() {
				this.$Api.rechargeRecord({
					pageSize: this.pageSize,
					pageIndex: this.pageNo
				}).then(res => {
					if (res.data.data) {
						this.rechargeList = this.rechargeList.concat(res.data.data);
						this.totalPage = res.data.totalPage;
						if (res.data.data.length < this.pageSize) { //判断接口返回数据量小于请求数据量，则表示此为最后一页
							this.isLoadMore = true
							this.loadStatus = 'nomore'
						} else {
							this.isLoadMore = false
						}
					} else {
						this.isLoadMore = true
						this.loadStatus = 'nomore'
					}
				}, err => {
					console.log(err.statusCode)
					uni.showToast({
						title: '服务器开小差了呢，请您稍后再试',
						icon: 'none'
					})
					this.isLoadMore = false
					if (this.pageNo > 1) {
						this.pageNo -= 1
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.uni-load-more__text.data-v-5f6e5104 {
		font-size: 24rpx !important;
	}

	.list {
		padding: 0 28rpx;

		.item {
			padding: 28rpx 0;
			font-size: 30rpx;
			color: #2A2A2A;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #F4F4F4;
			;

			.time {
				font-size: 28rpx;
				color: #6A6A6A;
				padding-top: 8rpx;
			}

			.price {
				font-size: 40rpx;
				color: #2A2A2A;
			}

			.tip {
				font-size: 24rpx;
				color: #FF4D23;
				padding-left: 10rpx;
			}
		}
	}
</style>
