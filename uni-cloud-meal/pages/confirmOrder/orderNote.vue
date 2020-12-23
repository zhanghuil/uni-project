<template>
	<view>
		<textarea maxlength="50" placeholder-class="placeholder" v-model="notes" placeholder="可输入不超过50个字" class="notes_textarea"></textarea>
		<view class="footer" @tap="submitTap">
			<button class="cu-btn">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				notes: ''
			};
		},
		onShow() {
			let _orderNote = this.$store.state.orderNotes
			if (_orderNote) this.notes = _orderNote
		},
		methods: {
			submitTap() {
				this.$store.commit('setOrderNote', this.notes)
				uni.showToast({
					title: '保存成功',
					icon: 'none'
				});
				setTimeout(() => (
					wx.navigateBack({
						delta: 1
					})
				), 1500)
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: #FAFAFA;
	}

	.notes_textarea {
		width: 100%;
		padding: 32rpx 28rpx;
		background: #fff;
		font-size: 26rpx;
		line-height: 1.6;
		color: #4A4A4A;
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;

		.cu-btn {
			border: none;
			background: #4EC09B;
			font-size: 30rpx;
			color: #FFFFFF;
			text-align: center;
			width: 100%;
			height: 90rpx;
			border-radius: 0;
		}
	}
</style>
