

/**
 *  58app native bridge 交互 adapter层
 *
 *  因为有些api参数较多，为了屏蔽参数顺序问题，所有封装的参数全部以object对象形式传入
 *
 *  58app API 链接：https://apptest.58.com/static/doc/58app/index.html#!/api/app58
 *
 */

import _ from 'underscore'

import CallApp from './callApp'

const nativeFunc = {

	/**
	 *  判断58app 是否支持微信登录（版本号）
	 */
	supportWx(){
		return WBAPP.appVersion >= '7.0.6'
	},

	/**
	 *  埋点功能函数
	 *  @param {Object} params
	 * 				   -{String} actiontype 必填项  埋点统计的动作类型
	 *  			   -{String} pagetype   必填项  埋点统计页面类型
	 *  			   -{String} [cate]     选填项  埋点统计页面分类 fullPath
	 * 				   -{Array}  params     选填项  埋点参数
	 *
	 */
	setWebLog(params){
		WBAPP.setWebLog(params.actiontype, params.pagetype, params.cate, params.params)
	},

	/**
	 *  调用native页面跳转功能
	 *  @param {Object} params
	 *                 -{String} pagetype   必填项 页面类型[childcate|list|detail|link|publish|
	 *                                                     backreload|mypublish|usercenterbusiness]
	 *                 -{String} url        必填项 页面url
     *		           -{String} title      必填项，页面标题
	 *	               -{Boolean} showarea  选填项，是否在title上显示区域筛选
     *                 -{Boolean} showpub   选填项，是否在title上显示发布按钮
     *                 -{Boolean} isfinish  选填项，跳转到目标页面，源页面是否需要关闭
	 *                 -{String} top_right  选填项，取值 sou/map/hide 附近页面title右上角显示搜索按钮还是地图按钮还是隐藏
     *                 -{Boolean} is_recent 选填项，是否需要记录最近访问的页面。专用首页足迹
     *                 -{Boolean} showsift  选填项，是否显示筛选记录
     *                 -{Boolean} backtoroot  选填项，标明点击返回键webview是否直接返回上一页面
     *                 -{Sttring} anim      选填项，如果传slideinbottom则表示执行登录页面那种由底部到顶部的动画
	 */
	loadPage (params){
		WBAPP.loadPage(params.pagetype, params.url, params.title, params.showarea, params.showpub,
			           params.isfinish, params.top_right, params.is_recent, params.showsift,
			           params.backtoroot, params.anim);
	},

	/**
	 *  调用native设置title功能
     *  @param {Object} params
     *                 -{String} title  必填项，title内容
     *                 -{String} cmd    选填项，右边按钮是否隐藏，默认是show不做操作
	 */
	 setTitle(params) {
	 	params.cmd ? "" : params.cmd = "show"
	 	WBAPP.setTitle(params.title, params.cmd);
	 },

	 /**
	  *
	  */
	login(callback){
		let callbackId = _.uniqueId('login');

		window[callbackId] = (err)=>{

			callback(err);
			//delete window[callbackId]
		}
		WBAPP.thirdLogin('wechat',callbackId);
	},

	/**
	 *  native toast.
	 */
	toast(msg) {
		if(!msg) return;
		if(process.env.NODE_ENV !== 'production') {
			alert(msg)
		}else{
			WBAPP.toastMsg(msg);
		}
	},

	/*
	 *   调起（下载）转转app
	 */
	 callZZApp(opts){
		 let callApp = new CallApp();
		 callApp.start(opts);
	 },

	/**
	 *  调用native扩展右上放按钮功能
	 *  @param {String} type 必填项，top_right/add_subscription/edit_subscription
	 *  @param {String} text  必填项，必填项，显示内容
	 *  @param {String} callback 必填项，回调函数
	 *
	 */
	extendRightBtn(type, text, callback){
		if(type && text && callback){
			WBAPP.extendRightBtn(type, text, callback);
		}
	}
}

export default nativeFunc
