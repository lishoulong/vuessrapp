<template>
    <!--质检服务-->
    <p class="specialservice_title">特色服务</p>
    <div class="specialservice_cont">
      <div v-if="zhijianData.selectType==1" class="chooseBtn"  v-el="check-btn" @click.prevent="checkOrNot()">
        <span v-bind:class="{ 'choose': isChoosed,'greyBtn': isGrey}" serviceId="{{zhijianData.serviceId}}"></span>
      </div>
      <div>
        <p>
          <i>专</i>{{zhijianData.title}}<span class="zhijianIntro" @click="popWenan()">?</span>
        </p>
        <p>验机需要先发货给优品，请勿泄漏地址</p>
      </div>
      <div>
        <p>
          原价&nbsp;{{zhijianData.originalPrice}}<span>¥&nbsp;{{zhijianData.nowPrice}}</span>
        </p>
        <p>
          <span>体验价</span>
        </p>
      </div>
		</div>
    <div class="zhijianintropop" v-bind:class="{ viEnvi: isPos}">
      <div class="zjip_bg"></div>
      <div class="zjip_cont">
          <div class="zjip_header">优品验机服务</div>
          <p class="zjip_title">服务介绍</p>
          <ul class="zjip_lista">
              <li>验机服务由转转优品专业质检工程师提供，专业靠谱</li>
              <li>验机服务完成录像监控并同步云端，真实可信。</li>
              <li>验机结果将生成详细报告同步买卖双方，公平透明。</li>
              <li>买卖双方的交易纠纷将参考验机结果，安全无忧。</li>
          </ul>
          <p class="zjip_title">流程介绍</p>
          <ul class="zjip_listb">
              <li><span>1</span>卖家发布支持验机服务的商品</li>
              <li><span>2</span>买家购买商品并选择验机服务。</li>
              <li><span>3</span>卖家将手机邮寄到转转优品进行专业检测</li>
              <li><span>4</span>优品收到手机1个工作日内完成质检，并为买卖双方出具质检报告。</li>
              <li><span>5</span>买房确认购买，转转优品平台顺丰包邮发货。</li>
          </ul>
          <p class="zjip_title">费用说明</p>
          <ul class="zjip_lista">
              <li>验机服务1元：包含验机费、快递费。</li>
              <li>快递均由优品顺丰包邮发出。</li>
          </ul>
          <p class="zjip_title">注意事项</p>
          <ul class="zjip_listb">
              <li><span>1</span>验机服务为默认选择，在买家下单后生效。</li>
              <li><span>2</span>验机服务不对商品价格进行评定。<li>
              <li><span>3</span>请勿私下交换地址并交易手机，请按照订单页面操作引导进行交易，以保证交易安全。如对方要求跳过验机环节私下交易，请尽快举报</li>
          </ul>
      </div>
      <div class="zjip_closebtn" @click="removeWenan()"></div>
  </div>

</template>
<style lang="less">
	@import "ZhiJian.less";
</style>
<script>
    module.exports = {
    	  props : ["zhijianData","isGrey","isChoosed"],
        data() {
            return {
                //isChoosed:true,
                isPos:true
            }
        },
        methods : {
            checkOrNot: function() {
              if (this.isGrey){
                return
              }
              var chooseBtnSpan=this.$els.checkBtn;
              if(this.isChoosed){
                this.isChoosed = false;
                this.$parent.changeZhijian(-parseInt(this.zhijianData.nowPrice));
              }else{
                this.isChoosed = true;
                this.$parent.changeZhijian(parseInt(this.zhijianData.nowPrice));
              }
            },
            popWenan: function() {
              this.isPos = false;
            },
            removeWenan: function() {
              this.isPos = true;
            }
        }
    }
</script>
