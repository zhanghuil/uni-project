/**
 * 小程序配置文件
 */


let url_config = ""

if (process.env.NODE_ENV === 'development') {
	// 开发环境
	url_config = 'http://192.172.2.78:3915'
} else {
	// 生产环境
	url_config = 'https://soa.wincome.group'
}

export default url_config
