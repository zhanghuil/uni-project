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

	.block10 {
		background: #FAFAFA;
		width: 100%;
		height: 20rpx;
	}

	.mt16 {
		margin-top: 32rpx;
	}

	.mt20 {
		margin-top: 40rpx;
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
</style>
