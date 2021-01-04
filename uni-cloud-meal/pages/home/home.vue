<template>
	<view>
		<image src="../../static/image/meal/timg3.jpg" mode="center" class="response"></image>
		<cu-custom bgColor="bg-hyaline" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">在线订餐</block>
		</cu-custom>
		<view class="topWrapper">
			<view class="homeTop">
				<view class="flex align-center">
					<view class="logoImg">
						<image class="img" :src="storeInfo.logo"></image>
					</view>
					<view class="R">
						<view class="flex justify-between">
							<view class="text-cut">{{storeInfo.name}}</view>
							<view class="phoneCon flex align-center" @tap="makePhoneCall">
								<image class="pimg" mode="scaleToFill" src="../../static/image/meal/phone.png"></image>
							</view>
						</view>
						<view class="notice flex align-start" @click="showModal" data-target="shopNoticeModal">
							<view>
								<image class="nimg" mode="scaleToFill" src="../../static/image/meal/notice.png"></image>
							</view>
							<text class="white_space_line_2">{{storeInfo.notice}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 切换日期 -->
		<scroll-view scroll-x class="nav dateCard" scroll-with-animation :scroll-left="scrollLeft" v-show="newOrderDate">
			<view class="cu-item" :class="index==TabCur?'cur':''" v-for="(item,index) in newOrderDate" :key="index" @tap="tabSelect"
			 :data-date="item.date" :data-id="index">
				{{item.dateStr}}<text class="week">{{item.week}}</text>
			</view>
		</scroll-view>
		<!-- 餐次 -->
		<scroll-view scroll-x class="nav mealTimes" scroll-with-animation :scroll-left="scrollMLeft">
			<view class="cu-item" :class="item.serviceTypeId==mealRepastCur?'cur':''" v-for="(item,index) in currentMenuList"
			 :key="index" @tap="mealTimeSelect" :data-id="item.serviceTypeId">
				{{item.serviceTypeName}}
			</view>
		</scroll-view>
		<!-- 菜谱列表start-->
		<view class="verticalBox" v-for="(itemRepast,indexRepast) in currentMenuList" :key="indexRepast" v-if="mealRepastCur == itemRepast.serviceTypeId">
			<!-- 左侧列表 -->
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:calc(100vh - 658upx)">
				<view class="cu-item" :class="index==currentLeft?'cur':''" v-for="(item,index) in itemRepast.categoryList" :key="index"
				 @tap="leftTap" :data-index='index'>
					{{item.categoryName}}
				</view>
			</scroll-view>
			<!-- 右侧列表 -->
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation :scroll-into-view="'main-'+mainCur" @scroll="verticalMain"
			 style="height:calc(100vh - 658upx)" :scroll-top="scrollTop">
				<view class="padding-lr mainMeal" v-for="(item,index) in itemRepast.categoryList" :key="index" :id="'main-'+index">
					<view class="title">{{item.categoryName}}</view>
					<view class="menuList">
						<view class="item" v-for="(food,idx) in item.productList" :key="idx" @tap="productDetail(food)">
							<view class="panel_left">
								<image :src="food.img ? food.img : '../../static/image/meal/default.png'" lazy-load="true"></image>
								<!-- <text class="tag">建议少食</text> -->
							</view>
							<view class="panel_right">
								<view class="mealName white_space_line_2">{{food.productName}}</view>
								<view class="desc">
									<view v-if="food.surplus==0" class="flex align-center">
										<image class="tipImg" src="../../static/image/meal/tip.png"></image>已售罄
									</view>
									<view v-else>还剩{{food.surplus}}份</view>
								</view>
								<view class="mealCon">
									<view class="flex justify-between align-center">
										<view class="price">¥<text class="f18">{{food.price}}</text></view>
										<cartcontrol @add="addFood" @decrease="decreaseFood" :foodInfo="food"></cartcontrol>
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
		<!-- 今日歇业 -->
		<view class="blankContent" v-if="currentMenuList.length == 0">
			<image class="img" src="../../static/image/meal/blank.png"></image>
			<view>今日歇业<br />
				暂不对外营业</view>
		</view>
		<!-- 店铺公告 -->
		<view class="cu-modal bottom-modal" style="z-index: 1112;" :class="modalName=='shopNoticeModal'?'show':''">
			<view class="cu-dialog shopNoticeDialog">
				<view class="top" @tap="hideModal">
					<view class="txt text-cut text-left">{{storeInfo.name}}</view>
					<view class="cuIcon-close"></view>
				</view>
				<view class="content">
					<view class="flex align-center">
						<image class="nImg" src="../../static/image/meal/notice.png"></image>店铺公告
					</view>
					<scroll-view scroll-y="true" class="txt">
						{{storeInfo.notice}}
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- 菜肴详情 -->
		<view class="cu-modal drawer-modal justify-end" style="z-index: 1112;" :class="modalName=='DrawerModalR'?'show':''">
			<view class="cu-dialog basis-lg foodDescDiv">
				<scroll-view scroll-y="true" class="foodDescScroll">
					<view class="headImg">
						<image class="foodImg" src="../../static/image/meal/default.png" lazy-load="true" mode="scaleToFill"></image>
						<image @tap.stop="hideModal" class="closeImg" src="../../static/image/meal/close.png"></image>
					</view>
					<view class="foodDesWrap">
						<view class="name text-bold">{{proDetailInfo.name}}</view>
						<view class="hd">
							<view class="L flex align-center">
								<view class="num">还剩{{detailFood.surplus}}份</view>
								<view>¥<text class="price">{{proDetailInfo.price}}</text></view>

							</view>
							<cartcontrol @add="addFood" @decrease="decreaseFood" :foodInfo="detailFood"></cartcontrol>
						</view>
						<view class="desc">{{proDetailInfo.productIntr}}</view>

						<view v-if="proDetailInfo.energy">
							<view class="f18 c-2a pb20 pt32 text-bold">营养成分</view>
							<view class="cu-list menu nutritionList">
								<view class="cu-item">
									<view class="content">
										<image class="nutritionImg" src="../../static/image/meal/nutrition1.png"></image>
										<text>能量</text>
									</view>
									<view class="action">
										<text>{{proDetailInfo.energy}} kcl</text>
									</view>
								</view>
								<view class="cu-item">
									<view class="content">
										<image class="nutritionImg" src="../../static/image/meal/nutrition2.png"></image>
										<text>蛋白质</text>
									</view>
									<view class="action">
										<text>{{proDetailInfo.protein}} g</text>
									</view>
								</view>
								<view class="cu-item">
									<view class="content">
										<image class="nutritionImg" src="../../static/image/meal/nutrition3.png"></image>
										<text>脂肪</text>
									</view>
									<view class="action">
										<text>{{proDetailInfo.fat}} g</text>
									</view>
								</view>
								<view class="cu-item">
									<view class="content">
										<image class="nutritionImg" src="../../static/image/meal/nutrition4.png"></image>
										<text>碳水化合物</text>
									</view>
									<view class="action">
										<text>{{proDetailInfo.carbohydrate}} g</text>
									</view>
								</view>
								<view class="cu-item" v-for="(item,index) in proDetailInfo.nutritionList" v-if="moreNutrients">
									<view class="content">
										<image class="nutritionImg" src="../../static/image/meal/nutrition5.png"></image>
										<text>{{item.name}}</text>
									</view>
									<view class="action">
										<text>{{item.value}} {{item.unit}}</text>
									</view>
								</view>
							</view>
							<view class="text-center" v-if="proDetailInfo.nutritionList.length > 0">
								<button class="cu-btn round" @tap="lookMoreTap">{{moreNutrients ? '收起' : '查看更多'}}</button>
							</view>
						</view>

						<view v-if="proDetailInfo.foodList.length > 0">
							<view class="f18 c-2a pb20 pt32 text-bold">配料组成</view>
							<view class="f14 c-4a pb15" v-for="(item,index) in proDetailInfo.foodList">{{item.name}}</view>
						</view>

					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 购物车列表面板 start -->
		<view class="shopcartPanel cu-modal bottom-modal" :class="shopcartPanelShow?'show':''" @tap="hideList">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar">
					<view class="f18 c-2a">已选商品</view>
					<view class="emptyBox flex" @tap="empty">
						<image src="../../static/image/meal/empty.png" class="img"></image>
						<text>清空</text>
					</view>
				</view>
				<scroll-view scroll-y="true" class="content">
					<scroll-view scroll-x class="nav dateCard text-left" scroll-with-animation :scroll-left="scrollCartLeft">
						<view class="cu-item" :class="index==shopcartCur?'cur':''" v-for="(item,index) in selectFoods" :key="index"
						 @tap.stop="tabCartSelect" :data-id="index">
							{{item.orderDate.replace(/\"/g,'') | filtersDate}}<text class="week">{{item.orderDate.replace(/\"/g,'') | filtersWeek}}</text>
						</view>
					</scroll-view>
					<view v-for="(item,index) in selectFoods" :key="index" v-if="shopcartCur == index">
						<block v-for="(rep,repIndex) in item.repeatList" :key="repIndex">
							<view class="repastName">- {{rep.repeatName.replace(/\"/g,'')}} -</view>
							<view class="flex align-center shopCartItem" v-for="(food,idex) in rep.food" @tap="productDetail(food)">
								<image class="img" src="../../static/image/meal/default.png"></image>
								<view class="mealCon ovh flex1">
									<view class="text-cut">{{food.productName}}</view>
									<view class="flex align-center justify-between">
										<view class="price">¥{{food.price}}</view>
										<cartcontrol @add="addFood" @decrease="decreaseFood" :foodInfo="food"></cartcontrol>
									</view>
								</view>
							</view>
							<!-- 一个菜 end -->
						</block>
						<!-- 一个餐次 end -->
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 购物车列表面板 end -->
		<!-- 购物车底部 -->
		<view class="shopcart justify-between" @click="toggleList" v-if="currentMenuList.length > 0">
			<view class="flex align-center">
				<view class="carCon">
					<image src="../../static/image/meal/car.png" mode="" class="carImg"></image>
					<view class="cu-tag badge">{{totalCount}}</view>
				</view>
				<view class="price" v-show="totalPrice">¥{{totalPrice}}</view>
			</view>
			<view @tap.stop="submitOrder">
				<button class="cu-btn round" :disabled="totalCount==0" :class="totalCount>0 ? 'bg-cyan' : 'bg-gray'">去结算</button>
			</view>
		</view>
		<!-- end -->
		<m-loading></m-loading>
	</view>
</template>

<script>
	import {
		formatDate,
		getWeek,
		groupBy
	} from '../../common/util.js'
	import mLoading from '../../components/m-loading.vue'
	import cartcontrol from '../../components/cartcontrol/cartcontrol.vue'
	export default {
		components: {
			mLoading,
			cartcontrol
		},
		data() {
			return {
				modalName: null,
				TabCur: 0,
				scrollLeft: 0,
				dateList: [],

				shopcartCur: 0,
				scrollCartLeft: 0,

				mealRepastCur: 0, //当前餐次
				scrollMLeft: 0,

				currentLeft: 0, //左侧选中的下标
				mainCur: 0,
				verticalNavTop: 0,

				heightArr: [], //右侧分类的高度累加数组
				distance: 0, //记录scroll-view滚动过程中距离顶部的高度

				scrollTop: 0, //到顶部的距离
				food_detail_mask: false,
				foodClass: '',
				storeInfo: {
					logo: '',
					name: '',
					notice: '',
					orderDate: [],
					phone: ''
				},
				storeId: '', //门店id
				defaultDate: '',
				menuList: [], //具体食谱数据，通过parentId区分
				drawerFoodModal: null,
				proDetailInfo: {}, //菜肴详情
				detailFood: {}, //当前菜肴传到详情页
				moreNutrients: false, //更多营养成分
				selectSetFoods: [], //选中的菜肴
				fold: false, // 购物车底部弹框

			};
		},
		onLoad(options) {
			this.clearMenu();
			this.storeInfoObj(options.id);
			this.storeId = options.id;
			// this.$showLoading(true)
			// setTimeout(() => {
			// 	this.$showLoading(false)
			// }, 2000)
		},
		computed: {
			currentMenuList() {
				// for (let j = 0; j < this.menuList.length; j++) {
				// 	if (
				// 		this.menuList[j].parentId ==
				// 		this.currentModuleId + '_' + this.currentRepastId
				// 	) {
				// 		return this.menuList[j]
				// 	}
				// }
				// return {}
				return this.menuList;
			},
			selectFoods() {
				let singleDataArr = [];
				if (this.selectSetFoods.length == 0) {
					return []
				}
				// debugger
				// console.log({
				// 	'计算属性selectSetFoods': this.selectSetFoods
				// })
				let orderDayModeGroup = groupBy(this.selectSetFoods, (food) => {
					return food.orderDay
				});

				// orderDayModeGroup[Symbol.iterator] = function*(){
				//     var keys = Object.keys(orderDayModeGroup);
				//     for(var k of keys){
				//         yield [k,orderDayModeGroup[k]]
				//     }
				// };

				// for(var  [orderDay,v] of orderDayModeGroup){
				//     console.log({'testorderDay':orderDay})
				// }

				console.log({
					'orderDayModeGroup': orderDayModeGroup
				})

				// for(var  [orderDay,v] of orderDayModeGroup){
				// debugger
				for (var orderDay in orderDayModeGroup) {
					let module = {
						orderDate: orderDay,
						repeatList: []
					};
					console.log({
						'orderDay': orderDay
					})
					let repastIdGroup = groupBy(orderDayModeGroup[orderDay], (food) => {
						return food.repastName
					})

					// console.log({'repastIdGroup':repastIdGroup})

					for (let index in repastIdGroup) {
						let repeat = {
							repeatName: index,
							food: repastIdGroup[index]
						}
						module.repeatList.push(repeat)
					}
					// console.log(module)
					singleDataArr.push(module)
					// console.log({'singleDataArr':singleDataArr})
				}
				return singleDataArr
			},
			shopcartPanelShow() {
				if (!this.totalCount) {
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				return show;
			},
			totalCount() {
				let count = 0
				if (this.selectSetFoods.length == 0) return 0
				this.selectSetFoods.forEach(food => {
					count += food.count
				})
				return count
			},
			totalPrice() {
				// debugger
				let total = 0
				if (this.selectSetFoods.length == 0) return ''
				this.selectSetFoods.forEach(food => {
					total += food.price * food.count
				})
				return total
			},
			newOrderDate() {
				if (!this.storeInfo.orderDate) return {}

				let dateArr = []
				for (let i = 0; i < this.storeInfo.orderDate.length; i++) {
					var item = this.storeInfo.orderDate[i]
					dateArr.push({
						date: item,
						dateStr: formatDate(new Date(item), 'MM/dd'),
						week: getWeek(item)
					})
				}
				return dateArr
			},
		},
		filters: {
			filtersDate(time) {
				let _date = formatDate(new Date(time), 'MM/dd')
				return _date
			},
			filtersWeek(time) {
				let _date = formatDate(new Date(time), 'yyyy-MM-dd')
				return getWeek(_date)
			},
		},
		methods: {
			//获取门店头部信息
			async storeInfoObj(id) {
				this.$Api.storeInfo(id).then(res => {
					let data = res.data;
					this.storeInfo.logo = data.logo
					this.storeInfo.name = data.name
					this.storeInfo.notice = data.notice
					this.storeInfo.orderDate = data.orderDate
					this.storeInfo.phone = data.phone
					this.defaultDate = data.orderDate[0]
					this.storeMenu()
				}, err => {})
			},
			//选择日期
			tabSelect(e) {
				let _date = e.currentTarget.dataset.date;
				this.defaultDate = _date;
				this.storeMenu();
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;

				this.currentLeft = 0;
				this.$nextTick(() => {
					this.selectHeight();
				});

			},
			//获取菜谱列表
			storeMenu() {
				let params = {
					storeId: this.storeId,
					date: this.defaultDate
				}
				this.$Api.storeMenu(params).then(res => {
					let tempMenu = res.data;
					if (!tempMenu.dateValue) return
					this.menuList = tempMenu.serviceTypeList;
					this.mealRepastCur = tempMenu.serviceTypeList[0].serviceTypeId;
					tempMenu.serviceTypeList.forEach(v => {
						v.categoryList.forEach(m => {
							m.productList.forEach(n => {
								n.orderDay = tempMenu.dateValue
								n.categoryId = m.categoryId
								n.serviceTypeId = v.serviceTypeId
								n.count = 0
								n.repastName = v.serviceTypeName
								// n.serviceTypeLimit=2
								// n.limit=1
								//从缓存取数据 更新
								let selectStorageArray = uni.getStorageSync('selectfood_storage_key');
								if (!selectStorageArray) return true; // continue 

								let selectFood = selectStorageArray.find(s => s.orderDay == n.orderDay &&
									s.serviceTypeId == n.serviceTypeId &&
									s.productId == n.productId);
								if (!selectFood) return true; // continue 

								n.count = selectFood.count
								n.surplus = selectFood.surplus

							})
						})
					})
					this.menuList = tempMenu.serviceTypeList
					// console.log(this.menuList)

					this.$nextTick(() => {
						this.selectHeight();
					});
				}, err => {
					this.menuList = []
				})
			},
			//获取菜肴详情
			productDetail(food) {
				this.modalName = 'DrawerModalR';
				let params = {
					prodoctId: food.productId
				}
				this.$Api.productDetail(params).then(res => {
					this.proDetailInfo = res.data
				}, err => {})
				this.detailFood = food
			},
			//单选加一
			addFood(food) {
				// debugger
				// console.log(this.selectSetFoods)
				this.updateMenuList(food);
				let filterGoods = this.selectSetFoods.filter(n =>
					n.orderDay == food.orderDay &&
					n.serviceTypeId == food.serviceTypeId &&
					n.productId == food.productId);

				if (filterGoods && filterGoods.length > 0) {
					filterGoods.forEach(n => {
						n.count = food.count
						n.surplus = food.surplus
					});
				} else {
					this.selectSetFoods.push(food)
				}
				console.log({
					'selectSetFoods': this.selectSetFoods
				})

				//从缓存取数据 更新
				let selectStorageArray = uni.getStorageSync('selectfood_storage_key');
				if (!selectStorageArray) selectStorageArray = [];
				let selectFood = selectStorageArray.find(n => n.orderDay == food.orderDay &&
					n.serviceTypeId == food.serviceTypeId &&
					n.productId == food.productId);
				if (selectFood) {
					selectFood.count = food.count;
					selectFood.surplus = food.surplus;
				} else {
					selectStorageArray.push(food);
				}

				uni.setStorageSync('selectfood_storage_key', selectStorageArray);

				// this.fnCartLoad();
				// debugger
				console.log('addFood数量为：' + food.count)
			},
			//单选减一
			decreaseFood(food) {
				// debugger
				this.updateMenuList(food);
				let filterGoods = this.selectSetFoods.filter(n =>
					n.orderDay == food.orderDay &&
					n.serviceTypeId == food.serviceTypeId &&
					n.productId == food.productId);

				if (filterGoods.length > 0) {
					filterGoods.forEach(n => {
						n.count = food.count
						n.surplus = food.surplus
					});
					if (food.count == 0) {
						let itemIndex = this.selectSetFoods.findIndex(n =>
							n.serviceTypeId == food.serviceTypeId &&
							n.productId == food.productId);
						if (itemIndex != -1) {
							this.selectSetFoods.splice(itemIndex, 1)
						}
					}
				}

				//从缓存取数据 更新
				let selectStorageArray = uni.getStorageSync('selectfood_storage_key');
				if (!selectStorageArray) selectStorageArray = [];
				let selectFood = selectStorageArray.find(n => n.orderDay == food.orderDay &&
					n.serviceTypeId == food.serviceTypeId &&
					n.productId == food.productId);
				if (selectFood) {
					selectFood.count = food.count;
					selectFood.surplus = food.surplus;
				} else {
					selectStorageArray.push(food);
				}

				uni.setStorageSync('selectfood_storage_key', selectStorageArray);

			},
			//更新菜谱数据
			updateMenuList(food) {

				// console.log({
				// 	'thismenuList': this.menuList
				// })
				//如果恰好在当前日期下
				this.menuList.forEach(d => {
					d.categoryList.forEach(n => {
						let foodList = n.productList.filter(m => m.orderDay == food.orderDay && m.serviceTypeId == food.serviceTypeId &&
							m.productId == food.productId)
						if (foodList && foodList.length > 0) {
							foodList.forEach(k => {
								k.count = food.count;
								k.surplus = food.surplus;
							})

						}
					})
				})
			},
			//清空购物车及缓存
			clearMenu() {
				uni.removeStorageSync('selectfood_storage_key');
				this.$store.commit('setOrderMenuList', '');
				this.selectSetFoods = [];
				this.menuList.forEach(d => {
					d.categoryList.forEach(n => {
						n.productList.forEach(food => {
							food.surplus = food.surplus + food.count;
							food.count = 0;
						})
					})
				})

			},
			//清空购物车
			empty() {
				var _this = this;
				uni.showModal({
					content: '清空购物车？',
					cancelText: '取消',
					confirmText: '清空',
					success: function(res) {
						if (res.confirm) {
							_this.clearMenu();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//购物车弹起面板
			toggleList() {
				if (!this.totalCount) {
					return
				}
				this.fold = !this.fold
			},
			hideList() {
				this.fold = !this.fold
			},
			// 拨打电话
			makePhoneCall() {
				uni.makePhoneCall({
					phoneNumber: this.storeInfo.phone,
					success: () => {
						console.log("成功拨打电话")
					}
				})
			},
			lookMoreTap() {
				this.moreNutrients = !this.moreNutrients
			},
			showModal(e) {
				let val = e.currentTarget.dataset.target
				if (val) this.modalName = null
				this.modalName = val
			},
			hideModal(e) {
				this.modalName = null
			},
			tabCartSelect(e) {
				this.shopcartCur = e.currentTarget.dataset.id;
				this.scrollCartLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			mealTimeSelect(e) {
				this.mealRepastCur = e.currentTarget.dataset.id;
				this.scrollMLeft = (e.currentTarget.dataset.id - 1) * 60

				// this.currentLeft = 0;
				// this.$nextTick(() => {
				// 	this.selectHeight();
				// });
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
				query.selectAll('.mainMeal').boundingClientRect();
				query.exec(function(res) {
					res[0].forEach((item) => {
						h += item.height;
						that.heightArr.push(h);
					})
					console.log({'菜谱高度':that.heightArr});
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
			},
			/**
			 * 跳转订单页
			 */
			submitOrder() {
				let selectStorageArray = uni.getStorageSync('selectfood_storage_key');
				console.log(selectStorageArray)
				this.$store.commit('setOrderMenuList', selectStorageArray);
				
				uni.navigateTo({
					url: `../confirmOrder/confirmOrder?storeId=${this.storeId}`
				})
			}
		},

	}
</script>

<style lang="scss">
	.cu-custom .cu-bar {
		&.bg-hyaline {
			padding-top: 66rpx;

			.content {
				top: 66rpx;
			}
		}
	}

	page {
		background: #FFFFFF;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.response {
		// background: #EFA720;
		display: block;
		filter: blur(3px);
		// height: 160rpx;
		height: 240rpx;
		overflow: hidden;
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
		width: calc(100% - 56rpx);

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
		// height: calc(100vh - 160rpx - 96rpx - 120rpx - 62rpx - 32rpx - 108rpx);

		.VerticalNav.nav {
			width: 180rpx;
			// height: calc(100vh - 578rpx);
			white-space: initial;
			background: #FAFAFA;
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

			// height: calc(100vh - 578rpx);
			.mainMeal {
				&:last-child {
					padding-bottom: 36rpx;
				}
			}

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

					&:last-child {
						margin: 0;
					}

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
						}
					}
				}
			}
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

	//购物车
	.shopcart {
		position: relative;
		z-index: 1111;
		height: 108rpx;
		overflow: hidden;
		// box-sizing: border-box;
		background: #FFFFFF;
		padding: 0 28rpx;
		border-top: 1rpx solid #F2F2F2;
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
				padding: 12rpx 8rpx 8rpx;
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
			// margin-top: -6rpx;
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
		top: 0;
		height: 100vh;

		.foodDescScroll {
			height: 100%;
		}

		.headImg {
			position: relative;
			height: 750rpx;

			.foodImg {
				width: 100%;
				height: 750rpx;
			}

			.closeImg {
				position: absolute;
				right: 50rpx;
				top: 160rpx;
				width: 70rpx;
				height: 70rpx;
			}
		}

		.foodDesWrap {
			text-align: left;
			padding: 40rpx 28rpx;

			.name {
				font-size: 36rpx;
				color: #2A2A2A;
			}

			.hd {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 24rpx 0;

				.L {
					font-size: 28rpx;
					color: #FF4D23;

					.num {
						font-size: 24rpx;
						color: #6A6A6A;
						padding-right: 32rpx;
					}

					.price {
						font-size: 44rpx;
						padding-left: 6rpx;
					}

					.tag {
						margin-left: 32rpx;
						background: linear-gradient(to right, #FFD444, #FFB023);
						font-size: 20rpx;
						color: #FFFFFF;
						padding: 2rpx 10rpx;
						border: 2rpx solid #FFFFFF;
						border-radius: 0 16rpx 16rpx 16rpx;
					}
				}

				.cart-count {
					font-size: 32rpx;
					color: #4A4A4A;
					padding: 4rpx 16rpx 0;
				}

				.iconfont {
					font-size: 48rpx;
				}
			}

			.desc {
				font-size: 26rpx;
				color: #4A4A4A;
			}

			.nutritionList {
				&.cu-list.menu>.cu-item {
					padding: 0 0 32rpx;
					font-size: 28rpx;
					color: #2A2A2A;
					min-height: auto;
				}

				&.cu-list.menu>.cu-item .content>image {
					margin-right: 24rpx;
				}

				&.cu-list.menu-avatar>.cu-item:after,
				&.cu-list.menu>.cu-item:after {
					border: none;
				}

				.content {
					font-size: 28rpx;
					color: #4A4A4A;
					display: flex;
					align-items: center;
				}

				.nutritionImg {
					width: 48rpx;
					height: 48rpx;
				}
			}

			.cu-btn {
				font-size: 24rpx;
				color: #6A6A6A;
				background: #F4F4F4;
				padding: 0 40rpx;
				margin-top: 8rpx;
				height: 60rpx;
			}
		}
	}

	.cu-modal.drawer-modal .cu-dialog {
		min-width: 100%;
		width: 100%;
		background-color: #FFFFFF;
	}

	// 购物车面板
	.shopcartPanel {
		.cu-dialog {
			height: 900rpx;
			padding-bottom: 108rpx;
		}

		.cu-bar {
			padding: 32rpx 28rpx;
			min-height: auto;
		}

		.emptyBox {
			font-size: 28rpx;
			color: #6A6A6A;

			.img {
				width: 36rpx;
				height: 36rpx;
				margin-right: 8rpx;
				margin-top: 2rpx;
			}
		}

		.content {
			padding: 0 28rpx;
			height: 680rpx;

			.dateCard {
				padding: 0 0 12rpx;

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
				padding: 20rpx 0 24rpx;
				text-align: left;
			}

			.shopCartItem {
				margin-bottom: 24rpx;

				.img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 8rpx;
					margin-right: 24rpx;
				}

				.text-cut {
					font-size: 28rpx;
					color: #2A2A2A;
					text-align: left;
					padding-bottom: 20rpx;
				}

				.price {
					font-size: 32rpx;
					color: #FF4D23;
				}
			}
		}

	}
</style>
