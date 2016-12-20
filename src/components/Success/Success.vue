<template>
	<div class="success">
		<div class="success-title" v-if="!prodType">
			<img src="img/right.png" alt="success">支付成功
		</div>
		<div class="success-explain" v-if="!prodType">
			<div>{{zhijianPaySuccessInfo.paySuccessContent}}</div>
			<div class="success-explain-action">
		        <a v-if="zhijianPaySuccessInfo.paySuccessBtns[0].text=='咨询质检客服'" class="success-explain-action-help" href="//m.zhuanzhuan.58.com/Mzhuanzhuan/zzapp/service-issue.html">{{zhijianPaySuccessInfo.paySuccessBtns[0].text}}</a>
		        <a v-else class="success-explain-action-help" v-link="{name: 'help'}">{{zhijianPaySuccessInfo.paySuccessBtns[0].text}}</a>
		        <a v-if="!hideDownload" class="down active" @click="callApp" _href="//m.zhuanzhuan.58.com/Mzhuanzhuan/trade/html/app58/xz_zz.html?sale=mybuy&zhuanzhuanSourceFrom=712">{{zhijianPaySuccessInfo.paySuccessBtns[1].text}}</a>
	        </div>
		</div>
		<div class="success-payafter" v-if="prodType">
			<div class="success-payafter-title">
				 <img src="img/right.png" alt="success">{{successStatus}}
			 </div>
			 <p class="success-payafter-wenanDetail">{{successContent}}</p>
		</div>
		<!--
		<div v-else class="success-explain">
			<ul class="">
	            <li>卖家未发货，如何申请退款？
	                <p>
	                下载转转APP，使用微信登录，绑定当前的手机号码，即可管理订单，申请退款。
	                	<a class="see_detail" v-link="{name: 'order', params: {order_id: this.orderId}}">查看详情&gt;&gt;</a>
	                </p>
	            </li>
	            <li>付款成功，我的钱去哪儿了？
	                <p>转转已收到您的钱款，并为您通知卖家发货。您确认收货后欠款将打入卖家账户。</p>
	            </li>
	        </ul>
	        <div class="success-explain-action">
		        <a class="success-explain-action-help" v-link="{name: 'help'}">去帮助中心</a>
		        <a class="down active" @click="callApp" _href="//m.zhuanzhuan.58.com/Mzhuanzhuan/trade/html/app58/xz_zz.html?sale=mybuy&zhuanzhuanSourceFrom=712">下载转转APP 管理订单</a>
	        </div>
		</div>
		-->
		<div class="success-order">
			<div class="success-order-info">
				<img :src="orderInfo.infoPics | handlePic '120' '120'" alt="">
				<div class="success-order-info-item">
					<p>实付款：￥{{ orderInfo.actualPayMoney }}</p>
					<p>收货人：{{ address.name }} <span>{{ orderInfo.userTel }}</span></p>
					<p class="addr">收货地址：{{ address.city }} {{ address.detail }}</p>
				</div>
			</div>
			<div class="success-order-oper">
				<span @click="toOrderDetail">
					查看订单详情
				</span>
				<span @click="remindDelivery" class="red" v-if="!prodType">
					提醒卖家发货
				</span>
				<span  @click="goQq" class="red" v-if="prodType">
					提醒卖家发货
				</span>
			</div>
		</div>
		<!-- <div class="success-recommend"> -->
			<recommend :recommends="recommends" title="猜你喜欢"></recommend>
		<!-- </div> -->

		<div v-if="!hideDownload" @click="downApp" class="success-bottom" href="//m.zhuanzhuan.58.com/Mzhuanzhuan/trade/html/app58/xz_zz.html?sale=mybuy&zhuanzhuanSourceFrom=712">
			下载转转APP&nbsp;&nbsp;管理订单
		</div>
	</div>
</template>
<style lang="less">
	@import "Success.less";
</style>
<script>

	import Recommend from './Recommend/Recommend.vue'

	import Native from '../../libs/native.js'

	import { getOrder, getRecommendForPay, remindDeliverGood, getPaySuccessInfo } from '../../libs/data-api'
	import handleImg from '../../libs/handleImg'
  import Cookie from '../../libs/cookie'

	export default {
		name: 'success',
		data() {
			return {
				orderInfo: {},
				address: {},
				recommends: [],
				zhijianPaySuccessInfo:{},
				zhijianPayBtns:[{text: '去帮助中心'},{text: '下载转转APP 管理订单'}],
				successStatus: '',
				successContent: ''
			}
		},
		filters: {
		    handlePic: handleImg.handleSingle

		},
		computed: {
			orderId(){
				return this.$route.params.order_id
			},
			prodType(){
				return this.$route.query.itemTypeList
			},
			// 厂商内置包的header，不允许有跳下载
			hideDownload() {
				return !!Cookie.get('inter_manufacturer')
			}
		},
		methods:{
			toOrderDetail() {
				this.$router.go({
					name: 'order',
					params: {
						order_id: this.orderId
					},
					query: {
						typelistcomeBot: this.prodType
					}
				})
			},
			remindDelivery() {
				//remindDelivery
				remindDeliverGood(this.orderId).then(response => {
					if(response.data.respCode == 0) {
						Native.toast('已提醒卖家快马加鞭')
					}else{
						Native.toast(response.data.errMsg || '服务器繁忙，稍后重试')
					}
				})
			},
			goQq(){
				window.location.href = "//m.zhuanzhuan.58.com/Mzhuanzhuan/zzYoupin/issues/issue_index.html";
			},
            callApp(){
				Native.callZZApp();
            },
            downApp(){
            	Native.setWebLog({
            		actiontype : "xz",
                    pagetype: "zzzfcg"
            	});
            	Native.callZZApp();
            }
		},
		route: {

			activate(){
				document.body.style.backgroundColor = "#eeeeee";
				//待确定activate能否取到computed中的属性
				if(this.prodType){
					Native.setTitle({title: '下单成功'});
				}else {
					Native.setTitle({title: '支付成功'});
				}
				Native.setWebLog({
					actiontype : "show",
                    pagetype: "zzzfcg"
				});
			},
			data() {
				getOrder(this.orderId).then(response => {

						if(response.data.respCode == 0) {
							this.orderInfo = response.data.respData
							this.address = JSON.parse(response.data.respData.address)
							return getRecommendForPay({
								pageSize: 6,
								pageNum: 1,
								cateId: response.data.respData.cateId
							})
						}

				}).then( response => {

					if(response.data.respCode == 0 ) {
						this.recommends = response.data.respData
					}

				})
				getPaySuccessInfo(this.orderId).then(response => {
					if(response.data.respCode == 0){
						this.zhijianPaySuccessInfo=response.data.respData;
						this.zhijianPayBtns = this.zhijianPaySuccessInfo.paySuccessBtns;
						this.successStatus = this.zhijianPaySuccessInfo.paySuccessTitle;
						this.successContent = this.zhijianPaySuccessInfo.paySuccessContent;
					}
				})
			},
			deactivate(){
				document.body.style.backgroundColor = ""
			}
		},
		components: {
			recommend: Recommend
		},
	}

</script>
