<template>
	<div class="order">

		<!--

			已验证的status
			1.待支付
			18. detailInfo=买家超时未支付，交易关闭。
			20. detailInfo=卖家取消订单，原因：与买家价格未协商一致


			有问题的状态
			17.退款   detailInfo=卖家已确认退款30元，请您前往微信零钱查看退款。使用银行卡支付的卖家需要等待3-7个工作日到账。

			4 卖家已发货
		 -->

		<div class="order-info">

			<div class="order-info-sd">
				<span class="order-info-status">
					<i></i>
					{{ order.statusInfo }}
				</span>
				<span class="order-info-date">
					{{ order.latestOpTime | parseInt | dateFormat 'MM/dd hh:mm'}}
				</span>
			</div>
			<!--验机服务-->
			<div v-if="order.hasOwnProperty('serviceWinInfo')">
				<p class="order-info-text-service"><img :src="serviceWindow.serviceWinIcon | handlePic" />{{serviceWindow.serviceWinTitle}}</p>
				<p class="order-info-msg-service">{{{serviceWindow.serviceWinContent}}}</p>
			</div>
			<div v-else>
				<p class="order-info-text">
					{{ order.detailInfo }} <br/>
					<span class="red">{{ order.payTime | parseInt | countDown}}</span>{{ order.detailInfo1 }}
				</p>
				<div class="order-info-msg" v-if="order.status==4">
					<i class="order-info-msg-icon"></i>
					<div class="order-info-msg-con">
						<div class="order-info-msg-con-title item">卖家标明已发货，货物信息请在转转APP查看</div>
						<div class="order-info-msg-con-info item" v-show="order.lastLogisticsInfo">{{order.lastLogisticsInfo}}</div>
						<div class="order-info-msg-con-time item" v-show="order.lastLogisticsTime">{{order.lastLogisticsTime | parseInt | dateFormat 'YYYY-MM-dd hh:mm'}}</div>
					</div>
				</div>
			</div>
			<div class="order-info-buyer" v-if="!typelistcomeBot">
				<p>
					<img :src="order.userPic | handlePic | formatProtocol" alt="">
					<span>{{ order.userNickName }}</span>
				</p>
				<p>
					<a v-if="order.userNickName == '转转优品' || !!order.availableServices" @click.stop.prevent = "backDetail">{{ order.btnTextContract }}</a>
					<a v-else v-link="{ name: 'dialog', params: {user_id: order.userId, product_id: order.infoId }}">
						{{ order.btnTextContract }}
					</a>
				</p>
			</div>
			<div class="order-info-buyer" v-if="typelistcomeBot">
				<p>
					<img src="./img/youpinLogo.png" alt="">
					<span class="youpinzhuan">转转优品</span>
				</p>
				<p>
					<a href="tel:4008582358">
						联系客服
					</a>
				</p>
			</div>
		</div>

		<div class="order-detail">
			<a v-if="typelistcomeBot || order.userNickName == '转转优品'" >
				<div class="order-detail-address">
					<p>
						收件人：{{ order.address.name }}
					<span class="order-detail-address-mobile">
						{{ order.address.mobile }}
					</span>
						<!-- 收件人：朱崇跃 18612782819 -->
					</p>
					<p>
						收获地址：{{ order.address.detail }}
						<!-- 收获地址：酒仙桥北路甲121223 -->
					</p>
				</div>
				<div class="order-detail-product">
					<div class="order-detail-product-wrap">
						<img :src="order.infoPics">
						<div class="order-detail-product-items">
							<p>
								{{ order.infoTitle }}{{ order.infoDescripton }}
								<!-- 多孔USB接口，给钱你就拿走  请走转转担保交易，喜欢的话就赶快联系我吧。 -->
							</p>
							<p class="layout1 layout">￥{{ order.price }}</p>
							<p class="layout">运费&nbsp;&nbsp;&nbsp;￥{{ order.freight }}</p>
						</div>
					</div>
					<p class="other">商品总额<span>￥{{ parseInt(order.price) + parseInt(order.freight) }}</span></p>
					<p v-if="order.hasOwnProperty('availableServices')" class="other">优品验机服务<span>￥{{order.availableServices[0].nowPrice}}</span></p>
					<p class="other">红包减免<span>-￥0</span></p>
				</div>
			</a>
			<a v-else v-link="{name: 'detail', params: {product_id: order.infoId}}">
				<div class="order-detail-address">
					<p>
						收件人：{{ order.address.name }}
					<span class="order-detail-address-mobile">
						{{ order.address.mobile }}
					</span>
						<!-- 收件人：朱崇跃 18612782819 -->
					</p>
					<p>
						收获地址：{{ order.address.detail }}
						<!-- 收获地址：酒仙桥北路甲121223 -->
					</p>
				</div>
				<div class="order-detail-product">
					<div class="order-detail-product-wrap">
						<img :src="order.infoPics">
						<div class="order-detail-product-items">
							<p>
								{{ order.infoTitle }}{{ order.infoDescripton }}
								<!-- 多孔USB接口，给钱你就拿走  请走转转担保交易，喜欢的话就赶快联系我吧。 -->
							</p>
							<p class="layout1 layout">￥{{ order.price }}</p>
							<p class="layout">运费&nbsp;&nbsp;&nbsp;￥{{ order.freight }}</p>
						</div>
					</div>
					<p class="other">商品总额<span>￥{{ parseInt(order.price) + parseInt(order.freight) }}</span></p>
					<p v-if="order.hasOwnProperty('availableServices')" class="other">优品验机服务<span>￥{{order.availableServices[0].nowPrice}}</span></p>
					<p class="other">红包减免<span>-￥0</span></p>
				</div>
			</a>

			<div class="order-detail-sum">
				<i></i>转转担保交易
				<span>支付总价￥{{order.actualPayMoney}}</span>
			</div>
		</div>

		<div class="order-bill">
			<p>
				支付方式
				<span v-if="typelistcomeBot">货到付款</span>
				<span v-else>微信支付</span>
			</p>
			<p>
				订单编号
				<span>
					{{ order.orderId }}
				</span>
			</p>
			<p>
				下单时间
				<span>
				 {{order.createTime | parseInt | dateFormat 'YYYY-MM-dd hh:mm'}}
				</span>
			</p>
			<p>
				支付时间
				<span v-if="order.buyerPayTime > 0">
					{{order.buyerPayTime | parseInt | dateFormat 'YYYY-MM-dd hh:mm'}}
				</span>
			</p>
			<p>
				发货时间
				<span v-if="order.deliverTime > 0">
					{{order.deliverTime | parseInt | dateFormat 'YYYY-MM-dd hh:mm'}}
				</span>
			</p>
		</div>

		<div v-if="order.hasOwnProperty('serviceWinInfo')">
			<div v-if="order.status==1" class="order-oper">
				<div @click="showCancel" class="order-oper-cancel">
					{{ order.btnTextLeft }}
				</div>
				<div @click="defrayOrder" class="order-oper-pay">
					{{ order.btnTextRight }}
				</div>
			</div>
			<div v-else class="order-oper">
				<div v-if="order.hasOwnProperty('btnTextLeft')" class="order-oper-cancel"><a :href="downloadUrl" @click="stopDownload($event)">{{ order.btnTextLeft }}</a></div>
				<div v-if="order.hasOwnProperty('btnTextRight')" class="order-oper-pay"><a :href="downloadUrl" @click="stopDownload($event)">{{ order.btnTextRight }}</a></div>
			</div>
		</div>
		<div v-else>
			<!--货到付款底部显示-->
			<div v-if="typelistcomeBot" class="order-oper">
					<div  class="order-oper-zz">
						<a href="tel:4008582358"><p>联系优品客服</p></a>
					</div>
			</div>
			<!-- 待支付 -->
			<div v-if="order.status==1 && !typelistcomeBot" class="order-oper">
				<div @click="showCancel" class="order-oper-cancel">
					{{ order.btnTextLeft }}
				</div>
				<div @click="defrayOrder" class="order-oper-pay">
					{{ order.btnTextRight }}
				</div>
			</div>

			<!-- 支付成功 -->
			<div v-if="order.status==3 && !typelistcomeBot" class="order-oper">
				<div class="order-oper-cancel">
					<a :href="downloadUrl" @click="stopDownload($event)">
						{{ order.btnTextLeft }}
					</a>
				</div>
				<div @click="remindDelivery" class="order-oper-pay">
						{{ order.btnTextRight }}
				</div>
			</div>

			<!-- 卖家已发货 -->
			<div v-if="order.status==4 && !typelistcomeBot" class="order-oper">
				<div class="order-oper-cancel">
					<a :href="downloadUrl" @click="stopDownload($event)">
						{{ order.btnTextLeft }}
					</a>
				</div>
				<div class="order-oper-pay">
					<a :href="downloadUrl" @click="stopDownload($event)">
						{{ order.btnTextRight }}
					</a>
				</div>
			</div>

			<!-- 交易成功 -->
			<div v-if="successSet.has(parseInt(order.status)) && !typelistcomeBot" class="order-oper">
				<div class="order-oper-cancel">
					<a :href="downloadUrl" @click="stopDownload($event)">
						{{ order.btnTextLeft }}
					</a>
				</div>
				<div @click="showConfirmReceive" class="order-oper-pay">
					{{ order.btnTextRight }}
				</div>
			</div>

			<div v-if="endSet.has(parseInt(order.status)) && order.btnTextRight && !typelistcomeBot" class="order-oper">
				<a :href="downloadUrl" @click="stopDownload($event)" class="order-oper-zz">
					{{ order.btnTextRight }}
				</a>
			</div>
		</div>

		<zz-tip :visible.sync="showReceiveTip" :tipsparam.sync="confirmReciveParam" slide="center">

			<div class="getPayCaptcha">
			    <div class="blackbg1" v-el:blackbg1></div>
			    <div class="PayPanel">
			        <div class="close" ><div class="close_img" @click=""><img src="img/close.png"></div></div>
			        <h3>确认收货</h3>
			        <p>确认提交后，卖家将直接收到您的钱款</p>
			        <div class="sendCode">
			            <p><span>已向手机：</span><br><b>18612782819发送验证码</b></p>
			            <div v-if ='' class="btnDaojishi">{{btnDaojishi}}</div>
			            <div v-else class="codeBtn canclick" @click="">重新发送</div>
			        </div>
			        <form @submit.prevent="">
			            <input v-el:key type="number" v-model="" @input="">
			            <!-- <input type="number" v-model="key1"  @keyup="checkInput(1,$event)" v-el:key1>
			            <input type="number" v-model="key2"  @keyup="checkInput(2,$event)" v-el:key2>
			            <input type="number" v-model="key3"  @keyup="checkInput(3,$event)" v-el:key3>
			            <input type="number" v-model="key4"  @keyup="checkInput(4,$event)" v-el:key4> -->
			            <p v-show="">*请输入正确的验证码</p>
			        </form>
			        <div class="confirmReceipt" @click="">确认收货</div>
			    </div>
			</div>

		</zz-tip>

		<cancel-order :is-show.sync="showCancelTip" :order-id="orderId" :callback="cancelOrderCallback"></cancel-order>

		<zz-tip :visible.sync="showLoading" :tipsparam.sync="loadingTipParam">
		</zz-tip>
	</div>
