
import {

  CHANGE_DEFAUTL_ADDR,
  SELECT_CITY,
  SELECT_AREA,
  CHANGE_DEFAUTL_ADDR_MOBILE,
  CHANGE_DEFAUTL_ADDR_NAME,
  CHANGE_DEFAUTL_ADDR_CITY_AREA,
  CHANGE_DEFAUTL_ADDR_DETAIL

} from '../mutations-types'

const state = {
	defaultAddr: {},
	currentAddr: null,
	selectedCity: null,
	selectedArea: null,
}

const mutations = {

	CHANGE_DEFAUTL_ADDR (state, addr) {
		state.defaultAddr = addr
	},
	SELECT_CITY (state, city) {
		state.selectedCity = city
	},
	SELECT_AREA (state, area) {
		state.selectedArea = area
	},
	CHANGE_DEFAUTL_ADDR_MOBILE (state, mobile) {
		state.defaultAddr.mobile = mobile
	},
	CHANGE_DEFAUTL_ADDR_NAME (state, name) {
		state.defaultAddr.name = name
	},
	CHANGE_DEFAUTL_ADDR_CITY_AREA (state, city) {
		state.defaultAddr.city = city

	},
	CHANGE_DEFAUTL_ADDR_DETAIL (state, detail) {
		state.defaultAddr.detail = detail
	}

}

export default {
	state,
	mutations
}