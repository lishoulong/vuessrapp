<template>
	<div class="chat-dialog">
		<div class="chat-dialog-goods">
			<a v-link="{name:'detail',params:{product_id: info.id}}">
				<div class="chat-dialog-goods-icon">
					<img :src="info.pics" />
				</div>
				<div class="chat-dialog-goods-text">
					<div class="title">{{info.title}}</div>
					<div class="price">{{info.price | price}}</div>
				</div>
			</a>
		</div>

		<div id="chat-dialog-box" class="chat-dialog-box" v-el:chatBox>
			<div class="chat-dialog-box-history">
				<message :messages="historyList" :uid="userInfo.id" ></message>
			</div>
			<div class="chat-dialog-box-main">
				<message :messages="messageList" :uid="userInfo.id" ></message>
			</div>
		</div>

		<div class="chat-dialog-form">
			<textarea class="chat-dialog-form-text" v-model="message"></textarea>
			<button class="chat-dialog-form-btn" @click="sendMsg(message,0)">发送</button>
		</div>
	</div>
</template>
<style lang="less">
	@import "Dialog.less";
</style>
<!--<script type="text/ecmascript-6">-->
<script>
	import _ from 'underscore';
	import Cookie from '../../libs/cookie';
	import * as Api from '../../libs/data-api'
	import * as Chat from "../../libs/chat";
	import HandleImg from "../../libs/handleImg";
	import { dateFormat, countDown } from "../../libs/util";
	import { setChatList, setSystemList } from "../../vuex/actions";
	import { chatList, systemList } from '../../vuex/getters'
	import Native from '../../libs/native.js'

	import Message from './Message/Message.vue'

	export default {
		name: 'Dialog',
		vuex: {
			actions: {
				setChatList, setSystemList
			},
			getters: {
				chatList, systemList
			}
		},
		data(){
			return {
				userInfo: {
					id: Cookie.getUID(),
					nickName: "",
					portrait: ""
				},
				toInfo: {
					id: this.$route.params.user_id,
					nickName: "",
					portrait: ""
				},
				info: {
					id: this.$route.params.product_id,
					title: "",
					price: "",
					orderId: "",
					pics: ""
				},
				msgcount: 20,
				starttimestamp: 0,
				historyList: [],
				message: "",
				messageList: [],
				flag: true //离开此路由，断开user_pick刷新
			};
		},
		components: {
			'message': Message
		},
		methods: {
			scrollBottom(){
				this.$els.chatbox.scrollTop = this.$els.chatbox.scrollHeight;
			},
			getInfoSimpleDetail(){
				Api.getInfoSimpleDetail({
					infoId:this.info.id,
					otherId:this.toInfo.id
				}).then(resp => {
					if(resp.data && resp.data.respCode == "0" && resp.data.respData){
						this.info.title = resp.data.respData.title;
						this.info.price = resp.data.respData.nowPrice;
						this.info.orderId = resp.data.respData.orderId;
						this.info.pics = HandleImg.handleSingle(resp.data.respData.pics.split('|')[0], 60,60);
					}
				});
			},
			sendMsg(message){
				if(!message) return ;

				// 0: sending, 1: success, 2: error
				const status = 0;

				Chat.login().then(() => {
					this.message = "";
					const timestamp = new Date().getTime() / 1000, i = this.messageList.length;
					this.messageList.push({
						timestamp,
						from_uid: this.userInfo.id,
						portrait: this.userInfo.portrait,
						msg_content: {text: message},
						status
					});

					this.$nextTick(() => {
						if(this.messageList.length > i){
							this.scrollBottom();
						}
					});

					return Chat.sendMsg({
						to_uid: this.toInfo.id,
						n: this.userInfo.nickName,
						sid: this.$route.params.product_id,
						msg_data: message,
						time: timestamp,
						msgid: timestamp
					}).then(resp => {
						if(resp.data && resp.data.code && resp.data.code == 200000){
							this.messageList[i].status = 1;
						} else {
							this.messageList[i].status = 2;
						}
					});
				});
			},
			getOnlineMsg(cb){
				return Chat.login().then(resp => {
					return Chat.getOnlineMsg({
						touid: this.toInfo.id,
						msgcount: this.msgcount,
						starttimestamp: this.starttimestamp
					});
				}).then(resp => {
					if(resp.data && resp.data.code == 200000  && resp.data.protocol_content && resp.data.protocol_content.msg_data){
						this.historyList = _.sortBy(resp.data.protocol_content.msg_data, message => {
							return message.timestamp;
						});
						return cb && cb(this.historyList);
					}
				});
			},
			userPick(){
				Chat.userPick().then(resp => {
					if(!this.flag) return;  	//表示已经离开此路由
					if(resp.data && resp.data.code == 200000){
						if(resp.data.cmd == 'msg'){		//收到消息时
							if(resp.data.sub_cmd == "tmp_notify"){		//收到实时消息
								if(this.toInfo.id == resp.data.protocol_content.from_uid){
									const timestamp = new Date().getTime() / 1000, i = this.messageList.length;
									this.messageList.push({
										timestamp,
										from_uid: this.toInfo.id,
										portrait: this.toInfo.portrait,
										msg_content: {text: resp.data.protocol_content.msg_data.text,
											capimg: resp.data.protocol_content.msg_data.capimg},
										status: 1
									});
									this.$nextTick(() => {
										if(this.messageList.length > i){
											this.scrollBottom();
										}
									});
								} else {
									let chatList = this.chatList || {}, newChatList = {};
									let unread = chatList[this.userInfo.id];
									if(!_.has(unread, resp.data.protocol_content.from_uid)){
										unread[resp.data.protocol_content.from_uid] = 0;
									}
									unread[resp.data.protocol_content.from_uid] += 1;
									newChatList[this.userInfo.id] = _.extend({}, unread);
									this.setChatList(newChatList);
								}
							} else if(resp.data.sub_cmd == "push_notify"){		//收到系统消息
								//TODO: 系统消息存储
							}
						} else if(resp.data.cmd == "user" && resp.data.sub_cmd == "kickout"){
							//被踢下线，清除userpick函数，不在发送user_pick
							return ;
						}
						this.userPick();
					} else if(resp.data.code == 400008){
						//被踢下线，清除userpick函数，不在发送user_pick
						return ;
					} else {
						//其他情况先登录，然后重新起 user_pick
						Chat.login().then(() => {
							this.userPick();
						});
					}
				});
			},
			clearUnread(){
				let chatList = this.chatList || {}, newChatList = {};
				let unread = chatList[this.userInfo.id] || {};
				if(_.has(unread, this.toInfo.id)){
					delete unread[this.toInfo.id];
					newChatList[this.userInfo.id] = _.extend({}, unread);;
					this.setChatList(_.extend({}, newChatList));
				}
			},
			setTitle(){
				Native.setTitle({ title: this.toInfo.nickName });
				Native.extendRightBtn("top_right", "消息", "openChatList");
				window.openChatList = () => {
					return this.$router.go({
						name: 'chat'
					});
				};
				Native.setWebLog({
					actiontype : "show",
        			pagetype: "zztalk"
				});
			},
			initData(){
				this.userInfo = {
					id: Cookie.getUID(),
							nickName: "",
							portrait: ""
				};
				this.toInfo = {
					id: this.$route.params.user_id,
							nickName: "",
							portrait: ""
				};
				this.info = {
					id: this.$route.params.product_id,
							title: "",
							price: "",
							orderId: "",
							pics: ""
				};
				this.msgcount = 20;
				this.starttimestamp = 0;
				this.historyList = [];
				this.message = "";
				this.messageList = [];
			}
		},
		filters: {
			price(price){
				return "￥" + price;
			},
			dateFormat
		},
		route: {
			data(){
				this.initData();
				this.getInfoSimpleDetail();
				this.clearUnread();
				this.getOnlineMsg(() => {
					return Api.getNickNameAndPhoto({
						userids: `${this.userInfo.id},${this.toInfo.id}`
					});
				}).then(resp => {
					if(resp.data && resp.data.respCode == 0 && resp.data.respData){
						//this.nickName = resp.data.respData[this.uid].nickName;
						//this.portrait = resp.data.respData[this.uid].portrait;
						this.userInfo = _.extend(this.userInfo, resp.data.respData[this.userInfo.id]);
						this.toInfo = _.extend(this.toInfo, resp.data.respData[this.toInfo.id]);
						this.historyList = _.map(this.historyList, message => {
							return _.extend({status: 1}, message, resp.data.respData[message.from_uid]);
						});
						this.scrollBottom();
						this.setTitle();
						return this.userPick();
					}
				});
			},
			canDeactivate(){
				this.userPick();
				this.flag = false;

				Native.extendRightBtn("top_right", " ", "rightMessageCallback");
				window.rightMessageCallback = () => {

				};
			}
		}
	}

</script>
