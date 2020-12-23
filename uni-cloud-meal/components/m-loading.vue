<template>
	<view class="loadingBox" v-show="show" @click="dismiss">
		<image class="rotateImg" src="../static/image/loading.svg"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			dismiss() {
				this.$store.commit("showLoading", false);
			},
		},
		computed: {
			show() {
				return this.$store.state.loading;
			},
		},
	};
</script>

<style>
	.loadingBox {
		width: 100%;
		height: 100vh;
		background-color: rgba(255, 255, 255, 1);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10000;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loadingBox .rotateImg {
		margin-bottom: 40px;
		width: 180rpx;
		height: 180rpx;
	}

	.rotateImg {
		animation: rotateImg 2s ease-in-out infinite;
	}

	@keyframes rotateImg {
		from {
			transform: rotate(0deg)
		}

		to {
			transform: rotate(360deg)
		}
	}
</style>
