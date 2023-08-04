<template>
    <img class="backImg" :src="musicList.al.picUrl" alt="">
    <div class="blur"></div>
    <div class="musicDetailMiddle" v-show="!isLyricShow">
        <img :class="{ needle_ab_active: isPlaying, needle_ab: !isPlaying }" src="../../assets/img/needle-ab.png" alt="">
        <img class="blackCircle" src="../../assets/img/blackCircle.png" alt="">
        <img :class="{ musicPic_active: !isPlaying, musicPic: isPlaying }" :src="musicList.al.picUrl" alt=""
            @click="updateIsLyricShow(true)">
    </div>
    <div class="musicLyric" v-show="isLyricShow" @click="updateIsLyricShow(false)">
        <p v-for="item in lyric" :key="item"
            :class="{ active: (currentTime * 1000) >= item.time && (currentTime * 1000) <= item.pre }">
            {{ item.lrc }}
        </p>
    </div>
    <div class="musicDetailBottom">
        <div class="top">
            <el-icon @click="deleteFromMyFavorite" v-show="isLiked">
                <StarFilled />
            </el-icon>
            <el-icon @click="addMusicToMyFavorite" v-show="!isLiked">
                <Star />
            </el-icon>
            <el-icon @click="isDownLoad = true">
                <Download />
            </el-icon>
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
            <el-icon class="Comment" style="position: relative" @click="store.commit('updateCommentShow')">
                <Comment />
                <div v-if="totalCount != null" style="position: absolute;font-size: .8rem;top: -1.5rem;right: -.5rem">
                    <span>{{ changeCount(totalCount) }}</span>
                </div>
                <el-drawer :model-value="store.state.CommentShow" title="评论区,开发中" :with-header="false"
                    :direction="direction" ref="erDrawerComments" size="100%" :destroy-on-close="true">
                    <div class="musicCommentsTop">
                        <div class="musicCommentsTopBack" @click="closeMusicComments">
                            <el-icon>
                                <Back />
                            </el-icon>
                            <span>评论</span>
                        </div>
                        <div class="musicCommentsTopShare">
                            <el-icon>
                                <Share />
                            </el-icon>
                        </div>
                    </div>
                    <MusicComments />
                </el-drawer>
            </el-icon>
        </div>
        <div class="middle">

            <el-slider v-model="myAudio.currentTime" :min=0 :max="duration" :step=0.5 />
        </div>
        <div class="bottom">
            <el-icon @click="changePlayModel" v-show="store.state.playModel === 0"><svg t="1660555125611" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1254" width="200"
                    height="200">
                    <path
                        d="M462.364444 234.666667a21.333333 21.333333 0 0 1 3.84 42.325333l-3.84 0.341333H384c-129.607111 0-234.666667 105.059556-234.666667 234.666667 0 126.435556 99.996444 229.532444 225.223111 234.481778L384 746.666667h42.666667v-43.392a8.533333 8.533333 0 0 1 1.137777-4.266667l1.365334-1.777778a8.533333 8.533333 0 0 1 9.856-1.592889l2.204444 1.592889 64.739556 64.739556a8.533333 8.533333 0 0 1 1.592889 9.856l-1.592889 2.204444-64.739556 64.739556a8.533333 8.533333 0 0 1-14.264889-3.768889l-0.298666-2.275556V789.333333h-42.666667C230.826667 789.333333 106.666667 665.173333 106.666667 512c0-149.831111 118.826667-271.928889 267.377777-277.162667l9.955556-0.170666h78.364444zM640 320.725333a8.533333 8.533333 0 0 1-14.563556 6.044445l-64.739555-64.739556a8.533333 8.533333 0 0 1 0-12.060444l64.739555-64.739556A8.533333 8.533333 0 0 1 640 191.288889V234.666667c153.173333 0 277.333333 124.16 277.333333 277.333333 0 149.831111-118.826667 271.928889-267.377777 277.162667l-9.955556 0.170666h-42.666667a21.333333 21.333333 0 0 1-3.84-42.325333L597.333333 746.666667h42.666667c129.607111 0 234.666667-105.059556 234.666667-234.666667S769.607111 277.333333 640 277.333333v43.392z"
                        p-id="1255"></path>
                </svg></el-icon>
            <el-icon @click="changePlayModel" v-show="store.state.playModel === 1"><svg t="1660554931810" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="953" width="200"
                    height="200">
                    <path
                        d="M855.836444 270.563556a8.533333 8.533333 0 0 1 9.856-1.592889l2.204445 1.592889 64.739555 64.739555a8.533333 8.533333 0 0 1 1.592889 9.856l-1.592889 2.204445-64.739555 64.739555a8.533333 8.533333 0 0 1-14.264889-3.768889l-0.298667-2.275555V362.666667h-132.792889c-52.536889 0-83.484444 16.583111-104.135111 49.934222a21.333333 21.333333 0 0 1-36.266666-22.442667c26.951111-43.605333 68.408889-67.413333 129.422222-69.930666l10.979555-0.227556H853.333333v-43.392a8.533333 8.533333 0 0 1 1.137778-4.266667l1.365333-1.777777z"
                        p-id="954"></path>
                    <path
                        d="M377.955556 320c122.311111 0 166.684444 50.602667 199.722666 175.587556l5.006222 19.712c27.320889 109.539556 50.972444 143.829333 129.792 145.92l8.064 0.113777H853.333333v-43.392a8.533333 8.533333 0 0 1 1.137778-4.266666l1.365333-1.777778a8.533333 8.533333 0 0 1 9.856-1.592889l2.204445 1.592889 64.739555 64.739555a8.533333 8.533333 0 0 1 1.592889 9.856l-1.592889 2.204445-64.739555 64.739555a8.533333 8.533333 0 0 1-14.264889-3.768888l-0.298667-2.275556V704h-132.792889c-107.804444 0-144.64-45.482667-176.384-167.111111l-4.977777-19.697778c-28.302222-112.924444-58.083556-152.149333-152.206223-154.424889l-9.016888-0.099555H128a21.333333 21.333333 0 0 1-3.84-42.325334L128 320h249.955556z"
                        p-id="955"></path>
                    <path
                        d="M528.028444 607.644444a21.333333 21.333333 0 0 1 4.366223 29.866667c-30.805333 41.386667-76.8 63.900444-142.620445 66.275556l-11.818666 0.213333H128a21.333333 21.333333 0 0 1-3.84-42.325333L128 661.333333h249.955556c59.235556 0 96.014222-16.796444 120.220444-49.308444a21.333333 21.333333 0 0 1 29.852444-4.380445z"
                        p-id="956"></path>
                </svg></el-icon>
            <el-icon @click="changePlayModel" v-show="store.state.playModel === 2"><svg t="1660555083849" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1104" width="200"
                    height="200">
                    <path
                        d="M640 234.666667c153.173333 0 277.333333 124.16 277.333333 277.333333S793.173333 789.333333 640 789.333333a21.333333 21.333333 0 0 1 0-42.666666c129.607111 0 234.666667-105.059556 234.666667-234.666667 0-126.435556-99.996444-229.532444-225.223111-234.481778L640 277.333333H384c-129.607111 0-234.666667 105.059556-234.666667 234.666667 0 126.435556 99.996444 229.532444 225.223111 234.481778L384 746.666667h42.666667v-43.392a8.533333 8.533333 0 0 1 1.137777-4.266667l1.365334-1.777778a8.533333 8.533333 0 0 1 9.856-1.592889l2.204444 1.592889 64.739556 64.739556a8.533333 8.533333 0 0 1 1.592889 9.856l-1.592889 2.204444-64.739556 64.739556a8.533333 8.533333 0 0 1-14.264889-3.768889l-0.298666-2.275556V789.333333h-42.666667C230.826667 789.333333 106.666667 665.173333 106.666667 512c0-149.831111 118.826667-271.928889 267.377777-277.162667l9.955556-0.170666h256z"
                        p-id="1105"></path>
                    <path d="M554.666667 640V384h-36.124445L469.333333 427.150222v40.618667l49.208889-43.861333V640z"
                        p-id="1106"></path>
                </svg></el-icon>
            <el-icon class="lastPlay" @click="lastPlay(); getTotalCount()">
                <CaretLeft />
            </el-icon>
            <el-icon class="VideoPlay" @click="play()" v-if="isPlaying === false">
                <VideoPlay />
            </el-icon>
            <el-icon class="VideoPause" @click="play()" v-else>
                <VideoPause />
            </el-icon>
            <el-icon class="nextPlay" @click="nextPlay(); getTotalCount(); play()">
                <CaretRight />
            </el-icon>
            <el-icon @click="isMusicListShow = true">
                <Expand />
            </el-icon>
            <div class="playingList">
                <el-drawer v-model="isMusicListShow" ref="MusicListDrawer" title="标题" :with-header="false"
                    :direction="direction" size="50%" :destroy-on-close="true">
                    <el-scrollbar>
                        <div class="playingListContent">
                            <div class="playingListItem" :id="'playingListItem' + index"
                                v-for="( item, index ) in  playList " :key="index"
                                @click="updatePlayListIndex(index); getTotalCount(); isPlaying = true"
                                @touchstart="touchstart(index)" @touchmove="touchmove(index)"
                                @touchcancel="touchcancel(index)" @touchend="touchend(index)">
                                <span>{{ index + 1 }}</span>
                                <div class="playingItem">
                                    <div class="playingName">{{ item.name + '-' }}</div>
                                    <div class="playingArtist">
                                        <div class="playingArtistName" v-if="item.ar.length > 1"
                                            v-for="( item2, index2 ) in  item.ar " :key="index2">
                                            {{ item2.name + '&' }}
                                        </div>
                                        <div class="playingArtistName" v-else>{{ item.ar[0].name }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </el-drawer>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    Download, Star, StarFilled, Comment,
    RefreshRight, VideoPlay, VideoPause,
    CaretLeft, CaretRight, Expand, Back, Share
} from '@element-plus/icons-vue'
import { ref, onMounted, watch, computed } from 'vue'
import MusicComments from "./musicDetail/musicComments.vue";
import store from "../../store/index.js";
import { downloadMusic } from '../../request/api/musicList.js'
import axios from 'axios'
import $ from "jquery";
import { addMusicToList } from "../../request/api/userMusicList.js";
//抽屉一定要用语法糖写，不然手机端会报错，第一次能打开，后面就打不开了
const isMusicListShow = ref(false)
const direction = ref('btt')
let MusicListDrawer = ref()
let totalCount = ref()
let erDrawerComments = ref()
let isDownLoad = ref(false)
let isDownLoadDialog = ref()
let isLiked = ref(false)

