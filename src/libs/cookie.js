/**
 *  Cookie 操作的基本类库，api请参照 https://github.com/js-cookie/js-cookie
 *
 *  关于几个特定的cookie值操作   zzu   zz_uid 之类的  请统一使用下面的常量
 *
 */

import Cookies from 'js-cookie'

import _ from 'underscore'

//const COOKIE_T_VALUE = 21

let customCookies = Cookies.withConverter({
	write(value, key){
		return value
	},
	read(value){
		return value
	}
})


export default _.extend(customCookies, {

	COOKIE_OPTION: { expires: 10, domain: '58.com', path: '/'},
	COOKIE_TK: 'tk',
	COOKIE_ZZU: 'ZZU',
	COOKIE_T: 'zz_t',
	COOKIE_T_VALUE: 21,
	COOKIE_UID: 'zz_uid',

	getZZU() {
		return customCookies.get(this.COOKIE_ZZU)
	},

	getUID() {
		return customCookies.get(this.COOKIE_UID)
	}
})