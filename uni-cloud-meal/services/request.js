import baseUrl from './config.js'
import md5 from '../common/md5.js' //md5加密
// 同时发送异步代码的次数，防止一次点击中有多次请求，用于处理
let ajaxTimes = 0;
import store from "../store/index.js";

//参数MD5加密
function encryption(timestamp, caller, callSource) {
	let authCode = ''
	var str = [timestamp, caller, callSource].map(authCodeStr).join('_');
	authCode = md5.hexMD5(str)
	// console.log(str)
	// console.log(authCode)
	return authCode
}

function authCodeStr(n) {
	n = n.toString()
	return n
}

//基本的接口请求
const baseRequest = (url, method, data) => {
	var timestamp = Date.parse(new Date()) //时间戳
	let tokenValue = uni.getStorageSync('token') || ''
	// console.log(tokenValue)
	ajaxTimes++;
	uni.showLoading({
		title: '加载中...',
		mask: true
	});
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method: method || 'POST',
			data: data || {},
			header: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + tokenValue,
				'WC-CallTime': timestamp,
				'WC-Caller': 'wx', //调用者
				'WC-CallSource': 'WeChatApplet', //调用来源
				'WC-Signature': encryption(timestamp, 'wx', 'wxminiapp'), //MD5加密
				'WC-Version': '1'
			},
			success: (res) => {
				// console.log('请求成功')
				// 请求成功
				if (res.statusCode === 200) {
					resolve(res)
				} else if (res.statusCode === 401) { // 未认证
					/* 可做一些错误提示，或者直接跳转至登录页面等 */
					uni.setStorageSync('sessionBagKey', res.data);
					let companyID = store.state.companyID
					if (!companyID) {
						return uni.reLaunch({
							url: '/pages/entry/entry',
						});
					} else {
						return uni.reLaunch({
							url: '/pages/entry/choose',
						});
					}
				} else if (res.statusCode === 201) { //完善信息201
					uni.setStorageSync('token', res.data.accessToken);
					if (res.header.Location == '/api/staff') {
						return uni.reLaunch({
							url: '/pages/registerStaff/registerStaff?agree=1',
						});
					}
				} else {
					// uni.showToast({
					// 	title: res.data.message,
					// 	icon: "none"
					// });
					reject(res)
				}
			},
			fail: (err) => {
				/* 可做一些全局错误提示，如网络错误等 */
				if (err.errMsg == "request:fail") {
					uni.showToast({
						title: "网络连接失败,请检查设备的网络通信是否正常",
						icon: "none",
						duration: 4000
					});
				} else {
					uni.showToast({
						title: "网络请求失败,请联系管理员",
						icon: "none"
					});
				}
				reject(err)
			},
			complete: (complete) => {
				ajaxTimes--;
				if (ajaxTimes === 0) {
					//  关闭正在等待的图标
					uni.hideLoading({
						fail() {}
					});
				}
			}
		})

	})
}
export default {
	baseRequest
}
