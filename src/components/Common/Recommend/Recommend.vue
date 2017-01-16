<template>
    <div class="recommends" >
        <dl>
            <dt>{{title}}</dt>
            <dd v-for="item in recommends" :id="item.infoidStr" @click="redirect(item)">
                    <div class="icon">
                        <img :src="picFilter(item.pic)" />
                        <div class="price">{{item.nowPrice | price}}</div>
                    </div>
                    <div class="title">{{item.title}}</div>
            </dd>
        </dl>
    </div>
</template>
<style lang="less">
    @import "Recommend.less";
</style>
<script>
    import handleImg from '../../../libs/handleImg'
    export default{
        data(){
            return{

            }
        },
        props: ['recommends', 'title'],
        methods: {
            redirect(item){
                const url = decodeURIComponent(item.infoUrl);
                var reg = new RegExp(/youpin.m.58.com/i);
                console.log(url, reg.test(url));
                if(reg.test(url)){
                    location.href = url;
                    return;
                }
                this.$router.push({
                    name: 'detail',
                    params: {product_id: item.infoidStr}
                });
            },
            pic(urls){
                if(!urls) return;
                return decodeURIComponent(urls.split('|')[0]);
            },
            picFilter(urls){
              return handleImg.handleSingle(this.pic(urls));
            }
        },
        filters:{
            price(price){
                return "￥" + price;
            },
            decode(url){
                return decodeURIComponent(url);
            }
        },
        route: {

        }
    }
</script>
