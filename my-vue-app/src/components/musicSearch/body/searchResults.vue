<template>
    <div class="songsListArea" v-show="songInfos.length > 0" id="songsListArea">
        <el-scrollbar @scroll="loadingSongsData" ref="scrollbar">
            <div class="songsListLayout">
                <div class="songsItem" :id="'songsItem' + index" v-for="(item, index) in songInfos" :key="index">
                    <div class="songsInfos" @click="selectMusic(item)" @touchstart="songsItemTouchstart(index)"
                        @touchend="songsItemTouchend(index)">
                        <div class="name">{{ item.name }}</div>
                        <div class="artists">
                            <span v-for="(item2, index2) in item.ar" :key="index2" class="artistsName">
                                {{ item2.name }}
                            </span>
                        </div>
                    </div>
                    <div class="songsOption">
                        <el-icon v-if="item.mv > 0" class="mv" @click="watchMv(item.mv)">
                            <VideoCamera />
                        </el-icon>
                        <el-icon class="moreOption" @click="moreButton(index)">
                            <MoreFilled />
                        </el-icon>
                    </div>
                </div>
                <div class="mvAreaLayout">
                    <el-drawer v-model="isMvShow" ref="MvDrawer" title="标题" :with-header="false" :direction="direction"
                        size="100%" :destroy-on-close="true">
                        <div class="mvArea">
                            <video :src="MvUrl" controls preload="metadata" height="400" width="380" />
                            <div class="mvArea_button" @click="closeMv" @touchstart="mvAreaButtonTouchstart"
                                @touchend="mvAreaButtonTouchstart"><span>退出视频</span></div>
                        </div>
                    </el-drawer>
                </div>
                <el-drawer v-model="isMoreOptionShow" ref="songsOptionDrawer" title="标题" :with-header="false"
                    :direction="direction" size="40%" :destroy-on-close="true">
                    <div class="songsOptionArea">
                        <ul>
                            <li id="songsOption1" @click="addNextSong" @touchstart="songsOptionTouchstart(1)"
                                @touchend="songsOptionTouchend(1)"><el-icon>
                                    <ArrowRight />
                                </el-icon><span>下一首播放</span></li>
                            <li id="songsOption2" @click="isDownLoad = true" @touchstart="songsOptionTouchstart(2)"
                                @touchend="songsOptionTouchend(2)"><el-icon>
                                    <Download />
                                </el-icon><span>下载</span></li>
                            <li id="songsOption3" v-show="!isLiked" @click="addMusicToMyFavorite"
                                @touchstart="songsOptionTouchstart(3)" @touchend="songsOptionTouchend(3)"><el-icon>
                                    <Star />
                                </el-icon><span>收藏</span></li>
                            <li id="songsOption3" v-show="isLiked" @click="deleteFromMyFavorite"
                                @touchstart="songsOptionTouchstart(3)" @touchend="songsOptionTouchend(3)"><el-icon>
                                    <StarFilled />
                                </el-icon><span>已收藏</span></li>
                            <li id="songsOption4" @click="addButton" @touchstart="songsOptionTouchstart(4)"
                                @touchend="songsOptionTouchend(4)"><el-icon>
                                    <CirclePlus />
                                </el-icon><span>添加至歌单</span></li>
                            <li id="songsOption5" @touchstart="songsOptionTouchstart(5)" @touchend="songsOptionTouchend(5)">
                                <el-icon>
                                    <Share />
                                </el-icon><span>分享</span>
                            </li>
                        </ul>
                    </div>
                </el-drawer>
                <el-drawer v-model="isDownLoad" ref="isDownLoadDialog" title="选择你的设备" :with-header="false" size="30%"
                    :direction="direction" :destroy-on-close="true">
                    <div class="downloadMusicArea">
                        <div class="downloadMusicArea_title">
                            <span>请选择下载平台(认真!)</span>
                        </div>
                        <div class="downloadMusicArea_body">
                            <div class="PC" @click="downloadThisMusic">
                                <el-icon>
                                    <Download />
                                </el-icon>
                                <p>PC端</p>
                            </div>
                            <div class="Mobile" @click="downloadThisMusicMobile">
                                <el-icon>
                                    <Download />
                                </el-icon>
                                <p>移动端</p>
                            </div>
                        </div>
                    </div>
                </el-drawer>
                <el-drawer v-model="addMusic" ref="addMusicDrawer" title="标题" :with-header="false" :direction="direction"
                    size="40%" :destroy-on-close="true">
                    <div class="addMusicArea"
                        v-if="store.state.userMusicList.length > 0 && store.state.Cookies !== '' && store.state.Cookies !== undefined">
                        <el-scrollbar>
                            <div class="addMusicArea_layout">
                                <div v-for="(item, index) in store.state.userMusicList" :key="index"
                                    @click="addMusicToUserMusicList(item.id)" @touchstart="addMusicTouchstart(index)"
                                    @touchend="addMusicTouchend(index)" :id="'addMusicAreaItem' + index"
                                    class="addMusicAreaItem">
                                    <div class="addMusicAreaItem_img">
                                        <img :src="item.coverImgUrl" alt="?">
                                    </div>
                                    <div class="addMusicAreaItem_text">
                                        <p>{{ item.name }}</p>
                                        <p>{{ item.trackCount + '首' }}</p>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div v-else class="addMusicArea_noData"><span>你都没有登陆诶，哪来的歌单</span></div>
                </el-drawer>
            </div>
        </el-scrollbar>
        <div class="toUpButton" @click="toUpButton" @touchstart="toUpButtonTouchstart" @touchend="toUpButtonTouchend">
            <el-icon>
                <Top />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, watch, nextTick } from "vue";
