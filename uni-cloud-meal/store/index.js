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
		isRemark: {}, //门店是否启用订单备注、手写地址
		distributionInfo: '', //配送信息
		orderMenuList: '', //提交订单菜谱列表
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
		},
		showLoading(state, show) {
			state.loading = show;
		},
		setIsRemark(state, value) {
			state.isRemark = value
		},
		setDistributionInfo(state, value) {
			state.distributionInfo = value
		},
		setOrderMenuList(state, value) {
			state.orderMenuList = value
		},
	},
	actions: {}
})
export default store
