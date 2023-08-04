<template>
    <div class="loading">
        <UserMusicListTop :playlist="data.playlist" :id="data.id" />
        <UserMusicListContent :songList="data.songList" :id="data.id" :songCount="data.songCount" />
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, reactive, } from "vue";
import { getMusicListItem, getMusicListSong } from "../request/api/userMusicList.js";
import UserMusicListTop from "../components/userMusicList/userMusicListTop.vue";
import UserMusicListContent from "../components/userMusicList/userMusicListContent.vue";
import { ElLoading } from "element-plus";
import store from '../store/index.js'
const data = reactive({
    playlist: {},  //歌单详情页数据
    songList: [],//歌单歌曲
    id: 0,//歌单ID
    songCount: 0//歌单歌曲数量
})

const MusicListItem = async (id) => {
    //获取对应ID歌单的详情信息
    let res = await getMusicListItem(id, store.state.Cookies)
    data.songCount = res.playlist.trackCount
    data.playlist = res.playlist
}
const MusicListSong = async (id) => {
    const loadingInstance = ElLoading.service({
        target: document.getElementById('loading'),
        text: "数据加载中",
        background: "rgba(52,52,52,0.8)",
    })
    let res = await getMusicListSong(id, 20, 0, store.state.Cookies)
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