import { useStore } from "vuex";
import { VideoCamera, MoreFilled, Top, Download, Star, StarFilled, Share, ArrowRight, CirclePlus } from '@element-plus/icons-vue'
import { ElLoading } from "element-plus";
import { getMusicSearched } from "../../../request/api/musicSearch.js";
import { downloadMusic, getCopyRight, getMv } from "../../../request/api/musicList.js";
import axios from "axios";
import { addMusicToList } from "../../../request/api/userMusicList.js";



const isMoreOptionShow = ref(false)
const direction = ref('btt')
let MvUrl = ref('')
let isMvShow = ref(false)
let MvDrawer = ref()
let songsOptionDrawer = ref()
let songListIndex = ref(0)
let scrollbar = ref()
let isTop = ref(true)
let songTable = ref()
let songInfos = ref([])
let isLoadingComments = ref(false)
let blockInfer = ref(false)
let requestData = {
    keywords: '',
    limit: 20,
    offset: 1,
    page: 0
}

let isDownLoad = ref(false)
let isDownLoadDialog = ref()
let isLiked = ref(false)
let addMusic = ref(false)
let addMusicDrawer = ref()

const props = defineProps(['musicInfos', 'inputSearch'])
watch(props, (newValue, oldValue) => {


    if (newValue.inputSearch !== requestData.keywords) {  //搜索词语变动
        nextTick(() => {
            scrollbar.value.setScrollTop(0)
        })
        requestData.limit = 20
        requestData.offset = 1
        requestData.page = 0
        console.log("搜索词变动")
    }
    songInfos.value = props.musicInfos
    requestData.keywords = newValue.inputSearch
    // console.log("重置",songInfos.value)
}, { immediate: true })
console.log(props.musicInfos, props.inputSearch)
const store = useStore()

