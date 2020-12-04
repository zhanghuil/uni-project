<template name="paymentList">
	<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
		<view class="cu-dialog shopNoticeDialog">
			<view class="top" @tap="hideModal">
				<view class="txt text-cut text-left">选择支付方式</view>
				<view class="cuIcon-close"></view>
			</view>
			<view class="content">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in payList" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">
									<image class="img" :src="'../static/image/meal/'+item.paymentId+'.png'"></image>{{item.paymentName}}
								</view>
								<radio class="round" :class="selectId==item.paymentId?'checked':''" :checked="selectId==item.paymentId?true:false"
								 :value="item.paymentId"></radio>
							</label>
						</view>
					</view>
				</radio-group>
				<view class="subBtn" @click="submit">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "paymentList",
		props: {
			modalName: {
				type: String,
				default: null
			},
			payList: {
				type: Array
			},
			selectId: {
				type: Number
			}
		},

		//组件生命周期
		created() {

		},
		data() {
			return {
				paymentId: null || this.selectId
			}
		},
		methods: {
			submit() {
				this.$emit("reselectId", this.paymentId)
				this.hideModal()
			},
			RadioChange(e) {
				let val = e.detail.value
				this.paymentId = val
				console.log(`选择的支付方式：${val}`)
			},
			hideModal(e) {
				this.$emit("hideModal", null)
			},
		}
	}
</script>

<style lang="scss">
	.cu-modal.bottom-modal .cu-dialog {
		background-color: #FFFFFF;
		border-radius: 24rpx 24rpx 0 0;
	}

	.shopNoticeDialog {
		padding: 40rpx 28rpx 0;
		position: relative;

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
			padding: 32rpx 0 138rpx;
			font-size: 28rpx;
			color: #2A2A2A;

			.cu-item {
				padding: 16rpx 0 16rpx 12rpx;
				min-height: auto;

				&::after {
					border: none;
				}

				.flex-sub {
					display: flex;
					align-items: center;

					.img {
						width: 60rpx;
						height: 60rpx;
						margin-right: 24rpx;
					}
				}

				.round {
					font-size: 40rpx;
					color: #4EC09B;
				}
			}
		}

		.subBtn {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #4EC09B;
			font-size: 30rpx;
			color: #FFFFFF;
			height: 90rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
