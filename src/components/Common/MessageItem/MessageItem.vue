<template>
  <div>
    <div class="msgorder-list-item" v-for="item in items" v-show="items.length">
        <router-link :to="item.url" class="msgorder-list-item-link">
            <img v-lazy="filterPortrait(item.portrait)" :class="[item.isRadius ? 'img-radius' : '']">
            <div>
                <p class="msgorder-list-item-link-name">
                    {{item.nickName}}
                </p>
                <i class="msgorder-list-item-link-point" v-show="item.point"></i>
                <p class="msgorder-list-item-link-status">
                    {{item.status}}
                </p>
                    <span class="msgorder-list-item-link-time">
                        {{item.timestamp | timeFilter}}
                    </span>

            </div>
        </router-link>
    </div>
  </div>
</template>
<style lang="less">
    @import "MessageItem.less";
</style>
<script>

    import timeFilter from '../../../libs/timefilter'

    import handleImg from '../../../libs/handleImg.js'

    import { formatProtocol } from '../../../libs/util';

    export default{
        name: 'message-item',
        data(){
            return{

            }
        },
        methods: {
          handlePic: (url) => {
            if(url) {
              return handleImg.handleSingle(url, 50, 50)
            }
          },
          filterPortrait: function(url){
              return formatProtocol(this.handlePic(url));
          }
        },
        filters: {
            timeFilter
        },
        props: ['items']
    }
</script>
