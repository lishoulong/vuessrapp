
import * as types from './mutations-types'

export const  changeDefaultAddr = ({ dispatch }, addr) => {

	dispatch(types.CHANGE_DEFAUTL_ADDR, addr)

}

export const selectCity = ({ dispatch }, city) => {

	dispatch(types.SELECT_CITY, city)

}

export const selectArea = ({ dispatch }, area) => {

	dispatch(types.SELECT_AREA, area)

}

export const changeDefaultAddrCityArea = ({ dispatch }, cityArea) => {
	dispatch(types.CHANGE_DEFAUTL_ADDR_CITY_AREA, cityArea)
}

export const changeRedirect = ({ dispatch }, redirectInfo) => {
	dispatch(types.CHANGE_REDIRECT, redirectInfo)
}

export const setChatList = ({ dispatch }, chatList) => {
	dispatch(types.SET_CHATLIST, chatList)
}

export const changeDefaultAddrMobile = ({ dispatch }, mobile) => {
	dispatch(types.CHANGE_DEFAUTL_ADDR_MOBILE, mobile)
}

export const changeDefaultAddrName = ({ dispatch }, name) => {
	dispatch(types.CHANGE_DEFAUTL_ADDR_NAME, name)
}

export const changeDefaultAddrDetail  = ({ dispatch }, detail) => {
	dispatch(types.CHANGE_DEFAUTL_ADDR_DETAIL, detail)
}
export const setSystemList = ({ dispatch }, systemList) => {
	dispatch(types.SET_SYSTEMLIST, systemList)
}
export const changeOrderId = ({dispatch}, orderName) => {
	dispatch(types.CHANGE_ORDERID, orderName)
}
export const changePayType = ({dispatch}, payValue) => {
	dispatch(types.CHANGE_PAYTYPE, payValue)
}
