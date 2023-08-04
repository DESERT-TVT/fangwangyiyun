<template>
    <div class="loading">
        <musicListTop :playlist="data.playlist" :id="data.id" />
        <musicListContent :songList="data.songList" :id="data.id" :songCount="data.songCount" />
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, reactive, } from "vue";
import { getMusicListItem, getMusicListSong } from "../request/api/musicList.js";
import musicListTop from '../components/musicList/musicListTop.vue'
import musicListContent from '../components/musicList/musicListContent.vue'
import { ElLoading } from "element-plus";
const data = reactive({
    playlist: {},  //歌单详情页数据
    songList: [],//歌单歌曲
    id: 0,//歌单ID
    songCount: 0//歌单歌曲数量
})

const MusicListItem = async (id) => {
    //获取对应ID歌单的详情信息
    let res = await getMusicListItem(id)
    data.songCount = res.playlist.trackCount
    data.playlist = res.playlist
}
const MusicListSong = async (id) => {
    const loadingInstance = ElLoading.service({
        target: document.getElementById('loading'),
        text: "数据加载中",
        background: "rgba(52,52,52,0.8)",
    })
    let res = await getMusicListSong(id, 20, 0)
    data.songList = res.songs
    data.id = id
    loadingInstance.close()
}

onMounted(() => {
    //拿到歌单ID号
    let id = useRoute().query.id

    MusicListItem(id)
    //获取歌单歌曲
    MusicListSong(id)
    //防止页面刷新，数据丢失，将数据保存到session中
    // sessionStorage.setItem('itemDetail',JSON.stringify(data))
})
</script>

<style scoped></style>