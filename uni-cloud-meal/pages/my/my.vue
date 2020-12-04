<template>
	<view>
		<!-- 职工 -->
		<view class="header">
			<view class="imgBox">
				<image class="img" src="../../static/image/sex0.png"></image>
			</view>
			<view class="desc">
				<view class="flex align-center justify-between">
					<view class="name">张丹</view>
					<view class="edit">退出登录</view>
				</view>
				<view class="hos">上海交通大学附属新华医院</view>
			</view>
		</view>
		<view class="card-menu">
			<view class="cu-item">
				<view>
					<view class="txt"><text class="pr10">部门：</text>本部 后勤科</view>
					<view class="txt"><text class="pr10">手机：</text>{{getPhone}}</view>
				</view>
				<image class="img" src="../../static/image/card.png"></image>
			</view>
			<view class="cu-item" @click="rechargeTap">
				<view class="cardTxt">
					<view class="L">我的职工卡<text class="cuIcon-right"></text></view>
					<view>查看卡余，在线充值</view>
				</view>
				<image src="../../static/image/bg1.png" class="bg-img"></image>
			</view>
			<view class="cu-item" @click="infoTap">
				<view class="cardTxt">
					<view class="L">完善健康信息<text class="cuIcon-right"></text></view>
					<view>为您提供科学的营养推荐</view>
				</view>
				<image src="../../static/image/bg2.png" class="bg-img"></image>
			</view>
		</view>
		<!-- 患者 -->
		<view class="header">
			<view class="imgBox">
				<open-data style="border-radius:50%;overflow:hidden;display:block;height:140rpx;" type="userAvatarUrl"></open-data>
				<!--  #ifdef MP-ALIPAY -->
				<image class="img" src="../../static/image/sex0.png"></image>
				<!--  #endif -->
			</view>
			<view class="desc">
				<view class="flex align-center justify-between">
					<view class="name"><open-data type="userNickName"></open-data></view>
					<view class="edit">退出登录</view>
				</view>
				<view class="hos">手机：{{getPhone}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '17717960463'
			}
		},
		computed: {
			getPhone() {
				var mphone = this.phone.substring(0, 3) + '****' + this.phone.substring(7);
				return mphone;
			}
		},
		methods: {
			rechargeTap() {
				uni.navigateTo({
					url: './recharge'
				})
			},
			infoTap() {
				uni.navigateTo({
					url: './perfectInfo'
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.header {
		display: flex;
		align-items: center;
		padding: 24rpx 40rpx;

		.imgBox {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			margin-right: 24rpx;

			.img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		.desc {
			flex: 1;
			font-size: 28rpx;
			color: #6A6A6A;

			.name {
				font-size: 18px;
				color: #2A2A2A;
			}

			.edit {
				font-size: 26rpx;
				color: #4EC09B;
			}

			.hos {
				padding-top: 14rpx;
			}
		}
	}

	.card-menu {
		padding: 0 40rpx 32rpx;

		.cu-item {
			margin-bottom: 32rpx;
			background: #FAFAFA;
			border-radius: 8rpx;
			padding: 20rpx 32rpx;
			display: flex;
			justify-content: space-between;
			font-size: 28rpx;
			color: #4A4A4A;
			position: relative;

			.txt {
				line-height: 2;
			}

			.img {
				width: 72rpx;
				height: 84rpx;
				margin-top: 14rpx;
			}

			&:nth-child(2),
			&:nth-child(3) {
				background-image: linear-gradient(90deg, #9FD9C7 0%, #6ECCAE 100%);
				color: #FFFFFF;
				line-height: 1.8;

				.bg-img {
					position: absolute;
					width: 184rpx;
					height: 148rpx;
					right: 0;
					bottom: 0;
				}

				.cardTxt {
					.L {
						font-size: 32rpx;
						display: flex;
						align-items: center;

						.cuIcon-right {
							margin-left: 8rpx;

						}
					}
				}
			}

			&:nth-child(3) {
				background-image: linear-gradient(90deg, #A2B9E4 0%, #7E9FDB 100%);
				color: #FFFFFF;
				line-height: 1.8;
			}
		}
	}
</style>
