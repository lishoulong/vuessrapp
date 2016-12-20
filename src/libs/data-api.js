
import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const IM_PREFIX = "//grzhuanzhuan.58.com/";

const API = {

	GET_INFO_BY_ID: 'getInfoById',

	CREATE_ORDER: 'createOrder',

	GET_DEFAULT_ADDRESS: 'getDefaultAddress',

	GET_CAPTCHA: 'getCaptcha',

	LOGIN_BY_SMS: 'loginBySms',

	GET_INFO_COMMENTS: 'getInfoComments',

	GET_RECOMMEND_INFOS: 'getMlistingDetailRecommendInfos',

	GET_RECOMMEND_FOR_VISIT: 'getrecommendforvisit',

	GET_BUY_ORDER: 'getBuyOrders',

  GET_PAY: 'getPay',

  IS_PAY_SUCCESS: 'isPaySuccess',

	GET_ZZM_LISTING_INFO_LIST: 'getZZMListingInfoList',

	USER_LOGIN: IM_PREFIX + 'user_login',

	GET_LAST_CONTACTS: IM_PREFIX + 'getlastcontacts',

	GET_OFFLINE_MSG_COUNT: IM_PREFIX + 'getofflinemsgcount',

	MSG_OFFLINE: IM_PREFIX + 'msg_offline',

	GET_ONLINE_MSG: IM_PREFIX + 'getonlinemsg',

	MSG_SEND: IM_PREFIX + 'msg_send',

	USER_PICK: IM_PREFIX + 'user_pick',

	GET_ORDER_UNREAD: 'getOrderUnread',

	GET_RECOMMEND_FOR_PAY: 'getRecommendForPay',

	GET_ORDER: 'getOrder',

	GET_ORDER_SERVICE: 'getOrderService',

  GET_PAY_SUCCESS_INFO: 'getPaySuccessInfo',

	REMIND_DELIVERY: 'remindDeliverGood',

	GET_ORDER_MSG: 'getOrderMsg',

	GET_NICKNAME_AND_PHOTO: 'getNickNameAndPhoto',

  UPDATE_ADDRESS: 'updateAddress',

  GET_INFOS_BY_USER_ID: 'getInfosByUserId',

  QUERY_TAGS: 'query',

	GET_INFO_SIMPLE_DETAIL: 'getInfoSimpleDetail',

  CANCEL_ORDER: 'cancelOrder',

	REMIND_DELIVER_GOOD: 'remindDeliverGood',

  ADD_ADDRESS: 'addAddress',

	GET_ZHIJIAN: 'getServices',

	LOGIN_BY_58ID: 'loginBy58Id',

	GET_INFO_FOR_ORDER: 'getInfoForOrder',

};

/**
 *  Encapsulate `getrecommendforvisit` interface
 *
 *  @param {String} infoid
 *  @param {String} metric
 *  @return {Promise} With get recommend list.
 */
export const getrecommendforvisit = params => {
	return Vue.http.jsonp(API.GET_RECOMMEND_FOR_VISIT, { params });
};

/**
 *  Encapsulate `getInfoById` interface
 *
 *  @param {String} infoId
 *  @return {Promise} With product info.
 */
export const getProduct = ({infoId, metric = ""}) => {

	return Vue.http.jsonp(API.GET_INFO_BY_ID, {
		params: { infoId : infoId, metric : metric }
	});

 };
/**
 *  Encapsulate `getInfoForOrder` interface
 *
 *  @param {String} infoId
 *  @return {Promise} With product info.
 */
export const getInfoOrder = (infoId) => {
	return Vue.http.jsonp(API.GET_INFO_FOR_ORDER,{
		params:{infoId : infoId, countNum : 0}
	});
};
/**
 *  Encapsulate `getServices` interface,created by lishoulong
 *
 *  @param {String} infoId
 */
export const getZhiJian = (infoId) => {
	return Vue.http.jsonp(API.GET_ZHIJIAN, {
		params:{infoId : infoId, payType : 0}
	})
};
/**
 *  Encapsulate `getInfoComments` interface
 *
 *  @param {String} infoId
 *
 */
export const getInfoComments = infoId => {

	return Vue.http.jsonp(API.GET_INFO_COMMENTS, {
		params: { infoId }
	});

};
/**
 *  Encapsulate `getMlistingDetailRecommendInfos` interface
 *
 *  @param {String} infoId
 *
 */
export const getRecommendInfos = infoId => {

	return Vue.http.jsonp(API.GET_RECOMMEND_INFOS, {
		params: { Isapp : true,
              infoId : infoId }
	});

};

/**
 *  Encapsulate `createOrder` interface
 *
 *  @param {Object} params
 *                  - {String} infoId
 *                  - {String|Integer} addressId
 *                  - {String|Integer} packId
 *  @return {Promise} with createdOrder infos.
 */
export const createOrder = (params) => {

	return Vue.http.jsonp(API.CREATE_ORDER, { params });

};

