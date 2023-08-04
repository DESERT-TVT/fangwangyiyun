<template>
    <LocalHeader />
    <div class="headerV"></div>
    <LocalContent />
</template>

<script setup>
import LocalHeader from '../components/local/localHeader.vue'
import LocalContent from '../components/local/localContent.vue'
import { onMounted } from "vue";

//更新信息
onMounted(() => {
    if (localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined) {
        console.log("请先登录")
        // plus.nativeUI.toast("请先登录",{duration:'short'})
    } else {
        //获取用户信息
        store.dispatch('getUserInfos')
        //获取用户关注
        store.dispatch('getUserMusicList', store.state.userInfos.id)

        //获得用户最喜爱歌单歌曲
        // store.dispatch('getFavoriteSongList')
    }
})
</script>
<script>
import store from '../store/index.js'
export default {
    name: "localView",
    created() {
        // let res = store.dispatch('getUserInfos')
    }
}
</script>

<style scoped>
.headerV {
    width: 100%;
    height: 3rem;
}
</style>