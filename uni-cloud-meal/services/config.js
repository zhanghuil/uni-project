/**
 * 小程序配置文件
 */

//  接口域名
const domain = 'https://soa.wincome.group';

var config = {
  //接口列表
  api: {
    /* 用户相关 */
    GetStaffInfo: `${domain}/staffOrderWxApi/api/StaffOrder/GetStaffInfo`, //用户信息

    /* 菜谱相关 */
  },
  // 获取接口方法
  getAPI(key) {
    let url;
    if (config && config.api) url = config.api[key]
    return url
  }
};

module.exports = config