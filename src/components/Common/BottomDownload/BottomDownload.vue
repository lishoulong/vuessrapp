<template>
    <div class="wrap" v-show="showBottomDownload">
        <div class="wrap-icon">
            <img src="//img.58cdn.com.cn/zhuanzhuan/logo.png" />
        </div>
        <div class="wrap-download" @click="callApp">立即打开</div>
        <div class="wrap-text">{{title}}</div>
        <div class="wrap-close" @click="hidePanel"></div>
    </div>
</template>
<style lang="less">
   @import "BottomDownload.less";
</style>
<script  type="text/ecmascript-6">

    import Native from "../../../libs/native";
    import * as ENV from "../../../config/env";

    export default{
        props: ["title"],
        data(){
            return{
                showBottomDownload: true
            }
        },
        methods: {
            hidePanel(){
                this.showBottomDownload = false;
            },
            callApp(){
                Native.callZZApp({
                    urlSearch:{openType:'mybuy'},
                    middleWareUrl: ENV.ORDER_DOWNLOAD_URL
                });
            }
        }
    }
</script>
