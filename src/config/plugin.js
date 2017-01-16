

import Vue from 'vue'
import Resource from 'vue-resource'
import VueTouch from 'vue-touch'
import Router from 'vue-router'
import Vuex from 'vuex'
import store from '../vuex/store'
import App from '../App.vue'
import VueInfiniteScroll from 'vue-infinite-scroll'
import VueLazyLod from 'vue-lazyload'
import Native from '../libs/native.js'
import {local as localStore} from '../libs/store'
import Cookies from '../libs/cookie'
import login from '../mixin/login'
import * as filters from  '../filters'
import VueRx from 'vue-rx'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

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
		});
		Vue.use(VueRx, { Observable, Subscription });
	},
	resourceGlobalSetting() {
		Vue.http.options.root = "//zhuan.58.com/zz/transfer";

		Vue.http.interceptors.push((response,next) => {

			next( (response) => {
				var code = response.data.respCode = parseInt(response.data.respCode, 10),
				app = this.router.app,
				route = app.$route;

				if( -8 == code ) {
					if( route.meta.auth ){
						app.auth(route );
					}
				}
			})
		})

	},
	runRouter() {
		var routeMap = this.createRouteMap();
		var routerOpts =  {

		};
		var router = this.router = new Router({
			mode:'history',
			scrollBehavior: function (to, from, savedPosition) {
			  return savedPosition || { x: 0, y: 0 }
			},
			base : '/Mzhuanzhuan/zz58app/',
			routes: routeMap
		});

		router.beforeEach(this.beforeEach.bind(router));
		router.afterEach(this.afterEach.bind(router));
		// register global utility filters.
		Object.keys(filters).forEach(key => {
		  Vue.filter(key, filters[key])
		})
		//router.redirect({'/': '/mine'});
		new Vue({
		  el: '#app',
		  router,
			store,
			//mixins: [login]
		  // replace the content of <div id="app"></div> with App
		  render: h => h(App)
		})
	},
	createRouteMap() {
		return [
      {
			  path:'/detail/:product_id',
				name: 'detail',
				component (resolve) {
					require(['../components/Detail/Detail.vue'], resolve);
				}
			},
			{
			  path:'/delivery/:product_id',
				name: 'delivery',
				meta: {auth: true},
				component (resolve) {
					alert('deli');
					require(['../components/Delivery/Delivery.vue'], resolve);
				}
			},
			{
			  path:'/payquery',
				name: 'payquery',
				component (resolve) {
					require(['../components/PayQuery/PayQuery.vue'], resolve);
				}
			},
			{
			  path: '/delivery/city',
				name: 'city',
				meta: {auth: true},
				component (resolve) {
					require(['../components/Address/City.vue'], resolve);
				}
			},
			{
			  path: '/delivery/area/:city_id',
				name: 'area',
				meta: {auth: true},
				component (resolve) {
					require(['../components/Address/Area.vue'], resolve);
				}
			},
			{
			  path: '/success/:order_id',
				name: 'success',
				meta: {auth: true},
				component (resolve) {
					require(['../components/Success/Success.vue'], resolve);
				}
			},
			{
			  path: '/order/:order_id',
				name: 'order',
				meta: {auth: true},
				component (resolve) {
					require(['../components/Order/Order.vue'], resolve);
				}
			},
			{
			  path: '/mine',
				name: 'mine',
				meta: {auth: true},
				component (resolve) {
					require(['../components/Mine/Mine.vue'], resolve);
				}
			},
			{
			  path: '/message/chat',
				name: 'chat',
				meta: {auth: true},
				component (resolve) {
					alert('chat');
					require(['../components/MessageChat/MessageChat.vue'], resolve);
				}
			},
			{
			  path: '/message/chat/:user_id/:product_id',
				name: 'dialog',
				meta: {auth: true},
				component (resolve) {
					require(['../components/Dialog/Dialog.vue'], resolve);
				}
			},
			{
			  path: '/message/order',
				name: 'message-order',
				meta: {auth: true},
				component (resolve) {
					require(['../components/MessageOrder/MessageOrder.vue'], resolve);
				}
			},
			{
			  path: '/message/system',
				name: 'message-system',
				meta: {auth: true},
				component (resolve) {
					require(['../components/MessageSystem/MessageSystem.vue'], resolve);
				}
			},
			{
			  path: '/help',
				name: 'help',
				component (resolve) {
					require(['../components/Help/Help.vue'], resolve);
				}
			},
			{
			  path: '/help/:type',
				name: 'helper',
				component (resolve) {
					require(['../components/Help/Help.vue'], resolve);
				}
			},
			{
			  path: '/profile/:user_id',
				name: 'profile',
				//auth: true,
				component (resolve) {
					require(['../components/Profile/Profile.vue'], resolve);
				}
			},
			{
			  path: '/login',
				name: 'login',
				component (resolve) {
					require(['../components/Login/Login.vue'], resolve);
				}
			},
			{
			  path: '/quit',
				name: 'quit',
				component (resolve) {
					require(['../components/Quit/Quit.vue'], resolve);
				}
			}
		]
	},
	beforeEach( to, from, next ) {
	  var query = to.query || {},
		  	app = login.methods;
		if(to.name != 'mine'){
			document.body.scrollTop = 0
		}
		if(Cookies.get("PPU") !== (!!localStore.get("PPU") && localStore.get("PPU"))){
			//Cookies.remove(Cookies.COOKIE_ZZU,Cookies.COOKIE_OPTION);
		}
		if( to.matched.some(m => (m.meta.auth && !app.isLogin())) ){
			if(!from.path && to.name != 'delivery'){
				from.path = '/mine';
			}
			next(false);
			app.auth(to, () => {
				next()
				this.app.$router.push({
					name: to.name,
					params: to.params,
					query: query
				})

				if(from.name == 'detail' && to.name == 'delivery') {
					Native.setWebLog({
						actiontype: "buyactivewxsuc",
		        		pagetype: "zzdetail",
					})
				}
			})
		}else{
			next()
		}
	},
	afterEach( transition ) {

	}
}

export default plugin