/**
 *  Encapsulate `getDefaultAddress` interface
 *
 *  @return {Promise}  With address info
 *
 */

 export const getDefaultAddress = () => {
    return Vue.http.jsonp(API.GET_DEFAULT_ADDRESS);
 };

 /**
  *  Encapsulate `getCaptcha` interface
  *  获取验证码
  *
  *  @param {String} mobile
  *  @return {Promise} with { xxzl_cp, captcha_type }
  */

  export const getCaptcha = (mobile) => {

  	  return Vue.http.jsonp(API.GET_CAPTCHA, {
  	  	  params: {
  	  	  	type: 4,
  	  	  	level: 4,
  	  	  	len: 4,
  	  	  	mobile: mobile
  	  	  }
  	  });
  };

  /**
   * Encapsulte `loginBySms` interface
   * @param {Object} params
   *                 -{Integer}  type  4|6
   *                 -{String}   mobile
   *                 -{Integer|String}  xxzl_cp
   *                 -{Integer|String}  captcha_input
   *                 -{String}   mtoken
   *                 -{Integer}  captcha_type
   * @return {Promise}
   */
  export const loginBySms = (params) => {

  		return Vue.http.jsonp(API.LOGIN_BY_SMS, { params });
  };


/**
 *  Encapsulate `getBuyOrders` interface
 *
 * 	@param {Object}	pageSize,pageNum
 *	@return {Promise}  With get buy order
 */
export const getBuyOrders = (pageObj) => {

	return Vue.http.jsonp(API.GET_BUY_ORDER, {
		params: pageObj
	});

};


/**
 *  Encapsulate `getPay` interface
 *
 *  @param {Object} params
 *                  -{String|Integer} orderId
 *                  -{String|Integer} payId
 *  @return {Promise} with pay info, attention the `deeplink` feild.
 */
 export const getPay = (params) => {
   return Vue.http.jsonp(API.GET_PAY, { params });
 };

 /**
  *  Encapsulate `isPaySuccess` interface
  *
  *  @param {Object} params
  *                  -{String|Integer} orderId
  *                  -{String|integer} payId
  *  @return {Promise} with the result of pay.
  *                  -{Boolean} success
  */
  export const isPaySuccess = (params) => {
    return Vue.http.jsonp(API.IS_PAY_SUCCESS, { params });
  };

/**
 *  Encapsulate `getZZMListingInfoList` interface
 *
 * 	@param {Object}	pageSize,pageNum,Isapp
 *	@return {Promise}  With get recommend
 */
export const getZZMListingInfoList = (pageObj) => {

	return Vue.http.jsonp(API.GET_ZZM_LISTING_INFO_LIST, {
		params: pageObj
	});

};

/**
 *  Encapsulate `user_login` interface
 *
 * 	@param {Object}	uid, source, pc_code, client_version, token, ostype
 *	@return {Promise}  chat login
 */
export const user_login = (params) => {

	return Vue.http.jsonp(API.USER_LOGIN, { params });

};

/**
 *  Encapsulate `getlastcontacts` interface
 *
 * 	@param {Object}	pagenum, pagesize, uid, source
 *	@return {Promise}  chat get contacts
 */
export const getlastcontacts = (params) => {

	return Vue.http.jsonp(API.GET_LAST_CONTACTS, { params });

};

/**
 *  Encapsulate `getofflinemsgcount` interface
 *
 * 	@param {Object}	source, uid, msgtype
 *	@return {Promise}  chat get offline count
 */
export const getofflinemsgcount = (params) => {

	return Vue.http.jsonp(API.GET_OFFLINE_MSG_COUNT, { params });

};

/**
 *  Encapsulate `getOrderUnread` interface
 *
 *	@return {Promise}  chat get contacts
 */
export const getOrderUnread = () => {

	return Vue.http.jsonp(API.GET_ORDER_UNREAD);

};

/**
 *  Encapsulate `getRecommendForPay` interface.
 *
 *  @param {Object} params
 *                  -{Integer} pageSize
 *                  -{Integer} pageNum
 *                  -{Integer} cateId
 *
 *  @return {Promise} with infos for recommend at pay success page.
 */
export const getRecommendForPay = (params) => {

  return Vue.http.jsonp(API.GET_RECOMMEND_FOR_PAY, { params })
}


/**
 *  Encapsulate `getOrder` interface.
 *
 *  @param {String|Integer} orderId
 *
 *  @return {Promise}  with order infos.
 */
export const getOrder = (orderId) => {
  return Vue.http.jsonp(API.GET_ORDER, { params:{
    orderId
  }})
}


/**
 *  Encapsulate `getOrderService` interface.
 *
 *  @param {String|Integer} orderId
 *
 *  @return {Promise} with zhijianService infos.
 *
 */
export const getOrderService = (orderId) => {
  return Vue.http.jsonp(API.GET_ORDER_SERVICE, { params:{
    orderId
  }})
}


 /**
 * Encapsulate `getPaySuccessInfo` interface.
 *
 * @param {String|Integer} orderId
 *
 * return {Promise} with zhijianOrderInfo infos.
 *
 */
