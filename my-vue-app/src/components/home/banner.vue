<template>
    <div class="bannerArea">
        <div class="banner" @touchstart="bannerTouchstart" @touchmove="bannerTouchmove" @touchend="bannerTouchend">
            <div class="bannerShadow"></div>
            <el-carousel :interval=3000 ref="slideCarousel" class="slideCarousel" v-if="bannerPic.images[0] != null">
                <el-carousel-item style="border-radius: 1rem;overflow: hidden;" v-for="item in bannerPic.images"
                    @click="clickBannerItem(item)" :key="item.id">
                    <el-image :src="item.pic" fit="cover" />
                </el-carousel-item>
            </el-carousel>
        </div>
        <!--  轮播区域按钮-->
        <el-scrollbar class="bannerAreaButton">
            <ul>
                <li>
                    <div @click="println"><el-icon>
                            <Expand />
                        </el-icon><span>每日推荐</span></div>
                </li>
                <li>
                    <div @click="println"><el-icon>
                            <Expand />
                        </el-icon><span>私人FM</span></div>
                </li>
                <li>
                    <div @click="println"><el-icon>
                            <Expand />
                        </el-icon><span>歌单</span></div>
                </li>
                <li>
                    <div @click="println"><el-icon>
                            <Expand />
                        </el-icon><span>排行榜</span></div>
                </li>
                <li>
                    <div @click="println"><el-icon>
                            <Expand />
                        </el-icon><span>直播</span></div>
                </li>
                <li>
                    <div @click="println"><el-icon>
                            <Expand />
                        </el-icon><span>数字专辑</span></div>
                </li>
                <li>
                    <div @click="println"><el-icon>
                            <Expand />
                        </el-icon><span>有声书</span></div>
                </li>
                <li>
                    <div @click="println"><el-icon>
                            <Expand />
                        </el-icon><span>关注新歌</span></div>
                </li>
                <li>
                    <div @click="println"><el-icon>
                            <Expand />
                        </el-icon><span>歌房</span></div>
                </li>
                <li>
                    <div @click="println"><el-icon>
                            <Expand />
                        </el-icon><span>游戏专区</span></div>
                </li>
            </ul>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { getBanner } from '../../request/api/home.js'
import { onMounted, reactive, ref, nextTick } from 'vue'
import { Expand } from '@element-plus/icons-vue'
import { ElLoading } from 'element-plus'
import { useRouter } from "vue-router";
import store from '../../store/index.js'
const router = useRouter()


//轮播图数组
let bannerPic = reactive({
    images: []
})
const println = () => {
    console.log("点击按钮")
}

//点击轮播图
const clickBannerItem = (data) => {
    console.log(data, data.targetType)
    switch (data.targetType) {
        case 1: {  //新歌首发，red
            store.commit('addMusicToPlayListHead', data.song)
            store.commit('updateIsPlaying', true)
            store.commit('updateDetailShow')
        } break;
        case 1004: { //MV推荐，red
            watchMv(data.targetId)
        } break;
        case 1006: { //活动，blue
            window.location.href = data.url
        } break;
        case 10: { //新碟首发，red
            // <router-link :to="{path:'/musicList',query:{id:item.id}}">
            router.push({ name: 'musicAlbum', query: { id: data.targetId } })
        } break;
        case 3000: { //数字单曲，blue
            window.location.href = data.url
        } break;
    }
}