//点击更多按钮
const moreButton = (index) => {
    isMoreOptionShow.value = true
    songListIndex.value = index
    isLikedFun()
}
const addButton = () => {
    isMoreOptionShow.value = false
    addMusic.value = true
}
//滑动至顶部按钮
const toUpButton = () => {
    let contentArea = $('.el-scrollbar__view')[$('.el-scrollbar__view').length - 1].scrollHeight
    let step = contentArea / 2

    if (isTop.value === false) {
        const timeTop = setInterval(() => {
            scrollbar.value.setScrollTop(step)
            step = step - 50
            if (step < 0) {
                clearInterval(timeTop)
                isTop.value = true
            }
        }, 15)
    }


}
//歌曲滑动加载
const loadingSongsData = async (scroll) => {
    let sightArea = $('.songsListArea')
    let contentArea = $('.el-scrollbar__view')
    let index = (contentArea.length - 1)
    let scrollHeight = contentArea[index].scrollHeight
    let infer = (scrollHeight - scroll.scrollTop) - sightArea[0].scrollHeight
    //异步先初始好值
    let init = function () {
        sightArea = $('.songsListArea')
        contentArea = $('.el-scrollbar__view')
        index = (contentArea.length - 1)
        scrollHeight = contentArea[index].scrollHeight
        infer = (scrollHeight - scroll.scrollTop) - sightArea[0].scrollHeight
    }
    await init()


    //更新滚动状态
    if (scroll.scrollTop > 0) {
        isTop.value = false
    } else {
        isTop.value = true
    }


    if (infer <= 0 && blockInfer.value === false) {
        isLoadingComments.value = true
        blockInfer.value = true
    }
    if (infer <= 0 && isLoadingComments.value) {
        isLoadingComments.value = false
        const loadingInstance = ElLoading.service({
            target: document.getElementById('songsListArea'),
            text: "数据加载中",
            background: "rgba(52,52,52,0.8)",
        })
        requestData.page = requestData.page + 1
        requestData.offset = requestData.page * requestData.limit
        let res = await getMusicSearched(requestData.keywords, requestData.limit, requestData.offset)
        // console.log(requestData.page,requestData.offset)
        if (res.data.result.songCount > 0) {
            res.data.result.songs.forEach(item => {
                songInfos.value.push(item)
            })

        } else {
            alert("没有歌曲了")
        }
        blockInfer.value = false
        loadingInstance.close()
    }
}
//添加至下一首播放
const addNextSong = () => {
    songInfos.value.forEach((item, index) => {
        if (songListIndex.value === index) {
            store.commit('addMusicToPlayListNext', item)
            songsOptionDrawer.value.handleClose()
        }
    })
}
//下载音乐
const downloadThisMusic = async () => {
    isDownLoadDialog.value.handleClose()
    songsOptionDrawer.value.handleClose()
    let musicName = songInfos.value[songListIndex.value].name
    let musicArtist = songInfos.value[songListIndex.value].ar[0].name
    let res = await downloadMusic(songInfos.value[songListIndex.value].id)
    // await downloadMp3(res.data.data[0].url)
    let res2 = (await axios({ method: 'get', url: res.data.data[0].url, responseType: 'blob' }))
    // console.log(res,res2)
    if (res2.headers["content-type"] === "audio/mpeg; charset=UTF-8" ||
        "audio/mpeg") {
        // const blob = new Blob([(res2.data)], {type: "audio/mpeg"})
        // console.log(res2.data)
        const blobUrl = URL.createObjectURL(res2.data)
        let link = document.createElement('a')
        document.body.appendChild(link)
        link.style.display = 'none'
        link.href = blobUrl
        // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
        link.download = musicName.concat('-').concat(musicArtist).concat('.mp3')
        // 自触发click事件
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl);
        // saveAs(res.data.data[0].url,"music2.mp3")  //废弃的方法
    }
}
const downloadThisMusicMobile = async () => {
    isDownLoadDialog.value.handleClose()
    songsOptionDrawer.value.handleClose()
    let musicName = songInfos.value[songListIndex.value].name
    let musicArtist = songInfos.value[songListIndex.value].ar[0].name
    let res = await downloadMusic(songInfos.value[songListIndex.value].id)
    //资源地址
    let picurl = res.data.data[0].url
    // 参数
    let data = {
        //自定义下载文件路径
        filename: "file://storage/emulated/0/X-MusicDownLoad/".concat(musicName).concat('-').concat(musicArtist).concat('.mp3'),
        //默认为GET请求。注意这里需大写“GET”、“POST”
        method: 'GET',
    }
    let dtask = plus.downloader.createDownload(picurl, data, (d, status) => {
        // 下载完成
        if (status == 200) {
            // this.$toast( '导出成功' );
            // 将本地URL路径转换成平台绝对路径
            plus.io.convertLocalFileSystemURL(d.filename);
            plus.nativeUI.toast("下载成功", { duration: 'short' })
        } else {
            dtask.clear(); //清除下载任务
            // this.$toast( '导出失败' );
            plus.nativeUI.toast("下载失败", { duration: 'short' })
        }
    }
    );
    // 开始下载
    dtask.start();
}
//初始判断该歌曲是否是喜欢歌曲
const isLikedFun = () => {
    if (localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined) {
        isLiked.value = false
    } else {
        for (let i = 0; i < store.state.userFavoriteSongList.length; i++) {
            if (store.state.userFavoriteSongList[i].id === songInfos.value[songListIndex.value].id) {
                isLiked.value = true
                break
            }
            else {
                isLiked.value = false
            }
        }
    }
}
//添加至我喜欢的音乐
const addMusicToMyFavorite = async () => {
    if (localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined) {
        console.log("请先登录")
        plus.nativeUI.toast("请先登录", { duration: 'short' })
    } else {
        isLiked.value = true
        let res = await addMusicToList('add',
            store.state.userFavoriteMusicListId,
            songInfos.value[songListIndex.value].id,
            store.state.Cookies)
        console.log(res)
        await store.commit('addMusicToUserFavoriteSongListHead', songInfos.value[songListIndex.value])
        // store.commit('updateCookies',res.data.cookie)
        if (res.data.body.code === 200) {
            console.log("添加成功")
            plus.nativeUI.toast("添加成功", { duration: 'short' })
        }
        else {
            console.log("添加失败或者歌曲已存在")
            plus.nativeUI.toast("添加失败或者歌曲已存在", { duration: 'short' })
        }
    }
}
//从我喜欢的音乐中删去
const deleteFromMyFavorite = async () => {
    if (localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined) {
        console.log("请先登录")
        plus.nativeUI.toast("请先登录", { duration: 'short' })
    } else {
        isLiked.value = false
        let res = await addMusicToList('del',
            store.state.userFavoriteMusicListId,
            songInfos.value[songListIndex.value].id,
            store.state.Cookies)
        console.log(res)
        await store.commit('deleteFromUserFavoriteSongListById', songInfos.value[songListIndex.value])
        if (res.data.body.code === 200) {
            console.log("删除成功")
            plus.nativeUI.toast("删除成功", { duration: 'short' })
        }
        else {
            console.log("删除失败或者歌曲未存在")
            plus.nativeUI.toast("删除失败或者歌曲未存在", { duration: 'short' })
        }
    }

}
//添加音乐至歌单
const addMusicToUserMusicList = async (id) => {
    let res = await addMusicToList('add', id, songInfos.value[songListIndex.value].id, store.state.Cookies)
    console.log(res)
    switch (res.data.body.code) {
        case 502: {
            console.log(res.data.body.message)
        } break;
        case 200: {
            console.log("已添加至本歌单")
            //更新用户歌单信息
            await store.dispatch('getUserMusicList', store.state.userInfos.id)
            addMusic.value = false
        } break;
    }
}
//观看mv
const watchMv = async (id) => {
    let myAudio = document.getElementById('mp')
    myAudio.pause()
    isMvShow.value = true
    let res = await getMv(id)
    console.log(res)
    MvUrl.value = res.data.data.url
}
//关闭Mv
const closeMv = () => {
    let myAudio = document.getElementById('mp')
    if (store.state.isPlaying === true) {
        myAudio.play()
    }
    MvDrawer.value.handleClose()
}
//更新store中的播放列表
const playMusic = (newSong) => {
    store.commit('addMusicToPlayListHead', newSong)
    store.commit('updateIsPlaying', true)
}
//选择音乐并播放时
const selectMusic = async (e) => {
    if (e != null) {
        playMusic(e)
        // let res = await getCopyRight(e.id)
        // if(res.data.success===true){
        //   console.log("有版权")
        //   playMusic(e)
        // }else{
        //   console.log(res.data.message)
        // }
    }
}
</script>

