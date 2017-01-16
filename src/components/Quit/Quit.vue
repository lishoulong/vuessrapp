<template>
  <div>
    <div>
        Delete Cookie !
    </div>
    <router-link to="{name: 'mine'}">Mine</router-link>
  </div>
</template>
<style lang="less">

</style>
<script type="text/ecmascript-6">
    import Cookie from '../../libs/cookie';

    export default{
        data(){
            return{
                msg:'hello vue'
            }
        },
        methods: {
            removeCookie(){
                document.cookie = "";
                Cookie.remove(Cookie.COOKIE_ZZU, Cookie.COOKIE_OPTION)
            }
        },
        route: {
            data(){
                this.removeCookie();
            }
        }
    }
</script>
