<template>
    <div class="musicListArea" id="musicListArea" v-show="songListData.length > 0">
        <div class="musicListTitle">
            <el-icon>
                <VideoPlay />
            </el-icon>
            <span>播放全部</span>
            <span>{{ '(共' + songCount + '首)' }}</span>
        </div>
        <el-scrollbar @scroll="loadingSongsData" ref="scrollbar">
            <div class="musicListContent">
                <div class="musicListItem" :id="'musicListItem' + index" v-for="(item, index) in songListData" :key="index">
                    <span>{{ index + 1 }}</span>
                    <div class="musicItem" @click="playMusic(index)" @touchstart="touchstart(index)"
                        @touchmove="touchmove(index)" @touchcancel="touchcancel(index)" @touchend="touchend(index)">
                        <div class="musicName">{{ item.name }}</div>
                        <div class="artist">
                            <div class="artistName" v-if="item.ar.length > 1" v-for="(item2, index2) in item.ar"
                                :key="index2">
                                {{ item2.name + '&' }}
                            </div>
                            <div class="artistName" v-else>{{ item.ar[0].name }}</div>
                        </div>
                    </div>
                    <div class="mv" v-if="item.mv > 0" @click="watchMv(item.mv)"><el-icon>
                            <VideoCamera />
                        </el-icon></div>
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
                            @touchend="mvAreaButtonTouchend"><span>退出视频</span></div>
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
                            <div class="addMusicList" @click="addMusicListButton" @touchstart="addMusicListTouchstart()"
                                @touchend="addMusicListTouchend()">
                                <div class="addMusicList_img">

                                </div>
                                <div class="addMusicAreaItem_text">
                                    <p>新增歌单</p>
                                </div>
                            </div>
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
            <el-drawer v-model="addMusicList" ref="addMusicListDrawer" title="标题" :with-header="false"
                :direction="direction" size="25%" :destroy-on-close="true">
                <div class="addMusicListAreaLayout">
                    <div class="addMusicListArea">
                        <el-form :model="form" size="large" :rules="rules" status-icon ref="formRef">
                            <el-form-item prop="name">
                                <input type="text" name="name" class="name" placeholder="请输入歌单名称" v-model="form.name">
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="btnArea">
                        <button class="btn" @click="createAddMusicList"><span>创建</span></button>
                    </div>
                </div>
            </el-drawer>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { watch, ref } from "vue";
import { VideoPlay, VideoCamera, MoreFilled, ArrowRight, Download, Star, Share, StarFilled, CirclePlus } from '@element-plus/icons-vue'
import { useStore } from "vuex";
import { ElLoading } from "element-plus";
import { getMusicSearched } from "../../request/api/musicSearch.js";
import { downloadMusic, getMusicListSong, getMv } from "../../request/api/musicList.js";
import axios from "axios";
import { addMusicToList, createMusicList } from "../../request/api/userMusicList.js";

const loading = ref('')
const store = useStore()
//数据定义
const isMoreOptionShow = ref(false)
const direction = ref('btt')
let isMvShow = ref(false)
let MvDrawer = ref()
let isDownLoad = ref(false)
let isDownLoadDialog = ref()
let songsOptionDrawer = ref()
let songListIndex = ref(0)
let songListData = ref([])
let songCount = ref(0)
let scrollbar = ref()
let isTop = ref(true)
let isLoadingMusic = ref(false)
let blockInfer = ref(false)
let requestData = {
    id: 0,
    limit: 20,
    offset: 1,
    page: 0
}
let MvUrl = ref('')
let tempMusicList = ref([])
let isLiked = ref(false)
let addMusic = ref(false)
let addMusicDrawer = ref()
let addMusicList = ref(false)
let addMusicListDrawer = ref()
let form = ref({})
let formRef = ref()
let rules = ref({
    name: [
        { required: true, message: '请输入歌单名', trigger: 'blur' },
    ],
})

