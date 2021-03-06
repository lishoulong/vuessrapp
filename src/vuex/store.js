

import Vue  from "vue"
import Vuex from "vuex"
import address from "./modules/address.js"
import login from './modules/login.js'
import localStore from './modules/localStore.js'
import zhijian from './modules/zhijian.js'
import payafter from './modules/payafter.js'
import * as actions from './actions'
import * as getters from './getters'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		address,
		login,
		localStore,
		zhijian,
		payafter
	},
	actions,
	getters,
	strict: debug,
})
