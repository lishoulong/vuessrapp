
import { session as sessionStorage } from '../../libs/store'

const state = {
	redirect:
	    sessionStorage.get('redirect', {
				name: 'mine',
				param: null
			})
}

const mutations = {

	CHANGE_REDIRECT (state, redirectInfo) {
		state.redirect = redirectInfo
		sessionStorage.set('redirect', redirectInfo)
	}
}

export default {
	state,
	mutations
}
