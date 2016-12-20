<template>
    <!--货到付款-->
    <div class="after_pay">
        <p class="spec">
            支付方式
        </p>
        <div class="trade-either">
          <div class="payBefore">
            <span class="backimg1" @click.prevent="changeImgup"><span  v-bind:class="{ 'checkedPartImg': checkedImg, 'payGrey': lastGrey}" class="circleTap"></span></span>
            <div class="BeforeOk">
              <img class="logoimg1" src="../img/payWechat.png" alt="weixinLogo">
              <div class="payBeforeWenan">
                <p>微信支付</p>
                <p>推荐使用微信5.0及以上版本使用</p>
              </div>
            </div>
          </div>
          <div class="payAfter">
            <span class="backimg2" @click.prevent="changeImgdown"><span v-bind:class="{ 'checkedPartImg': !checkedImg, 'payGrey': lastsecGrey}" class="circleTap"></span></span>
            <div class="AfterOk">
              <img class="logoimg2" src="../img/payAfter.png" alt="payAfter">
              <div class="payAfterWenan">
                <p>货到付款</p>
                <p>收到货时直接将钱交给快递员即可</p>
              </div>
            </div>
          </div>
        </div>
    </div>

</template>
<style lang="less">
	@import "payAfterTrade.less";
</style>
<script>
    module.exports = {
    	  props : ['checkedImg','payGrey','orderid'],
        data() {
            return {
            }
        },
        computed : {
          lastGrey(){
            return this.payGrey == 3;
          },
          lastsecGrey(){
            return this.payGrey == 2;
          }
        },
        methods : {
            changeImgup: function() {
              if(!!this.orderid){
                return
              }
              this.checkedImg = true;
            },
            changeImgdown: function() {
              if(!!this.orderid){
                return
              }
              this.checkedImg = false;
            }
        }
    }
</script>
