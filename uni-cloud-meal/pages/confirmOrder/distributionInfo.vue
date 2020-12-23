<template>
	<view>
		<view class="disInfo-form-group">
			<view class="item" @tap="showModal" data-target="bottomModal">
				<view class="title">配送地址<text class="star iconfont icon-bitian"></text></view>
				<view class="arrow">
					<view class="defaultTxt" v-if="!addressStr">请选择</view>
					<!-- 有值 -->
					<view v-else class="f14 c-6a">{{addressStr}}</view>
				</view>
			</view>
			<view class="item">
				<view class="title">详细地址</view>
				<input type="text" class="ipt" placeholder="进一步补充具体位置" placeholder-class="placeholder" maxlength="20" v-model="detailAddress" />
			</view>
			<view class="item">
				<view class="title">联系人<text class="star iconfont icon-bitian"></text></view>
				<input type="text" class="ipt" placeholder="请输入" placeholder-class="placeholder" maxlength="15" v-model="userName" />
			</view>
			<view class="item">
				<view class="title">联系手机号 <text class="star iconfont icon-bitian"></text></view>
				<input type="text" class="ipt" placeholder="请输入" placeholder-class="placeholder" maxlength="11" v-model="phone" />
			</view>
		</view>
		<view class="footer" @tap="submitTap">
			<button class="cu-btn bg-grey bg-cyan">确定</button>
		</view>
		<!-- 地址选择 start -->
		<view class="cu-modal bottom-modal selectAddress" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cuIcon-close" @tap="hideModal"></view>
				<view class="topBox">
					<view v-show="districtName" class="icon cuIcon-back"></view>
					<view class="txt">
						<text v-show="districtName" @tap="backToTap" :data-index="0">{{districtName}}</text>
						<text v-show="buildingName" class="px10">-</text>
						<text v-show="buildingName" @tap="backToTap" :data-index="1">{{buildingName}}</text>
					</view>
				</view>
				<view class="content">
					<!-- 一级地址 -->
					<scroll-view class="scroll-Y" scroll-y="true" v-show="currIndex == 0">
						<view class="item" v-for="(item,index) in addressList" :key="index" @tap="oneLevel" :id="item.districtId"
						 :data-index="1">{{item.districtName}}</view>
					</scroll-view>
					<!-- 二级地址 -->
					<scroll-view class="scroll-Y" scroll-y="true" v-show="currIndex == 1">
						<view class="item" v-for="(item,index) in addresslist2" :key="index" @tap="twoLevel" :id="item.buildingId"
						 :data-index="2">{{item.buildingName}}</view>
					</scroll-view>
					<!-- 三级地址 pb30-->
					<view class="rel" v-show="currIndex == 2">
						<scroll-view class="scroll-Y" scroll-y="true">
							<view class="item" :class="currFloor == index ? 'on' : ''" v-for="(item,index) in addresslist3" :key="index"
							 @tap="threeLevel(index,item.floorId,item.floorName)">{{item.floorName}}</view>
						</scroll-view>
						<!-- <view class="footer" @tap="confirmAddress">
							<button class="cu-btn bg-cyan">确定</button>
						</view> -->
					</view>
					<!-- end -->
				</view>
			</view>
		</view>
		<!-- 地址选择 end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				currIndex: 0,
				districtName: '', //院区
				buildingName: '', //楼栋
				floorName: '', //楼层
				addressStr: '',
				currFloor: -1,
				addressList: [{
						"buildingList": [{
								"floorList": [{
									"floorId": 9,
									"floorName": "F17"
								}],
								"buildingId": 5,
								"buildingName": "建配龙"
							},
							{
								"floorList": [{
										"floorId": 142,
										"floorName": "F14"
									},
									{
										"floorId": 143,
										"floorName": "F17"
									}
								],
								"buildingId": 39,
								"buildingName": "建配龙B栋"
							}
						],
						"districtId": 2,
						"districtName": "本院"
					},
					{
						"buildingList": [{
								"floorList": [{
										"floorId": 596,
										"floorName": "1"
									},
									{
										"floorId": 597,
										"floorName": "2"
									},
									{
										"floorId": 598,
										"floorName": "3"
									}
								],
								"buildingId": 169,
								"buildingName": "1号楼"
							},
							{
								"floorList": [{
										"floorId": 599,
										"floorName": "1"
									},
									{
										"floorId": 600,
										"floorName": "2"
									}
								],
								"buildingId": 170,
								"buildingName": "2号楼"
							}
						],
						"districtId": 23,
						"districtName": "东院"
					}
				],
				addresslist2: [],
				addresslist3: [],
			};
		},
		methods: {
			oneLevel(e) {
				let id = e.currentTarget.id;
				let currIndex = e.currentTarget.dataset.index;
				let result = this.addressList.find(item => item.districtId == id);
				this.addresslist2 = result.buildingList
				this.districtName = result.districtName
				this.currIndex = currIndex
			},
			twoLevel(e) {
				let id = e.currentTarget.id;
				let currIndex = e.currentTarget.dataset.index;
				let result = this.addresslist2.find(item => item.buildingId == id);
				this.addresslist3 = result.floorList
				this.buildingName = result.buildingName
				this.currIndex = currIndex
			},
			threeLevel(index, id, name) {
				this.currFloor = index
				this.floorName = name
				this.addressStr = `${this.districtName}-${this.buildingName}-${this.floorName}`
				this.hideModal()
			},
			backToTap(e) {
				let currIndex = e.currentTarget.dataset.index;
				if (currIndex == 0) {
					this.buildingName = ''
					this.currFloor = -1
				}

				this.currIndex = currIndex
			},
			confirmAddress(e) {
				this.hideModal()
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
		},
	}