//语法糖父传子
const props = defineProps(['songList', 'id', 'songCount'])
//因为子组件先加载，后加载父组件，所以父组件还没来得及更新值，就把数据给子组件
//所以第一次输出结果为空，下面设置一个watch监听就好了，再次读取父组件传输的值
watch(props, () => {
    store.commit('updateCurrentSongListId', props.id)
    requestData.id = props.id
    songListData.value = props.songList
    songCount.value = props.songCount
}, { deep: true, immediate: true })

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
const addMusicListButton = () => {
    addMusicList.value = true
}
//下一首播放
const addNextSong = () => {
    songListData.value.forEach((item, index) => {
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
    let musicName = songListData.value[songListIndex.value].name
    let musicArtist = songListData.value[songListIndex.value].ar[0].name
    let res = await downloadMusic(songListData.value[songListIndex.value].id)
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
    let musicName = songListData.value[songListIndex.value].name
    let musicArtist = songListData.value[songListIndex.value].ar[0].name
    let res = await downloadMusic(songListData.value[songListIndex.value].id)
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
            if (store.state.userFavoriteSongList[i].id === songListData.value[songListIndex.value].id) {
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
            songListData.value[songListIndex.value].id,
            store.state.Cookies)
        console.log(res)
        await store.commit('addMusicToUserFavoriteSongListHead', songListData.value[songListIndex.value])
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
            songListData.value[songListIndex.value].id,
            store.state.Cookies)
        console.log(res)
        await store.commit('deleteFromUserFavoriteSongListById', songListData.value[songListIndex.value])
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

//更新store中的播放列表
const playMusic = (index) => {
    store.commit('updateCurrentSongListId', props.id)
    store.commit('updateLastSongListId', props.id)
    store.commit('updatePlayList', songListData)
    store.commit('updatePlayListIndex', index)
    store.state.isPlaying = true
}

//添加音乐至歌单
const addMusicToUserMusicList = async (id) => {
    let res = await addMusicToList('add', id, songListData.value[songListIndex.value].id, store.state.Cookies)
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
    // console.log(myAudio);
    // myAudio.pause()
    isMvShow.value = true
    let res = await getMv(id)
    // console.log(res)
    MvUrl.value = res.data.url
}
//关闭Mv
const closeMv = () => {
    let myAudio = document.getElementById('mp')
    if (store.state.isPlaying === true) {
        myAudio.play()
    }
    MvDrawer.value.handleClose()
}

//加载音乐
const loadingSongsData = async (scroll) => {
    let sightArea = $('.musicListArea')
    let contentArea = $('.el-scrollbar__view')
    let index = (contentArea.length - 1)
    let scrollHeight = contentArea[index].scrollHeight
    let infer = (scrollHeight - scroll.scrollTop) - sightArea[0].scrollHeight
    //异步先初始好值
    let init = function () {
        sightArea = $('.musicListArea')
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
        isLoadingMusic.value = true
        blockInfer.value = true
    }
    if (infer <= 0 && isLoadingMusic.value) {
        isLoadingMusic.value = false
        const loadingInstance = ElLoading.service({
            target: document.getElementById('musicListArea'),
            text: "数据加载中",
            background: "rgba(52,52,52,0.8)",
        })
        if (store.state.playList.length === songCount.value) {
            console.log("歌单歌曲已全部加载")
            requestData.page = Math.floor(songCount.value / requestData.limit)
            requestData.offset = songCount.value
        } else {
            requestData.page = requestData.page + 1
            requestData.offset = requestData.page * requestData.limit
        }
        let res = await getMusicListSong(requestData.id, requestData.limit, requestData.offset)

        if (res.songs.length > 0) {
            blockInfer.value = false
            res.songs.forEach(item => {
                let num = 0
                for (let i = 0; i < songListData.value.length; i++) {
                    if (item.name === songListData.value[i].name) {
                        console.log("歌曲存在，不必重复添加")
                    } else {
                        num++
                    }

                    if (num === songListData.value.length) {
                        songListData.value.push(item)
                    }
                }

            })
            if (store.state.currentSongListId === store.state.lastSongListId) {
                store.commit('updatePlayList', songListData)
            }
        } else {
            blockInfer.value = true
            // alert("没有歌曲了")
            plus.nativeUI.toast("没有歌曲了", { duration: 'short' })
        }
        console.log(requestData.page, requestData.offset, res)

        loadingInstance.close()
    }
}
const createAddMusicList = async function () {
    await formRef.value.validate(async (valid) => {
        console.log(valid)
        if (valid) {
            const loadingInstance = ElLoading.service({
                target: document.getElementById('myMusicList'),
                text: "正在创建歌单",
                background: "rgba(231,231,231,0.35)",
            })
            let res = await createMusicList(form.value.name, store.state.Cookies)
            console.log(res)
            if (res.data.code === 200) {  //登录成功
                //获取用户歌单信息
                await store.dispatch('getUserMusicList', store.state.userInfos.id)
                loadingInstance.close()
                addMusicListDrawer.value.handleClose()
            } else {
                // alert("要么是网络拥挤，要么是密码错了")
                loadingInstance.close()
            }
        } else {
            console.log("不合法输入！")
        }
    })
}
</script>


<script>
import $ from "jquery";
import { ElLoading } from "element-plus";
import { createMusicList } from "../../request/api/userMusicList.js";
export default {

    methods: {
        touchstart(index) {
            console.log(index)
            $('#musicListItem' + index).toggleClass('active')
        },
        touchmove(index) {
            // $('#musicListItem'+index).toggleClass('move')
        },
        touchend(index) {
            $('#musicListItem' + index).toggleClass('active')
        },
        touchcancel(index) {
            // $('#musicListItem'+index).toggleClass('move')
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
        addMusicListTouchstart() {
            $('.addMusicList').toggleClass('activeAddMusicList')
        },
        addMusicListTouchend() {
            $('.addMusicList').toggleClass('activeAddMusicList')
        }
    }
}

</script>
<style scoped>
.musicListArea:deep(.el-scrollbar__bar.is-horizontal) {
    height: 0;
}

.musicListArea:deep(.el-scrollbar__bar.is-vertical) {
    width: 0;
}

.musicListArea {
    width: 100%;
    height: calc(100vh - 30rem);
}

.musicListArea .musicListTitle {
    display: flex;
    align-items: center;
    width: 100%;
    height: 4.1rem;
    background-color: #fdfdfe;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    color: #2c2c2c;
    font-size: 1rem;
    font-weight: bold;
}

.musicListArea .musicListTitle .el-icon {
    font-size: 1.5rem;
    margin: 0 1rem;
}

.musicListArea .musicListContent {
    background-color: #fdfdfe;
}

.musicListArea :deep(.el-loading-mask) {
    bottom: -20%;
}

.musicListArea .musicListContent .musicListItem {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 4rem;
    /*background-color: black;*/
}

/*.musicListArea .musicListContent .musicListItem:hover {*/
/*  background-color: #505050;*/
/*}*/
.active.musicListItem {
    background-color: rgba(80, 80, 80, 0.5);
    /*animation: test linear .1s normal;*/
}

.move.musicListItem {
    animation: test linear 1s normal;
}

.musicListArea .musicListContent .musicListItem .musicItem {
    width: 70%;
}

.musicListArea .musicListContent .musicListItem span {
    text-align: center;
    width: 2rem;
    margin: 0 .5rem;
    color: #2c2c2c;
    font-weight: bold;
}

.musicListArea .musicListContent .musicListItem .musicItem .artist {
    display: flex;
}

.musicListArea .musicListContent .musicListItem .musicItem .musicName {
    color: #2c2c2c;
    font-weight: bold;
}

.musicListArea .musicListContent .musicListItem .musicItem .artistName {

    color: #2c2c2c;
    font-size: .7rem;
}

.musicListArea .musicListContent .musicListItem .mv {
    color: #2c2c2c;
    font-size: 1.4rem;
    position: absolute;
    right: 12%;
}

.musicListArea .musicListContent .musicListItem .moreOption {
    color: #2c2c2c;
    font-size: 1.4rem;
    position: absolute;
    top: 30%;
    right: 4%;
}


.musicListArea :deep(.el-drawer.btt),
.el-drawer.ttb {
    width: 90%;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
    border-radius: 1rem;
}

.musicListArea :deep(.el-drawer) {
    background-color: rgba(44, 44, 44, 0.85) !important;
}

.musicListArea :deep(.el-drawer__body) {
    padding: 0 !important;
    background-color: #f3f4f6;
}


.mvAreaLayout :deep(.el-drawer.btt),
.el-drawer.ttb {
    width: 100%;
    left: 0;
    top: 0;
    transform: translate(0, 0);
    border-radius: 1rem;
}

.mvAreaLayout:deep(.el-drawer) {
    background-color: rgba(44, 44, 44, 0) !important;
}

.mvAreaLayout :deep(.el-drawer__body) {
    padding: 0 !important;
}

.mvAreaLayout {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}



.songsOptionArea {
    width: 100%;
    height: 100%;
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
    color: #2c2c2c;
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
    background-color: #dadada;
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

.activeAddMusicList {
    background-color: #dcdcdc;
}

.addMusicList {
    width: 100%;
    height: 3.6rem;
    display: flex;
    align-items: center;
    margin: .2rem 0;
}

.addMusicList_img {
    height: 3rem;
    width: 3rem;
    margin-left: .5rem;
    border-radius: 1rem;
    background-image: url("./src/assets/img/addButton.jpeg");
    background-repeat: no-repeat;
    background-size: cover;
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


.addMusicListAreaLayout {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.addMusicListArea input {
    width: 18rem;
    height: 3rem;
    text-indent: 1rem;
    border: none;
    outline: none;
    border-bottom: #ddd solid 1px;
    border-radius: 1rem;
    margin: .2rem 0;
}

.addMusicListArea:deep(.el-form-item__error) {
    left: 1rem;
}

.btnArea button {
    width: 5rem;
    height: 2rem;
    border: none;
    border-radius: 1rem;
    background-color: #f56c6c;
    color: #f9f9f9;
    font-weight: bold;
    margin: 0 1rem;
}


@keyframes test {
    from {
        background-color: yellow;
    }

    to {
        background-color: #f56c6c;
    }
}
</style>