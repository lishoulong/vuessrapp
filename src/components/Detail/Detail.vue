<template>
	<div class="detail">
		<div class="product-onsell" v-show="!isSoldout" v-el:parent>
			<carousel :current-count.sync="currentCount" v-bind:urls="pics" :big-urls="bigPics" :infos="infos"></carousel>
			<div v-if="isService && isTipsState" class="yanji-content">{{qualitySafeTip}}<i class="tips-close"  @click="closeDiv"></i></div>
			<div class="detail-info">
				<div v-if="nowPrice" class="detail-info-price">
					<span class="detail-info-price-current">￥<strong>{{nowPrice}}</strong></span>
					<span class="detail-info-price-ori" v-if="infos.oriPrice && infos.oriPrice>0">￥{{oriPrice}}</span>
					<span class="detail-info-price-fare" v-if="infos.freigth>0">运费{{infos.freigth}}元</span>
					<div class="detail-info-collect" @click="showCollectItemTip">
						<span><img src="images/collect-item-star.png" /></span>
						<span>收藏</span>
					</div>
				</div>

				<!--圈子label-->
				<p v-if="infos.groupId && infos.groupSpeInfoLabel" class="detail-info-circle">
					<span class="detail-info-circle-label">
						{{ infos.groupSpeInfoLabel }}
					</span>
				</p>

				<p class="detail-info-wrap">{{infos.title}} &nbsp{{infos.content}}</p>

				<div class="detail-info-tradeTip" @click="popTips">
					<span>请使用</span>
					<span class="detail-info-tradeTip-popBtn" >转转担保交易</span>
					<img class="detail-info-tradeTip-question" src="images/question.png" />
				</div>

				<p v-if="infos.groupName" class="detail-info-area">
					来自{{fromCityName}}
					<span  class="detail-info-area-circle" @click="circleTap">
						{{ infos.groupName }}<i></i>

					</span>
				</p>

				<p  class="detail-info-area" v-else>
					{{infos.cityName}} &nbsp|&nbsp {{infos.areaName}}
				</p>

				<ul class="detail-tags">
					<li v-for="label in labels">{{label}}</li>
				</ul>
				<ul class="mobile-tags">
					<li class="" v-for="mobiletTag in mobiletTags">
						<img v-lazy="mobiletTag.qualityIcon | handlePic">
						{{mobiletTag.qualityTitle}}
					</li>
				</ul>
				<div v-if="isService" class="youpin-zhijian">
					<a href="//m.zhuanzhuan.58.com/Mzhuanzhuan/zzYoupin/intro_detail.html">
						<img src="images/youpin-little-sq@3x.png" />
						<p>不敢放心买？</p>
						<p><span>1元即可享受</span>转转官方提供的专业验机服务</p>
						<i></i>
					</a>
				</div>
				<div v-if="isService" class="zhijian_zixun">
					<a :href=zhijianZixunLink><img v-lazy="zhijianZixunPic | handlePic" ></a>
				</div>

				<div v-if="isService" class="detail-alert">
					请勿使用转转担保交易之外的交易方式
				</div>
			</div>

			<div class="detail-info" v-if="false">
				<div class="detail-info-face-trade">
					<img class="detail-info-face-trade-icon" src="images/eye.png" />
					<span>此物品支持</span><span class="detail-info-face-trade-popBtn" @click="showFaceTrade">在线付款，当面验货</span>
				</div>
			</div>

			<div class="detail-personal">
				<div class="detail-love-user" v-if="infos.collectCount > 0" @click="showLikeItemTip">
					<img src="images/heart.png" class="detail-love-user-icon" />
					<span>{{infos.collectCount}}人喜欢</span>
					<ul class="love-user-img">
						<li class="love-user-head extra-user-head">
							<img src="images/arrow-like.png" />
						</li>
						<li class="love-user-head" v-for="loveImg in loveImgs" track-by="$index">
							<img v-lazy="loveImg | handlePic '54' '54'">
						</li>
					</ul>
					<!-- <b v-if="infos.collectCount>5">...</b> -->
				</div>
			</div>
			<div class="separator like-and-comment" v-if="infos.collectCount > 0"></div>
			<comment v-if="!hideComment" v-bind:comments="comments" :infos="infos"></comment>

			<div class="detail-personal">
				<div class="detail-personal-info-wrap" @click="getCallApp">
					<img class="detail-personal-portrait" :src="infos.portrait">
					<div class="detail-personal-info">
						<p>
							<span class="detail-personal-nickname">{{infos.nickName}}</span>
							<span class="detail-personal-location">{{infos.userLocation}}</span>
						</p>
						<ul class="user-tag">
							<li v-if="infos.goodCommentCount>0">评价<b>{{infos.goodCommentCount}}</b></li>
							<li>宝贝<b>{{infos.sellingCount}}</b></li>
							<li v-if="infos.joinDays<10">转转新人</li>
							<li v-if="infos.joinDays>=10 && infos.joinDays<365">加入转转<b>{{infos.joinDays}}</b>天</li>
							<li v-if="infos.joinDays>365">加入转转<b>{{joinYear}}</b>年</li>
						</ul>
					</div>
				</div>
				<i></i>
				<div class="user-sesame-wrap" @click="getCallApp">
					<span v-show="dredgeZhima == 1" class="user-sesame-logo">芝麻信用</span>
					<span v-else class="user-sesame-logo active">芝麻信用</span>
					<span class="user-sesame-more">查看</span>
					<i></i>
				</div>

				<div class="detail-zhuanzhuan">
					<h3 class="zhuan-title">宝贝来自【转转】，你可以直接在线购买</h3>
					<div class="zhuan-buy">
						<h4>如何在线购买?</h4>
						<img src="./images/detail_stepts.jpg" />
					</div>
					<div class="zhuan-content">
						<h4>【转转】是什么？</h4>
						<div>
							<p>58二手全新升级，更专业的二手交易平台</p>
							<img src="images/pic_vs_a.jpg"/>
							<div class="zhuan-detail-content">
								<p class="left-content">
										<b>买：这个周末面交？</b>
										<b>卖：这个周末又要加班。</b>
								</p>
								<p class="right-content">
										<b>支持快递送货上门</b>
										<b>方便快捷</b>
								</p>
							</div>
						</div>
						<div>
							<p>信息逐条严审、交易全程担保、拒绝骗子</p>
							<img src="images/pic_vs_b.jpg"/>
							<div class="zhuan-detail-content">
								<p class="left-content">
										<b>图片超漂亮</b>
										<b>收到货后是模型机</b>
								</p>
								<p class="right-content">
										<b>每条信息都人工审核</b>
										<b>更安心，更靠谱</b>
								</p>
							</div>
							<img src="images/pic_vs_c.jpg"/>
							<div class="zhuan-detail-content">
								<p class="left-content">
										<b>当面交易后发现是假货</b>
										<b>如何是好？</b>
								</p>
								<p class="right-content">
										<b>收到货物满意后</b>
										<b>卖家才能收到钱款</b>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="goto-zhuanzhaun">
					<div class="goto-zhuanzhaun-head">
						<span>「转转」是什么？</span>
						<!--<img src="//img.58cdn.com.cn/zhuanzhuan/logo.png" />-->
					</div>
					<p>58赶集联合微信倾力打造的全新闲置交易平台</p>
					<div class="download-zhuan" v-if="!hideComment" @click="loadZhuan">下载转转，领取58元红包</div>
				</div>
			</div>
			<div class="separator zz-and-recommend"></div>
			<recommend v-ref:reco-child v-bind:is-trade="isTrade" v-bind:recommends="recommends"></recommend>
			 <div class="empty"></div>
			<div v-if="infos.groupId && infos.groupSpeInfoLabel"
			 class="detail-footer detail-footer-circle">
				<span class="connect-buyer" @click="circleDialog">私信TA</span>
				<!-- 如果手机支持验机服务的时候，得走转转下单 -->
				<span class="want-buy" @click="circleComment">留言</span>
			</div>
			<template v-else>
				<!-- status==2,宝贝被拍下还未付钱；status==3，已卖出 -->
				<div v-if="infos.status==1 || infos.status==2" class="detail-footer">
					<span class="connect-buyer" @click="connectBtn">联系卖家</span>
					<!-- 如果手机支持验机服务的时候，得走转转下单 -->
					<span class="want-buy" @click="orBuy"> 我想购买</span>
				</div>
				<div  v-if="!!infos.status && infos.status !=1 && infos.status !=2" class="sold-detail">{{btnsold}}</div>
				<!-- 如果是本人的话，就是去转转 isauthed是否是本人-->
				<div v-if="infos.uid==uid" class="goto-zhuan" @click="downApp">{{btnmine}}</div>
			</template>

		</div>
		<!-- 后端返回数据异常时的页面展示 -->
		<div class="product-sold" v-if="isSoldout">
			<img src="images/soldout.png" />
		</div>
		<zz-tip :visible.sync="popTipParam.visible" :tipsparam.sync="popTipParam">
			<ul class="popTipList">
				<li v-for="item in popTipParam.content" class="popTipItem">{{item}}</li>
			</ul>
		</zz-tip>
		<zz-tip :visible.sync="faceTradeParam.visible" :tipsparam.sync="faceTradeParam">
			<div class="faceTradeTip">{{faceTradeParam.tip}}</div>
			<ul class="popTipList">
				<li v-for="item in faceTradeParam.content" class="popTipItem">{{item}}</li>
			</ul>
		</zz-tip>
		<zz-tip :visible.sync="callAppParam.visible" :tipsparam.sync="callAppParam"></zz-tip>
		<collect-item-tip :visible.sync="collectItemTipVisible" v-on:confirm="confirmCollectItem" v-on:cancel="cancelCollectItem"></collect-item-tip>
		<like-item-tip :visible.sync="likeItemTipVisible" v-on:confirm="confirmLikeItem" v-on:cancel="cancelLikeItem"></like-item-tip>
	</div>
