<template>
    <div :class="{
        footerMusicPlayer: isBottomNavShow,
        bottomNav_footerMusicPlayer: !isBottomNavShow
    }">
        <div class="footerMusicPlayerLayout">
            <audio ref="audio" id="mp" class="mp"
                :src="`https://music.163.com/song/media/outer/url?id=${playList[playListIndex].id}.mp3`" autoplay
                @timeupdate="updateTime" @ended="ended"></audio>
            <img :class="{ musicImg_active: !isPlaying, musicImg: isPlaying }" :src="playList[playListIndex].al.picUrl"
                alt="" @click="openMusicDetail">
            <div class="musicName">{{ playList[playListIndex].name }}</div>
            <div class="playOrPause" @click="musicPlayController" @touchstart="playOrPauseTouchstart"
                @touchend="playOrPauseTouchend">
                <el-icon v-show="store.state.isPlaying === false">
                    <VideoPlay />
                </el-icon>
                <el-icon v-show="store.state.isPlaying === true">
                    <VideoPause />
                </el-icon>
            </div>
            <div class="songListButton" @click="isMusicListShow = true" @touchstart="songListButtonTouchstart"
                @touchend="songListButtonTouchend"><el-icon>
                    <Expand />
                </el-icon></div>
            <div class="songList">
                <el-drawer v-model="isMusicListShow" ref="MusicListDrawer" title="标题" :with-header="false"
                    :direction="direction" size="50%" :destroy-on-close="true">
                    <el-scrollbar>
                        <div class="songPlayingList">
                            <div class="songPlayingListItem" @click="updatePlayListIndex(index); updateIsPlaying(true)"
                                :key="index" v-for="(item, index) in playList" :id="'songPlayingListItem' + index"
                                @touchstart="songPlayingListItemTouchstart(index)"
                                @touchend="songPlayingListItemTouchend(index)">
                                <span>{{ index + 1 }}</span>
                                <div class="songItem">
                                    <div class="songName">{{ item.name + '-' }}</div>
                                    <div class="songArtist">
                                        <div class="songArtistName" v-for="(item2, index2) in item.ar" :key="index2">
                                            {{ item2.name + '&' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </el-drawer>
            </div>
            <div class="musicDetail">
                <el-drawer :model-value="detailShow" title="标题" :with-header="false" :direction="'btt'" size="100%"
                    ref="erDrawerMusic" :destroy-on-close="true">
                    <div class="musicDetailTop">
                        <div class="musicDetailTopBack" @click="closeMusicDetail">
                            <el-icon>
                                <ArrowDown />
                            </el-icon>
                        </div>
                        <div class="musicDetailTopInfos">
                            <vue3-marquee>
                                {{ playList[playListIndex].name }}
                            </vue3-marquee>
                            <div class="artistName">
                                <span v-for="item in playList[playListIndex].ar" :key="item">{{ item.name }}</span>
                            </div>
                        </div>
                        <div class="musicDetailTopShare">
                            <el-icon>
                                <Share />
                            </el-icon>
                        </div>
                    </div>
                    <MusicDetail :musicList="playList[playListIndex]" :play="musicPlayController" :goPlay="goPlay"
                        :isPlaying="isPlaying" />
                </el-drawer>
            </div>
        </div>
    </div>
</template>
<script setup>
import store from '../store/index.js'
import { VideoPlay, Expand, VideoPause, ArrowDown, ArrowRight, Share } from '@element-plus/icons-vue'
import { ref } from "vue";
const isMusicListShow = ref(false)
const direction = ref('btt')
let MusicListDrawer = ref()
</script>

<script>
import MusicDetail from "./musicPlayer/musicDetail.vue";
import { Vue3Marquee } from 'vue3-marquee'
// import 'vue3-marquee/dist/style.css'
import { mapState, mapMutations, mapActions } from 'vuex'
import $ from "jquery";
export default {
    components: {
        Vue3Marquee
    },
    //在语法糖中写好像有周期问题，不会响应式更新，所以这里就用了普通vue3写法
    computed: {
        ...mapState(['playList', 'playListIndex', 'isPlaying', 'detailShow', 'isBottomNavShow', 'playModel'])
    },
    mounted() {
        let myaudio = document.getElementById('mp')
        myaudio.pause()
        this.getLyric(this.playList[this.playListIndex].id)  //初始渲染时也要获得当前歌曲歌词
        // this.getComment(this.playList[this.playListIndex].id)    //初始渲染时获取歌词评论数据
        // console.log(this.$refs)
        // $('.musicImg').toggleClass('active') //首次打开音乐图片应该是停止状态
    },
    updated() {
        this.getLyric(this.playList[this.playListIndex].id)
        // this.getComment(this.playList[this.playListIndex].id)
    },
    methods: {
        musicPlayController() {
            let myAudio = document.getElementById('mp')
            if (myAudio.paused) {
                myAudio.play()
                this.updateIsPlaying(true)//更新store中的isPlaying状态
            } else {
                myAudio.pause()
                this.updateIsPlaying(false)//更新store中的isPlaying状态
            }
        },
        openMusicDetail() {
            this.updateDetailShow()
            this.addDuration()
        },
        closeMusicDetail() {
            this.$refs.erDrawerMusic.handleClose()
            this.updateDetailShow()
            this.updateIsLyricShow(false)
        },
        updateTime(e) {
            // this.interVal = setInterval(()=>{
            //   let myaudio = document.getElementById('mp')
            //   //这边建议用audio的timeupdate事件，当前播放时间改变时触发
            //   this.updateCurrentTime(myaudio.currentTime)
            // },1000)
            // console.log("时间变化",e.target.currentTime)
            this.updateCurrentTime(e.target.currentTime)
            this.addDuration()
        },
        ended() {//当前歌曲播放完毕后
            // console.log(e)
            switch (this.playModel) {
                case 0: {//顺序播放
                    this.goPlay(1)
                } break;
                case 1: {//随机播放
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
                case 2: {//单曲循环
                    this.goPlay(-1)
                    this.$nextTick(() => {
                        this.goPlay(1)
                    })

                } break;
            }

        },
        addDuration() {
            this.updateDuration(this.$refs.audio.duration)
        },
        goPlay(e) {
            // console.log(this.playList.length)
            console.log((this.playListIndex + e + this.playList.length) % (this.playList.length))
            console.log(this.playList)
            //上一首下一首的切换，取余循环
            this.updatePlayListIndex((this.playListIndex + e + this.playList.length) % (this.playList.length))
        },
        ...mapMutations([
            'updateIsPlaying',
            'updateDetailShow',
            'updateCurrentTime',
            'updateIsLyricShow',
            'updateDuration', 'updatePlayListIndex']),
        ...mapActions(['getLyric']),
        playOrPauseTouchstart() {
            $('.playOrPause').toggleClass('activePlayOrPause')
        },
        playOrPauseTouchmove() {
            // $('#playingListItem'+index).toggleClass('move')
        },
        playOrPauseTouchend() {
            $('.playOrPause').toggleClass('activePlayOrPause')
        },
        playOrPauseTouchcancel() {
            // $('#playingListItem'+index).toggleClass('move')
        },
        songListButtonTouchstart() {
            $('.songListButton').toggleClass('activeSongListButton')
        },
        songListButtonTouchend() {
            $('.songListButton').toggleClass('activeSongListButton')
        },
        songPlayingListItemTouchstart(index) {
            $('#songPlayingListItem' + index).toggleClass('activeSongPlayingListItem')
        },
        songPlayingListItemTouchend(index) {
            $('#songPlayingListItem' + index).toggleClass('activeSongPlayingListItem')
        }
    },

}
</script>
<style scoped>
.bottomNav_footerMusicPlayer {
    z-index: 10;
    width: 100%;
    height: 5rem;
    background-color: rgb(253, 253, 254);
    position: fixed;
    bottom: 0;
    transition: .5s;
    box-shadow: #fdfdfe 0 0 .5rem;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
}

.footerMusicPlayer {
    z-index: 10;
    width: 100%;
    height: 5rem;
    background-color: #fdfdfe;
    position: fixed;
    bottom: 3rem;
    transition: .5s;
    box-shadow: #fdfdfe 0 0 .5rem;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
    /*left: 50%;*/
    /*transform: translateX(-50%);*/
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: space-around;*/
}

.footerMusicPlayerLayout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
}

.footerMusicPlayer .musicImg,
.bottomNav_footerMusicPlayer .musicImg {
    /*margin: 1rem 1rem;*/
    /*padding: .5rem .5rem;*/
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    animation: musicPicRotate 10s linear infinite normal;
    margin-left: 1rem;
}

.musicImg_active {
    /*暂停时图片不重置回0deg*/
    /*margin: 0 1rem;*/
    /*padding: .1rem .1rem;*/
    width: 4rem;
    height: 4rem;
    margin-left: 1rem;

    border-radius: 50%;
    animation: musicPicRotate 10s linear infinite normal;
    animation-play-state: paused !important;
}

.footerMusicPlayer .musicName,
.bottomNav_footerMusicPlayer .musicName {
    width: 12rem;
    color: #2c2c2c;
    /*background-color: #2c2c2c;*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
}

.footerMusicPlayer .playOrPause,
.bottomNav_footerMusicPlayer .playOrPause {
    display: flex;
    align-items: center;
    height: 2.5rem;
    width: 2.5rem;
    /*background-color: blue;*/
    border-radius: 50%;
    font-size: 2.5rem;
    color: #2c2c2c;
    transition: .3s;
}

.activePlayOrPause.playOrPause {
    font-size: 2.2rem;
    color: #6c6c6c;
}


.footerMusicPlayer .songListButton,
.bottomNav_footerMusicPlayer .songListButton {
    display: flex;
    align-items: center;
    height: 2.5rem;
    width: 2.5rem;
    font-size: 1.8rem;
    color: #2c2c2c;
    transition: .3s;
}

.activeSongListButton.songListButton {
    font-size: 1.5rem;
    color: #6c6c6c;
}

.footerMusicPlayerLayout .songList .songPlayingList {
    padding: .5rem 0;
}

.footerMusicPlayerLayout .songList .songPlayingList .songPlayingListItem {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 4rem;
}

.activeSongPlayingListItem.songPlayingListItem {
    background-color: #e8e8e8;
}

.footerMusicPlayerLayout .songList .songPlayingList .songPlayingListItem span {
    text-align: center;
    margin: 0 .5rem;
    width: 2rem;
    color: #2c2c2c;
    font-weight: bold;
    font-size: 1rem;
}

.footerMusicPlayerLayout .songList .songPlayingList .songPlayingListItem .songItem .songName {
    font-size: .7rem;
    color: #2c2c2c;
}

.footerMusicPlayerLayout .songList .songPlayingList .songPlayingListItem .songItem .songArtistName {
    color: #2c2c2c;
    font-size: .7rem;
}

.songList:deep(.el-drawer.btt),
.el-drawer.ttb {
    width: 90%;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
    border-radius: 1rem;
}

.songList:deep(.el-drawer) {
    background-color: rgb(250, 250, 250) !important;
}

.songList:deep(.el-drawer__body) {
    padding: 0 !important;
}

.songList:deep(.el-scrollbar__bar.is-horizontal) {
    height: 0;
}

.songList:deep(.el-scrollbar__bar.is-vertical) {
    width: 0;
}



.footerMusicPlayer .musicDetail:deep(.el-drawer__body),
.bottomNav_footerMusicPlayer .musicDetail:deep(.el-drawer__body) {
    padding: 2rem 0 0;
}

.footerMusicPlayer .musicDetail:deep(.el-drawer),
.bottomNav_footerMusicPlayer .musicDetail:deep(.el-drawer) {
    background-color: rgba(0, 0, 0, 0);
}

.musicDetailTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 3rem;
    /*background-color: black;*/

}

.musicDetailTop .musicDetailTopBack {
    margin-left: .5rem;
    color: #f9f9f9;
    font-size: 2rem;
}

.musicDetailTop .musicDetailTopInfos {
    line-height: 1.2rem;
    height: 100%;
    color: #f9f9f9;
    font-size: .8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.musicDetailTop .musicDetailTopInfos .artistName {
    display: flex;
    align-items: center;
    justify-content: center;
}

.musicDetailTop .musicDetailTopShare {
    margin-right: .5rem;
    color: #f9f9f9;
    font-size: 2rem;
}

@keyframes musicPicRotate {
    from {
        transform: rotate(0deg);
        width: 4rem;
    }

    to {
        transform: rotate(360deg);
    }
}
</style>