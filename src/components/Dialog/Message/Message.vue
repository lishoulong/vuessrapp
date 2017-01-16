<template>
  <div>
      <div class="chat-dialog-box-main-item" v-for="message in messages">
          <div class="time">{{message.timestamp * 1000 | dateFormat('YYYY-MM-dd hh:mm')}}</div>
          <div class="con mine" :class="message.from_uid == uid ? 'mine' : 'yours'">
              <img :src="imgUrl(message.portrait,100,100)" class="avatar" />
              <div class="msg">
                  <div v-if="message.msg_content.capimg" class="text"><img :src="connectImgUrl (message.from_uid, message.msg_content.capimg.s,21)" /></div>
                  <div v-else class="text" :class="message.status ? 'send' : 'sending'">{{message.msg_content.text}}</div>
                  <div class="shapb" v-show="message.status"></div>
                  <div class="shap" v-show="message.status"></div>
              </div>
              <div class="error" v-show="message.status == 2">!</div>
              <div class="clear-float"></div>
          </div>
      </div>
  </div>
</template>
<style lang="less">
    @import "Message.less";
</style>
<script>
    import HandleImg from "../../../libs/handleImg";
    import { dateFormat, countDown } from "../../../libs/util";

    export default{
        props: ['messages', 'uid'],
        data(){
            return{

            }
        },
        filters: {
            dateFormat
        },
        methods:{
            connectImgUrl (fromid,md5,source){
                let receiveId = fromid==this.uid ? this.$route.params.user_id : this.uid;
                return '//picbangbang.58.com/download?did='+receiveId+'&dtp=1&md5='+md5+'&source='+source;
            },
            imgUrl(url, width, height){
                return HandleImg.handleSingle(url, width, height);
            }

        },
        route:{
            data(){}
        }
    }
</script>
