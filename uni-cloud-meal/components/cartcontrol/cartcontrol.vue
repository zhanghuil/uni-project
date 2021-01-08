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
	import {
		showToast
	} from '../../common/util.js'
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

				/*
				 *serviceTypeLimitNum  null不限购  0-没有可加购数量
				 *B、点击+时，依据当前门店、当前商品、当前用户人群分类，判断：超出当日当类型限量，无法继续添加，并提示“每人最多只可购买3份”
				 *C、未超出当日当类型限量，则继续判断：超出当日限量，无法继续添加，并提示“每人每日最多只可购买10份”
				 */
				let selectStorageArray = uni.getStorageSync('selectfood_storage_key');
				if (!selectStorageArray) selectStorageArray = [];
				let sameFood = selectStorageArray.filter(n => n.orderDay == this.food.orderDay && n.productId == this.food.productId)
				let sum = 1
				sameFood.forEach(e => {
					sum += e.count
				})
				if ((this.food.serviceTypeLimitNum && this.food.count + 1 > this.food.serviceTypeLimitNum) || this.food.serviceTypeLimitNum ==
					0) {
					showToast(`每人最多只可购买${this.food.serviceTypeLimit}份`)
					return;
				}
				if ((this.food.limitNum && sum > this.food.limitNum) || this.food.limitNum == 0) {
					showToast(`每人每日最多只可购买${this.food.limit}份`)
					return;
				}


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
