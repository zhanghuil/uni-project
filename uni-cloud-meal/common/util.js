/**
 * 根据key查找数据中对应的值
 */
const SearchData = (key, data) => {
	var value = '';
	var i = 0;
	while (i < data.length) {

		if (key == data[i].key) {
			value = data[i].title;
			break;
		} else {
			i++;
			continue;
		}
	}
	return value;
}

/**
 * 根据key查找数据中对应角标
 */
const SearchDataIndex = (key, data) => {
	var value = '';
	var i = 0;
	while (i < data.length) {

		if (key == data[i].key) {
			value = i;
			break;
		} else {
			i++;
			continue;
		}
	}
	return value;
}
/**
 * 格式化日期
 * 参数1: date 对象
 * 参数2: fmt: 'yyyy', 'yyyy-MM-dd', 'yy-MM-dd', 'yyyy-MM-dd hh:mm:ss', ...(按需求自己定义格式)
 */
const formatDate = (date, fmt) => {
	if (typeof date == 'string') {
		return date;
	}

	if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";

	if (!date || date == null) return null;
	var o = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds() // 毫秒
	}
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[
			k]).substr(('' + o[k]).length)))
	}
	return fmt
}


/**
 * 获取用于显示的星期和日期时间
 * @param date
 * @returns {string}
 */
const getWeek = (date) => {
	//将字符串日期转换日期对象
	date = date.replace(/-/g, '/');
	var dd = new Date(date);
	var curDate = new Date();
	var curDate2 = new Date();
	var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
	var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
	var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
	var mynum = dd.getDay();

	var week, weekdate;
	var curMd = curDate.getMonth() + 1 + "-" + curDate.getDate();
	var md = dd.getMonth() + 1 + "-" + dd.getDate();
	//昨天
	curDate2.setDate(curDate2.getDate() - 1);
	var curMd2 = curDate2.getMonth() + 1 + "-" + curDate2.getDate();
	//时间
	var hour = dd.getHours() < 10 ? "0" + dd.getHours() : dd.getHours();
	var minutes = dd.getMinutes() < 10 ? "0" + dd.getMinutes() : dd.getMinutes();
	/*
	if (curMd == md) {
		week = "今天";
		weekdate = hour + ":" + minutes;
	} else if (curMd2 == md) {
		week = "昨天";
		weekdate = hour + ":" + minutes;
	} else {
		week = weekday[mynum];
		weekdate = m + "-" + d;
	}
	return week + "|" + weekdate;*/
	week = weekday[mynum];
	return week;
}

/**
 * 分组
 * list:原始数据。
 * fn:分组条件判断函数，之后会根据该函数返回的结果进行分组，其有一个参数表示数组的某一项数据。
 */
const groupBy = (list, fn) => {
	const groups = {};
	list.forEach(function(o) {
		const group = JSON.stringify(fn(o));
		groups[group] = groups[group] || [];
		groups[group].push(o);
	});
	// return Object.keys(groups).map(function (group) {
	//     return groups[group];
	// });
	return groups;
}

// const groupBy=( array , id )=> {
//     let groups = {};
//     array.forEach( function( o ) {
//         let group = JSON.stringify( o[id] );
//         groups[group] = groups[group] || [];
//         groups[group].push( o );
//     });
//     return Object.values(groups);
// }

module.exports = {
	SearchData,
	SearchDataIndex,
	formatDate,
	getWeek,
	groupBy
}
