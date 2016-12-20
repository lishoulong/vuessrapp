
import Vue from 'vue'

import VueResource from 'vue-resource'

import Cookies from '../libs/cookie'

import store from '../vuex/store'

import {local as localStore} from '../libs/store'

import { CHANGE_REDIRECT } from '../vuex/mutations-types'

import Native from '../libs/native'

import * as Api from '../libs/data-api'

Vue.use(VueResource)

let isLogin = false

const supportWx = false

const WX_AUTH_FAIL_TIP = "微信登录授权失败!"


function adapterCookie (val) {
    // 解决58埋的cookie值居然有带 '"'
    if(typeof val == 'string' && val[0] == '"'){

        return val.substring(1,val.length - 1)
    }
    else {
        return val;
    }
}

function getUidByPPU (ppu) {
	var uid = '';
	if(ppu){
		uid = /UID=([^&=]+)\&.*/ig.exec(ppu);
		uid && (uid = uid[1]);
	}
	return uid;
}

function serialize (obj) {
	var arr = []
	for(var p in obj) {
		if(p)
		arr.push(p+"="+ encodeURIComponent(obj[p]));
	}
	return arr.join("&");
}

function formatParams(data) {
	var arr = [];
	for (var name in data) {
		arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
	}
	arr.push(("v=" + Math.random()).replace(".",""));
	return arr.join("&");
}

function ajax(options){
	options = options || {};
	options.type = (options.method || "GET").toUpperCase();
	options.dataType = options.dataType || "json";
	var params = formatParams(options.data);
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xhr.withCredentials = true;
	xhr.onreadystatechange = function () {
		//alert(`${xhr.readyState}, ${xhr.status}, ${xhr.responseText}`);
		if (xhr.readyState == 4) {
			var status = xhr.status;
			if (status >= 200 && status < 300 || xhr.status == 304 || xhr.status == 0) {
				options.success && (xhr.responseText) && options.success( JSON.parse(xhr.responseText) );
			} else {
				options.fail && options.fail(status);
			}
		}
	}
	if (options.type == "GET") {
		xhr.open("GET", options.url + "?" + params, options.async != undefined ? options.async : true);
		xhr.send(null);
	} else if (options.type == "POST") {
		xhr.open("POST", options.url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(params);
	}
}

const login = {

	loginBy58(callback, to) {
		var ppu = adapterCookie( Cookies.get('PPU') ),		// PPU
			wubaid = adapterCookie( Cookies.get('uid') ) || adapterCookie(getUidByPPU(Cookies.get('PPU'))),   // uid
		    data = {
		        wubaid : wubaid,
		        ppu : ppu
		    };
		var url = "";
			if(location.protocol == 'https:'){
				url = 'https://zhuan.58.com/zz/transfer/loginBy58Id';
			} else {
				url = 'http://zhuanzhuan.58.com/zz/transfer/loginBy58Id';
			}
			ajax({
				url : url,
				data : data,
				method: 'get',
				async: false, // 使用同步
				success : function (res) {
					var code = res.respCode,
						data = res.respData;
					if(0 == code){
						Cookies.set(Cookies.COOKIE_ZZU, data.ppu, Cookies.COOKIE_OPTION);
						Cookies.set(Cookies.COOKIE_UID, data.uid, Cookies.COOKIE_OPTION);
						Cookies.set("zz_mobile", data.mobile, Cookies.COOKIE_OPTION);
            localStore.set("PPU", Cookies.get("PPU"));
						if(callback) {
							callback()
						}

            			Native.setWebLog({
						    actiontype: "loginzzsuc",
		        			pagetype: "zzdetail",
					  	})

					}
					else if (-2 == code){
						// -2:微信查不到用户，需要手机号
						Cookies.set('zz_mobile_bind',1);
						store.dispatch(CHANGE_REDIRECT, to);
						to.router.go({
							name: 'login'
						});
						Native.setWebLog({
							actiontype: "loginzzfail1",
							pagetype: "zzdetail",
						})
						//this.bindMobile();
					}
					else if (1 == code){
						// 1:手机号已绑定至其他微信
						Native.toast("手机号已绑定至其他微信!");
						Native.setWebLog({
							actiontype: "loginzzfail2",
							pagetype: "zzdetail",
						})
					}
					else if (-1 == code){
						Native.toast("登录失败!");
            			Native.setWebLog({
						    actiontype: "loginzzfail3",
							pagetype: "zzdetail",
						})
					}
				}
			});

	},
	isLogin(){
		return !!Cookies.getZZU()
	},
	login () {
	},
	auth(to, callback) {
    	//便于调试阶段  判断58app环境  线上环境应该去掉if else
		if(Cookies.get("58ua") == '58app') {
			if (Native.supportWx()) {
				Native.login((err) => {
					if (err == 0) {
						this.loginBy58(callback, to);
						Native.setWebLog({
							actiontype: "activewxcbsuc",
							pagetype: "zzdetail"
						});
					} else {
						Native.toast(WX_AUTH_FAIL_TIP);

						Native.setWebLog({
							actiontype: "activewxcbfail",
							pagetype: "zzdetail"
						});
					}
				})
			} else {
				store.dispatch(CHANGE_REDIRECT, to)
				to.router.go({
					name: 'login',
					replace: true
				});
			}

		}
	}
}

export default {
	methods: login,
	created(){
	}
}
