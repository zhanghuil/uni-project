<template>
	<view class="container">
		<!-- 轮播图 -->
		<view class="banner">
			<swiper class="bannerswipers" :autoplay="autoplay" :current="currentSwiper" @change="swiperChange">
				<block v-for="item in imgs" :key="item">
					<swiper-item>
						<image :src="item.url"></image>
					</swiper-item>
				</block>
			</swiper>
			<!--重置小圆点的样式  -->
			<view class='bannerNum'>{{(currentSwiper+1)}}/{{imgs.length}}</view>
		</view>
		<!-- 门店列表 -->
		<view class="storeBox">
			<view class="storeTab flex text-left">
				<view class="cu-item flex-sub" :class="0==TabCur?'cur':''" @tap="tabSelect" data-id="0">
					全部门店
				</view>
				<view class="cu-item flex-sub" :class="1==TabCur?'cur':''" @tap="tabSelect" data-id="1">
					经常光顾
				</view>
				<view class="cu-item flex-sub" :class="2==TabCur?'cur':''" @tap="tabSelect" data-id="2">
					门店位置<text class="icon cuIcon-unfold"></text>
				</view>
			</view>
			<!-- 门店列表 -->
			<view class="storeList">
				<view class="storeItem" @click="homeTap">
					<view>
						<image class="item_img" src="../../static/image/default_store.png" mode=""></image>
					</view>
					<view class="content">
						<view class="text-cut">尔美餐厅</view>
						<view class="text-loca flex">
							<image class="icon_img" src="../../static/image/icon0.png"></image>浦东院区<image class="icon_img icon_img1" src="../../static/image/icon1.png"></image>月售&nbsp;51
						</view>
						<view class="itemFoot">
							<view class="desc">
								<text class="iconfont icon-yinhao"></text>正宗川菜，值得光临
								<text class="iconfont icon-quote-right"></text>
							</view>
						</view>
					</view>
				</view>
				<!-- item -->
				<view class="text-center lookAllBox">
					<text class="lookAllStore">查看全部门店</text>
				</view>
			</view>
		</view>
		<view class="block10"></view>
		<!-- 营养科普 -->
		<view class="articleTitle">营养科普</view>
		<scroll-view scroll-x class="bg-white nav articleNav" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item" :class="index==TabACur?'cur':''" v-for="(item,index) in articleItem" :key="index" @tap="tabArticle"
			 :data-id="index">
				{{item}}
			</view>
		</scroll-view>
		<view class="articleList">
			<view class="articleItem">
				<view class="L">
					<view class="tit white_space_line_2">文章标题文章标题文章标题文章标题文章标题文章标题文章标题文章标题文章标题文章标题文章标题文章标题</view>
					<view class="flex mt20"><image src="../../static/image/icon2.png" mode=""></image>作者信息</view>
				</view>
				<view class="R">
					<image class="img" src="../../static/image/default_store.png"></image>
				</view>
			</view>
			<!-- 加载更多 -->
			<view class="loadMore">
					<text class="icon cuIcon-loading2 cuIconfont-spin"></text>更多文章载入中</button>
			</view>
		</view>
		<!-- end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgs: [{
					url: 'http://demo.sc.chinaz.com/Files/DownLoad/webjs1/201801/jiaoben5647/img/1.jpg'
				}],
				currentSwiper: 0,
				autoplay: true,
				TabCur: 0,
				articleItem: ['高血糖', '心脑血管', '肿瘤', '术后康复', '孕妇', '冠心病', '脂肪肝'],
				TabACur: 0,
				scrollLeft: 0

			}
		},
		created() {
			uni.setNavigationBarTitle({
				title: '云订餐'
			})
		},
		methods: {
			homeTap(){
				uni.navigateTo({
					url: '../home/home'
				})
			},
			swiperChange: function(e) {
				this.currentSwiper = e.detail.current
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
			},
			tabArticle(e) {
				this.TabACur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.banner {
		height: auto;
		position: relative;
	}

	.bannerswipers {
		width: 100%;
		height: 240rpx;
	}

	.bannerswipers image {
		width: 100%;
		height: 100%;
		display: block;
	}

	/*用来包裹所有的小圆点  */

	.bannerdots {
		width: 750rpx;
		height: 36rpx;
		display: flex;
		flex-direction: row;
		position: absolute;
		left: 0;
		bottom: 20rpx;
	}

	/*未选中时的小圆点样式 */

	.bannerdot {
		width: 16rpx;
		height: 16rpx;
		margin-right: 26rpx;
		background-color: yellow;
		border-radius: 16rpx;
	}

	/*选中以后的小圆点样式  */

	.banneractive {
		width: 32rpx;
		height: 16rpx;
		background-color: coral;
	}

	.flex {
		display: -webkit-box;
		display: -moz-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		display: box;
		flex-wrap: wrap;
	}

	.alignC {
		/*元素居中*/
		align-items: center;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-moz-align-items: center;
		-ms-align-items: center;
		-o-align-items: center;
	}

	.flexC {
		-webkit-box-pack: center;
		justify-content: center;
		-webkit-justify-content: center;
		-moz-justify-content: center;
		-ms-justify-content: center;
		-o-justify-content: center;
	}

	/* 改写点点为数字 */

	.bannerNum {
		width: 68rpx;
		text-align: center;
		position: absolute;
		right: 28rpx;
		bottom: 16rpx;
		border-radius: 20rpx;
		padding: 8rpx 9rpx;
		background-color: rgba(0, 0, 0, 0.3);
		color: #fff;
		font-size: 20rpx;
	}

	.storeTab {

		padding: 48rpx 28rpx;

		.cu-item {
			font-size: 30rpx;
			color: #4A4A4A;
			align-items: center;

			&:nth-child(2) {
				padding-left: 46rpx;
			}

			&:last-child {
				text-align: right;
			}

			&.cur {
				color: #4EC09B;
				font-family: PingFangSC-Semibold;

				.icon {
					color: #4EC09B;
				}
			}

			.icon {
				color: #4A4A4A;
				font-size: 32rpx;
				margin: 8rpx;
			}
		}
	}

	.storeItem {
		display: flex;
		padding: 0 28rpx 32rpx 28rpx;

		.item_img {
			width: 160rpx;
			height: 160rpx;
			border-radius: 10rpx;
			margin-right: 24rpx;
		}

		.content {
			position: relative;
			flex: 1;
		}

		.text-loca {
			align-items: center;
			font-size: 24rpx;
			color: #6A6A6A;

			.icon_img {
				width: 24rpx;
				height: 24rpx;
				margin: 4rpx 4rpx 0 0;
			}

			.icon_img1 {
				margin-left: 24rpx;
			}
		}

		.text-cut {
			font-size: 32rpx;
			color: #2A2A2A;
			padding-bottom: 6rpx;
		}

		.itemFoot {
			position: absolute;
			bottom: 6rpx;

			.desc {
				.iconfont {
					margin: 0 10rpx;
					font-size: 28rpx;
				}

				font-family: PingFangSC-Regular;
				background: #FFEFD6;
				border-radius: 4rpx;
				font-size: 24rpx;
				color: #FDA130;
				padding: 6rpx 4rpx;
			}
		}

	}

	.lookAllBox {
		margin: 20rpx 0 60rpx;

		.lookAllStore {
			background: #F4F4F4;
			border-radius: 30rpx;
			font-size: 24rpx;
			color: #6A6A6A;
			padding: 18rpx 40rpx;
		}
	}

	.articleTitle {
		font-size: 32rpx;
		color: #2A2A2A;
		padding: 48rpx 28rpx 16rpx;
	}

	.articleNav {
		.cu-item {
			height: 82rpx;
			line-height: 82rpx;
			font-size: 30rpx;
			color: #6A6A6A;

			&.cur {
				color: #4EC09B;
				border-bottom: none;
				position: relative;

				&::after {
					position: absolute;
					bottom: 0;
					left: 50%;
					margin-left: -15rpx;
					content: '';
					width: 30rpx;
					height: 8rpx;
					background: #4EC09B;
					border-radius: 5rpx;
				}
			}
		}
	}

	.articleList {
		padding-bottom: 50rpx;

		.articleItem {
			display: flex;
			justify-content: space-between;
			padding: 46rpx 32rpx 0 28rpx;

			.L {
				font-size: 24rpx;
				color: #AAAAAA;
				image{
					width: 32rpx;
					height: 32rpx;
					margin-right: 4rpx;
				}
				.tit {
					font-family: PingFangSC-Medium;
					font-size: 30rpx;
					color: #2A2A2A;
					line-height: 44rpx;
				}
			}

			.R {
				margin-left: 20rpx;
				width: 228rpx;
				height: 160rpx;
				border-radius: 18rpx;
				background: #F8F8F8;

				.img {
					width: 228rpx;
					height: 160rpx;
				}
			}
		}
	}
	.loadMore{
		padding: 50rpx 0 10rpx;
		font-size: 24rpx;
		color: #AAAAAA;
		display: flex;
		align-items: center;
		justify-content: center;
		.icon{
			font-size: 36rpx;
			color: #AAAAAA;
			margin-right: 10rpx;
		}
	}
</style>