<script>
import $ from "jquery";

export default {
    methods: {
        songsItemTouchstart(index) {
            $('#songsItem' + index).toggleClass('activeSongsItem')
        },
        songsItemTouchend(index) {
            $('#songsItem' + index).toggleClass('activeSongsItem')
        },
        toUpButtonTouchstart() {
            $('.toUpButton').toggleClass('activeToUpButton')
        },
        toUpButtonTouchend() {
            $('.toUpButton').toggleClass('activeToUpButton')
        },
        songsOptionTouchstart(index) {
            $('#songsOption' + index).toggleClass('activeSongsOption')
        },
        songsOptionTouchend(index) {
            $('#songsOption' + index).toggleClass('activeSongsOption')
        },
        mvAreaButtonTouchstart() {
            $('.mvArea_button').toggleClass('activeMvArea_button')
        },
        mvAreaButtonTouchend() {
            $('.mvArea_button').toggleClass('activeMvArea_button')
        },
        addMusicTouchstart(index) {
            $('#addMusicAreaItem' + index).toggleClass('activeMusicAreaItem')
        },
        addMusicTouchend(index) {
            $('#addMusicAreaItem' + index).toggleClass('activeMusicAreaItem')
        },
    }
}
</script>

<style scoped>
.songsListArea:deep(.el-scrollbar__bar.is-horizontal) {
    height: 0;
}

