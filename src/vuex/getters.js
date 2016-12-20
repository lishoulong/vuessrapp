
export const addrMaps = state => {
	return state.address.addrMap
}

export const defaultAddr = state => {
	return state.address.defaultAddr
}

export const selectedCity = state => {
	return state.address.selectedCity;
}

export const selectedArea = state => {
	return state.address.selectedArea;
}


export const selectedAddr = state => {
	return {
		city: state.address.selectedCity,
		area: state.address.selectedArea
	}
}

export const redirect = state => {
	return state.login.redirect
}

export const chatList = state => {
	return state.localStore.chatList;
}

export const systemList = state => {
	return state.localStore.systemList;
}

export const orderId = state => {
	return state.zhijian.orderId;
}

export const payType = state => {
	return state.payafter.payType;
}
