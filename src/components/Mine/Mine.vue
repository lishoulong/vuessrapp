<template>
	<div class="mine">
		<div class="message-wrap">
			<ul class="message-body">
				<li class="message-chat">
					<router-link :to="{ name: 'chat' }">私信
						<i v-show="chatNum" class="icon chat"></i>
					</router-link>
				</li>
				<li class="message-order">
					<router-link :to="{ name: 'message-order' }">订单消息
						<i v-show="ordersNum" class="icon order"></i>
					</router-link>
				</li>
				<li class="message-system">
					<router-link :to="{ name: 'message-system' }">
						系统消息<i v-show="systemNum" class="icon system"></i>
					</router-link>
				</li>
			</ul>
		</div>

		<div class="all-orders" v-show="orders.length">
			<transition name="expand">
				<div class="order-top-banner" v-if="topBanner">{{topBanner}}</div>
			</transition>
			<div class="order pending-order" v-if="pendingOrders.length">
				<dl>
					<dt>正在进行中的订单</dt>
					<dd v-for="order in pendingOrders" :id="order.orderId">
						<router-link to="{name: 'order', params: {order_id: order.orderId}, query: {typelistcomeBot: order.payType} }">
							<div class="order-title">
								<div class="status">{{order.statusInfo}}</div>
								<div v-if="order.serviceIcon" class="zhijianicon"><img :src="imgUrl(order.serviceIcon)" /></div>
								<div class="isPay">{{order.statusDescription}}</div>
							</div>
							<div class="order-content">
								<!--<img class="icon" v-lazy="order.infoPics | imgUrl" />-->
								<div class="iconImg" :style="[order.iconImg]"></div>
								<div class="order-detail">
									<div class="words">{{order.infoTitle}}</div>
									<div class="price">{{order.actualPayMoney | price}}</div>
								</div>
							</div>
							<div v-if="order.hasOwnProperty('availableServices')" class="order-buttons">
								<div class="button" @click.stop.prevent="securePayment(order)">
										<router-link to="{name: 'dialog', params: {user_id: order.userId, product_id:order.infoId}}">
											联系卖家
										</router-link>
								</div>
								<div v-if="order.status==1" class="button" @click.stop.prevent="securePayment(order)">安心支付</div>
							</div>
							<div v-else class="order-buttons">
								<div class="button" @click.stop.prevent="btnTextRight(order)">{{order.btnTextRight}}</div>
								<div class="button" @click.stop.prevent="btnTextLeft(order)">{{order.btnTextLeft}}</div>
							</div>
						</router-link>
					</dd>
				</dl>
			</div>
			<div class="order complete-order"  v-if="completeOrders.length">
				<dl>
					<dt>已完成的订单</dt>
					<dd v-for="order in completeOrders" :id="order.orderId">
						<router-link to="{name: 'order', params: {order_id: order.orderId}, query: {typelistcomeBot: order.payType}}">
							<div class="order-title">
								<div class="status">{{order.statusInfo}}</div>
								<div v-if="order.serviceIcon" class="zhijianicon"><img :src="imgUrl(order.serviceIcon)" /></div>
								<div class="isPay"></div>
							</div>
							<div class="order-content">
								<!--<img class="icon" v-lazy="order.infoPics | imgUrl" />-->
								<div class="iconImg" :style="[order.iconImg]"></div>
								<div class="order-detail">
									<div class="words">{{order.infoTitle}}</div>
									<div class="price">{{order.actualPayMoney | price}}</div>
								</div>
							</div>
							<div v-if="order.hasOwnProperty('availableServices')" class="order-buttons">
								<div class="button" @click.stop.prevent="securePayment(order)">
									<router-link to="{name: 'dialog', params: {user_id: order.userId, product_id:order.infoId}}">
										联系卖家
									</router-link>
								</div>
							</div>
							<div v-else class="order-buttons">
								<div class="button" @click.stop.prevent="btnTextRight(order)" v-if="order.btnTextRight && (order.btnTextLeft || !(order.status == 17) || !(order.payType == 3))">{{order.btnTextRight}}</div>
								<div class="button" @click.stop.prevent="btnTextLeft(order)" v-if="order.btnTextLeft">{{order.btnTextLeft}}</div>
								<div class="button" v-if="(!order.btnTextLeft && !order.btnTextRight) || (order.btnTextRight && !order.btnTextLeft && (order.status == 17) && (order.payType == 3))">
									<router-link  v-if="order.payType != 3 && !(order.userNickName == '转转优品')" to="{name: 'dialog', params: {user_id: order.userId, product_id:order.infoId}}">{{order.btnTextContract}}</router-link>
									<a  v-if="order.payType == 3 || order.userNickName == '转转优品'" href="//m.zhuanzhuan.58.com/Mzhuanzhuan/zzYoupin/issues/issue_index.html">{{order.btnTextContract}}</a>
								</div>
								<div class="button"></div>
							</div>
						</router-link>
					</dd>
				</dl>
			</div>

			<div class="order-footer">{{orderFooter}}</div>
		</div>
		<recommend :recommends="recommends" title="还没有买到任何宝贝，快来看看吧" v-show="!orders.length"></recommend>
		<zz-tip :visible.sync="showLoading" :tipsparam.sync="loadingTipParam"></zz-tip>
		<zz-tip :visible.sync="showRemindOrder" :tipsparam.sync="remindOrderParam"></zz-tip>
		<cancel-order :is-show="showCancelOrder" :order-id="order.orderId" :callback="cancelOrderCallback"></cancel-order>
		<!--<bottom-download v-if="!hideDownload" title="下载转转APP 订单管理更方便"></bottom-download>-->
	</div>
