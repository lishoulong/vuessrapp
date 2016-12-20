

import { getCaptcha, loginBySms, loginBy58Id } from '../../libs/data-api'
import Cookies from '../../libs/cookie'

let [tempId, tempType] = ['', '']

let token = /ios/.test( Cookies.get("os") ) ? Cookies.get("openudid") : Cookies.get("cimei")

export function requestCode(mobile) {

	getCaptcha(mobile).then(response => {

		if(response.data.respCode == 0) {
			tempId = response.data.respData.id
			tempType = response.data.respData.type
		}

	})
}

export function login58Id(params) {
	return loginBy58Id(params)
}

export function loginSms(mobile, code) {

	return loginBySms({
			mobile,
			type: 4,
			xxzl_cp: tempId,
			captcha_input: code,
			captcha_type: tempType,
			mtoken: token
		})
}
