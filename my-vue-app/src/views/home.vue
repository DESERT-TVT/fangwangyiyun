<template>
    <div class="main">
        <!-- 头部 -->
        <Header />
        <div class="headerV"></div>
        <!-- 轮播 -->
        <Banner />
        <!--  推荐歌单-->
        <MusicList />
    </div>
</template>

<script setup>
import Header from "../components/Header.vue"
import Banner from "../components/home/banner.vue"
import MusicList from '../components/home/musicList.vue'
import store from '../store/index.js'
store.commit('updateIsPlayerShow', true)
store.commit('updateIsBottomNavShow', true)
</script>

<style lang="scss">
.headerV {
    width: 100%;
    height: 3rem;
}
</style>