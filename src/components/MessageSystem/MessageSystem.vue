<template>
	<div class="message-system">
		<div class="msgorder-list">
			<message-item :items="orderMsg"></message-item>
		</div>
		<div v-show="list.length<1" class="system-msg-nodata">
		    <img src="./img/no_system_msg.png">
		    <p>暂无系统消息</p>
		</div>
		
	</div>
</template>
<style lang="less">
	@import "MessageSystem.less";
</style>
<script>
	import {setChatList, setSystemList} from "../../vuex/actions"
	import {systemList} from "../../vuex/getters"
	import MessageItem from '../Common/MessageItem/MessageItem.vue'
	import Cookies from '../../libs/cookie.js'
	import Native from '../../libs/native.js'

	export default {
		name: 'message-order',
		data() {
			return {
				orderMsg: [],
				pageNum: 1,
				pageSize: 10,
				loading: false,
				noMoreData: false,
				list:[]
			}
		},
		vuex: {
			actions: {
				setChatList, setSystemList
			},
			getters: {
				systemList
			}
		},
		methods:{
			loadOrderMsgs() {
				this.loading = true;

				if(this.noMoreData) {
					return;
				}
				getSystemMsg({
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(response => {
					if(response.data.respCode == 0) {
						if(response.data.respData == null || response.data.respData == {} || response.data.respData.length < this.pageSize){
							this.noMoreData = true;
						}
						this.orderMsg = this.orderMsg.concat(response.data.respData);
						this.pageNum++;
						this.loading = false;
					}
				})
				
			},
			setHeader(){
				Native.setTitle({ title: "系统消息" });
				Native.setWebLog({
					actiontype : "xitong",
        			pagetype: "zzmine"
				});
			}
		},
		components:{
			'message-item': MessageItem
		},
		route: {
			activate(){
				document.body.style.backgroundColor="#f1f2f6"
			},
			data(){
				this.list = this.systemList[ Cookies.getUID() ] || [];
				this.setHeader();
			},
			deactivate(){
				document.body.style.backgroundColor=""
			}
		}
	}

</script>