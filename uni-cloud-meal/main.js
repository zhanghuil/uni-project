import Vue from 'vue'
import App from './App'
import store from './store' //引入vuex
import Api from './services/api.js' // 1、引入api.js

function showLoading(show) {
	store.commit("showLoading", show)
}


Vue.prototype.$store = store //把vuex定义成全局组件
Vue.prototype.$Api = Api //  2、挂载全局
Vue.prototype.$showLoading = showLoading


import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
