<template>
    <div class="delivery">
        <div v-if="zhijianData.defaultType" class="delivery-wenan">
          <div v-if="zhijianData.defaultType === 1">{{tipForSelected}}</div>
          <div v-else>{{tipForUnselected}}</div>
        </div>
        <div class="delivery-product">
            <div class="delivery-product-info">
                <img :src="handlePic(infos.pics.split('|')[0])" class="delivery-product-icon" alt="">
                <div class="delivery-product-meta">
                    <p class="title">
                        {{infos.title}} {{infos.content}}
                    </p>
                    <p class="price">
          						<span class="now-price">
          							￥{{infos.nowPrice}}
          						</span>
                      <span v-if="oriPrice" class="old-price">
          							原价{{infos.oriPrice}}
          						</span>
                    </p>
                </div>
            </div>
            <div class="delivery-product-express">
                配送方式
                <span>快递&nbsp;￥{{ infos.freigth }}</span>
            </div>
        </div>

        <div class="delivery-personal">
            <p class="spec">
                收货信息
            </p>

            <div class="delivery-personal-form">
                <p>
                    <span class="label">手机号</span>
                    <input :value="defaultAddr.mobile" type="tel" placeholder="请输入您的联系方式" @input="changeMobile">
                    <i v-show="defaultAddr.mobile" v-touch:tap="clearMobile" class="item-clear"></i>
                    <!-- <button type="button">发送验证码</button> -->
                </p>
                <!-- <p>
                    <span class="label">验证码</span>
                    <input type="tel" placeholder="请输入手机验证码">
                </p> -->
                <p>
                    <span class="label">收货人</span>
                    <input :value="defaultAddr.name" type="text" placeholder="请输入收货人姓名" @input="changeName">
                    <i v-show="defaultAddr.name" v-touch:tap="clearName" class="item-clear"></i>
                </p>

                <!-- <p v-if="addr.city && addr.area" @click="selectArea">
                    <span class="label">收货地区</span>
                    <span>{{addr.city.localName }} {{addr.area.localName}}</span>
                </p> -->
                <p @click.stop.prevent="selectArea">
                    <span class="label">收货地区</span>
                    <input :value="defaultAddr.city" type="text" placeholder="选择地区">
                    <i class="item-arrow"></i>
                </p>
                <p>
                    <span class="label">详细地址</span>
                    <input :value="defaultAddr.detail" @input="changeDetail" type="text" placeholder="请输入详细的地址信息">
                    <i v-show="defaultAddr.detail" v-touch:tap="clearDetail" class="item-clear"></i>
                </p>
            </div>
        </div>
        <zhijian-service v-if="serviceId == 1" :is-choosed.sync="isChoosed" :zhijian-data="zhijianData" :is-grey="isGrey"></zhijian-service>
        <payafter-trade v-if="prodType" :orderid="orderId" :checked-img.sync="checkedImg" :pay-grey.sync="addGrey"></payafter-trade>
        <div class="delivery-trade" v-else>
            <p class="spec" v-if="false">
                交易方式
            </p>
            <div class="delivery-trade-pipe"  v-if="false">
      					<img class="delivery-trade-pipe-icon" src="img/eye.png" />
      					<span>此物品支持</span>
                <span class="delivery-trade-pipe-popBtn" @click="showFaceTrade">在线付款，当面验货</span>
                <img class="delivery-trade-pipe-question" src="img/question.png" />
      			</div>
            <div class="delivery-trade-wx">
                <img src="./img/wx_msg.png" alt="">
                <p>微信支付</p>
                <p>推荐使用微信5.0及以上版本</p>
            </div>
        </div>

        <div class="delivery-mutation">
            <div class="delivery-mutation-total">
                合计<span>￥{{price}}=>{{price$}}</span>
            </div>
            <div class="delivery-mutation-pay" @click="btnClick">
                确认
            </div>
        </div>
        <pop-tips :visible.sync="visible" :tipsparam="tipsparam"></pop-tips>
        <pop-tips :visible.sync="visibleLoad" :tipsparam="tipsparamLoad"></pop-tips>
        <zz-tip :visible.sync="faceTradeParam.visible" :tipsparam.sync="faceTradeParam">
          <div class="faceTradeTip">{{faceTradeParam.tip}}</div>
          <ul class="popTipList">
            <li v-for="item in faceTradeParam.content" class="popTipItem">{{item}}</li>
          </ul>
        </zz-tip>
    </div>
