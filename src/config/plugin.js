

import Vue from 'vue'
import Resource from 'vue-resource'
import VueTouch from 'vue-touch'
import Router from 'vue-router'
import Vuex from 'vuex'
import App from '../App.vue'
import VueInfiniteScroll from 'vue-infinite-scroll'
import VueLazyLod from 'vue-lazyload'
import Native from '../libs/native.js'
import {local as localStore} from '../libs/store'
import Cookies from '../libs/cookie'

var plugin = {
	init(){
		this.initVuePlugins();
		this.resourceGlobalSetting();
		this.runRouter();
	},

	initVuePlugins() {
		Vue.use(Router);
		Vue.use(Resource);
		Vue.use(VueTouch);
		Vue.use(Vuex);
		Vue.use(VueInfiniteScroll);
		Vue.use(VueLazyLod, {
			preLoad: 1.3,
			try: 2
		})
	},
	resourceGlobalSetting() {
		Vue.http.options.root = "//zhuan.58.com/zz/transfer";

		Vue.http.interceptors.push((response,next) => {

			next( (response) => {
				var code = response.data.respCode = parseInt(response.data.respCode, 10),
				app = this.router.app,
				route = app.$route;

				if( -8 == code ) {
					if( route.auth ){
						app.auth(route );
					}
				}
			})
		})

	},
	runRouter() {
		var routeMap = this.createRouteMap();

		var routerOpts =  {
			hashbang : false,
			history : true,
			saveScrollPosition: true,
			root : '/Mzhuanzhuan/zz58app'
		};
		var router = this.router = new Router(routerOpts);

		router.beforeEach(this.beforeEach.bind(router));
		router.afterEach(this.afterEach.bind(router));

		router.map(routeMap);
		//router.redirect({'/': '/mine'});
		router.start(App,"#app");
	},
	createRouteMap() {
		var map = {

			'/detail/:product_id': {
				name: 'detail',
				component (resolve) {
					require(['../components/Detail/Detail.vue'], resolve);
				}
			},
			'/delivery/:product_id': {
				name: 'delivery',
				auth: true,
				component (resolve) {
					require(['../components/Delivery/Delivery.vue'], resolve);
				}
			},
			'/payquery': {
				name: 'payquery',
				component (resolve) {
					require(['../components/PayQuery/PayQuery.vue'], resolve);
				}
			},
			'/delivery/city': {
				name: 'city',
				auth: true,
				component (resolve) {
					require(['../components/Address/City.vue'], resolve);
				}
			},
			'/delivery/area/:city_id': {
				name: 'area',
				auth: true,
				component (resolve) {
					require(['../components/Address/Area.vue'], resolve);
				}
			},
			'/success/:order_id': {
				name: 'success',
				auth: true,
				component (resolve) {
					require(['../components/Success/Success.vue'], resolve);
				}
			},
			'/order/:order_id': {
				name: 'order',
				auth: true,
				component (resolve) {
					require(['../components/Order/Order.vue'], resolve);
				}
			},
			'/mine': {
				name: 'mine',
				auth: true,
				component (resolve) {
					require(['../components/Mine/Mine.vue'], resolve);
				}
			},
			'/message/chat': {
				name: 'chat',
				auth: true,
				component (resolve) {
					require(['../components/MessageChat/MessageChat.vue'], resolve);
				}
			},
			'/message/chat/:user_id/:product_id': {
				name: 'dialog',
				auth: true,
				component (resolve) {
					require(['../components/Dialog/Dialog.vue'], resolve);
				}
			},
			'/message/order': {
				name: 'message-order',
				auth: true,
				component (resolve) {
					require(['../components/MessageOrder/MessageOrder.vue'], resolve);
				}
			},
			'/message/system': {
				name: 'message-system',
				auth: true,
				component (resolve) {
					require(['../components/MessageSystem/MessageSystem.vue'], resolve);
				}
			},
			'/help': {
				name: 'help',
				component (resolve) {
					require(['../components/Help/Help.vue'], resolve);
				}
			},
			'/help/:type': {
				name: 'helper',
				component (resolve) {
					require(['../components/Help/Help.vue'], resolve);
				}
			},
			'/profile/:user_id': {
				name: 'profile',
				//auth: true,
				component (resolve) {
					require(['../components/Profile/Profile.vue'], resolve);
				}
			},
			'/login': {
				name: 'login',
				component (resolve) {
					require(['../components/Login/Login.vue'], resolve);
				}
			},
			'/quit': {
				name: 'quit',
				component (resolve) {
					require(['../components/Quit/Quit.vue'], resolve);
				}
			}
		}
		return map;
	},
	beforeEach( transition ) {
		var to = transition.to,
		    query = to.query || {},
		  	app = to.router.app;
		if(transition.to.name != 'mine'){
			document.body.scrollTop = 0
		}
		if(Cookies.get("PPU") !== (!!localStore.get("PPU") && localStore.get("PPU"))){
			Cookies.remove(Cookies.COOKIE_ZZU,Cookies.COOKIE_OPTION);
		}
		if( to.auth && !app.isLogin() ){
			if(!transition.from.path && transition.to.name != 'delivery'){
				transition.from.path = '/mine';
			}
			transition.abort();
			app.auth(to, () => {
				transition.next()
				app.$router.go({
					name: to.name,
					params: to.params,
					query: query
				})

				if(transition.from.name == 'detail' && transition.to.name == 'delivery') {
					Native.setWebLog({
						actiontype: "buyactivewxsuc",
		        		pagetype: "zzdetail",
					})
				}
			})
		}else{
			transition.next()
		}
	},
	afterEach( transition ) {

	}
}

export default plugin
