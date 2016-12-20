<template>
    <zz-tip :visible.sync="visible" :tipsparam="param"></zz-tip>
</template>

<script type="text/javascript">
import zzTip from '../../Common/tips/tips.vue';

export default {
    props: {
        visible: Boolean
    },
    data() {
        return {
            param: {
                type:'confirm',
                content: "去转转 APP 中收藏，及时关注降价信息",
                leftBtn : "不收藏",
                rightBtn : "这就去",
                callback: this.confirmCallback,
                failback: this.cancelCallback,
                showX : true
            }
        };
    },
    methods: {
        confirmCallback() {
            this.$emit('confirm');
        },
        cancelCallback() {
            this.$emit('cancel');
        }
    },
    components: {
        zzTip
    }
}
</script>

<style lang="less" scope>
@import "../../common";

.tips-btns {
    font-size: 30 *@px;
}
</style>