</template>
<style lang="less">
    @import "Delivery.less";
</style>
<script>
    alert("delivery")
    import ZhijianService from './ZhiJian/ZhiJian.vue'
    import popTips from '../Common/tips/tips.vue'
    import zzTip from '../Common/tips/tips.vue'
    import payAfterTrade from './PayAfterTrade/payAfterTrade.vue'
    import _ from 'underscore'
    import { mapGetters } from 'vuex'

    import {
              getProduct,
              getDefaultAddress,
              getPay,
              createOrder,
              isPaySuccess,
              updateAddress,
              getOrder,
              addAddress,
              getZhiJian,
              getInfoOrder
           } from '../../libs/data-api'

    import Native from '../../libs/native'

    import {local as localStore} from '../../libs/store'

    import handleImg from '../../libs/handleImg'
    import 'rxjs/add/operator/pluck'
    import 'rxjs/add/operator/startWith'
    import 'rxjs/add/operator/delay'
    import 'rxjs/add/operator/map'

    const iosMiddleUrl = 'https://m.zhuanzhuan.58.com/Mzhuanzhuan/wbmiddle.html'

    export default {
        name: 'delivery',
        components : {
    			"zhijian-service" : ZhijianService,
          "pop-tips" : popTips,
          "payafter-trade" : payAfterTrade,
          "zzTip" : zzTip
    		},
        data(){
            return {
                faceTradeParam: {
                  visible: false,
                  type:'dialog',
                  title: '在线付款，当面验货',
                  tip: "为保证买卖双方财产安全，避免交易纠纷。当面验货交易需要买家在平台确认下单并支付。",
                  content: ["1. 买家确认下单并支付给转转", "2. 买卖双方协商快递或当面交易", "3. 买家验货并确认收货", "4. 转转打款至卖家微信账户"],
                  showX: true,
                  style: {top: '20%'}
                },
                infos: {pics:''},
                timer: null,
                defaultAddrInit:{},
                zhijianData: {},
                tipForSelected: '',
                tipForUnselected: '',
                isGrey:false,
                serviceId: '',
                isChoosed:true,
                tipsparam:{},
                tipsparamLoad:{},
                visible:false,
                visibleLoad:false,
                count: 0,
                oriPrice:true,
                checkedImg: true,
                prodType: false,
                addGrey: 1,
                price: 0
            }
        },
        subscriptions(){
          return {
            price$: this.$watchAsObservable('price')
                    .pluck('newValue')
                    .startWith(this.price)
                    .map(value => value + 1)
                    .delay(3000)
          }
        },
        created(){
            alert('created');
            getDefaultAddress().then( response =>{
                if(response.data.respCode == 0 ){
                    this.$store.dispatch('changeDefaultAddr', response.data.respData || {city:'',mobile:'',name: '', detail:''});
                    this.defaultAddrInit = _.clone(response.data.respData || {})
                }
            })
        },
        computed: {
            ...mapGetters({
              addr:'selectedAddr',
              selectedCity:'selectedCity',
              defaultAddr:'defaultAddr',
              orderId:'orderId',
              payType:'payType'
            }),
            infoId(){
                return this.$route.params.product_id;
            },
            handlePic(){
              return handleImg.handleSingle
            } ,
            isFaceTrade(){
              const cateIds = [
      					"2105001", "2105002", "2105003", "107", "108", "2108001", "2108002", "2108003", "2108004", "2108005", "2108006", "2108007", "2108008", "2108009", "2108010", "2108011", "2108014", "2108015", "2108016", "2108017"
      				];
      				return _.some(cateIds, value => (value == this.infos.cateId));

      			},
            metricDelivery(){
              return this.$route.query.metric || "";
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
        methods: {
            //created by lishoulong, add the floatwindow;
            showFaceTrade(){
              this.faceTradeParam.visible = true;
            },
            //created by lishoulong, down to the child components;
            changeZhijian(money){
              this.price += money
            },
            //created by lishoulong, change orderId;
            changeOrderName(ordername){
              this.$store.dispatch('changeOrderId',ordername)
            },
            selectArea(){
                this.$router.push({
                    name: 'city'
                })
            },

            validateAddr() {

                let { mobile, name, city, detail } = this.defaultAddr

                let mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/


                if(mobile == '' || mobile == null){
                    Native.toast("手机号不能为空哦");
                    return false
                }

                if(!mobileReg.test(mobile)) {
                    Native.toast("请填写正确的手机号");
                    return false
                }


                if(name == '' || name == null) {
                    Native.toast("收件人姓名不能为空哦");
                    return false
                }

                if(city == '' || city == null ) {
                    Native.toast("请选择你所在的地区")
                    return false
                }

                if(detail == '' || detail == null ) {
                    Native.toast("收货地址不能为空哦")
                    return false
                }else if(detail.length<6){
                    Native.toast("收货地址过短")
                    return false
                }

                return true
            },

            clearMobile() {
                this.$store.dispatch('changeDefaultAddrMobile', '');
            },
            clearName(){
                this.$store.dispatch('changeDefaultAddrName', '');
            },
            clearDetail(){
                this.$store.dispatch('changeDefaultAddrDetail','');
            },
            changeMobile(e) {
                this.$store.dispatch('changeDefaultAddrMobile',e.target.value)
            },

            changeName(e) {
                this.$store.dispatch('changeDefaultAddrName',e.target.value)
            },
            changeDetail(e) {
                this.$store.dispatch('changeDefaultAddrDetail',e.target.value)
            },
            addAddrAndPay(tempOrderId, tempPayId) {
              addAddress({
                  name: this.defaultAddr.name,
                  mobile: this.defaultAddr.mobile,
                  mailCode:'',
                  city: this.defaultAddr.city,
                  detail: this.defaultAddr.detail
              }).then( response => {
                  if(response.data.respCode == 0) {
                    //lishoulong,根据getInfoById得到的结果中是否有serviceId，来判断createOrder中是否添加这个参数
                    if(this.serviceId){
                      return createOrder({
                                  infoId: this.infoId,
                                  addressId: response.data.respData.id,
                                  packId: 0,
                                  payType: 5,
                                  serviceId: `[${this.serviceId}]`,
                                  metric: this.metricDelivery
                              });
                    } else {
                      return createOrder({
                                  infoId: this.infoId,
                                  addressId: response.data.respData.id,
                                  payType: 5,
                                  packId: 0,
                                  metric: this.metricDelivery
                              });
                    }
                  }
              }).then( response => {

                    if(response.data.respCode == 0) {
                        //用于在通过微信支付创建订单但是不支付的情况下，确认是否像订单详情页传prodType参数。
                        this.$store.dispatch('changePayType',2);
                        this.addGrey = 2;
                        //添加等待的loading,截止等待loading
                        Native.setWebLog({
                            actiontype : "createsuc",
                            pagetype: "zzdingdan"
                        });
                        this.visibleLoad = false;
                        let respData = response.data.respData;
                        //addAddrAndPay，创建订单后改变state中的orderId。
                        this.changeOrderName(respData.orderId);
                        [tempOrderId, tempPayId] = [respData.orderId, respData.payId]

                        return getPay({
                            orderId: respData.orderId,
                            payId: respData.payId,
                            payType: 5,
                            systemType: this.sysType
                        })
                    }else if((response.data.respCode == -1) || (response.data.respCode == -2)){
                      this.visibleLoad = false;
                      //货到付款重复下单弹框提示
                      this.visible = true;
                      this.tipsparam = {
                        type: "toast",
                        toastType:"fail",
                        content:response.data.errMsg,
                      }
                      setTimeout(
                        function(){
                          this.visible = false;
                        }.bind(this)
                      , 4000)
                    }

                }).then( response => {
                    if(response.data.respCode == 0 ) {
                        Native.setWebLog({
                            actiontype : "createpaysuc",
                            pagetype: "zzdingdan"
                        });
                        //window.location.href = response.data.respData.deeplink;
                        this.h5Pay(response.data.respData.mWebUrl, tempOrderId, tempPayId)
                    }

                    var _this = this;
                    this.timer = setInterval(() => {

                        isPaySuccess({
                            orderId: tempOrderId,
                            payId: tempPayId
                        }).then( response => {
                            if(response.data.respCode == 0) {
                                if(response.data.respData.success == 1) {
                                    Native.setWebLog({
                                        actiontype : "createpaysuced",
                                        pagetype: "zzdingdan"
                                    });
                                    clearInterval(this.timer);
                                    _this.$router.push({
                                        name: 'success',
                                        params: {
                                            order_id: tempOrderId
                                        },
                                        query: {
                                          itemTypeList: this.prodType
                                        }
                                    })
                                }
                            }
                        })

                    },5000)
                })
            },
            btnClick(){
              //点击按钮后，优先验证输入框合法性
              if(!this.validateAddr()) {
                  return;
              }
              if (!!this.orderId){
                  if (this.payType == 3){
                    this.$router.push({
                      name: 'order',
                      params: {
                        order_id: this.orderId
                      },
                      query: {
                        typelistcomeBot: this.prodType
                      }
                    })
                  }else {
                    this.$router.push({
                      name: 'order',
                      params: {
                        order_id: this.orderId
                      }
                    })
                  }
              }else if (this.serviceId && !this.orderId){
                //根据是否支持质检为入口，然后判断是否选中质检，弹出不同的弹框;增加了对订单是否创建的逻辑的判断。
                if (this.isChoosed){
                  //选中质检按钮对应的弹窗
                  this.visible = true;
                  this.tipsparam = {
                    type: "confirm",
                    title:"服务提示",
                    content:"验机服务要求卖家将物品寄往转转优品进行检验，请勿向卖家透露您的收货地址，如卖家将手机私自寄往您的地址，为避免纠纷，请原封退还卖家。",
                    btn:"1",
                    rightBtn:"我知道了",
                    callback:this.createOrderAndPayZhijian
                  }
                } else {
                  //未选中质检按钮对应的弹窗
                  this.tipsparam = {
                    type: "confirm",
                    title:"服务提示",
                    content:"取消质检服务后，转转无法保证您购买的手机是正品，建议您使用质检服务。",
                    btn:"2",
                    leftBtn:"不使用质检服务",
                    rightBtn:`使用质检服务 ￥${parseInt(this.zhijianData.nowPrice)}`,
                    callback:this.createOrderAndPayZhijian,
                    failback:this.createOrderAndPay
                  }
                  this.visible = true;
                }
              } else if (this.prodType && !this.checkedImg && !this.orderId) {
                this.visible = true;
                this.tipsparam = {
                  type: "confirm",
                  title:"确定下单",
                  content:"货到付款订单无需线上支付，确认下单即下单成功。",
                  btn:"2",
                  leftBtn:"取消",
                  rightBtn:"确认下单",
                  callback:this.createOrderAndNotPay,
                }
              }else {
                this.createOrderAndPay()
              }
              this.isGrey = true;  //如果货到付款的话，这个设置没有用处。
            },
            //未点击质检服务，确认下单弹窗中点击“质检服务”时的回调函数
            createOrderAndPayZhijian(){
              //在弹窗中更改质检价格，在合计中生效。
              this.changeZhijian(parseInt(this.zhijianData.nowPrice));
              //只要右侧按钮被选中，就把isChoosed属性设置为true；最后在createOrder中归类为通过ischoosed来判断。

              this.isChoosed = true;
              this.createOrderAndPay();
            },
            createOrderAndNotPay(){

              if(_.isEmpty(this.defaultAddrInit)) {
                addAddress({
                    name: this.defaultAddr.name,
                    mobile: this.defaultAddr.mobile,
                    mailCode:'',
                    city: this.defaultAddr.city,
                    detail: this.defaultAddr.detail
                }).then( response => {
                    if(response.data.respCode == 0) {
                      //lishoulong,根据getInfoById得到的结果中是否有serviceId，来判断createOrder中是否添加这个参数
                      if(this.serviceId){
                        return createOrder({
                                    infoId: this.infoId,
                                    addressId: response.data.respData.id,
                                    packId: 0,
                                    serviceId: `[${this.serviceId}]`,
                                    payType: 3
                                });
                      } else {
                        return createOrder({
                                    infoId: this.infoId,
                                    addressId: response.data.respData.id,
                                    packId: 0,
                                    payType: 3
                                });
                      }
                    }
                }).then(response => {
                    if(response.data.respCode == 0){
                      this.$store.dispatch('changePayType',3)
                      this.addGrey = 3;
                      let tempOrderId = response.data.respData.orderId;
                      this.changeOrderName(tempOrderId);
                      this.$router.push({
                          name: 'success',
                          params: {
                              order_id: tempOrderId,
                          },
                          query: {
                            itemTypeList: this.prodType
                          }
                      })
                    }else if((response.data.respCode == -1) || (response.data.respCode == -2)){
                      //货到付款重复下单弹框提示
                      this.visible = true;
                      this.tipsparam = {
                        type: "toast",
                        toastType:"fail",
                        content:response.data.errMsg,
                      }
                      setTimeout(
                        function(){
                          this.visible = false;
                        }.bind(this)
                      , 4000)
                    }
                  })
              }else{
                  if(!_.isEqual(this.defaultAddrInit, this.defaultAddr)) {
                    updateAddress({
                        addressId: this.defaultAddr.id,
                        name: this.defaultAddr.name,
                        mobile: this.defaultAddr.mobile,
                        mailCode:'',
                        city: this.defaultAddr.city,
                        detail: this.defaultAddr.detail
                    }).then( response => {
                        if(response.data.respCode == 0) {
                            //lishoulong,根据getInfoById得到的结果中是否有serviceId，来判断createOrder中是否添加这个参数
                            if(this.serviceId){
                              return createOrder({
                                          infoId: this.infoId,
                                          addressId: this.defaultAddr.id,
                                          packId: 0,
                                          serviceId: `[${this.serviceId}]`,
                                          payType: 3
                                      });
                            } else {
                              return createOrder({
                                          infoId: this.infoId,
                                          addressId: this.defaultAddr.id,
                                          packId: 0,
                                          payType: 3
                                      });
                            }

                        }
                    }).then( response => {

                          if(response.data.respCode == 0) {
                              this.$store.dispatch('changePayType',3)
                              this.addGrey = 3;
                              Native.setWebLog({
                                  actiontype : "createsuc",
                                  pagetype: "zzdingdan"
                              });
                              let respData = response.data.respData;
                              //createOrderAndPay，创建订单后改变state中的orderId。
                              this.changeOrderName(respData.orderId);
                              let tempOrderId = response.data.respData.orderId;

                              this.$router.push({
                                  name: 'success',
                                  params: {
                                      order_id: tempOrderId,
                                  },
                                  query: {
                                    itemTypeList: this.prodType
                                  }
                              })
                          }else if((response.data.respCode == -1) || (response.data.respCode == -2)){
                            //货到付款重复下单弹框提示
                            this.visible = true;
                            this.tipsparam = {
                              type: "toast",
                              toastType:"fail",
                              content:response.data.errMsg,
                            }
                            setTimeout(
                              function(){
                                this.visible = false;
                              }.bind(this)
                            , 4000)
                          }

                      })
                  }else {
                       let orderOption;
                       orderOption = {
                                  infoId: this.infoId,
                                  addressId: this.defaultAddr.id,
                                  packId: 0,
                                  payType: 3
                      };
                      createOrder(orderOption).then( response => {
                          if(response.data.respCode == 0) {
                              this.$store.dispatch('changePayType',3)
                              this.addGrey = 3;
                              Native.setWebLog({
                                  actiontype : "createsuc",
                                  pagetype: "zzdingdan"
                              });
                              let respData = response.data.respData;
                              //create Zhijian order，创建订单后改变state中的orderId。
                              this.changeOrderName(respData.orderId);
                              let tempOrderId = response.data.respData.orderId;

                              this.$router.push({
                                  name: 'success',
                                  params: {
                                      order_id: tempOrderId,
                                  },
                                  query: {
                                    itemTypeList: this.prodType
                                  }
                              })
                          }else if((response.data.respCode == -1) || (response.data.respCode == -2)){
                            //货到付款重复下单弹框提示
                            this.visible = true;
                            this.tipsparam = {
                              type: "toast",
                              toastType:"fail",
                              content:response.data.errMsg,
                            }
                            setTimeout(
                              function(){
                                this.visible = false;
                              }.bind(this)
                            , 4000)
                          }

                      })
                  }
              }

            },
            createOrderAndPay(){

                //埋点
                Native.setWebLog({
                    actiontype : "zhifu",
                    pagetype: "zzdingdan"
                });

                //添加等待的loading
                this.visibleLoad = true;
                this.tipsparamLoad = {
                   type: "loading",
                   content: "请您耐心等候"
                };
                let [tempOrderId, tempPayId] = ['', '']

                if(_.isEmpty(this.defaultAddrInit)) {
                    this.addAddrAndPay(tempOrderId, tempPayId)
                }else{
                    if(!_.isEqual(this.defaultAddrInit, this.defaultAddr)) {
                      updateAddress({
                          addressId: this.defaultAddr.id,
                          name: this.defaultAddr.name,
                          mobile: this.defaultAddr.mobile,
                          mailCode:'',
                          city: this.defaultAddr.city,
                          detail: this.defaultAddr.detail
                      }).then( response => {
                          if(response.data.respCode == 0) {
                              //lishoulong,根据getInfoById得到的结果中是否有serviceId，来判断createOrder中是否添加这个参数
                              if(this.serviceId){
                                return createOrder({
                                            infoId: this.infoId,
                                            addressId: this.defaultAddr.id,
                                            packId: 0,
                                            payType: 5,
                                            serviceId: `[${this.serviceId}]`,
                                            metric: this.metricDelivery
                                        });
                              } else {
                                return createOrder({
                                            infoId: this.infoId,
                                            addressId: this.defaultAddr.id,
                                            payType: 5,
                                            packId: 0,
                                            metric: this.metricDelivery
                                        });
                              }

                          }
                      }).then( response => {

                            if(response.data.respCode == 0) {
                                //用于在通过微信支付创建订单但是不支付的情况下，确认是否像订单详情页传prodType参数。
                                this.$store.dispatch('changePayType',2);
                                this.addGrey = 2;
                                //添加等待的loading,截止等待loading
                                Native.setWebLog({
                                    actiontype : "createsuc",
                                    pagetype: "zzdingdan"
                                });
                                this.visibleLoad = false;
                                let respData = response.data.respData;
                                //createOrderAndPay，创建订单后改变state中的orderId。
                                this.changeOrderName(respData.orderId);
                                let [tempOrderId, tempPayId] = [respData.orderId, respData.payId];

                                return getPay({
                                    orderId: tempOrderId,
                                    payId: tempPayId,
                                    payType: 5,
                                    systemType: this.sysType
                                })
                          }else if((response.data.respCode == -1) || (response.data.respCode == -2)){
                              this.visibleLoad = false;
                              //货到付款重复下单弹框提示
                              this.visible = true;
                              this.tipsparam = {
                                type: "toast",
                                toastType:"fail",
                                content:response.data.errMsg,
                              }
                              setTimeout(
                                function(){
                                  this.visible = false;
                                }.bind(this)
                              , 4000)
                            }

                        }).then( response => {
                            if(response.data.respCode == 0 ) {
                                //window.location.href = response.data.respData.mWebUrl;
                                this.h5Pay(response.data.respData.mWebUrl, tempOrderId, tempPayId)
                                Native.setWebLog({
                                    actiontype : "createpaysuc",
                                    pagetype: "zzdingdan"
                                });
                            }

                            var _this = this;
                            this.timer = setInterval(() => {

                                isPaySuccess({
                                    orderId: tempOrderId,
                                    payId: tempPayId
                                }).then( response => {
                                    if(response.data.respCode == 0) {
                                        if(response.data.respData.success == 1) {

                                            Native.setWebLog({
                                                actiontype : "createpaysuced",
                                                pagetype: "zzdingdan"
                                            });
                                            clearInterval(this.timer);
                                            _this.$router.push({
                                                name: 'success',
                                                params: {
                                                    order_id: tempOrderId
                                                },
                                                query: {
                                                  itemTypeList: this.prodType
                                                }
                                            })
                                        }
                                    }
                                })

                            },5000)
                        })
                    }else {
                      //created by lishoulong,add the 质检 part.
                         let orderOption;
                         if(this.isChoosed){
                            orderOption = {
                                       infoId: this.infoId,
                                       addressId: this.defaultAddr.id,
                                       packId: 0,
                                       payType: 5,
                                       serviceId: `[${this.serviceId}]`,
                                       metric: this.metricDelivery
                            };
                         } else {
                           orderOption = {
                                      infoId: this.infoId,
                                      addressId: this.defaultAddr.id,
                                      packId: 0,
                                      payType: 5,
                                      metric: this.metricDelivery
                          };
                        }
                        createOrder(orderOption).then( response => {

                            if(response.data.respCode == 0) {
                                this.$store.dispatch('changePayType',2);
                                this.addGrey = 2;
                                Native.setWebLog({
                                    actiontype : "createsuc",
                                    pagetype: "zzdingdan"
                                });
                                //添加等待的loading,截止等待loading
                                this.visibleLoad = false;
                                let respData = response.data.respData;
                                //create Zhijian order，创建订单后改变state中的orderId。
                                this.changeOrderName(respData.orderId);
                                [tempOrderId, tempPayId] = [respData.orderId, respData.payId]

                                return getPay({
                                    orderId: respData.orderId,
                                    payId: respData.payId,
                                    payType: 5,
                                    systemType: this.sysType
                                })
                            }else if((response.data.respCode == -1) || (response.data.respCode == -2)){
                                //添加等待的loading,截止等待loading
                                this.visibleLoad = false;
                                //createOrder错误弹框
                                this.visible = true;
                                this.tipsparam = {
                                  type: "toast",
                                  toastType:"fail",
                                  content:response.data.errMsg,
                                }
                                setTimeout(
                                  function(){
                                    this.visible = false;
                                  }.bind(this)
                                , 4000)
                            }

                        }).then( response => {
                            if(response.data.respCode == 0 ) {
                                // window.location.href = response.data.respData.mWebUrl;
                                this.h5Pay(response.data.respData.mWebUrl, tempOrderId, tempPayId)
                                 Native.setWebLog({
                                    actiontype : "createpaysuc",
                                    pagetype: "zzdingdan"
                                });
                            }

                            var _this = this;
                            this.timer = setInterval(() => {

                                isPaySuccess({
                                    orderId: tempOrderId,
                                    payId: tempPayId
                                }).then( response => {
                                    if(response.data.respCode == 0) {
                                        if(response.data.respData.success == 1) {
                                            Native.setWebLog({
                                                actiontype : "createpaysuced",
                                                pagetype: "zzdingdan"
                                            });

                                            clearInterval(this.timer);
                                            _this.$router.push({
                                                name: 'success',
                                                params: {
                                                    order_id: tempOrderId
                                                },
                                                query: {
                                                  itemTypeList: this.prodType
                                                }
                                            })
                                        }
                                    }
                                })

                            },5000)
                        })
                    }
                }

            },
            h5Pay(mWebUrl, orderId, payId, infoId) {
              let wxUrl
              if(this.sysType == 0) {
                wxUrl = mWebUrl + '&redirect_url=' + encodeURIComponent(`${iosMiddleUrl}?orderId=${orderId}&payId=${payId}&prodType=${this.prodType}&infoId=${this.infoId}`);
              } else {
                let redirectUrl = `https://m.zhuanzhuan.58.com/Mzhuanzhuan/zz58app/payquery?orderId=${orderId}&payId=${payId}&prodType=${this.prodType}&infoId=${this.infoId}`
                wxUrl = mWebUrl + '&redirect_url=' + encodeURIComponent(redirectUrl);
              }
              window.location.href = wxUrl;
            },
            initRouter(){
              this.serviceId = "";
              this.addGrey = 1;
              this.price = 0;
            },
            getOrd(orderid){
              getOrder(orderid).then( response => {
                this.handleOrder(response);
              })
            },
            handleOrder(response){
              if(response.data.respCode == 0) {
                  let respData = response.data.respData;
                  if(respData.payType === 3){
                    this.prodType = true;
                    //为了兼容跳到优品详情页状态刷没的问题，做一层持久化。
                    localStore.set("prodType", true);
                    Native.setWebLog({
                        actiontype : "dfshow",
                        pagetype: "zzdingdan"
                    });
                  }else {
                    this.prodType = localStore.get("prodType")
                  }
              }
            },
            getInFo(){
              getInfoOrder(this.infoId).then(response =>{
                this.handleInFo(response);
              })
            },
            handleInFo(response){
              if(response.data.respCode == 0){
                this.prodType = response.data.respData.payTypeList.indexOf('3') > -1;
                localStore.set("prodType", this.prodType);
                if (this.prodType){
                  Native.setWebLog({
                      actiontype : "dfshow",
                      pagetype: "zzdingdan"
                  });
                }
              }else if (response.data.respCode == -1) {
                //如果是同一个商品的话，货到付款逻辑根据localStore判断。分为已下单和没有下单；
                // 普通商品，如果没有下单的话，prodType为false，如果已下单的话，走GetOrder，拿到新的prodType状态。
                // 优品商品，如果没有下单的话，getInfoOrder就可以拿到prodType，如果已下单的话，从详情页进来，prodType为localstore中的状态，
                // 赋值给prodType就行了。
                this.prodType = localStore.get("prodType")
              }
            },
            getProD(){
              getProduct({ infoId: this.infoId, metric: this.metricDelivery }).then(response => {
                this.handleProd(response)
              })
            },
            handleProd(response){
              this.infos = response.data.respData;
              this.oriPrice = !!this.infos.oriPrice && parseInt(this.infos.oriPrice,10) > 0 ;
              let extraType = !!this.infos.extraData && JSON.parse(this.infos.extraData);
              if(this.infos.type == 2 && !!this.infos.extraData && extraType.type == 1 && !!extraType.url){
                //保存优品的详情页URL，以便从订单详情页跳到优品的商品详情页。
                localStore.set("youpinUrl", extraType.url);
                localStore.set("infoId", this.infoId);
              }
              //created by lishoulong 8/31,get the price return by getInfoById;
              let sumPrice = parseInt(this.infos.nowPrice) + parseInt(this.infos.freigth);
              //用来判断优品详情页过来的商品是否有orderId，如果有orderId就是本人下的单
              if(!!this.infos.orderId && !this.orderId){
                getOrder(this.infos.orderId).then( response => {
                    if(response.data.respCode == 0) {
                        let respData = response.data.respData;
                        if(respData.payType == 3){
                          //触发改变payType的action，状态用作跳到order.vue用。
                          this.$store.dispatch('changePayType',3);
                          //用来改变货到付款的样式
                          this.checkedImg = false;
                          //用来添加置灰的按钮
                          this.addGrey = 3;
                        }else {
                          this.$store.dispatch('changePayType',2);
                          //用来改变货到付款的样式
                          this.checkedImg = true;
                          this.addGrey = 2;
                        }
                    }
                })
              }
              this.changeZhijian(sumPrice);
              //orderId在route中用来判断是否已经下单了，如果下单的话，就把质检按钮置灰。
              this.changeOrderName(this.infos.orderId);
              if(this.infos.serviceInfo && this.infos.serviceInfo[0].serviceId==1){
                  this.serviceId='1';
              }
              //this.serviceId = this.infos.serviceInfo && this.infos.serviceInfo[0].serviceId==1 && this.infos.serviceInfo[0].serviceId;
              //created by lishoulong 8/31
              if(response.data.respData.serviceInfo!==undefined) {
                 getZhiJian(this.infoId).then(response =>{
                   this.zhijianData = response.data.respData.availableServices[0];
                   this.tipForSelected = this.zhijianData.tipForSelectState.tipForSelected;
                   this.tipForUnselected = this.zhijianData.tipForSelectState.tipForUnselected;
                   this.changeZhijian(parseInt(this.zhijianData.nowPrice));
                 })
              }
            }
        },
        beforeRouteEnter(to, from, next){
    			next(vm => {
    							console.log(vm.fullPath);
                  if(!!vm.orderId){
                    //如果没有刷新页面用getter中的payType改变按钮状态。
                    if(vm.payType == 3){
                      vm.addGrey = 3;
                    }else if(vm.payType == 2){
                      vm.addGrey = 2;
                    }
                    vm.getOrd(vm.orderId);
                    this.isGrey = true;
                  }else {
                    vm.getInFo();
                  }
                  vm.getProD();
            })
          },
          beforeDestroy() {
              document.body.style.backgroundColor = ""
          }
        }
</script>
