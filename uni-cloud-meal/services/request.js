import config from './config.js'
import md5 from '../common/md5.js'
// var md5 = require('../common/md5.js'); //md5加密

//接口认证码 token  num:接口编号 md5加密转大写
function authCode(num, timestamp) {
	//当前时间戳
	var SecretObj = {
		interfaceNum: num, //接口编号
		timestamp: timestamp
	}
	// console.log('加密串：'+JSON.stringify(SecretObj))
	return md5.hexMD5(JSON.stringify(SecretObj)).toUpperCase()
}

function myRequest(url, data, commonData, method) {

	var timestamp = Date.parse(new Date())
	timestamp = (timestamp / 1000).toString()
	var tokenValue = wx.getStorageSync('token')
	// console.log(tokenValue)
	if (!method)
		method = 'POST';
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		uni.request({
			url: url,
			method: method,
			data: data,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'token': tokenValue,
				'wincomeflag': authCode(commonData.authCode, timestamp),
				'wincometimestamp': timestamp
			},
			success: (res) => {
				// console.log(res)
				// 请求成功
				if (res.statusCode === 200) {
					resolve(res)
				}
				// 请求成功无响应体
				else if (res.statusCode === 204) {
					/* 
					可做一些成功提示，
					如调用wx.showToast()、wx.showModal()或自定义弹出层等 
					*/
					uni.showToast({
						title: res.data.msg || '服务端失败',
						icon: 'none'
					});
					resolve(res)
				} else if (res.statusCode === 401) { // 未认证
					/* 可做一些错误提示，或者直接跳转至登录页面等 */
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return uni.reLaunch({
						url: '/pages/login/login',
					});
					reject(res)
				} else if (res.statusCode == 400) {
					/* 可做一些错误提示*/
					reject(res)
				} else if (res.statuCode === 403) {
					/* 无权限错误提示*/
					reject(res)
				}
			},
			fail: (err) => {
				/* 可做一些全局错误提示，如网络错误等 */
				wx.hideLoading()
				uni.showToast({
					title: err.errMsg || '请求失败',
					icon: 'none'
				});
				reject(err)
			},
			complete: () => {
				uni.hideLoading();
			}
		})

	})
}
export {
	myRequest
}
