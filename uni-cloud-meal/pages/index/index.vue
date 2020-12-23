<template>
	<view class="container">
		<!-- 轮播图 -->
		<view class="banner" v-if="imgs.length>0">
			<swiper class="bannerswipers" :autoplay="autoplay" :current="currentSwiper" @change="swiperChange">
				<block v-for="item in imgs" :key="item">
					<swiper-item>
						<image :src="item.coverImg" :data-url="item.skipLink" :data-type="item.skipLinkType" @tap="onClickSwiper"></image>
					</swiper-item>
				</block>
			</swiper>
			<!--重置小圆点的样式  -->
			<view class='bannerNum'>{{(currentSwiper+1)}}/{{imgs.length}}</view>
		</view>
		<!-- 门店列表 -->
		<view class="storeBox" v-if="storeList.length > 0">
			<view class="storeTab flex text-left">
				<view class="cu-item flex-sub" :class="0==TabCur?'cur':''" @tap="tabSelect" data-id="0">
					全部门店
				</view>
				<view class="cu-item flex-sub" :class="1==TabCur?'cur':''" @tap="tabSelect" data-id="1">
					经常光顾
				</view>
				<view class="cu-item flex-sub" :class="2==TabCur?'cur':''" @tap="tabSelect" data-id="2">
					门店位置<text class="icon cuIcon-unfold" @tap.stop="dropDown"></text>
				</view>
			</view>
			<!-- 门店区域 -->
			<view class="areaBox" :animation="animationData" v-show="areaBoxShow" :class="areaBoxShow ? 'on' : ''">
				<view class="item" :data-id="item.id" @tap="selectAreaTap" :class="areaCur==item.id?'on':''" v-for="(item,index) in areaList"
				 :key="index">{{item.name}}</view>
			</view>
			<view class="cu-modal top-modal" :class="modalName=='topModal'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white">
						<view class="action text-green">确定</view>
						<view class="action text-blue" @tap="hideModal">取消</view>
					</view>
					<view class="padding-xl">
						Modal 内容。
					</view>
				</view>
			</view>
			<!-- 门店列表 -->
			<view class="storeList">
				<view class="storeItem" @click="homeTap(item.id)" v-for="(item,index) in storeList" :key="index">
					<view>
						<!-- <image class="item_img" src="../../static/image/default_store.png" mode=""></image> -->
						<image class="item_img" :src="item.logo"></image>
					</view>
					<view class="content ovh">
						<view class="text-cut">{{item.name}}</view>
						<view class="text-loca flex">
							<image class="icon_img" src="../../static/image/icon0.png"></image>{{item.districtName}}
							<image class="icon_img icon_img1" src="../../static/image/icon1.png"></image>月售&nbsp;{{item.monthSale}}
						</view>
						<view class="itemFoot">
							<view class="desc">
								<view class="iconfont icon-yinhao"></view>
								<view class="text-cut">{{item.slogan}}</view>
								<view class="iconfont icon-quote-right"></view>
							</view>
						</view>
					</view>
				</view>
				<!-- item -->
				<!-- <view class="text-center lookAllBox">
					<text class="lookAllStore">查看全部门店</text>
				</view> -->
			</view>
		</view>

		<!-- 营养科普 -->
		<view class="dn">
			<view class="block10"></view>
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
						<view class="flex mt20">
							<image src="../../static/image/icon2.png" mode=""></image>作者信息
						</view>
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
		<m-loading></m-loading>
	</view>
</template>

