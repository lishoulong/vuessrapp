<template>
  <div>
    <div class="zz-tips-bg" v-if="visible && slide!='down' && tipsparam.cover!=false" @click="cancel" v-touch:pan.stop></div>

    <div class="zz-tips" v-if="visible && tipsparam.type != 'slide'" v-touch:pan.stop>

      <div class="zz-tips-confirm" v-if="tipsparam.type=='confirm'">
          <h3>{{tipsparam.title | defaultValue('提示')}}</h3>
          <div class="tips-content">{{tipsparam.content}}</div>
          <div v-if="tipsparam.contentBr" class="tips-content">{{tipsparam.contentBr}}</div>
          <div class="tips-btns" v-if="tipsparam.btn==1">
              <p class="tips-oneBtn" @click="confirm">{{tipsparam.rightBtn | defaultValue('确认')}}</p>
          </div>
          <div class="tips-btns" v-else>
              <p class="tips-leftBtn" @click="cancel">{{tipsparam.leftBtn | defaultValue('取消')}}</p>
              <p class="tips-rightBtn" @click="confirm">{{tipsparam.rightBtn | defaultValue('确认')}}</p>
          </div>
          <i class="tips-close" v-if="tipsparam.showX" @click="closePage"></i>
      </div>

      <div class="zz-tips-toast" v-if="tipsparam.type == 'toast'">
          <p class="failImg" v-show="tipsparam.toastType == 'fail'"></p>
          <p class="successImg" v-show="tipsparam.toastType == 'success'"></p>
          <div class="toastContent">{{tipsparam.content}}</div>
      </div>

      <div class="zz-tips-loading" v-if="tipsparam.type=='loading'">
          <p class="loadingImg"></p>
          <div class="loadingContent">{{tipsparam.content | defaultValue('载入中...')}}</div>
      </div>
    </div>

    <div class="zz-tips-dialog"  v-show="visible && tipsparam.type=='dialog'" :style="tipsparam.style">
        <div class="zz-tips-dialog-title">{{tipsparam.title | defaultValue('提示')}}</div>
        <div class="zz-tips-dialog-content"><slot></slot></div>
        <i class="zz-tips-dialog-close" v-if="tipsparam.showX" @click="closePage"></i>
    </div>

    <div class="zz-tips-slide" v-if="visible && tipsparam.type=='slide'" :class="[slide ? 'zz-tips-' + slide : '']" :transition="transitionName">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="less">
    @import "tips.less";
</style>
<script type="text/javascript">
  export default{
    props:{
      visible:Boolean,
      tipsparam:Object,
      slide:{
        type: String,
        default: 'top'
      },
      type:String,
      animate:{
        type: String,
        default: 'true'
      }
    },
    filters:{
        defaultValue(val, key){
          return !val ? key: val;
        }
    },
    computed: {
      dialogStyle(val){
          return val ? val: {};
      },
      transitionName(){
        return (this.animate === 'false') ? '' : 'zz-slide-'+this.slide;
      }
    },
    watch:{
      visible(){
        if(this.visible){
          //document.body.style.position = "fixed";
          document.body.style.width = '100%';

          if(this.tipsparam.duration){
             const time = this.tipsparam.duration || 2000;
            setTimeout(function(){
              this.visible = false;
            }.bind(this),time);
          }

        }else{
          document.body.style.position = 'static';
        }
      }
    },
    methods:{
      cancel(){
        this.visible = false;
        this.tipsparam.failback ? this.tipsparam.failback && this.tipsparam.failback() : '';
      },
      confirm() {
        this.visible = false;
        this.tipsparam.callback && this.tipsparam.callback();
      },
      closePage(){
        this.visible = false;
      }
    },
    mounted(){
      // if(this.slide){
      //   this.transitionName = this.computeTrans;
      // }
    }
  }
</script>