.songsListArea:deep(.el-scrollbar__bar.is-vertical) {
    width: 0;
}

.toUpButton {
    z-index: 1;
    position: fixed;
    bottom: 10%;
    right: 0;
    transform: translate(-50%, -50%);
    width: 3rem;
    height: 3rem;
    background-color: rgb(84, 84, 84);
    border-radius: 50%;
    box-shadow: #2b2b2b 0 0 .8rem;
    color: #f9f9f9;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .5s;
}

.activeToUpButton.toUpButton {
    z-index: 15;
    position: fixed;
    bottom: 11%;
    right: 2%;
    transform: translate(-50%, -50%);
    width: 2.5rem;
    height: 2.5rem;
    background-color: #f9f9f9;
    border-radius: 50%;
    box-shadow: #f9f9f9 0 0 .8rem;
    color: #2b2b2b;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .5s;
}

.songsListArea {
    width: 100%;
    height: calc(100vh - 15rem);
    /*background-color: #5c5c5c;*/
}

.songsListArea .songsListLayout {
    margin-top: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.activeSongsItem {
    background-color: #bbbbbb;
}

.songsListArea .songsListLayout .songsItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 5rem;
    /*background-color: #79bbff;*/
    /*border-top: rgba(44, 44, 44, 0.15) 1px solid;*/
    padding: 0 .5rem;
}

.songsListArea .songsListLayout .songsItem:first-child {
    border-top: #2c2c2c 0 solid;
}

.songsListArea .songsListLayout .songsItem .songsInfos {
    width: 70%;
    color: #2c2c2c;
}

.songsListArea .songsListLayout .songsItem .songsInfos .name {
    font-size: 1rem;
    font-weight: bold;
    padding: .2rem 1rem 0;
}

