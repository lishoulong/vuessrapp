
import {

  CHANGE_ORDERID

} from '../mutations-types'

const state = {
  orderId: null
}

const mutations = {

  CHANGE_ORDERID (state, order) {
    state.orderId = order
  }
}

export default {
	state,
	mutations
}