<script>
	import mLoading from '../../components/m-loading.vue'
	export default {
		components: {
			mLoading
		},
		data() {
			return {
				imgs: [],
				currentSwiper: 0,
				autoplay: true,
				TabCur: 0,
				articleItem: ['高血糖', '心脑血管', '肿瘤', '术后康复', '孕妇', '冠心病', '脂肪肝'],
				TabACur: 0, //默认全部
				scrollLeft: 0,
				storeList: [],
				areaList: [],
				areaCur: '',
				areaBoxShow: false,
				modalName: ''
			}
		},
		created() {
			// this.$showLoading(true)
			//todo
			let tit = this.$store.state.setCompanyTit || '医院营养云订餐'
			uni.setNavigationBarTitle({
				title: tit
			})
		},
		onLoad(options) {
			// options.HosId = '2D27DCE7CA88417992C164B0D46AA89C'
			let companyID = options.HosId // 单位id  companyID
			if (companyID) this.$store.commit('setCompanyID', companyID)
			this.isWechat(companyID) //是否登录
		},
		methods: {
			isWechat(companyID) {
				var _this = this;
				uni.login({
					success: function(res) {
						console.log(`获取到的code：${res.code}`);
						// return
						let params = {
							jsCode: res.code,
							companyId: companyID
						}
						// return
						_this.$Api.isWechat(params).then(res => {
							// console.log(res.data.expiresIn) //有效期(秒)
							// console.log(res.data.accessToken)
							uni.setStorageSync('token', res.data.accessToken)
							_this.storeLocation()
							_this.store()
							_this.getBanner()
						}, err => {})
					}
				});
			},
			//banner
			getBanner() {
				this.$Api.getBanner().then(res => {
					this.imgs = res.data
				}, err => {})
			},
			// 门店位置：全部+区域字典，默认展示全部区域的门店
			storeLocation() {
				this.$Api.storeLocation().then(res => {
					let allArr = [{
						id: '',
						name: "全部"
					}]
					this.areaList = [...allArr, ...res.data]
				}, err => {})
			},
			// 如果没有访问过的门店数据，则默认展示全部门店的分类，如果有访问过的门店数据，则默认展示经常光顾的分类
			async store() {
				let res = await this.$Api.storeOften()
				if (res.data.length > 0) {
					this.storeList = res.data
					this.TabCur = 1
				} else {
					this.storeAll()
				}
			},
			storeAll() {
				this.$Api.storeAll().then(res => {
					this.storeList = res.data
				}, err => {})
			},
			storeOften() {
				this.$Api.storeOften().then(res => {
					this.storeList = res.data
				}, err => {})
			},
			// 选择不同区域
			selectAreaTap(e) {
				this.areaCur = e.currentTarget.dataset.id
				this.storeDistrict()
				this.areaBoxShow = !this.areaBoxShow
			},
			storeDistrict() {
				this.$Api.storeDistrict({
					districtId: this.areaCur
				}).then(res => {
					this.storeList = res.data
				}, err => {})
			},
			onClickSwiper(e) {
				const dataset = e.currentTarget.dataset;
				if (!dataset.url) return
				this.statisticsHits(dataset.url, dataset.type);
			},
			statisticsHits(urlLink, urlType) {
				// 0-没有链接  1-外链  2-内链
				if (urlType == '2') { //内链
					uni.navigateTo({
						url: `../${urlLink}`
					})
				} else {
					var LinkUrl = encodeURIComponent(urlLink)
					let type = 'encodeUrl'
					uni.navigateTo({
						url: `../d_webview/d_webview?type=${type}&url=${LinkUrl}`
					})
				}
			},
			//门店详情
			homeTap(id) {
				// uni.removeStorageSync('isFirst')

				let isFirst = uni.getStorageSync('isFirst');
				if (!isFirst) {
					uni.setStorageSync('isFirst', 1)
					uni.navigateTo({
						url: `../my/perfectInfo?id=${id}`
					})
				} else {
					uni.navigateTo({
						url: `../home/home?id=${id}`
					})
				}
			},
			swiperChange: function(e) {
				this.currentSwiper = e.detail.current
			},
			// 门店筛选
			tabSelect(e) {
				switch (e.currentTarget.dataset.id) {
					case '0':
						this.areaBoxShow = false
						this.storeAll()
						break;
					case '1':
						this.areaBoxShow = false
						this.storeOften()
						break;
					case '2':
						this.storeDistrict()
						break;
				}
				this.storeList = this.storeList
				this.TabCur = e.currentTarget.dataset.id;
			},
			//展开门店位置
			dropDown() {
				this.TabCur = 2
				this.areaBoxShow = !this.areaBoxShow
			},
			// 文章列表
			tabArticle(e) {
				this.TabACur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			}
		}
	}
</script>

<style lang="scss">
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
				display: flex;
				align-items: center;

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

				.text-cut {
					max-width: 390rpx;
					font-size: 24rpx;
					color: #FDA130;
				}
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

				image {
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

	.loadMore {
		padding: 50rpx 0 10rpx;
		font-size: 24rpx;
		color: #AAAAAA;
		display: flex;
		align-items: center;
		justify-content: center;

		.icon {
			font-size: 36rpx;
			color: #AAAAAA;
			margin-right: 10rpx;
		}
	}

	.areaBox {
		background: #FFFFFF;
		width: 100%;
		position: absolute;
		z-index: 10;
		box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
		border-top: 1px solid #F4F4F4;
		padding: 30rpx 0 10rpx;

		.item {
			font-size: 28rpx;
			color: #2A2A2A;
			padding: 0 28rpx 28rpx;

			&.on {
				color: #4EC09B;
			}
		}
	}

	.cu-modal.top-modal::before {
		vertical-align: top;
	}

	.cu-modal.top-modal .cu-dialog {
		width: 100%;
		border-radius: 0;
	}

	.cu-modal.top-modal {
		margin-top: -1000upx;
	}

	.cu-modal.top-modal.show {
		margin-top: 0;
	}
</style>