//异步请求数据
onMounted(async () => {
    const loadingInstance = ElLoading.service({
        target: document.getElementById('banner'),
        text: "数据加载中",
        background: "rgba(52,52,52,0.8)"
    })
    // console.log("Mounted阶段")
    let res = await getBanner()
    // console.log(res)
    bannerPic.images = res.banners
    await nextTick(() => {
        // Loading should be closed asynchronously
        loadingInstance.close()
    })
})
</script>
<script>
import $ from 'jquery'
export default {
    name: 'bannerArea',
    mounted() {
        this.$nextTick(() => {
            if (document.querySelector('.el-carousel__container') != null) {
                console.log("启动手指滑动轮播图功能")
            }

        })

    },
    data() {
        return {
            startPoint: 0,
            stopPoint: 0
        }
    },
    methods: {
        bannerTouchstart(e) {
            this.startPoint = e.changedTouches[0].pageX;
        },
        bannerTouchmove(e) {
            this.stopPoint = e.changedTouches[0].pageX;
        },
        bannerTouchend(e) {
            // console.log("1：" + this.startPoint);
            // console.log("2：" + this.stopPoint);
            if (this.stopPoint == 0 || this.startPoint - this.stopPoint == 0) {
                this.resetPoint();
                return;
            }
            if (this.startPoint - this.stopPoint > 0) {
                this.resetPoint();
                this.$refs.slideCarousel.next()
                return;
            }
            if (this.startPoint - this.stopPoint < 0) {
                this.resetPoint();
                this.$refs.slideCarousel.prev()
                return;
            }
        },
        resetPoint() {
            this.startPoint = 0
            this.stopPoint = 0
        },
        mvAreaButtonTouchstart() {
            $('.mvArea_button').toggleClass('activeMvArea_button')
        },
        mvAreaButtonTouchend() {
            $('.mvArea_button').toggleClass('activeMvArea_button')
        }
    }
}
</script>
<style lang="scss" scoped>
.bannerArea {
    /*background-color: red;*/
    overflow: hidden;
    width: 100%;
    height: 18rem;
    padding-top: 1rem;
    margin-bottom: 1rem;
    border-bottom: rgba(255, 255, 255, 0.3) solid 1px;
}

/******************轮播图样式******************/
.bannerArea>.banner {

    position: relative;
    width: 92%;
    height: 10rem;
    margin: auto;

}

.bannerArea>.banner .bannerShadow {
    position: absolute;
    top: 0;
    width: 100%;
    height: 8.7rem;
    box-shadow: #565656 0 .15rem 1rem;
    border-radius: 1rem;
    /*background-color: #f56c6c;*/
}

.bannerArea>.banner:deep(.el-carousel__container) {
    height: 10rem;
}

.bannerArea>.banner:deep(.el-image) {
    /*box-shadow: #575757 0 .18rem .8rem;*/
    border-radius: 1rem;
}

/*轮播排序按钮样式*/
.bannerArea .banner:deep(.el-carousel__button) {
    width: .5rem;
    height: .5rem;
    border-radius: 50%;
}

.bannerArea>.banner:deep(.el-carousel__indicator--horizontal) {
    margin: 1.5rem .2rem;
    padding: 0;
}

/******************轮播区域按钮样式******************/
.bannerArea>.bannerAreaButton {

    /*background-color: #fdfdfe;*/
    margin-top: 1rem;
    width: 100%;
    height: 5rem;
}

.bannerArea>.bannerAreaButton ul {
    width: 100%;
    height: 100%;
    display: flex;
    /*justify-content: space-evenly;*/
    /*align-items: center;*/
}

.bannerArea>.bannerAreaButton li {
    /*float: left;*/
    /*margin-right: 1rem;*/
    margin: 0 10px;
}

.bannerArea>.bannerAreaButton li div {
    position: relative;
    border-radius: 50%;
    background-color: #fdfdfd;
    width: 4rem;
    height: 4rem;
}

.bannerArea>.bannerAreaButton li div span {
    position: absolute;
    top: 115%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #2c2c2c;
    width: 4rem;
    text-align: center;
    font-size: .7rem;
}

.bannerArea>.bannerAreaButton li div:deep(.el-icon) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2.5rem;
    color: #fd4f59;
}

/*隐藏滚动条*/
.bannerArea>.bannerAreaButton:deep(.el-scrollbar__bar.is-horizontal) {
    height: 0;
}

.bannerArea>.bannerAreaButton:deep(.el-scrollbar__bar.is-vertical) {
    width: 0;
}
</style>