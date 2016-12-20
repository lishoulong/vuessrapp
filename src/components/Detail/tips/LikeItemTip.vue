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
                content: "担心与喜欢的宝贝擦肩而过？",
                contentBr: "来转转收藏宝贝吧~",
                leftBtn : "不去",
                rightBtn : "去转转",
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