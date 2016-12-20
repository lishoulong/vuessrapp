<template>
	<div class="message-chat">
		<message-item :items="users"></message-item>
	</div>
</template>
<style lang="less">
	@import "MessageChat.less";
</style>
<script type="text/ecmascript-6">
	import _ from 'underscore';
	import Cookie from '../../libs/cookie';
	import * as Api from '../../libs/data-api'
	import * as Chat from "../../libs/chat";
	import {setChatList, setSystemList} from "../../vuex/actions";
	import { chatList, systemList } from '../../vuex/getters'

	import MessageItem from '../Common/MessageItem/MessageItem.vue';
	import Native from '../../libs/native.js'

	export default {
		name: 'MessageChat',
		data(){
			return {
				usersCache: [],
				users: [],
				pagenum: 1,
				pagesize: 10,
				start_time: 0,
				start_id: 0,
				uid: Cookie.getUID()
			};
		},
		vuex: {
			actions: {
				setChatList, setSystemList
			},
			getters: {
				chatList, systemList
			}
		},
		methods: {
			getLastContacts(resp, cb){
				let users;
				if(resp.data && resp.data.code == 200000 && resp.data.protocol_content && resp.data.protocol_content.contact_infos){
					users = resp.data.protocol_content.contact_infos;
					users = _.map(users, (user) => {
						let ssid = user.msg_content.userdata?user.msg_content.userdata.sid: '';
						return {
							timestamp: user.msg_timestamp + "000",
							uid: user.uid,
							status: user.msg_content.text,
							portrait: "",
							nickName: "",
							isRadius: true,
							url: `/message/chat/${user.uid}/${ssid}`,
							point: 0,
							sid: ssid
						};
					});
					this.usersCache = users;
					return cb && cb(users);
				}
			},
			getNickNameAndPhoto(resp, cb){
				let users, usersInfo;
				if(resp.data && resp.data.respCode == 0 && resp.data.respData){
					usersInfo = resp.data.respData;

					users = _.chain(this.usersCache)
							.filter(user => {
								return usersInfo[user.uid] != undefined;
							})
							.map(user => {
								user.portrait = usersInfo[user.uid].portrait;
								user.nickName = usersInfo[user.uid].nickName;
								return user;
							}).value();
					this.users = users;
					return cb && cb(users);
				}
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
						if(chatlist[this.uid] && chatlist[this.uid][user.uid]){
							user.point = chatlist[this.uid][user.uid];
						}
						return user;
					}, this);
				}
			}
		},
		components: {
			'message-item': MessageItem
		},
		route: {
			data(){
				Native.setTitle({ title: "私信" });
				Native.setWebLog({
					actiontype : "talk",
        			pagetype: "zzmine"
				});
				Chat.login().then(resp => {
					const params = {
						pagenum: this.pagenum,
						pagesize: this.pagesize
					};
					return Chat.getlastcontacts(params);
				}).then(resp => {
					return this.getLastContacts(resp, (users) => {
						let ids = _.map(users, user => user.uid);
						return Api.getNickNameAndPhoto({userids: ids.join(",")});
					});
				}).then(resp => {

					return this.getNickNameAndPhoto(resp, () => {
						return Chat.msg_offline({
							start_time:this.start_time,
							start_id:this.start_id,
							msgtype:10
						}).then((resp) => {
							return this.msg_offline(resp);
						});
					});
				});
			}
		}
	}

</script>
