import request from './request.js' //引入request.js
import store from "../store/index.js";
const api = request
// export default {
// 	// 登录
// 	// async login: (params) => {
// 	// 	console.log('开始登录...')
// 	// 	let code = await wxLogin();
// 	// 	let res = await fly.get('/user/login', {
// 	// 		code: code
// 	// 	})
// 	// 	uni.setStorageSync('token', res.token)
// 	// 	uni.setStorageSync('openid', res.openid)
// 	// }
// }

export default {
	isWechat: (data) => {
		return api.baseRequest('/api/Account/logion/wechat', 'POST', data)
	},
	getCompany: (data) => { //根据Id获取单位信息
		return api.baseRequest('/api/Company/' + store.state.companyID, 'GET', data)
	},
	getDept: (data) => { //根据医院Id获取部门信息
		return api.baseRequest('/api/Dept', 'GET', data)
	},
	wechatphone: (data) => { //职工微信手机号验证
		return api.baseRequest('/api/Staff/auth/wechatphone', 'POST', data)
	},
	phoneStaff: (data) => { //职工姓名&部门&手机&验证码验证
		return api.baseRequest('/api/Staff/auth/phone', 'POST', data)
	},
	StaffName: (data) => { //职工补充姓名部门
		return api.baseRequest('/api/Staff', 'PUT', data)
	},
	wechatphoneP: (data) => { //患者微信手机号验证
		return api.baseRequest('/api/Patient/auth/wechatphone', 'POST', data)
	},
	phonePatient: (data) => { //患者手机号验证码验证
		return api.baseRequest('/api/Patient/auth/phone', 'POST', data)
	},
	smscode: (data) => { //获取验证码
		return api.baseRequest('/api/Common/smscode', 'GET', data)
	},


	// 首页
	currentCompany: (data) => { //获取当前单位信息
		return api.baseRequest('/api/Company/current', 'GET', data)
	},
	getBanner: (data) => { //首页医院banner
		return api.baseRequest('/api/Banner', 'GET', data)
	},
	storeAll: (data) => { //全部门店列表
		return api.baseRequest('/api/Store', 'GET', data)
	},
	storeOften: (data) => { //获取经常光顾门店列表
		return api.baseRequest('/api/Store/fond', 'GET', data)
	},
	storeLocation: (data) => { //门店医院区域位置
		return api.baseRequest('/api/Address/district', 'GET', data)
	},
	storeDistrict: (data) => { //获取不同区域门店列表
		return api.baseRequest('/api/Store/district', 'GET', data)
	},


	// 门店主页
	storeInfo: (data) => { //门店信息详情
		return api.baseRequest('/api/Store/' + data, 'GET', data)
	},
	storeMenu: (data) => { //根据日期获取菜单
		return api.baseRequest('/api/Menu/StoreIndexDetail', 'GET', data)
	},
	productDetail: (data) => { //根据id获取商品详情
		return api.baseRequest('/api/Menu/GetProductDetailById', 'GET', data)
	},
	isRemark: (data) => { //门店是否启用订单备注、手写地址
		return api.baseRequest('/api/Store/IsRemark', 'GET', data)
	},
	

	//订单
	shippingAddress: (data) => { //获取配送地址
		return api.baseRequest('/api/Address/ShippingAddress', 'GET', data)
	},
	lastAddress: (data) => { //获取历史配送地址
		return api.baseRequest('/api/Address/LastAddress', 'GET', data)
	},
	saveOrderAddress: (data) => { //保存配送地址
		return api.baseRequest('/api/Address/SaveOrderAddress', 'POST', data)
	},
	getPayType: (data) => { //获取支付方式
		return api.baseRequest('/api/Order/GetPayType', 'GET', data)
	},
	orderSubmit: (data) => { //订单提交
		return api.baseRequest('/api/Order/OrderSubmit', 'POST', data)
	},
	orderCancel: (data) => { //取消订单
		return api.baseRequest('/api/Order/OrderCancel', 'GET', data)
	},
	getMonthAmount: (data) => { //获取月消费合计
		return api.baseRequest('/api/Order/GetMonthAmount', 'GET', data)
	},
	orderList: (data) => { //订单中心列表
		return api.baseRequest('/api/Order/OrderList', 'GET', data)
	},
	orderPayDetail: (data) => { //订单中心未支付详情
		return api.baseRequest('/api/Order/OrderPayDetail', 'GET', data)
	},
	orderDetail: (data) => { //订单中心已支付详情
		return api.baseRequest('/api/Order/OrderDetail', 'GET', data)
	},
	// 支付
	orderPay: (data) => { //支付
		return api.baseRequest('/api/Order/pay', 'POST', data)
	},
	refund: (data) => { //退费
		return api.baseRequest('/api/Order/refund', 'POST', data)
	},
	updOrderPayment: (data) => { //修改支付方式
		return api.baseRequest('/api/Order/UpdOrderPayment', 'GET', data)
	},
	
	

	// 个人中心
	personalCenter: (data) => { //获取个人中心信息
		return api.baseRequest('/api/Account', 'GET', data)
	},
	diseaseDictionary: (data) => { //获取疾病字典
		return api.baseRequest('/api/Common/dictionary/PhysicalCondition', 'GET', data)
	},
	infoGather: (data) => { //信息采集
		return api.baseRequest('/api/Account', 'PUT', data)
	},
	recommend: (data) => { //营养素推荐
		return api.baseRequest('/api/Account/nurt/recommend', 'GET', data)
	},
	lookInfo: (data) => { //查看信息采集信息
		return api.baseRequest('/api/Account/info', 'GET', data)
	},
	unbind: (data) => { //解绑
		return api.baseRequest('/api/Account/unbind', 'DELETE', data)
	},
	recharge: (data) => { //职工卡充值
		return api.baseRequest('/api/Card/recharge', 'POST', data)
	},
	cardInfo: (data) => { //获取卡信息
		return api.baseRequest('/api/Card/current', 'GET', data)
	},
	rechargeRecord: (data) => { //获取充值记录
		return api.baseRequest('/api/Card/recharge', 'GET', data)
	}
}