export const getPaySuccessInfo = (orderId) => {
  return Vue.http.jsonp(API.GET_PAY_SUCCESS_INFO, { params:{
    orderId
  }})
}


/**
 *  Encapsulate `remindDeliverGood` interface.
 *
 *  @param {String|Integer} orderId
 *
 *  @return {Promise}  nothing just a request tip.
 */
export const remindDeliverGood = (orderId) => {
  return Vue.http.jsonp(API.REMIND_DELIVERY, { params:{
    orderId
  }})
}


/**
 *  Encapsulate `getOrderMsg` interface.
 *  @param {Object} params.
 *                  -{Integer} pageNum.
 *                  -{Integer} pageSize.
 *  @return {Promise} with order msgs info.
 */
 export const getOrderMsg = (params) => {
  return Vue.http.jsonp(API.GET_ORDER_MSG, { params })
 }

/**
 *  Encapsulate `get NickName And Photo` interface.
 *  @param {String} userids.
 *  @return {Promise} with order msgs info.
 */
export const getNickNameAndPhoto = (params) => {
	return Vue.http.jsonp(API.GET_NICKNAME_AND_PHOTO, { params })
}


/**
 *  Encapsulate `get offline message` interface.
 *  @param {Object} params
 *  				-{String} start_tiem.
 *                  -{String} start_id.
 *                  -{Integer} source.
 *                  -{Integer} uid.
 *                  -{Integer} umsgtype.
 *  @return {Promise} with order msgs info.
 */
export const msg_offline = (params) => {
	return Vue.http.jsonp(API.MSG_OFFLINE, { params })
}

/**
 *  Encapsulate `get offline message` interface.
 *  @param {Object} params

 *  @return {Promise} true.
 */
export const updateAddress = (params) => {
  return Vue.http.jsonp(API.UPDATE_ADDRESS, { params })
}

/**
 *  Encapsulate `cancelOrder` interface.
 *  @param {Object} params
 *                 -{String|Integer} orderId
 *                 -{String}    cancel reason.
 *  @return {Promise} true.
 */
export const cancelOrder = (params) => {
  return Vue.http.jsonp(API.CANCEL_ORDER, { params })
}

/**
 *  Encapsulate `getInfosByUserId` interface.
 *  @param {Object} params
 *                 -{String|Integer} userId
 *  @return {Promise} infos.
 */
export const getInfosByUserId = (params) => {
  return Vue.http.jsonp(API.GET_INFOS_BY_USER_ID, { params })
}

/**
 *  Encapsulate `query` interface.
 *  @param {Object} params
 *                 -{String|Integer} userId
 *  @return {Promise} tags.
 */
export const queryTags = (params) => {
  return Vue.http.jsonp(API.QUERY_TAGS, { params })
}


/**
 *  Encapsulate `get goods info` interface.
 *  @param {Object} params
 *  				-{String} infoId
 *  				-{String} otherId

 *  @return {Promise} true.
 */
export const getInfoSimpleDetail = (params) => {
	return Vue.http.jsonp(API.GET_INFO_SIMPLE_DETAIL, { params })
}

/**
 *  Encapsulate `get online msg` interface.
 *  @param {Object} params
 *  				-{Number} source
 *  				-{String} uid
 *  				-{String} touid
 *  				-{Number} msgcount
 *  				-{String} starttimestamp

 *  @return {Promise} true.
 */
export const getOnlineMsg = (params) => {
	return Vue.http.jsonp(API.GET_ONLINE_MSG, { params })
}

/**
 *  Encapsulate `msg_send` interface.
 *  @param {Object} params
 *  				-{Number} source
 *  				-{String} uid
 *  				-{String} from_uid
 *  				-{String} to_uid
 *  				-{Number} time
 *  				-{String} msgid
 *  				-{String} n
 *  				-{String} sid
 *  				-{String} msg_data

 *  @return {Promise} true.
 */
export const sendMsg = (params) => {
	return Vue.http.jsonp(API.MSG_SEND, { params })
}

/**
 *  Encapsulate `user_pick` interface.
 *  @param {Object} params
 *  				-{Number} source
 *  				-{String} uid

 *  @return {Promise} true.
 */
export const userPick = (params) => {
	return Vue.http.jsonp(API.USER_PICK, { params })
}

/**
 *  Encapsulate `remindDeliverGood` interface.
 *  @param {Object} params
 *  				-{String} orderId

 *  @return {Promise} true.
 */
export const remind = (params) => {
	return Vue.http.jsonp(API.REMIND_DELIVER_GOOD, { params })
}

export const addAddress = (params) => {
  return Vue.http.jsonp(API.ADD_ADDRESS, { params })
}

export const loginBy58Id = (params) => {
	return Vue.http.jsonp(API.LOGIN_BY_58ID, { params })
}
