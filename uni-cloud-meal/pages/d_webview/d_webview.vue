<template>
	<view>
		<web-view :src="d_wb_url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				d_wb_url: ''
			}
		},
		onLoad(options) {
			console.log("options", options)
			if (options.type) {
				this.d_wb_url = decodeURIComponent(options.url)
			} else {
				this.d_wb_url = options.url
			}

			// 设置标题
			let navName = options.name ? options.name : '医院营养云订餐';
			uni.setNavigationBarTitle({
				title: navName
			})
		},
		methods: {

		}
	}
</script>

<style>

</style>
