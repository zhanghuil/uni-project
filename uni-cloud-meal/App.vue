<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style>
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "common/iconfont.css";

	page {
		background: #FFFFFF;
	}

	.block10 {
		background: #FAFAFA;
		width: 100%;
		height: 20rpx;
	}

	.mt12 {
		margin-top: 24rpx;
	}

	.mt16 {
		margin-top: 32rpx;
	}

	.mt20 {
		margin-top: 40rpx;
	}

	.pt32 {
		padding-top: 64rpx;
	}

	.pr10 {
		padding-right: 20rpx;
	}

	.pb8 {
		padding-bottom: 16rpx;
	}

	.pb15 {
		padding-bottom: 30rpx;
	}

	.pb20 {
		padding-bottom: 40rpx;
	}

	.pb40 {
		padding-bottom: 80rpx;
	}

	.white_space_line_2 {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		white-space: normal;
	}

	.placeholder {
		font-size: 26rpx;
		color: #C0C0C0;
	}

	.cu-btn[disabled] {
		opacity: 1;
		background: #C0C0C0;
		color: #FFFFFF;
	}

	button[disabled]:not([type]) {
		background: #C0C0C0;
		color: #FFFFFF;
	}

	.f14 {
		font-size: 28rpx;
	}

	.f15 {
		font-size: 30rpx;
	}

	.f16 {
		font-size: 32rpx;
	}

	.f18 {
		font-size: 36rpx;
	}

	.c-c0 {
		color: #C0C0C0;
	}

	.c-4e {
		color: #4EC09B;
	}

	.c-4a {
		color: #4A4A4A;
	}

	.c-6a {
		color: #6A6A6A;
	}

	.c-2a {
		color: #2A2A2A;
	}

	.c-ff4 {
		color: #FF4D23;
	}

	.flex1 {
		flex: 1;
	}

	.rel {
		position: relative;
	}

	.ovh {
		overflow: hidden;
	}

	.dn {
		display: none;
	}

	.lh24 {
		line-height: 48rpx;
	}
</style>
