
import * as types from './mutations-types'

export const  changeDefaultAddr = (context, addr) => {

	context.commit(types.CHANGE_DEFAUTL_ADDR, addr)

}

export const selectCity = (context, city) => {

	context.commit(types.SELECT_CITY, city)

}

export const selectArea = (context, area) => {

	context.commit(types.SELECT_AREA, area)

}

export const changeDefaultAddrCityArea = (context, cityArea) => {
	context.commit(types.CHANGE_DEFAUTL_ADDR_CITY_AREA, cityArea)
}

export const changeRedirect = (context, redirectInfo) => {
	context.commit(types.CHANGE_REDIRECT, redirectInfo)
}

export const setChatList = (context, chatList) => {
	context.commit(types.SET_CHATLIST, chatList)
}

export const changeDefaultAddrMobile = (context, mobile) => {
	context.commit(types.CHANGE_DEFAUTL_ADDR_MOBILE, mobile)
}

export const changeDefaultAddrName = (context, name) => {
	context.commit(types.CHANGE_DEFAUTL_ADDR_NAME, name)
}

export const changeDefaultAddrDetail  = (context, detail) => {
	context.commit(types.CHANGE_DEFAUTL_ADDR_DETAIL, detail)
}
export const setSystemList = (context, systemList) => {
	context.commit(types.SET_SYSTEMLIST, systemList)
}
export const changeOrderId = (context, orderName) => {
	context.commit(types.CHANGE_ORDERID, orderName)
}
export const changePayType = (context, payValue) => {
	context.commit(types.CHANGE_PAYTYPE, payValue)
}
