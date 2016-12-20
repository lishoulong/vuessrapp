const state = {
	payType: 1
}

const mutations = {

	CHANGE_PAYTYPE (state, payValue) {
		state.payType = payValue
	}
}

export default {
	state,
	mutations
}
