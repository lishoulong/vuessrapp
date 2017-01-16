<template>
    <div class="recommends" >
        <dl>
            <dt>{{title}}</dt>
            <dd v-for="item in recommends" :id="item.infoId">
                <router-link to="{name: 'detail', params: {product_id: item.infoId}}">
                    <div class="icon" :style="{ backgroundImage: 'url('+ handleSingle(item.infoImage) + ')'}">
                        <!-- <img :src="item.infoImage | imgUrl" /> -->
                        <div class="price">￥{{item.infoPrice }}</div>
                    </div>
                    <div class="title">{{item.infoTitle}}</div>
                </router-link>
            </dd>
        </dl>
    </div>
</template>
<style lang="less">
    @import "Recommend.less";
</style>
<script>

    import handleImg from '../../../libs/handleImg.js'

    export default{
        data(){
            return{

            }
        },
        props: ['recommends', 'title'],
        methods: {
            handleSingle(url) {
              return handleImg.handleSingle(url.split("|")[0])
            }
        },
        filters:{
            price(price){
                return "￥" + price;
            },
            decode(url){
                return decodeURIComponent(url);
            },
            pic(urls){
                if(!urls) return;
                return decodeURIComponent(urls.split('|')[0]);
            }
        },
        route: {

        }
    }
</script>
