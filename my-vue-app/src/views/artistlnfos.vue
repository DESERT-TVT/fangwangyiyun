<template>
    <div class="artistInfosArea" v-if="artistInfosData.flag === true">
        <!-- 头部 -->
        <div class="artistInfosArea_top">
            <div class="left">
                <!--      返回上一级路由-->
                <el-icon @click="$router.go(-1)">
                    <Back />
                </el-icon>
                <span>歌单</span>
            </div>
            <div class="right">
                <el-icon class="MoreFilled">
                    <MoreFilled />
                </el-icon>
            </div>
        </div>
        <!-- 背景 -->
        <div class="blur"></div>

    </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { Back, MoreFilled, ArrowRight, Download, Star, Share, VideoCamera, StarFilled, CirclePlus } from '@element-plus/icons-vue'
import { getArtistFanCount, getArtistInfos, getArtistDetail, getArtistAllSong } from "../request/api/artistInfos.js";
import axios from "axios";
import { useRoute } from "vue-router";
const route = useRoute()
let artistID = route.query.id
let artistInfosData = reactive({
    data: [],
    flag: false
})
onMounted(async () => {
    await artistInfos()
    await artistFanCount()
    await artistSong()
})
//歌手信息
const artistInfos = async () => {
    let res = await getArtistInfos(artistID)
    artistInfosData.data = res.data.data
    artistInfosData.flag = true
    console.log(res)
}
//歌手粉丝数量
const artistFanCount = async () => {
    let res = await getArtistFanCount(artistID)
    // console.log(res)
    FanCount.value = changeCount(res.data.data.fansCnt)
}
//歌手歌曲获取
const artistSong = async () => {
    let res = await getArtistAllSong(artistID, 'hot', 20, 0)
    songCount.value = res.data.total
    songInfos.value = res.data.songs
    // console.log(res)
}
</script>

<style lang="scss">
.blur {
    z-index: -1;
    position: absolute;
    top: -6rem;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.15);
}

.artistInfosArea_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 3rem;
    color: #f9f9f9;
    /*background-color: #f56c6c;*/

}

.artistInfosArea_top .el-icon {
    font-size: 1.8rem;
}

.artistInfosArea_top .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: .5rem;
}

.artistInfosArea_top .left span {
    margin-left: .5rem;
}

.artistInfosArea_top .right {
    margin-right: .5rem;
}

.artistInfosArea {
    position: relative;
    width: 100%;
    height: calc(100vh - 2rem);
    /*!*color: #2c2c2c;*!*/
}
</style>