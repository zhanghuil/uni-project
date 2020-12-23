<template>
	<view>
		<view class="text-center">
			<image src="../../static/image/entry.png" class="entryImg"></image>
		</view>
		<view class="tit">方法一</view>
		<view class="txt">请使用微信扫医院订餐二维码进入订餐</view>
		<view class="tit">方法二</view>
		<view class="txt">通过贵医院微信公众号菜单入口或企业微信等
			医院指定入口进入订餐</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.entryImg {
		width: 200rpx;
		height: 200rpx;
		margin: 164rpx 0 56rpx;
	}

	.tit {
		font-size: 36rpx;
		color: #4EC09B;
		padding: 60rpx 0 24rpx;
		text-align: center;
	}

	.txt {
		font-size: 28rpx;
		color: #4A4A4A;
		padding: 0 60rpx;
		text-align: center;
	}
</style>
