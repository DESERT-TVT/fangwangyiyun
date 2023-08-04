<template>
    <div class="musicList">
        <div class="musicListTop">
            <div class="title">推荐歌单</div>
            <div class="more">更多<el-icon>
                    <ArrowRight />
                </el-icon></div>
        </div>
        <div class="musicListBottom">
            <el-scrollbar>
                <div class="divList">
                    <div class="divItem" v-for="item in musicList.data" :key="item">
                        <router-link :to="{ path: '/musicList', query: { id: item.id } }">
                            <div class="listPic" style="width: 100px;height: 100px">
                                <el-image :src="item.picUrl" :fit="'cover'"></el-image>
                            </div>
                            <div class="playCount">
                                <el-icon>
                                    <VideoPlay />
                                </el-icon>
                                {{ changeCount(item.playCount) }}
                            </div>
                            <span class="name">{{ item.name }}</span>
                        </router-link>
                    </div>
                    <div style="width: 1rem;"></div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import { getMusicList } from "../../request/api/home.js";
import { onMounted, reactive } from "vue";
import { ArrowRight, VideoPlay } from '@element-plus/icons-vue';

//推荐歌单数据
let musicList = reactive({
    data: []
})
//修改播放量
const changeCount = (num) => {
    if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + '亿'
    } else if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
    }
}
onMounted(async () => {
    let res = await getMusicList()
    musicList.data = res.result
    // console.log(musicList.data)
})
</script>

<style scoped>
.musicList {
    width: 100%;
    height: 12rem;
}

.musicList>.musicListTop {
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.musicList>.musicListTop>.title {
    font-weight: bold;
    color: #2c2c2c;
    font-size: 1.1rem;
    margin-left: .5rem;
}

.musicList>.musicListTop>.more {
    margin-right: .5rem;
    width: 3rem;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    border-radius: 1.2em;
    background-color: rgba(253, 253, 254, 0.85);
    font-size: 0.5rem;
    color: #2c2c2c;
    font-weight: bold;
}

.musicList>.musicListBottom {
    height: 12rem;
}

.musicList>.musicListBottom .divList {
    display: flex;
    margin-top: .5rem;
    width: 100%;
    justify-content: space-between;
}

.musicList>.musicListBottom .divItem {
    position: relative;
    /*flex-shrink: 0;*/
    padding-right: 1rem;
    font-size: .7rem;
    color: #f9f9f9;
}

.musicList>.musicListBottom .divItem span {
    color: #2c2c2c;
}

/* .musicList>.musicListBottom .divItem .listPic:deep .el-image {
    border-radius: .8rem;
} */

.musicList>.musicListBottom .divItem:first-child {
    padding-left: 1rem;
}

.musicList>.musicListBottom .divList .playCount {
    position: absolute;
    top: 0;
    right: 18%;
    margin-top: .1em;
    padding: 0 .1em;
    background-color: rgba(38, 38, 38, 0.5);
    border-radius: 10rem;
    text-align: center;
    font-size: .7rem;
}

/* .musicList>.musicListBottom:deep .el-scrollbar__bar.is-horizontal {
    height: 0;
}

.musicList>.musicListBottom:deep .el-scrollbar__bar.is-vertical {
    width: 0;
} */
</style>