</script>

<style lang="scss">
	page {
		background: #FAFAFA;
	}

	.disInfo-form-group {
		padding: 0 28rpx;
		background: #FFFFFF;

		.item {
			padding: 32rpx 0;
			border-bottom: 1rpx solid #EEEFF3;

			&:last-child {
				border: none;
			}

			.star {
				font-size: 40rpx;
				color: #FF4D23;
			}

			.title {
				font-size: 30rpx;
				color: #2A2A2A;
				padding-bottom: 24rpx;
			}

			.ipt {
				font-size: 28rpx;
				color: #6A6A6A;
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

			.defaultTxt {
				font-size: 28rpx;
				color: #C0C0C0;
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;

		.cu-btn {
			font-size: 30rpx;
			color: #FFFFFF;
			text-align: center;
			width: 100%;
			height: 90rpx;
			border-radius: 0;

			&.bg-grey {
				background: #C0C0C0;
			}

			&.bg-cyan {
				background-color: #4EC09B;
			}
		}
	}

	.cu-modal.bottom-modal .cu-dialog {
		background-color: #FFFFFF;
		border-radius: 24rpx 24rpx 0 0;
	}

	.selectAddress {
		.cuIcon-close {
			position: absolute;
			right: 40rpx;
			top: 44rpx;
			color: #C0C0C0;
			font-size: 40rpx;
			width: 36rpx;
			margin-left: 42rpx;
		}

		.topBox {
			padding: 44rpx 40rpx 60rpx 28rpx;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #4EC09B;
			height: 150rpx;

			.icon {
				color: #4A4A4A;
				margin-right: 16rpx;
				font-size: 40rpx;
			}

			.px10 {
				padding-left: 20rpx;
				padding-right: 20rpx;
			}
		}

		.content {
			padding: 0 28rpx 32rpx;

			.scroll-Y {
				height: 520rpx;
				position: relative;
			}

			.pb30 {
				padding-bottom: 60rpx;
			}

			.item {
				text-align: left;
				font-size: 28rpx;
				padding-bottom: 32rpx;
				color: #4A4A4A;

				&.on {
					color: #4EC09B;
				}
			}
		}
	}
</style>