</template>
<style lang="less">
	@import "Detail.less";
</style>
<script type="text/ecmascript-6">
	import _ from 'underscore';
	import { queryTags,getProduct, getInfoComments,  getRecommendInfos, getrecommendforvisit} from '../../libs/data-api'
	import Carousel from './DetailCarousel/DetailCarousel.vue'
	import Comment from './DetailComment/DetailComment.vue'
	import Recommend from './DetailRecommend/DetailRecommend.vue'
	import {local as localStore} from '../../libs/store'
	import handleImg from '../../libs/handleImg'
	import Native from '../../libs/native'
	import zzTip from '../Common/tips/tips.vue'
	import CollectItemTip from './tips/CollectItemTip.vue'
	import LikeItemTip from './tips/LikeItemTip.vue'
	import Cookie from '../../libs/cookie'
	import {getScrollTop, getClientHeight, getDocHeight} from '../../libs/util'

	const windowWidth = document.documentElement.clientWidth;

	export default {
		name: 'detail',
		data(){
			return {
				popTipParam: {
					visible: false,
					type:'dialog',
					title: '转转担保交易',
					content: ["1. 买家确认下单并支付给转转", "2. 买卖双方协商快递或当面交易", "3. 买家验货并确认收货", "4. 转转打款至卖家微信账户"],
					showX: true,
					style: {top: '20%'}
				},
				faceTradeParam: {
					visible: false,
					type:'dialog',
					title: '在线付款，当面验货',
					tip: "为保证买卖双方财产安全，避免交易纠纷。当面验货交易需要买家在平台确认下单并支付。",
					content: ["1. 买家确认下单并支付给转转", "2. 买卖双方协商快递或当面交易", "3. 买家验货并确认收货", "4. 转转打款至卖家微信账户"],
					showX: true,
					style: {top: '20%'}
				},
				callAppParam: {
					visible: false,
					type:'confirm',
					content: "担心卖家不靠谱？",
					contentBr:"去转转查看更多卖家资料",
					leftBtn : "不担心",
					rightBtn : "去转转",
					callback: this.downAppMine,
					failback: this.offDownApp,
					showX : true
				},
				collectItemTipVisible: false,
				likeItemTipVisible: false,
				infos: {},
				pics : [],
				bigPics  :[],
				comments : [],
				recommends : [],
				uid: Cookie.getUID(),
				currentCount : 1,
				isOrdered: false,
				isSoldout: false,
				isService: false,
				qualitySafeTip:'此商品支持优品验机。买家购买后卖家包邮至平台，平台为买家顺丰包邮。如卖家收取邮费，可与卖家协商。',
				isTipsShow:true,
				zhijianZixunPic:'',
				zhijianZixunLink:'',
				btnsold: '',
				btnmine: '',
				// 厂商内置包的header，不允许有跳下载
				hideComment: !!Cookie.get('inter_manufacturer'),
				fromCityName:'',
				maidianCount: 0,
				dredgeZhima:0
			}
		},
		filters: {
			handlePic: handleImg.handleSingle

		},
		created() {
			if(!!this.$route.query.token){
				Cookie.set(Cookie.COOKIE_TK, this.$route.query.token, Cookie.COOKIE_OPTION)
			}else {
				return
			}
		},
		computed:{
			metric(){
				return !!this.$route.query.metric? this.$route.query.metric : "";
			},
			infoId(){
				return this.$route.params.product_id;
			},
			isTrade(){
				const cateIds = [
					"2105001", "2105002", "2105003", "107", "108", "2108001", "2108002", "2108003", "2108004", "2108005", "2108006", "2108007", "2108008", "2108009", "2108010", "2108011", "2108014", "2108015", "2108016", "2108017"
				];
				return _.some(cateIds, value => (value == this.infos.cateId));

			},
			fullPath(){
				return (!!this.$route.query.fullPath)?this.$route.query.fullPath: '5,70149';
			},
			labels(){
				return this.infos.label ? this.infos.label.split("|") : []
			},

			loveImgs(){
				return this.infos.loveUserHeadImg;
			},
			joinYear(){
				return Math.floor(this.infos.joinDays/365)
			},
			mobiletTags(){
				return this.infos.qualityCheckingLable
			},
			nowPrice(){
				if(this.infos.nowPrice>10000){
					return ((this.infos.nowPrice / 10000).toFixed(2)) + "万" ;
				}else{
					return this.infos.nowPrice;
				}
			},
			oriPrice(){
				if(this.infos.oriPrice>10000){
					return ((this.infos.oriPrice / 10000).toFixed(2)) + "万" ;
				}else{
					return this.infos.oriPrice;
				}
			},
			isTipsState(){
				if(window.sessionStorage.getItem('zhijian_tips')){
					return false;
				}else{
					return this.isTipsShow;
				}
			},
			isauthed(){
				if(this.infos.uid == this.uid){
					this.btnmine = "去转转";
					return true
				}else{
					return false;
				}
			},
			btnsold(){
				if(this.infos.status !=1 && this.infos.status !=2){
					return "已卖出";
				}
			},
			fromCityName(){
				return this.infos.areaName? this.infos.areaName : this.infos.cityName;
			}
		},
		methods: {
			clearSta(){
				this.isOrdered = false;
			},
			showFaceTrade(){
				this.faceTradeParam.visible = true;
			},
			popTips(){
				this.popTipParam.visible = true;
			},
			showCollectItemTip() {
				this.collectItemTipVisible = true;
				Native.setWebLog({ actiontype : "shoucangclick", pagetype: "zzdetail" });
			},
			showLikeItemTip() {
				this.likeItemTipVisible = true;
				Native.setWebLog({ actiontype : "xihuanclick", pagetype: "zzdetail" });
			},
			confirmCollectItem() {
				Native.setWebLog({ actiontype : "shoucangdownload", pagetype: "zzdetail" });
				Native.callZZApp({
					urlSearch:{ openType: 'detail', id: this.infos.infoId },
					channelId: 791
				});
			},
			cancelCollectItem() { },
			confirmLikeItem() {
				Native.setWebLog({ actiontype : "xihuandownload", pagetype: "zzdetail" });
				Native.callZZApp({
					urlSearch:{ openType: 'detail', id: this.infos.infoId },
					channelId: 792
				});
			},
			cancelLikeItem() { },
	      	orBuy(){

		  		Native.setWebLog({
		  			actiontype : "buy",
		  			pagetype: "zzdetail",
		  			cate: this.infos.cateId
		  		});
		  		if(this.infos.status==1){

					this.$nextTick(() => {
						this.$router.go({
							name: 'delivery',
							params: {
								product_id: this.infoId
							},
							query: {
								metric: this.metric
							}
						})
					})
		      	}else{
		      		if(!!this.infos.orderId){
		      				//如果是本人下过的单，则会跳到订单详情页
		        		this.$router.go({
		                  name: 'order',
		                  params: {
		                      order_id: this.infos.orderId
				  						}
		            	})
		      		}else{
		      			Native.toast("宝贝被拍下还未付钱，还有机会哦！");
		      		}
		  		}
	      	},
	      	downApp(){
		  		Native.setWebLog({
		  			actiontype : "seller",
		  			pagetype: "zzdetail",
		  			cate: this.infos.cateId
		  		})
				Native.callZZApp({urlSearch:{
					openType: 'detail',
					id: this.infoId
				}});
	      	},
	      	circleDialog() {
	      		Native.setWebLog({
							actiontype: "click",
							pagetype: "detailtzsx",
							cate: this.fullPath,
							params:[this.infoId]
						});
	      		Native.callZZApp({urlSearch:{
							openType: 'detail',
							id: this.infoId
						},channelId:"773"});
	      	},
	      	circleComment(){
	      		Native.setWebLog({
							actiontype: "click",
							pagetype: "detailtzly",
							cate: this.fullPath,
							params:[this.infoId]
						});
	      		Native.callZZApp({urlSearch:{
							openType: 'detail',
							id: this.infoId
						},channelId:"773"});
	      	},
	      	circleTap(){
	      		Native.setWebLog({
							actiontype: "click",
							pagetype: "detailqz",
							cate: this.fullPath,
							params:[this.infoId]
						});
	      		var linkParams = {
	      			pagetype: 'link',
	      			url: "//m.zhuanzhuan.58.com/Mzhuanzhuan/zhuanzhuan/zzactivity/activity-quanzi/html/index.html?groupid=" + this.infos.groupId,
	      			title: "这个圈子不错哦",
	      			showarea: true,
	      			showpub: false,
	      			isfinish: false,
	      			top_right: "sou",
	      			is_recent: false,
	      			showsift: false,
	      			backtoroot: false,
	      			anim: false
	      		};
	      		Native.loadPage(linkParams);

	      	},
	      	serviceLink(){
	      		window.location.href = "//m.zhuanzhuan.58.com/Mzhuanzhuan/zzYoupin/intro_detail.html";
	      	},
	      	loadZhuan(){
				Native.setWebLog({
	    			actiontype : "58hongbao",
	    			pagetype: "zz"
	    		});
				Native.callZZApp({urlSearch:{
					openType: 'detail',
					id: this.infoId,
				},middleWareUrl: "//m.zhuanzhuan.58.com/Mzhuanzhuan/Mhongbao/newyear_hb.html?zhuanzhuanSourceFrom=960&zzqdFrom=58APP_tohb&isAPP=true&client=58APP"});
	        },
	        connectBtn(){
		  		Native.setWebLog({
		  			actiontype : "talk",
		  			pagetype: "zzdetail",
		  			cate: this.infos.cateId
		  		});
		      	this.$router.go({
		              name: 'dialog',
		              params: {
		                  user_id: this.infos.uid,
		                  product_id: this.infoId
		              }
		          })
	      	},
					connectYoupin(){
						window.location.href = "//m.zhuanzhuan.58.com/Mzhuanzhuan/zzYoupin/issues/issue_index.html";
					},
	      	goProfile(){
		      	Native.setWebLog({
		  			actiontype : "gerenxinxi",
		  			pagetype: "zz",
		  		});
		      	this.$router.go({
		      		 name: 'profile',
		      		 params: {user_id: this.infos.uid}
		      	})
	      	},
	      	closeDiv(){
		      	document.querySelector(".yanji-content").style.display = "none";
		      	window.sessionStorage.setItem('zhijian_tips','close');
		    },
			sendMaidian(index){
				if(!!this.recommends){
					Native.setWebLog({
						actiontype: "show",
						pagetype: "listDetailGoods",
						params:[`${index}/8`,"ZHUANZHUAN"]
					});
				}
			},
			getMaidianCount(count){
				return this.maidianCount<count?this.maidianCount = count: this.maidianCount;
			},
			getCallApp(){
				Native.setWebLog({
					actiontype : "gerenxinxiclick",
					pagetype: "zz"
				});
				this.callAppParam.visible = true;
			},
			downAppMine(){
				Native.setWebLog({
					actiontype : "gerenxinxizzdownload",
					pagetype: "zz"
				});
				Native.callZZApp({
					urlSearch:{
						openType: 'detail',
						id: this.infos.infoId
					},
					channelId: 952
				});
			},
			offDownApp(){
				Native.setWebLog({
					actiontype : "gerenxinxiquit",
					pagetype: "zz"
				});
			},
			getMaidianCount(count){
				return this.maidianCount<count?this.maidianCount = count: this.maidianCount;
			}
		},
		route: {
			canReuse(){
				return false
			},
			data(){
				console.log(this.fullPath);
				this.isSoldout = false;
				document.onscroll = function(){
					let current = getScrollTop() + getClientHeight();
					let docHeight = getDocHeight();
					let recommendH = (!!this.$refs.recoChild.$els.ulheight && !!this.$refs.recoChild.$els.ulheight.offsetHeight)?this.$refs.recoChild.$els.ulheight.offsetHeight : 0;
					let marginH1 = docHeight - recommendH/4;
					let marginH2 = docHeight - 2 * recommendH/4;
					let marginH3 = docHeight - 3 * recommendH/4; //次小
					let marginH4 = docHeight - recommendH; //最小的
			    // 到达底部返回true
			    if (marginH4 <= (current + 20) && (current + 20)<= marginH3) {
							this.getMaidianCount(2);
			    } else if(marginH3 <= (current + 20) && (current + 20)<= marginH2) {
							this.getMaidianCount(4);
					}else if (marginH2 <= (current + 20) && (current + 20)<= marginH1) {
							this.getMaidianCount(6);
			    }else if(marginH1 <= (current + 20) && (current + 20)<= docHeight){
							this.getMaidianCount(8);;
					}else{
							return
					}
				}.bind(this);
				Native.setTitle({title: "转转详情页"});
				this.currentCount = 1;
				getProduct({ infoId:this.infoId, metric: this.metric }).then(response => {
					if(response.status && response.data && response.data.respCode == 0){
						var data = response.data.respData
						if(data.status==8){
							this.isSoldout = true;
						}
						data.portrait = handleImg.handleSingle(data.portrait, 54, 54)
	                    this.infos = data
	                    this.pics = handleImg.handleBundle(data.pics, windowWidth, Math.floor(windowWidth * 0.8));
	                    this.bigPics = handleImg.handleBundle(data.pics, windowWidth, windowWidth);
											let latitude = data.lat || '',
											    lontitude = data.lon || '';
	                    if(this.infos.uid == this.uid){
							this.btnmine = "去转转";
						}
						if(this.infos.groupId && this.infos.groupSpeInfoLabel){
							Native.setWebLog({
								actiontype: "show",
								pagetype: "detailtz",
								cate: this.fullPath,
								params:[this.infoId]
							});
						}else if(this.infos.groupId){
							Native.setWebLog({
								actiontype: "show",
								pagetype: "detailqz",
								cate: this.fullPath,
								params:[this.infoId]
							});
						}else{
							Native.setWebLog({
								actiontype: "detailshow",
								pagetype: "zz",
								cate: this.fullPath,
								params:[this.infoId]
							});
							Native.setWebLog({
								actiontype: "show",
								pagetype: "detail",
								cate: this.fullPath,
								params:[this.infoId]
							});
						}

	                    if(data.qualitySafeTip != ''){
	                    	this.qualitySafeTip = data.qualitySafeTip;
	                    }
	                    if(this.infos.serviceInfo&&this.infos.serviceInfo[0].serviceId==1){
		            		this.isService = true;
		            		this.zhijianZixunPic = data.serviceInfo[0].picUrl;
		            		this.zhijianZixunLink = handleImg.handleSingle(data.serviceInfo[0].mUrl);
		            	}else{
		            		this.isService = false;
		            	}
									//后台接口写好以后，把经纬度字段作为参数传进来。
									getrecommendforvisit({ infoid: this.infoId, metric: this.metric, lon: lontitude, lat: latitude }).then( response => {
										console.log('getrecommendforvisit',response.data.respData);
										if(response.status && response.data && response.data.respCode == 0){

											if (this.isTrade){
												let stack1 = [], stack2 = [];
												_.each(response.data.respData.infos, (item, index) => {
													let disnum = parseInt(item.distance, 10);
													if (disnum >= 0){
														stack1.push(item)
													}else {
														stack2.push(item)
													}
												})
												if(stack1.length >= 8){
												 //_.filter循环的函数一定要return值出来。
												 this.recommends =	_.chain(stack1)
													 .map(item => { item.distance = parseInt(item.distance, 10); return item; })
													 .sortBy("distance")
													 .filter((item, index) => {
														return index < 8;
													 })
													 .value()
												}else {
													this.recommends =	_.chain(stack1)
														 .map(item => { item.distance = parseInt(item.distance, 10); return item; })
														 .sortBy("distance")
														 .concat(stack2)
														 .filter((item, index) => {
															return index < 8;
														 })
														 .value()
												}
												//this.recommends = !!response.data.respData.infos[0].distance?_.chain(response.data.respData.infos).map(item => { item.distance = parseInt(item.distance, 10); return item; }).sortBy("distance").reverse().filter((item, index) => (index < 8)).value() : _.filter(response.data.respData.infos, (item, index) => (index < 8));
											}else {
												this.recommends = _.filter(response.data.respData.infos, (item, index) => (index < 8));
											}

										}
									});
						queryTags({getUid:this.infos.uid}).then(response=>{
							if(response.status&&response.data&&response.data.respCode == 0){
							    this.dredgeZhima = response.data.respData.zhima;
							}
						})
					}else{
						this.isSoldout = true;
					}

                });
                getInfoComments(this.infoId).then(response => {
                	if(response.status && response.data && response.data.respCode == 0){
                		var data = response.data.respData
	                	data.portrait = handleImg.handleSingle(data.portrait)
	                	this.comments = data;
                	}
                });

			},
			deactivate(){
				this.sendMaidian(this.maidianCount)
			}
		},
		components : {
			carousel : Carousel,
			comment : Comment,
			recommend : Recommend,
			zzTip,
			CollectItemTip,
			LikeItemTip
		}
	}
</script>
