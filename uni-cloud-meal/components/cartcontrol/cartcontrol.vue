<template>
	<view>
		<view class="cartcontrol">
			<view class="cart-decrease" v-if="food.count > 0" @tap.stop="decreaseCart">
				<text class="iconfont icon-jianshao"></text>
			</view>
			<view class="cart-count" v-if="food.count > 0">{{ food.count }}</view>
			<view class="cart-add add" @tap.stop="addCart">
				<text class="iconfont icon-jia" :class="food.surplus==0?'c-d6':''"></text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			foodInfo: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		watch: {
			foodInfo: {
				handler(newVal, oldVal) {
					this.food = newVal
				},
				deep: true
			}
		},
		data() {
			return {
				food: this.foodInfo
			}
		},
		methods: {
			addCart(event) {
				if (this.food.surplus <= 0) return

				if (!this.food.count) {
					this.food.count = 1
				} else {
					this.food.count++
				}
				this.food.surplus--

				this.$emit('add', this.food)
			},
			decreaseCart(event) {
				if (this.food.count) {
					this.food.count--
					this.food.surplus++
				}
				this.$emit('decrease', this.food)
			}
		}
	}
</script>

<style lang="scss">
	.cartcontrol {
		display: flex;
		align-items: center;

		.iconfont {
			font-size: 48rpx;
			color: #4EC09B;

			&.icon-jianshao {
				color: #D6D6D6;
			}

			&.c-d6 {
				color: #D6D6D6;
			}
		}

		.cart-count {
			font-size: 32rpx;
			color: #4A4A4A;
			padding: 4rpx 16rpx 0;
		}
	}
</style>
