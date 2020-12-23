import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		companyID: '', //医院单位ID
		companyName: '', //医院title
		phoneInfo: {}, //手机号加密信息
		orderNotes: '', //订单备注
		loading: false, //自定义加载动画
	},
	mutations: {
		setCompanyID(state, value) {
			state.companyID = value
		},
		setCompanyTit(state, value) {
			state.companyName = value
		},
		setPhoneInfo(state, value) {
			state.phoneInfo = value
		},
		setOrderNote(state, value) {
			state.orderNotes = value
			console.log('订单备注：' + value)
		},
		showLoading(state, show) {
			state.loading = show;
		}
	},
	actions: {}
})
export default store