</template>
<style lang="less">
	@import "Order.less";
</style>
<script>

	import { getOrder, getOrderService } from '../../libs/data-api.js'

	import handleImg from '../../libs/handleImg.js'

	import { dateFormat, countDown } from '../../libs/util.js'

	import zzTip from '../Common/tips/tips.vue'

	import CancelOrder from '../Common/CancelOrder/CancelOrder.vue'

	import { cancelOrder, getPay, remindDeliverGood } from '../../libs/data-api.js'

	import { ORDER_DOWNLOAD_URL } from '../../config/env.js'

	import {local as localStore} from '../../libs/store'

	import Native from '../../libs/native.js'

	import Cookie from '../../libs/cookie'

	import { formatProtocol } from '../../libs/util';

	const iosMiddleUrl = 'https://m.zhuanzhuan.58.com/Mzhuanzhuan/wbmiddle.html'

	export default {
		name: 'order',
		data() {
			return {
				downloadUrl: ORDER_DOWNLOAD_URL,
				order: { address: {}},
				address: {},
				infoPics: '',
				showCancelTip: false,
				showLoading: false,
				showReceiveTip: false,
				confirmReciveParam: {type: 'slide'},
				loadingTipParam: {  type:'loading' },
				endSet: new Set([2, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
				successSet: new Set([5, 6, 21, 22]),
				serviceWindow:'',
				infoId: '',
				prodType: false
			}
		},
		computed: {
			orderId() {
				return this.$route.params.order_id;
			},
			typelistcomeBot() {
				console.log(this.$route.query.typelistcomeBot);
				return (this.$route.query.typelistcomeBot == "true") || (parseInt(this.$route.query.typelistcomeBot,10) == 3) || this.prodType;
			},
			hideDownload() {
				return !!Cookie.get('inter_manufacturer')
			},
			linkhref() {
				//目前的逻辑只是支持货到付款商品和支持优品验机商品，并且infoId和商品详情页的infoId相同的商品才可以拿到对应优品的URL，如果GetOrder也有优品URL就可以解决了。
				if(localStore.get("infoId") == this.infoId){
					return localStore.get("youpinUrl")
				}
			},
			sysType() {
				let u = navigator.userAgent;
				let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
				let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);  //ios终端
				if (isIOS) {
					return 0
				}
				if (isAndroid) {
					return 1
				}
			}
		},
		filters: {
			dateFormat,
			parseInt,
			countDown,
			formatProtocol,
			handlePic(url){
			if(url) {
					return handleImg.handleSingle(url, 50, 50)
				}
			}
		},
		methods:{
			stopDownload(e){
				if(this.hideDownload) {
					Native.toast('暂不支持此功能,请去转转查看');
					e.preventDefault();
				}
			},
			cancelOrderCallback(response){
				if( response.data.respCode == 0 ) {
					var data = response.data.respData
					data.address =  JSON.parse(data.address)
					data.infoPics = handleImg.handleSingle(data.infoPics)
					this.order = data;
				}
			},
			showCancel() {
				this.showCancelTip = true
			},
			hideCancel() {
				this.showCancelTip = false
			},
			showLoadingMethod() {
				this.showLoading = true;
			},
			defrayOrder() {
				this.showLoading = true;
				getPay({
					orderId: this.orderId,
					payId: this.order.payId,
					payType: 5,
					systemType: this.sysType
				}).then( response => {
					this.showLoading = false;
					if( response.data.respCode == 0 ) {
						// window.location.href = response.data.respData.deeplink;
						let wxUrl, mWebUrl = response.data.respData.mWebUrl;
						if(this.sysType == 0) {
							wxUrl = mWebUrl + '&redirect_url=' + encodeURIComponent(`${iosMiddleUrl}?orderId=${this.orderId}&payId=${this.order.payId}&prodType=${this.prodType}&infoId=${this.order.infoId}`);
						} else {
							let redirectUrl = `https://m.zhuanzhuan.58.com/Mzhuanzhuan/zz58app/payquery?orderId=${orderId}&payId=${payId}&prodType=${this.prodType}&infoId=${this.infoId}`
							wxUrl = mWebUrl + '&redirect_url=' + encodeURIComponent(redirectUrl);
							//wxUrl = `${mWebUrl}&redirect_url=${encodeURIComponent(window.location.href)}`;
						}
						window.location.href = wxUrl;
					}else{

					}
				})
			},
			remindDelivery() {
				//remindDelivery
				remindDeliverGood(this.orderId).then(response => {
					if(response.data.respCode == 0) {
						Native.toast('已提醒卖家快马加鞭')
					}else{
						Native.toast(response.data.errMsg || "一天只能发一次")
					}
				})
			},
			showConfirmReceive() {
				//this.showReceiveTip = true
				const url = "http://m.zhuanzhuan.58.com/Mzhuanzhuan/Mtips/paytip.html?orderId=777817876423671814&zzv=2.4.0&tt=B12B6FDB5132CACF013452383DF133A1";
				Native.callZZApp({
					urlSearch:{
						openType:'web',
						id: url
					}
				});
			},
			setHeader(){
				Native.setTitle({ title: "订单详情页" });
			},
			setMaidian(){
				Native.setWebLog({
					actiontype : "show",
                    pagetype: "zzdingdan"
				});
			},
			backDetail(){
				window.location.href = "//m.zhuanzhuan.58.com/Mzhuanzhuan/zzYoupin/issues/issue_index.html";
			},
		},
		components: {
			zzTip,
			'cancel-order': CancelOrder
		},
		route: {
			activate(){
				document.body.style.backgroundColor = '#ebeae8'
				this.order = { address: {}}
			},
			data(){
				this.setHeader();
				this.setMaidian();
				this.prodType = false;
				getOrder( this.orderId ).then( response => {
					if(response.data.respCode == 0) {

						var data = response.data.respData
						data.address =  JSON.parse(data.address)
						data.infoPics = handleImg.handleSingle(data.infoPics)
						this.order = data;
						this.infoId = data.infoId;
						//兼容从消息列表过来的订单是否是货到付款订单
						if(data.payType == 3){
							this.prodType = true;
						}
						if(data.hasOwnProperty('serviceWinInfo')){
							getOrderService(this.orderId).then(response=>{
								if(response.data.respCode==0){
									this.serviceWindow=response.data.respData;
								}
							})
						}
					}
				})
			},
			deactivate(){
				document.body.style.backgroundColor = ''
			}
		}
	}

</script>
