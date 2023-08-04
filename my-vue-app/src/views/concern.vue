<template>
    <concernList></concernList>
    <concernContent></concernContent>
</template>

<script setup>
import concernList from '../components/concern/concernlist.vue'
import concernContent from '../components/concern/concernContent.vue';
import store from '../store/index.js'
import { onMounted } from "vue"
//更新信息
onMounted(() => {
    if (localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined) {
        console.log("请先登录")
        // plus.nativeUI.toast("请先登录",{duration:'short'})
    } else {
        //获取用户信息
        store.dispatch('getUserInfos')
        //获取用户关注
        store.dispatch('getconcernlist', store.state.userInfos.id)
    }
})
defineOptions({
    name: 'concern',
});
</script>

<style lang="scss"></style>