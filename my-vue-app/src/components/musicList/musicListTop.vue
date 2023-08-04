<template>
    <!--  内部样式的v-if还没有删除-->
    <div v-if="Object.keys(playlist).length > 0">
        <div class="blur"></div>
        <div class="infosTop">
            <img :src="playlist.coverImgUrl" v-if="Object.keys(playlist).length > 0" />
            <img src="" alt="暂无图片" v-else />
            <div class="left">
                <!--      返回上一级路由-->
                <el-icon @click="$router.go(-1)">
                    <Back />
                </el-icon>
                <span>歌单</span>
            </div>
            <div class="right">
                <el-icon class="Search" @click="searchAllMusic">
                    <Search />
                </el-icon>
                <el-icon class="MoreFilled">
                    <MoreFilled />
                </el-icon>
            </div>
            <!--    列表搜索搜索-->
            <el-drawer v-model="listSearchShow" title="您可能想搜索：" ref="listSearchDrawer" @close="clearSearchData"
                :with-header="false" :direction="direction" size="100%">
                <div class="listSearchArea">
                    <div class="listSearchTop">
                        <el-icon @click="listSearchShow = false">
                            <ArrowDownBold />
                        </el-icon>
                        <input placeholder="请输入关键词" v-model="searchWord">
                    </div>
                    <div class="listSearchContent">
                        <el-scrollbar>
                            <div class="listSearchContent_layout">
                                <div class="suggestResultsItem" :id="'suggestResultsItem' + index"
                                    v-if="suggestResults != null" v-for="(item, index) in suggestResults" :key="index">
                                    <div class="suggestResultsItem_left" @click="selectThisMusic(index)">
                                        <div class="icon"><el-icon>
                                                <Search />
                                            </el-icon></div>
                                        <div class="songName">
                                            <span>{{ item.name }}</span>
                                        </div>
                                        <div class="artist">
                                            <span class="artistName" v-for="(item2, index2) in item.ar" :key="index2">
                                                {{ item2.name }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="suggestResultsItem_right">
                                        <el-icon class="moreOption" @click="moreButton(index)">
                                            <MoreFilled />
                                        </el-icon>
                                        <div class="mv" v-if="item.mv > 0" @click="watchMv(item.mv)"><el-icon>
                                                <VideoCamera />
                                            </el-icon></div>
                                    </div>

                                </div>
                            </div>
                        </el-scrollbar>

                    </div>
                </div>
            </el-drawer>
            <el-drawer v-model="isMoreOptionShow" ref="songsOptionDrawer" title="标题" :with-header="false"
                :direction="direction" size="50%" :destroy-on-close="true">
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
        </div>
        <div class="mvAreaLayout">
            <el-drawer v-model="isMvShow" ref="MvDrawer" title="标题" :with-header="false" :direction="direction" size="100%"
                :destroy-on-close="true">
                <div class="mvArea">
                    <video :src="MvUrl" controls preload="metadata" height="400" width="380" />
                    <div class="mvArea_button" @click="closeMv" @touchstart="mvAreaButtonTouchstart"
                        @touchend="mvAreaButtonTouchend"><span>退出视频</span></div>
                </div>
            </el-drawer>
        </div>
        <div class="infosContent">
            <div class="infos">
                <div class="infosPic">
                    <div class="playCount" v-if="Object.keys(playlist).length > 0">
                        <el-icon>
                            <VideoPlay />
                        </el-icon>
                        {{ changeCount(playlist.playCount) }}
                    </div>
                    <div class="playCount" v-else>
                        <el-icon>
                            <VideoPlay />
                        </el-icon>
                        播放量
                    </div>
                    <el-image class="img" :src="playlist.coverImgUrl" :preview-src-list="[playlist.coverImgUrl]" fit="cover"
                        v-if="Object.keys(playlist).length > 0"></el-image>
                    <img src="" alt="暂无图片" v-else />
                </div>
                <div class="infosText">
                    <div class="infosTitle">
                        <span v-if="Object.keys(playlist).length > 0">{{ playlist.name }}</span>
                        <span v-else>标题</span>
                    </div>
                    <div class="infosAuthor">
                        <img :src="playlist.creator.avatarUrl" v-if="Object.keys(playlist).length > 0">
                        <img src="" alt="暂无图片" v-else>
                        <span v-if="Object.keys(playlist).length > 0">{{ playlist.creator.nickname }}</span>
                        <span v-else>作者名</span>
                        <el-icon>
                            <ArrowRight />
                        </el-icon>
                    </div>
                    <div class="infosIntroduce">
                        <span v-if="Object.keys(playlist).length > 0">{{ playlist.description }}</span>
                        <span v-else>歌单描述</span>
                        <i>...</i>
                    </div>
                </div>
            </div>
            <div class="operation">
                <div class="Collection">
                    <el-icon>
                        <CirclePlus />
                    </el-icon>
                    <span v-if="Object.keys(playlist).length > 0">{{ changeCount(playlist.subscribedCount) }}</span>
                    <span v-else>收藏数</span>
                </div>
                <el-divider direction="vertical" />
                <div class="comment">
                    <el-icon>
                        <ChatLineRound />
                    </el-icon>
                    <span v-if="Object.keys(playlist).length > 0">{{ changeCount(playlist.commentCount) }}</span>
                    <span v-else>评论数</span>
                </div>
                <el-divider direction="vertical" />
                <div class="share">
                    <el-icon>
                        <Share />
                    </el-icon>
                    <span v-if="Object.keys(playlist).length > 0">{{ changeCount(playlist.shareCount) }}</span>
                    <span v-else>分享数</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";
import { Star, Download, VideoCamera, Back, Search, MoreFilled, StarFilled, ArrowRight, ArrowDownBold, VideoPlay, CirclePlus, ChatLineRound, Share } from '@element-plus/icons-vue'
import { downloadMusic, getMusicListSongAll, getMv } from "../../request/api/musicList.js";
import store from '../../store/index.js'
import { debounce } from "lodash";
import { ElLoading } from "element-plus";
import axios from "axios";
import { addMusicToList, createMusicList } from "../../request/api/userMusicList.js";
let MvUrl = ref('')
let isMvShow = ref(false)
let MvDrawer = ref()
let isDownLoadDialog = ref()
let isDownLoad = ref(false)
let songsOptionDrawer = ref()
let songListIndex = ref(0)
const isMoreOptionShow = ref(false)
let loading = ref(true)
let listSearchShow = ref(false)
let direction = ref('btt')
let listSearchDrawer = ref()
let searchWord = ref('')
let suggestResults = ref([])
let isLoadingAllMusic = ref(0)
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

//观看mv
const watchMv = async (id) => {
    let myAudio = document.getElementById('mp')
    myAudio.pause()
    isMvShow.value = true
    let res = await getMv(id)
    // console.log(res)
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
//下载音乐
const downloadThisMusic = async () => {
    isDownLoadDialog.value.handleClose()
    songsOptionDrawer.value.handleClose()
    let musicName = suggestResults.value[songListIndex.value].name
    let musicArtist = suggestResults.value[songListIndex.value].ar[0].name
    let res = await downloadMusic(suggestResults.value[songListIndex.value].id)
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
    let musicName = suggestResults.value[songListIndex.value].name
    let musicArtist = suggestResults.value[songListIndex.value].ar[0].name
    let res = await downloadMusic(suggestResults.value[songListIndex.value].id)
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
//下一首播放
const addNextSong = () => {
    suggestResults.value.forEach((item, index) => {
        if (songListIndex.value === index) {
            store.commit('addMusicToPlayListNext', item)
            songsOptionDrawer.value.handleClose()
        }
    })
}
//清空搜索数据
const clearSearchData = () => {
    suggestResults.value = []
    searchWord.value = ''
}
//播放搜索的歌曲
const selectThisMusic = (index) => {
    store.commit('addMusicToPlayListTail', suggestResults.value[index])
    store.commit('updateIsPlaying', true)
}
//搜索按钮并查找所有歌曲
const searchAllMusic = async () => {
    //第一次搜索，加载所有歌曲
    if (isLoadingAllMusic.value === 0) {
        const loadingInstance = ElLoading.service({
            target: document.getElementById('no'),
            text: '搜索准备中',
            background: "rgba(52,52,52,0.8)",
        })
        // let myaudio = document.getElementById('mp')
        // console.log("加载所有音乐数据")
        let res = await getMusicListSongAll(props.id)
        store.commit('updateCurrentSongListId2', props.id)
        store.commit('updateLastSongListId2', props.id)
        if (store.state.currentSongListId2 === store.state.lastSongListId2) {
            // await store.commit('updatePlayList',res.data.songs)
            tempMusicList.value = res.data.songs
            // console.log(tempMusicList.value)
            listSearchShow.value = true
            // myaudio.pause()
        }
        loadingInstance.close()
    }
    else {
        listSearchShow.value = true
    }
    isLoadingAllMusic.value = isLoadingAllMusic.value + 1
}
//正则模糊查找歌曲名
const findMusicBySearchWord = () => {
    console.log(searchWord.value)
    if (searchWord.value === '' || searchWord.value === null || searchWord.value === undefined) {
        suggestResults.value = []
    } else {
        suggestResults.value = []
        tempMusicList.value.forEach(item => {
            console.log(item.name)
            let pattern = new RegExp(searchWord.value)
            if (pattern.test(item.name)) {
                let num = 0
                for (let i = 0; i < suggestResults.value.length; i++) {
                    if (searchWord.value === suggestResults.value[i]) {
                        // console.log("该搜索结果已经读取过")
                        break
                    } else {
                        num = num + 1
                    }
                }
                if (num === suggestResults.value.length) {
                    suggestResults.value.push(item)
                    // console.log(suggestResults.value)
                }
            } else {
                // console.log("没有找到结果诶")
                // suggestResults.value = []
            }
        })
    }


}
//监听搜索词变化
watch(searchWord, debounce(async (newValue, oldValue) => {
    await findMusicBySearchWord()
}, 200), {})
//当前浏览歌单id
watch(props, async () => {
    store.commit('updateCurrentSongListId2', props.id)
}, { deep: true, immediate: true })
//语法糖父传子
const props = defineProps([
    'playlist', 'id'
])
//修改播放量
const changeCount = (num) => {
    if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + '亿'
    } else if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
    } else {
        return num
    }
}


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
//初始判断该歌曲是否是喜欢歌曲
const isLikedFun = () => {
    if (localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined) {
        isLiked.value = false
    } else {
        for (let i = 0; i < store.state.userFavoriteSongList.length; i++) {
            if (store.state.userFavoriteSongList[i].id === suggestResults.value[songListIndex.value].id) {
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
            suggestResults.value[songListIndex.value].id,
            store.state.Cookies)
        console.log(res)
        await store.commit('addMusicToUserFavoriteSongListHead', suggestResults.value[songListIndex.value])
        // store.commit('updateCookies',res.data.cookie)
        if (res.data.body.code === 200) {
            // console.log("添加成功")
            plus.nativeUI.toast("添加成功", { duration: 'short' })
        }
        else {
            // console.log("添加失败或者歌曲已存在")
            plus.nativeUI.toast("添加失败或者歌曲已存在", { duration: 'short' })
        }
    }
}
//从我喜欢的音乐中删去
const deleteFromMyFavorite = async () => {
    if (localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined) {
        // console.log("请先登录")
        plus.nativeUI.toast("请先登录", { duration: 'short' })
    } else {
        isLiked.value = false
        let res = await addMusicToList('del',
            store.state.userFavoriteMusicListId,
            suggestResults.value[songListIndex.value].id,
            store.state.Cookies)
        console.log(res)
        await store.commit('deleteFromUserFavoriteSongListById', suggestResults.value[songListIndex.value])
        if (res.data.body.code === 200) {
            // console.log("删除成功")
            plus.nativeUI.toast("删除成功", { duration: 'short' })
        }
        else {
            // console.log("删除失败或者歌曲未存在")
            plus.nativeUI.toast("删除失败或者歌曲未存在", { duration: 'short' })
        }
    }

}
//添加音乐至歌单
const addMusicToUserMusicList = async (id) => {
    let res = await addMusicToList('add', id, suggestResults.value[songListIndex.value].id, store.state.Cookies)
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
            // console.log(res)
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

export default {
    methods: {
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
.infosTop:deep .el-drawer__body {
    padding: 0;
}

.infosTop {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 3rem;
    color: #f9f9f9;
}

.infosTop>img {
    width: 120%;
    /*height: 100%;*/
    /*top: -100%;*/
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    z-index: -2;
    filter: blur(.3rem);
    /*border-radius: 25%;*/
}

.blur {
    z-index: -1;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
}

.infosTop .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.infosTop .left:deep .el-icon {
    margin-left: .5rem;
    font-size: 1.8rem;
}

.infosTop .left span {
    margin-left: .5rem;
    font-size: 1.2rem;
}

.infosTop .right {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 1.8rem;
}

.infosTop .right .Search {
    margin-right: 1.5rem;
}

.infosTop .right .MoreFilled {
    margin-right: .5rem;
}

.infosContent {
    position: relative;
    width: 100%;
    height: 17rem;
    padding: .5rem;
}

.infosContent .infos {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 9rem;
}

.infosContent .infos .infosPic {
    color: #f9f9f9;
    position: relative;
}

.infosContent .infos .infosPic .playCount {
    position: absolute;
    top: 2%;
    right: 10%;
    margin-top: .1em;
    padding: 0 .1em;
    background-color: rgba(38, 38, 38, 0.2);
    border-radius: 10rem;
    text-align: center;
    font-size: .7rem;
}

.infosContent .infos .infosPic>.img {
    margin-left: .5rem;
    margin-right: .5rem;
    width: 8.5rem;
    height: 8.5rem;
    border-radius: 1rem;
}

.infosContent .infosText {
    padding-top: .7rem;
    width: 15.5rem;
    height: 10rem;
    color: #f9f9f9;

}

.infosContent .infosText .infosTitle {
    font-size: 1.2rem;
    font-weight: bold;
}

.infosContent .infosText .infosAuthor {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    text-align: center;
    font-size: .9rem;
}


.infosContent .infosText .infosAuthor>span {
    margin-left: .5rem;
}

.infosContent .infosText .infosIntroduce {
    margin-top: 1rem;
    font-size: .7rem;
}

.infosContent .infosText .infosIntroduce span {
    display: block;
    width: 14rem;
    height: 4rem;
    /*white-space: nowrap;*/
    overflow: hidden;
    text-overflow: ellipsis;
}

.infosContent .infosText .infosAuthor>img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
}

.infosContent .operation {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: absolute;
    bottom: 2.5%;
    left: 50%;
    transform: translateX(-50%);
    width: 75%;
    height: 3rem;
    border-radius: 2rem;
    box-shadow: #fdfdfe 0 0 .2rem;
    background-color: #fdfdfe;
    color: #2c2c2c;
    font-size: 1.5rem;
}

.infosContent .operation .Collection {
    display: inherit;
    align-items: center;
}

.infosContent .operation .Collection span {
    font-size: 1rem;
}

.infosContent .operation .comment {
    display: inherit;
    align-items: center;
}

.infosContent .operation .comment span {
    font-size: 1rem;
}

.infosContent .operation .share {
    display: inherit;
    align-items: center;
}

.infosContent .operation .share span {
    font-size: 1rem;
}






.listSearchArea {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #f3f4f6;
}

.listSearchArea .listSearchTop {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 3rem;
    margin-bottom: 2rem;
}

.listSearchArea .listSearchTop .el-icon {
    font-size: 2rem;
    color: #f56c6c;
}

.listSearchArea .listSearchTop input {
    width: 18rem;
    height: 2.6rem;
    text-indent: 1rem;
    border: none;
    outline: none;
    border-bottom: #ddd solid 1px;
    border-radius: 1.3rem;
    margin: .2rem 0;
    box-shadow: #2c2c2c 0 0 .1rem;
}

.listSearchArea .listSearchContent {
    width: 100%;
    height: calc(100vh - 8rem);
}

.listSearchArea .listSearchContent .listSearchContent_layout {
    display: flex;
    flex-direction: column;
}

.listSearchArea:deep .el-scrollbar__bar.is-horizontal {
    height: 0;
}

.listSearchArea:deep .el-scrollbar__bar.is-vertical {
    width: 0;
}

.listSearchArea .listSearchContent .listSearchContent_layout .suggestResultsItem_left {
    width: 80%;
    height: 100%;
    padding: .5rem;
    /*background-color: #eebe77;*/
    position: relative;
}

.icon {
    position: absolute;
    top: 50%;
    left: 4%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    color: #f56c6c;
}

.songName {
    margin-top: .5rem;
    margin-left: 2.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: #2c2c2c;
}

.artist {
    margin-top: .5rem;
    margin-left: 2.5rem;
}

.artistName {
    margin-right: 1.2rem;
    font-size: .7rem;
    color: #2c2c2c;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.suggestResultsItem_right {
    height: 100%;
    width: 4rem;
    color: #2c2c2c;
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    align-items: center;
    /*background-color: #eebe77;*/
    font-size: 1.5rem;
    margin-right: .5rem;
}



.suggestResultsItem {
    width: 100%;
    height: 6rem;
    display: flex;
    justify-content: space-between;
    /*background-color: #f56c6c;*/
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
    height: 5.2rem;
    font-size: 1rem;
    color: #2c2c2c;
    /*background-color: #343434;*/
}

.songsOptionArea ul li:last-child {
    height: 5.4rem;
}

.songsOptionArea ul li .el-icon {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 1.8rem;
}

.activeSongsOption {
    background-color: #6c6c6c;
}

.downloadMusicArea {
    width: 100%;
    height: 100%;
    background-color: #f3f4f6;
    border-top-right-radius: 1.5rem;
    border-top-left-radius: 1.5rem;
    color: #2c2c2c;
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

.mvAreaLayout:deep .el-drawer.btt,
.el-drawer.ttb {
    width: 100%;
    left: 0;
    top: 0;
    transform: translate(0, 0);
    border-radius: 1rem;
}

.mvAreaLayout:deep .el-drawer {
    background-color: rgba(44, 44, 44, 0) !important;
}

.mvAreaLayout:deep .el-drawer__body {
    padding: 0 !important;
}

.mvAreaLayout {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}


.addMusicArea:deep .el-scrollbar {
    height: 100%;
    background-color: #f3f4f6;
}

.addMusicArea:deep .el-scrollbar__bar.is-vertical {
    width: 0;
}

.addMusicArea:deep .el-scrollbar__bar.is-horizontal {
    width: 0;
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
    /* background-image: url("./src/assets/img/addButton.jpeg"); */
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

.addMusicAreaItem_img>img {
    height: 3rem;
    width: 3rem;
    border-radius: 1rem;
    margin-left: .5rem;
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

:deep .el-form-item__error {
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
</style>