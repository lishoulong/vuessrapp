


/**
 *  convert milliseconds to time by format.
 *
 *  eg: YYYY-MM-dd-hh-mm-ss
 */
export const dateFormat = (milliseconds, format = 'YYYY-MM-dd') => {

	let date = new Date(milliseconds)

	let set = {
		//"Y+": date.getFullYear(),
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
	}

	if(/(Y+)/.test(format)) {
		format = format.replace(RegExp.$1, date.getFullYear().toString().substr(4 - RegExp.$1.length))
	}

	for(var key in set) {
		if( new RegExp(`(${key})`).test(format) ) {
			format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (set[key]) :  (("00" + set[key]).substr(("" + set[key]).length)) )
		}
	}

	return format
}


/**
 *  计算倒计时
 *  @params {Integer} milliseconds 距离截止时间的毫秒数
 *  @params {}
 *  @return {String}
 */

 export const countDown = (milliseconds) => {

 	let [perDay, perHour, perMin] = [24*60*60*1000, 60*60*1000, 60*1000]

 	let [day, hour, min] = [ Math.floor(milliseconds/perDay), Math.floor(milliseconds%perDay/perHour), Math.floor(milliseconds%perHour/perMin) ]

 	return day > 0 ? `${day}天${hour}小时${min}分` :
 	               hour > 0 ? `${hour}小时${min}分` :
 	               min > 0 ? `${min}分`: ''
 }

/**
 * 解决58埋的cookie值居然有带 '"'
 */
 export const  adapterCookie =  (val) => {

     if(typeof val == 'string' && val[0] == '"'){

         return val.substring(1,val.length - 1)
     }
     else {
         return val;
     }
 }

/**
 * 兼容cookie没有uid的情况  从ppu解uid
 */
export const  getUidByPPU = (ppu) => {
 	var uid = '';
 	if(ppu){
 		uid = /UID=([^&=]+)\&.*/ig.exec(ppu);
 		uid && (uid = uid[1]);
 	}
 	return uid;
}

//获取滚动条当前的位置
export const getScrollTop = () => {
		let scrollTop = 0;
		if (document.documentElement && document.documentElement.scrollTop) {
				scrollTop = document.documentElement.scrollTop;
		} else if (document.body) {
				scrollTop = document.body.scrollTop;
		}
		return scrollTop;
}

//获取当前可视范围的高度
export const getClientHeight = () => {
		let clientHeight = 0;
		if (document.body.clientHeight && document.documentElement.clientHeight) {
				clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
		} else {
				clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
		}
		return clientHeight;

}

//获取文档完整的高度
export const getDocHeight = () => {
		return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

/**
 * http协议转成成相对协议的过滤器
 * */
export const formatProtocol = url => {
	const re = /^(http:)/;
	if(re.test(url)){
		url.replace(re, "");
	}
	return url
}