//初始判断该歌曲是否是喜欢歌曲
const isLikedFun = () => {
    if (localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined) {
        isLiked.value = false
    } else {
        for (let i = 0; i < store.state.userFavoriteSongList.length; i++) {
            if (store.state.userFavoriteSongList[i].id === store.state.playList[store.state.playListIndex].id) {
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
        // plus.nativeUI.toast("请先登录",{duration:'short'})
    } else {
        isLiked.value = true
        let res = await addMusicToList('add',
            store.state.userFavoriteMusicListId,
            store.state.playList[store.state.playListIndex].id,
            store.state.Cookies)
        console.log(res)
        await store.commit('addMusicToUserFavoriteSongListHead', store.state.playList[store.state.playListIndex])
        // store.commit('updateCookies',res.data.cookie)
        if (res.data.body.code === 200) {
            console.log("添加成功")
            // plus.nativeUI.toast("添加成功",{duration:'short'})
        }
        else {
            console.log("添加失败或者歌曲已存在")
            // plus.nativeUI.toast("添加失败或者歌曲已存在",{duration:'short'})
        }
    }
}
//从我喜欢的音乐中删去
const deleteFromMyFavorite = async () => {
    if (localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined) {
        console.log("请先登录")
        // plus.nativeUI.toast("请先登录",{duration:'short'})
    } else {
        isLiked.value = false
        let res = await addMusicToList('del',
            store.state.userFavoriteMusicListId,
            store.state.playList[store.state.playListIndex].id,
            store.state.Cookies)
        console.log(res)
        await store.commit('deleteFromUserFavoriteSongListById', store.state.playList[store.state.playListIndex])
        if (res.data.body.code === 200) {
            console.log("删除成功")
            // plus.nativeUI.toast("删除成功",{duration:'short'})
        }
        else {
            console.log("删除失败或者歌曲未存在")
            // plus.nativeUI.toast("删除失败或者歌曲未存在",{duration:'short'})
        }
    }

}

//下载音乐
const downloadThisMusic = async () => {
    isDownLoadDialog.value.handleClose()
    let musicName = store.state.playList[store.state.playListIndex].name
    let musicArtist = store.state.playList[store.state.playListIndex].ar[0].name
    let res = await downloadMusic(store.state.playList[store.state.playListIndex].id)
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
    let musicName = store.state.playList[store.state.playListIndex].name
    let musicArtist = store.state.playList[store.state.playListIndex].ar[0].name
    let res = await downloadMusic(store.state.playList[store.state.playListIndex].id)
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
// 下载服务器的MP3文件
const downloadMp3 = (filePath) => {
    fetch(filePath).then(res => res.blob()).then(blob => {
        console.log(blob)
        const a = document.createElement('a');
        document.body.appendChild(a)
        a.style.display = 'none'
        // 使用获取到的blob对象创建的url
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        // 指定下载的文件名
        a.download = '语音音频.mp3';
        a.click();
        document.body.removeChild(a)
        // 移除blob对象的url
        window.URL.revokeObjectURL(url);
    });
}
const closeMusicComments = () => {
    erDrawerComments.value.handleClose()
    store.commit('updateCommentShow')
}
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
const getTotalCount = async () => {
    let data = {
        type: 0,
        id: store.state.playList[store.state.playListIndex].id,
        sortType: 1,
        pageNo: 1,
        pageSize: 7,
        isChange: true
    }
    totalCount.value = await store.dispatch('getComment', data)
}

//歌词
const lyric = computed(() => {
    let arr
    if (store.state.lyricList.lyric) {
        arr = store.state.lyricList.lyric.split(/[(\r\n)\r\n]+/).map((item) => {
            let minute = item.slice(1, 3)
            let second = item.slice(4, 6)
            let mill = item.slice(7, 10)
            let lrc = item.slice(11, item.length)
            let time = parseInt(minute) * 60 * 1000 + parseInt(second) * 1000 + parseInt(mill)
            if (isNaN(Number(mill))) {
                mill = item.slice(7, 9)
                lrc = item.slice(10, item.length)
                time = parseInt(minute) * 60 * 1000 + parseInt(second) * 1000 + parseInt(mill)
            }
            return { minute, second, mill, lrc, time }
        })
    }
    arr.forEach((item, i) => {
        if (i === arr.length - 1 || isNaN(arr[i + 1].time)) {  //  当是最后一句歌词，下一个时间段置为0
            item.pre = 0
        } else {   //当不是最后一句歌词，下一个时间设置为下一句歌词的起始时间
            item.pre = arr[i + 1].time
        }
    })
    // console.log(arr)
    return arr
})
//监听歌词，实现滚动
watch(() => store.state.currentTime, (newValue, oldValue) => {
    let p = document.querySelector("p.active")
    if (p != null) {
        setTimeout(() => {
            if ($('.musicLyric')[0] != null) {
                $('.musicLyric')[0].scrollTop = p.offsetTop - 350
            }
        }, 500)
    }
}, {})
//音乐播放器
const myAudio = document.getElementById('mp')

onMounted(() => {
    getTotalCount()
    isLikedFun()
})
</script>
<script>
import { mapMutations, mapState } from "vuex";
import { ref } from "vue";
export default {
    data() {
        return {
            // myAudio : document.getElementById('mp'),
        }
    },
    computed: {

        ...mapState(["lyricList", "currentTime", "isLyricShow", "playListIndex", "playList", "duration", "comment", "playModel"]),
        // lyric:function () {
        //   let arr
        //   if (this.lyricList.lyric){
        //     arr = this.lyricList.lyric.split(/[(\r\n)\r\n]+/).map((item)=>{
        //       let minute = item.slice(1,3)
        //       let second = item.slice(4,6)
        //       let mill = item.slice(7,10)
        //       let lrc = item.slice(11,item.length)
        //       let time = parseInt(minute)*60*1000+parseInt(second)*1000+parseInt(mill)
        //       if(isNaN(Number(mill))){
        //         mill = item.slice(7,9)
        //         lrc = item.slice(10,item.length)
        //         time = parseInt(minute)*60*1000+parseInt(second)*1000+parseInt(mill)
        //       }
        //       // let minute = item.match(/\d{2}(?=:)/gm)
        //       // let second = item.match(/\d{2}(?=\.)/gm)
        //       // let mill = item.match(/\d{2,3}(?=])/gm)
        //       // let lrc = item.match(/([^\]]+)$/gm)
        //       // console.log(minute[0])//,second,mill,lrc)
        //       return {minute,second,mill,lrc,time}
        //     })
        //   }
        //   arr.forEach((item,i) => {
        //     if (i === arr.length-1 || isNaN(arr[i+1].time)){  //  当是最后一句歌词，下一个时间段置为0
        //       item.pre = 0
        //     }else {   //当不是最后一句歌词，下一个时间设置为下一句歌词的起始时间
        //       item.pre = arr[i+1].time
        //     }
        //   })
        //   // console.log(arr)
        //   return arr
        // }
    },
    name: "musicDetail",
    props: ['musicList', 'play', 'isPlaying', 'goPlay'],
    methods: {
        ...mapMutations(["updateDetailShow", "updateIsLyricShow", "updatePlayListIndex", "updateCurrentTime", "updatePlayModel"]),
        // setCurrentTime(val){ //废弃的代码，这里是实现拖动进度条加载音乐，实际上直接给组件绑定
        //                        v-model = 播放器.currentTime即可
        //   console.log(this.currentTime,val)
        //   let myAudio = document.getElementById('mp')
        //   myAudio.load()
        //   myAudio.currentTime = val
        //
        //   this.updateCurrentTime(val)
        // },
        lastPlay() {
            switch (this.playModel) {
                case 0: {
                    this.goPlay(-1)
                } break;
                case 1: {
                    let randomNum = Math.floor(Math.random() * (this.playList.length))
                    if (randomNum === this.playListIndex) {
                        while (randomNum === this.playListIndex) {
                            randomNum = Math.floor(Math.random() * (this.playList.length))
                        }
                        this.goPlay(randomNum)
                    } else {
                        this.goPlay(randomNum)
                    }
                } break;
                case 2: {
                    this.goPlay(-1)
                    this.$nextTick(() => {
                        this.goPlay(1)
                    })
                } break;
            }
        },
        nextPlay() {

            switch (this.playModel) {
                case 0: {
                    this.goPlay(1)

                } break;
                case 1: {
                    let randomNum = Math.floor(Math.random() * (this.playList.length))
                    if (randomNum === this.playListIndex) {
                        while (randomNum === this.playListIndex) {
                            randomNum = Math.floor(Math.random() * (this.playList.length))
                        }
                        this.goPlay(randomNum)
                    } else {
                        this.goPlay(randomNum)
                    }
                } break;
                case 2: {
                    this.goPlay(-1)
                    this.$nextTick(() => {
                        this.goPlay(1)
                    })
                } break;
            }
        },
        changePlayModel() {
            switch (this.playModel) {
                case 0: {//顺序播放
                    this.updatePlayModel(1)
                } break;
                case 1: {//随机播放
                    this.updatePlayModel(2)
                } break;
                case 2: {//单曲循环
                    this.updatePlayModel(0)
                } break;
            }
        },
        touchstart(index) {
            console.log(index)
            $('#playingListItem' + index).toggleClass('active2')
        },
        touchmove(index) {
            // $('#playingListItem'+index).toggleClass('move')
        },
        touchend(index) {
            $('#playingListItem' + index).toggleClass('active2')
        },
        touchcancel(index) {
            // $('#playingListItem'+index).toggleClass('move')
        },
    },
}
</script>

<style scoped>
.backImg {
    position: absolute;
    /*width: 100%;*/
    height: 110%;
    z-index: -2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: blur(.5rem);
}

.blur {
    z-index: -1;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.musicDetailMiddle {
    position: relative;
    width: 100%;
    height: 36rem;
    display: flex;
    flex-direction: column;
}

.musicDetailMiddle .needle_ab {
    width: 6rem;
    height: 9rem;
    position: absolute;
    left: 55%;
    top: 20%;
    transform: translate(-50%, -50%) rotate(-13deg);
    transform-origin: 0 0;
    transition: all .5s;
    z-index: -1;
    /*animation: needle-ab 1s ease-in-out normal forwards;*/
}

.needle_ab_active {
    width: 6rem;
    height: 9rem;
    position: absolute;
    left: 55%;
    top: 20%;
    transform: translate(-50%, -50%) rotate(6deg);
    transform-origin: 0 0;
    transition: all .5s;
    z-index: -1;
}

.musicDetailMiddle .blackCircle {
    width: 15.9rem;
    height: 15.9rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: -2;
}

.musicDetailMiddle .musicPic {
    z-index: 0;
    position: absolute;
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: musicPicRotate 10s linear infinite normal;
}

.musicPic_active {
    z-index: 0;
    position: absolute;
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: musicPicRotate 10s linear infinite normal;
    animation-play-state: paused !important;
}

.musicLyric {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
    height: 34rem;
    width: 100%;
    overflow: hidden;
}

.musicLyric p {
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 1.5rem;
    transition: all 1s;
    text-align: center;
}

.active {
    color: #f9f9f9 !important;
    font-size: 1.1rem;
    font-weight: bold;
    font-style: italic;
    text-align: center;
}

.musicDetailBottom {
    position: absolute;
    bottom: 2.5%;
    width: 100%;
    /*height: calc(100vh - 42rem);*/
}

.musicDetailBottom .top {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 3rem;
    color: #f9f9f9;
    font-size: 1.8rem;
}

.musicDetailBottom .top .downloadMusicArea {

    width: 100%;
    height: 100%;
    background-color: #343434;
    border-top-right-radius: 1.5rem;
    border-top-left-radius: 1.5rem;
}

.musicDetailBottom .top .downloadMusicArea .downloadMusicArea_title {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    padding-left: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
}

.musicDetailBottom .top .downloadMusicArea .downloadMusicArea_body {
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

.musicDetailBottom .top .Comment span {
    font-size: .5rem;
}

.musicDetailBottom .middle {
    margin: 0 auto;
    padding-top: 1rem;
    width: 100%;
    height: 3rem;
    /*background-color: aquamarine;*/
}



.musicDetailBottom .middle:deep(.el-slider__runway) {
    background-color: #ffffff;
    height: 1px;
}

/*进度条颜色*/
.musicDetailBottom .middle:deep(.el-slider__bar) {
    /*background: #ffffff linear-gradient(rgba(0,0,0,1),rgba(0,0,0,1));*/
    /*animation: bar-anim 2s linear infinite;*/
    background-color: #f56c6c;
    height: 1px;
}

.musicDetailBottom .middle:deep(.el-slider__button-wrapper) {
    top: -17.5px;
}

.musicDetailBottom .middle:deep(.el-slider__button) {
    width: 10px;
    height: 10px;
    border: #ffffff solid 1px;
    box-shadow: rgba(255, 255, 255, 0.8) 0 0 1rem;
}

.musicDetailBottom .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 4.8rem;
    color: #f9f9f9;
    font-size: 2rem;
}

.musicDetailBottom .bottom .lastPlay {
    margin-left: 2rem;
}

.musicDetailBottom .bottom .VideoPlay,
.musicDetailBottom .bottom .VideoPause {
    font-size: 3.5rem;
    margin: 0 2rem;
}

.musicDetailBottom .bottom .nextPlay {
    margin-right: 2rem;
}

.playingList:deep(.el-drawer.btt),
.el-drawer.ttb {
    width: 90%;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
    border-radius: 1rem;
}

.playingList:deep(.el-drawer) {
    background-color: rgb(250, 250, 250) !important;
}

.playingList:deep(.el-drawer__body) {
    padding: 0 !important;
}

.playingList:deep(.el-scrollbar__bar.is-horizontal) {
    height: 0;
}

.playingList:deep(.el-scrollbar__bar.is-vertical) {
    width: 0;
}

.playingList .playingListContent {
    /*background-color: #2c2c2c*/
    padding: .5rem 0;
}

.playingList .playingListContent .playingListItem {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 4rem;
    /*background-color: black;*/
}

.active2.playingListItem {
    background-color: #e8e8e8;
}

.playingList .playingListContent .playingListItem span {
    text-align: center;
    margin: 0 .5rem;
    width: 2rem;
    color: #2c2c2c;
    font-weight: bold;
    font-size: 1rem;
}

.playingList .playingListContent .playingListItem .playingItem .playingName {
    font-size: .7rem;
    color: #2c2c2c;
}

.playingList .playingListContent .playingListItem .playingItem .playingArtist {
    display: flex;
    font-size: 1rem;
}

.playingList .playingListContent .playingListItem .playingItem .playingArtistName {
    color: #2c2c2c;
    font-size: .7rem;
}


.musicCommentsTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 3rem;
    font-style: normal;
    background-color: #fdfdfd;
}

.musicCommentsTop .musicCommentsTopBack {
    display: flex;
    align-items: center;
    margin-left: .5rem;
    color: #2c2c2c;
    font-size: 2rem;
}

.musicCommentsTop .musicCommentsTopBack span {
    margin-left: 1rem;
    font-size: 1.2rem !important;
}

.musicCommentsTop .musicCommentsTopShare {
    margin-right: .5rem;
    color: #2c2c2c;
    font-size: 2rem;
}

.Comment:deep(.el-drawer) {
    background-color: #fdfdfd !important;
}

@keyframes musicPicRotate {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

@keyframes needle-ab {
    from {
        transform: translate(-50%, -50%) rotate(-10deg);
    }

    to {
        transform: translate(-50%, -50%) rotate(0deg);
    }
}

@keyframes bar-anim {
    from {
        background-position: 24.375rem 0;
    }

    to {
        background-position: 0 0;
    }
}
</style>