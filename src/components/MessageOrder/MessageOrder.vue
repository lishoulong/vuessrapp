<template>

	<div class="msgorder">
		<div class="msgorder-list" v-infinite-scroll="loadOrderMsgs()" infinite-scroll-disabled="loading && !noMoreData" infinite-scroll-distance="10">
			<message-item :items="orderMsg"></message-item>
		</div>
	</div>
</template>
<style lang="less">
	@import "MessageOrder.less";
</style>
<script>

	import { getOrderMsg } from '../../libs/data-api'
	import Native from '../../libs/native.js'
	import MessageItem from '../Common/MessageItem/MessageItem.vue';

	export default {
		name: 'message-order',
		data() {
			return {
				orderMsg: [],
				pageNum: 1,
				pageSize: 10,
				loading: false,
				noMoreData: false,
			}
		},
		mounted(){
			this.$nextTick(
				getOrderMsg({
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(response => {
					if(response.data.respCode == 0) {
						var temp = response.data.respData.map(value => {
							value.url = {
								name: 'order',
								params: { 'order_id': value.orderId}
							}

							return value
						})
						this.orderMsg = temp;
					}

				})
			)
		},
		methods:{
			loadOrderMsgs() {
				this.loading = true;

				if(this.noMoreData) {
					return;
				}
				this.pageNum++;
				getOrderMsg({
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(response => {
					if(response.data.respCode == 0) {
						if(response.data.respData == null || response.data.respData == {} || response.data.respData.length < this.pageSize){
							this.noMoreData = true;
						}

						var temp = response.data.respData.map(value => {
							value.url = {
								name: 'order',
								params: { 'order_id': value.orderId}
							}

							return value
						})
						this.orderMsg = this.orderMsg.concat(temp);

						this.loading = false;
					}
				})

			}
		},
		components:{
			'message-item': MessageItem
		},
		route: {
			beforeRouteEnter(){
				this.loading = false
			},
			data(){

				Native.setTitle({ title: "订单消息" });
				Native.setWebLog({
					actiontype : "dingdan",
        			pagetype: "zzmine"
				});
			},
			beforeDestroy() {
				this.loading = true;
			}
		}
	}

</script>