.songsListArea .songsListLayout .songsItem .songsInfos .artists {
    padding: .6rem 1rem 0;
    font-size: .8rem;
}

.songsListArea .songsListLayout .songsItem .songsInfos .artists .artistsName {
    margin-right: .5rem;
}

.songsListArea .songsListLayout .songsItem .songsOption {
    color: #2c2c2c;
}

.songsListArea .songsListLayout .songsItem .songsOption .mv,
.songsListArea .songsListLayout .songsItem .songsOption .moreOption {
    font-size: 1.5rem;
    margin-right: .5rem;
}


.songsListLayout:deep(.el-drawer.btt),
.el-drawer.ttb {
    width: 90%;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
    border-radius: 1rem;
}

.songsListLayout:deep(.el-drawer) {
    background-color: rgba(44, 44, 44, 0.85) !important;
}

.songsListLayout:deep(.el-drawer__body) {
    padding: 0 !important;
}

.songsListLayout:deep(.el-scrollbar__bar.is-horizontal) {
    height: 0;
}

.songsListLayout:deep(.el-scrollbar__bar.is-vertical) {
    width: 0;
}

.songsOptionArea {
    width: 100%;
    height: 100%;
    /*background-color: #eebe77;*/
}

.songsOptionArea ul {

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.songsOptionArea ul li {
    display: flex;
    /*justify-content: center;*/
    align-items: center;
    width: 100%;
    height: 4.2rem;
    font-size: 1rem;
    color: #f9f9f9;
    /*background-color: #343434;*/
}

.songsOptionArea ul li:last-child {
    height: 4.2rem;
}

.songsOptionArea ul li .el-icon {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 1.5rem;
}

.activeSongsOption {
    background-color: #6c6c6c;
}

.downloadMusicArea {
    width: 100%;
    height: 100%;
    background-color: #343434;
    border-top-right-radius: 1.5rem;
    border-top-left-radius: 1.5rem;
    color: #f9f9f9;
}

.downloadMusicArea .downloadMusicArea_title {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    padding-left: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
}

.downloadMusicArea .downloadMusicArea_body {
    width: 100%;
    padding-top: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.PC {
    text-align: center;
    margin-right: 3rem;
}

.Mobile {
    text-align: center;
    margin-left: 3rem;
}

.PC p,
.Mobile p {
    font-size: 1rem;
}


.mvAreaLayout:deep(.el-drawer.btt, ) .el-drawer.ttb {
    width: 100%;
    left: 0;
    top: 0;
    transform: translate(0, 0);
    border-radius: 1rem;
}

.mvAreaLayout:deep(.el-drawer) {
    background-color: rgba(44, 44, 44, 0) !important;
}

.mvAreaLayout:deep(.el-drawer__body) {
    padding: 0 !important;
}

.mvAreaLayout {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}


.mvArea {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding-top: 4rem;
    /*background-color: #eebe77;*/
}

.mvArea_button {
    position: absolute;
    top: 80%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4rem;
    height: 3rem;
    border-radius: 1rem;
    color: #f9f9f9;
    font-size: .8rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2c2c2c;
}

.activeMvArea_button {
    background-color: #6c6c6c;
}

.addMusicArea:deep(.el-scrollbar) {
    height: 100%;
    background-color: #f3f4f6;
}

.addMusicArea {
    width: 100%;
    height: 100%;
}

.addMusicArea_layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.addMusicAreaItem {
    width: 100%;
    height: 3.6rem;
    display: flex;
    align-items: center;
    margin: .2rem 0;
}

.addMusicAreaItem:first-child {
    margin-top: .5rem;
}

.addMusicAreaItem_img img {
    height: 3rem;
    width: 3rem;
    margin-left: .5rem;
    border-radius: 1rem;
}

.addMusicAreaItem_text {
    margin-left: 1rem;
    color: #2c2c2c;
    font-size: .8rem;
}

.activeMusicAreaItem {
    background-color: #dcdcdc;
}
</style>