</template>
<style lang="less">
	@import "Mine.less";
	@import "Animation.less";
</style>
<script type="text/ecmascript-6">
	import _ from "underscore";
	import * as Api from "../../libs/data-api";
	import Cookie from '../../libs/cookie';
	import * as Chat from "../../libs/chat";
	import {setChatList, setSystemList} from "../../vuex/actions";
	import { chatList, systemList } from '../../vuex/getters'
	import * as ENV from "../../config/env";
	import Recommend from '../../components/Common/Recommend/Recommend.vue';
	import Native from '../../libs/native.js';
	import CancelOrder from '../Common/CancelOrder/CancelOrder.vue';
	import BottomDownload from '../Common/BottomDownload/BottomDownload.vue';
	import zzTip from '../Common/tips/tips.vue';

	import handleImg from '../../libs/handleImg.js';

	export default {
		name: 'mine',
		vuex: {
			actions: {
				setChatList, setSystemList
			},
			getters: {
				chatList, systemList
			}
		},
		data(){
			return{
				pageNum: 1,
				pageSize: 10,
				topBanner: "",
				orders: [],
				pendingOrders: [],
				completeOrders: [],
				recommends: [],
				loginNum: 0,
				uid: Cookie.getUID(),
				chatNum: 0,
				ordersNum: 0,
				systemNum: 0,
				start_time: 0,
				start_id: 0,
				showCancelOrder: false,
				order: {},
				isGetNewOrders: true,
				orderFooter: "",
				showLoading: false,
				loadingTipParam: {  type:'loading' },
				showRemindOrder: false,
				remindOrderParam: {type: "toast", content: "", toastType: ""},
				timer: null,
				// 厂商内置包的header，不允许有跳下载
				hideDownload: !!Cookie.get('inter_manufacturer')
			};
		},
		components: {
			zzTip,
			recommend: Recommend,
			'cancel-order': CancelOrder,
			'bottom-download': BottomDownload
		},
		methods:{
			openApp() {
				try {
					Native.setWebLog({
						actiontype : "xiazai",
        				pagetype: "zzmine"
					});
					Native.callZZApp();
				}catch(e){
					alert(JSON.stringify(e))
				}
			},
			scrollPage(){
				this.showBanner();
				let $orderFooter = document.querySelector('.order-footer');
				if($orderFooter.offsetTop <= document.body.scrollTop + document.documentElement.clientHeight && this.isGetNewOrders){
					this.isGetNewOrders = false;
					this.getNewOrders();
				}
			},
			showBanner(){
				let $pending = document.querySelector('.pending-order');
				let $complete = document.querySelector('.complete-order');
				if($pending && $pending.offsetTop < document.body.scrollTop && document.body.scrollTop < $complete.offsetTop){
					this.topBanner = "正在进行中的订单";
				} else if($complete && $complete.offsetTop < document.body.scrollTop){
					this.topBanner = "已完成的订单";
				} else {
					this.topBanner = "";
				}
			},
			getNewOrders(){
				if(this.orders.length < 10) return;
				this.pageNum += 1;
				this.getBuyOrders().then(resp => {
					this.isGetNewOrders = true;
					if(resp.status && resp.data && resp.data.respCode == "0"){
						this.orders = resp.data.respData;
						if(this.orders.length < this.pageSize){
							this.orderFooter = "没有更多订单了哦";
						}
						this.orders = _.map(this.orders, order => {
							order.iconImg = {backgroundImage: "url( "+this.imgUrl(order.infoPics)+" )"};
							return order;
						});
						this.pendingOrders = this.pendingOrders.concat(_.filter(this.orders, order => { return order.isFinish == "0"; }));
						this.completeOrders = this.completeOrders.concat(_.filter(this.orders, order => { return order.isFinish == "1"; }));
					}
				});
			},
			getBuyOrders(){
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				};
				return Api.getBuyOrders(params)
			},
			getRecommend(){
				let params = {
					pageNum:1,
					pageSize:6,
					Isapp: true
				};
				return Api.getZZMListingInfoList(params);
			},
			getPay(orderId, payId){
				let params = {
					payId, orderId
				};
				return Api.getPay(params);
			},
			pay(orderId, payId){
				this.getPay(orderId, payId).then(resp => {
					if(resp && resp.data && resp.data.respData && resp.data.respData.deeplink && resp.data.respCode == 0){
						location.href = resp.data.respData.deeplink;
					}
				});
			},
			remindOrder(orderId){
				this.showLoading = true;
				Api.remind({orderId}).then(resp => {
					this.showLoading = false;
					if(parseInt(resp.data.respCode, 10) == 0 || parseInt(resp.data.respCode, 10) == -2){
						this.showRemindOrder = true;
						this.remindOrderParam.content = "已提醒卖家快马加鞭";
						this.remindOrderParam.toastType = "success";
						this.timer = setTimeout(() => {
							this.showRemindOrder = false;
							this.timer = null;
						}, 1500);
					}
				});
			},
			backDetail(){
				this.showLoading = true;
				location.href = ENV.ORDER_DOWNLOAD_URL;
			},
			btnTextRight(order){
				switch(order.status){
					case "1":
						//未支付, 安心支付
						this.pay(order.orderId, order.payId);
						break;
					case "3":
						//未发货, 提醒发货
						this.remindOrder(order.orderId);
						break;
					case "8":
						this.backDetail(order);
						break;
					case "17":
						this.redirectPage();
						return ;
					default:
						this.redirectPage();
						break;
				}
			},
			btnTextLeft(order){
				if(order.status == 1){
					//未支付, 取消订单
					this.cancelOrder(order);
				}else if (order.status == 3) {
					if(order.payType == 3){
						window.location.href = "//m.zhuanzhuan.58.com/Mzhuanzhuan/zzYoupin/issues/issue_index.html";
					}else {
						//未发货, 申请退款
						this.refund(order);
					}
				}else if (order.status == 17) {
					this.redirectPage();
				}else {
					this.redirectPage();
				}
			},
			securePayment(order){
				this.pay(order.orderId, order.payId);
			},
			redirectPage(){
				location.href = ENV.ORDER_DOWNLOAD_URL;
			},
			cancelOrder(order){
				this.showCancelOrder = true;
				this.order = order;
			},
			cancelOrderCallback(resp){
				if(resp && resp.data && resp.data.respCode == 0){
					this.pendingOrders = _.filter(this.pendingOrders, order => {
						return order.orderId != this.order.orderId;
					});
					let orderInfo = resp.data.respData;
					orderInfo.iconImg = {backgroundImage: "url( "+this.imgUrl(orderInfo.infoPics)+" )"};
					this.completeOrders = [orderInfo].concat(this.completeOrders);
					Native.toast("取消成功");
				} else {
					Native.toast("取消失败");
				}
			},
			refund(order){
				this.showLoading = true;
				location.href = ENV.ORDER_DOWNLOAD_URL;
			},
			chatTip(chatList){
				const list = chatList[this.uid] ? chatList[this.uid] : {};
				this.chatNum = _.reduce(list, (memo, num) => {
							return memo + parseInt(num);
						}, 0);
			},
			ordersTip(){
				Api.getOrderUnread().then(resp => {
					if(resp.data.respCode == "0" && !!resp.data.respData){
						this.ordersNum = parseInt(resp.data.respData.cnt);
					}
				});
			},
			systemTip(){
				Api.getofflinemsgcount({
					source : 21,
					uid : this.uid,
					msgtype : 39
				}).then(resp => {
					if(resp.data && resp.data.code == 200000){
						this.systemNum =  parseInt(resp.data.protocol_content.msg_count);
					}
				});
			},
			handleChatList(chats, msgObj, cb){
				let oldChatList = _.extend({}, chats[this.uid]);
				const newChatList = _.countBy(msgObj.msgs, msg => {
					if(msg.msg_data && msg.msg_data.sub_cmd == "tmp_notify"){
						return msg.msg_data.from_uid;
					}
				});

				if(_.size(newChatList)){
					_.each(newChatList, (num, uid) => {
						if(!oldChatList[uid]){
							oldChatList[uid] = 0;
						}
						oldChatList[uid] += num;
					});
					chats = {};
					chats[this.uid] = oldChatList;
				}

				this.setChatList(chats);
				this.chatNum = _.reduce(chats[this.uid], (memo, num) => {
					return memo + num;
				}, 0);

				cb && cb(chats);
				return chats;
			},
			handleSystemList(systems, msgObj, cb){
				//msgObj = {msgs: [{msg_data:{time:"1470744697",sub_cmd: "push_notify", msg_data: {"text": "哈哈", "userdata": {"sid": "751383347181846529"}}}}]};
				let newSystemList = [], oldSystemList = systems[this.uid] || [], systemList = {};
				_.each(msgObj.msgs, msg => {
					if(msg.msg_data && msg.msg_data.sub_cmd == "push_notify"){
						newSystemList.push({
							time: msg.msg_data.time,
							'msg_data': msg.msg_data.msg_data
						});
					}
				});
				systemList[this.uid] = newSystemList.concat(oldSystemList);

				this.setSystemList(systems);
				this.systemNum = !!systems[this.uid] && systems[this.uid].length;

				cb && cb(systemList);
				return systemList;
			},
			msg_offline(resp){
				if(resp.data && resp.data.code == 200000 && resp.data.protocol_content && resp.data.protocol_content.msgs){
					const msgObj = resp.data.protocol_content;
					let chatlist = this.chatList || {};
					let systemlist = this.systemList || {};

					if(msgObj.msgs.length){
						chatlist = this.handleChatList(chatlist, msgObj);

						this.handleSystemList(systemlist, msgObj);
					}


					// 记录 last_msg_time & last_msg_id
					this.start_time = msgObj.last_msg_time;
					this.start_id = msgObj.last_msg_id;

					// 给列表添加未读红点，更新 this.users 的数据
					this.users = _.map(this.users, user => {
						if(chatlist[this.uid][user.uid]){
							user.point = chatlist[this.uid][user.uid];
						}
						return user;
					}, this);
				}
			},
			imgUrl(name){
				return handleImg.handleSingle(name,62,62);
			},
			setHeader(){
				Native.setTitle({ title: "我的转转" });
				Native.extendRightBtn("top_right", "帮助中心", "openHelpCenter");
				window.openHelpCenter = () => {
					return this.$router.push({
						name: 'help'
					});
				};
				Native.setWebLog({
					actiontype : "show",
        			pagetype: "zzmine"
				});
			},
			initData(){
				this.pageNum = 1;
				this.pageSize = 10;
				this.topBanner = "";
				this.orders = [];
				this.pendingOrders = [];
				this.completeOrders = [];
				this.recommends = [];
				this.loginNum = 0;
				this.uid = Cookie.getUID();
				this.chatNum = 0;
				this.ordersNum = 0;
				this.systemNum = 0;
				this.start_time = 0;
				this.start_id = 0;
				this.showCancelOrder = false;
				this.order = {};
				this.isGetNewOrders = true;
				this.orderFooter = "";
			}
		},
		filters:{
			price(price){
				return "￥" + price;
			},
			decode(url){
				return decodeURIComponent(url);
			},
			pic(urls){
				if(!urls) return;
				return decodeURIComponent(urls.split('|')[0]);
			}
		},
		mounted(){
			this.getBuyOrders().then(resp => {
				if(resp.status && resp.data && resp.data.respCode == "0"){
					this.orders = resp.data.respData;
					if(this.orders.length == 0){
						return this.getRecommend();
					}
					this.orders = _.map(this.orders, order => {
						//order.iconImg = {backgroundImage: `url( ${this.imgUrl(order.infoPics)} )`};
						order.iconImg = {backgroundImage: "url( "+this.imgUrl(order.infoPics)+" )"};
						return order;
					});
					this.pendingOrders = _.filter(this.orders, order => {
								return order.isFinish == "0";
					});
					this.completeOrders = _.filter(this.orders, order => {
								return order.isFinish == "1";
					});
				}
			}).then(resp => {
				if(resp && resp.data && resp.data.respCode == 0){
					this.recommends = resp.data.respData;
				}
			});
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
				vm.setHeader();
				document.addEventListener('scroll', vm.scrollPage, false);
				const _this = vm;
				Chat.login()
						.then(resp => {
							//_this.chatTip(_this.chatList);
							_this.ordersTip();
							//_this.systemTip();

							Chat.msg_offline({
								start_time:vm.start_time,
								start_id:vm.start_id,
								msgtype:10
							}).then((resp) => {
								return vm.msg_offline(resp);
							});
						}, resp => {
							//_this.$router.go({name:'login'});
						});
				})
			},
			beforeDestroy: function (transition) {
				document.removeEventListener('scroll', this.scrollPage, false);
				Native.extendRightBtn("top_right", " ", "righthelpCallback");
				window.righthelpCallback = () => { };
				transition.next();
			},
			beforeRouteLeave(){
				this.showLoading = false;
			}
	}
	/*
	* TODO:
	*
	* */
</script>
