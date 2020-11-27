<template>
	<view>
		<view class="infoH1 text-center">您的每日摄入推荐</view>
		<view class="energyBox">
			<image src="../../static/image/info.png" class="img"></image>
			<view class="content">
				<view class="name">能量</view>
				<view class="c-f f26 text-bold">2000</view>
				<view class="c-f f16">kcal</view>
			</view>
		</view>
		<view class="nutritionGroup">
			<view class="item">
				<view>蛋白质</view>
				<view class="numBox c-f f16">
					<view class="text-bold f20">120.5</view>
					<view>g</view>
				</view>
			</view>
			<view class="item">
				<view>脂肪</view>
				<view class="numBox c-f f16">
					<view class="text-bold f20">45</view>
					<view>g</view>
				</view>
			</view>
			<view class="item">
				<view>碳水化合物</view>
				<view class="numBox c-f f16">
					<view class="text-bold f20">66</view>
					<view>g</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view>
				<button class="cu-btn round bg-cyan" @tap="gotIt">我知道了</button>
			</view>
			<view class="mt18">
				<button class="cu-btn round bg-gray" @tap="recalculate">重新计算</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods:{
			gotIt(){
				uni.reLaunch({
				    url: '../home/home'
				});
			},
			recalculate(){
				uni.redirectTo({
				    url: './perfectInfo'
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
		padding-bottom: 72rpx;
	}

	.infoH1 {
		font-size: 36rpx;
		color: #4EC09B;
		padding: 48rpx 0 40rpx;
	}

	.energyBox {
		width: 440rpx;
		height: 440rpx;
		margin: 0 auto;
		position: relative;
		font-size: 28rpx;
		color: #4A4A4A;

		.img {
			width: 440rpx;
			height: 440rpx;
		}

		.content {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			width: 440rpx;
			height: 440rpx;
			text-align: center;

			.name {
				padding: 52rpx 0 82rpx;
			}
		}
	}

	.c-f {
		color: #FFFFFF;
	}

	.f16 {
		font-size: 32rpx;
	}

	.f20 {
		font-size: 40rpx;
	}

	.f26 {
		font-size: 52rpx;
	}

	.nutritionGroup {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		color: #4A4A4A;
		padding: 64rpx 76rpx 196rpx;
		.item{
			text-align: center;
		}
		.numBox {
			margin: 20rpx 0 0;
			background-image: linear-gradient(-142deg, #FFBE8D 0%, #FFA561 100%);
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
			display: flex;
			flex-direction:column;
			justify-content: center;
			align-content: stretch;
		}
	}
	.footer{
		text-align: center;
		.cu-btn{
			padding: 0 96rpx;
			height: 80rpx;
			font-size: 32rpx;
		}
		.bg-gray{
			color: #C0C0C0;
			background: none;
		}
		.mt18{
			margin-top: 36rpx;
		}
	}
</style>
