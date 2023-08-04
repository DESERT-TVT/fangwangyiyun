<template>
    <div class="commentArea" id="commentArea" v-if="comments.length > 0">
        <div class="commentAreaTitle">
            <span class="commentAreaTitle_title">评论区</span>
            <ul class="commentAreaTitle_option">
                <li @click="getRecomment()" :class="{ activeLi: Recomment }"><span>推荐</span></li>
                <li @click="getHot()" :class="{ activeLi: Hot }"><span>最热</span></li>
                <li @click="getNew()" :class="{ activeLi: New }"><span>最新</span></li>
            </ul>
        </div>
        <div class="commentAreaContent" id="commentAreaContent">
            <el-scrollbar ref="commentsScrollBar" @scroll="loadingCommentsData" :noresize="true">
                <div class="commentAreaContentLayout">
                    <div class="commentItem" v-for="(item, index) in comments" :key="index">
                        <div class="commentItem_header">
                            <div class="commentItem_header_left">
                                <img :src=item.user.avatarUrl alt="?">
                                <div class="commentItem_header_left_text">
                                    <p class="nickName">{{ item.user.nickname }}</p>
                                    <p class="timeStr">{{ item.timeStr }}</p>
                                </div>
                            </div>
                            <div class="commentLikedArea">
                                <span class="commentLikedArea_count">{{ item.likedCount }}</span>
                                <el-icon @click="likeOrDislike(item)">
                                    <Star />
                                </el-icon>
                                <el-icon v-show="item.user.userId === store.state.userInfos.userId"
                                    @click="delComment(item)">
                                    <Delete />
                                </el-icon>
                            </div>
                        </div>
                        <div class="commentItem_body">
                            <div class="commentItem_body_text" @click="clickReply(item)">
                                <span>{{ item.content }}</span>
                            </div>
                            <div class="commentItem_body_more" v-show="item.replyCount > 0">
                                <span @click="loadingSonComment(item.replyCount, item.commentId)">
                                    {{ item.replyCount + '条回复' }}
                                </span>
                                <el-icon>
                                    <ArrowRight />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                    <el-drawer v-model="isShowMoreComment" title="评论区,开发中" :with-header="false"
                        :direction="directionMoreComment" ref="erDrawerCommentsMore" size="90%" :destroy-on-close="true">
                        <div class="musicCommentsMoreTop">
                            <div class="musicCommentsMoreTopBack" @click="closeMusicCommentsMore">
                                <el-icon>
                                    <Back />
                                </el-icon>
                                <span>{{ '回复(' + repliedCount + ')' }}</span>
                            </div>
                        </div>
                        <MusicCommentMore :parentCommentId="parentCommentId" />
                    </el-drawer>
                    <div class="replyCommentArea" id="replyCommentArea">
                        <el-drawer v-model="replyComment" title="评论回复" :with-header="false"
                            :direction="directionMoreComment" ref="replyCommentDrawer" size="30%" :destroy-on-close="true">
                            <div class="replyCommentArea_layout">
                                <div class="replyCommentArea_input">
                                    <el-form :model="form2" size="large" :rules="rules2" status-icon ref="formRef2">
                                        <el-form-item prop="replyContent">
                                            <input type="text" name="replyContent" class="replyContent"
                                                placeholder="请输入回复内容" v-model="form2.replyContent">
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <div class="btnArea">
                                    <button class="btn" @click="reply"><span>回复</span></button>
                                </div>
                            </div>
                        </el-drawer>
                    </div>
                </div>
            </el-scrollbar>
            <div class="toUpButton_comment" @click="toUpButton" @touchstart="toUpButtonTouchstart"
                @touchend="toUpButtonTouchend">
                <el-icon>
                    <Top />
                </el-icon>
            </div>
        </div>
        <div class="commentInput">
            <el-form :model="form" size="large" :rules="rules" status-icon ref="formRef">
                <el-form-item prop="comment">
                    <input type="text" name="comment" class="comment_input" placeholder="想把你留在心里，却放任你游走云间"
                        v-model="form.comment">
                </el-form-item>
            </el-form>
            <button class="btn" @click="sendComment"><span>发送</span></button>
        </div>
    </div>
    <div v-else>当前歌曲没有评论</div>
</template>
<script setup>
import MusicCommentMore from '../musicCommentMore.vue'
import { Star, StarFilled, ArrowRight, Top, Back, Delete } from "@element-plus/icons-vue";
import store from '../../../store/index.js'
import { onMounted, onUpdated, ref, watch, nextTick } from "vue";
import { ElLoading } from "element-plus";
import { dComment, likeOrDislikeThisComment, sComment } from "../../../request/api/musicComment.js";
import { createMusicList } from "../../../request/api/userMusicList.js";
let rules2 = ref({
    replyContent: [
        { required: true, message: '请输入评论内容', trigger: 'blur' },
    ],
})
let form2 = ref({})
let formRef2 = ref()
let rules = ref({
    comment: [
        { required: true, message: '请输入评论内容', trigger: 'blur' },
    ],
})
let form = ref({})
let formRef = ref()
let replyComment = ref(false)
let replyCommentDrawer = ref()
let parentCommentId = ref(0)
let repliedCount = ref(0)
let isShowMoreComment = ref(false)
let directionMoreComment = ref('btt')
let erDrawerCommentsMore = ref()
let commentsScrollBar = ref()
let Recomment = ref(true)
let Hot = ref(false)
let New = ref(false)
let comments = ref([])
let isLoadingComments = ref(false)
let blockInfer = ref(false)
let requestData = {
    type: 0,
    id: store.state.playList[store.state.playListIndex].id,
    sortType: 1,
    pageNo: 1,
    pageSize: 7,
    cursor: 0,
    isChange: true
}
let isTop = ref(true)
let selectCommentId = ref(0)

const closeMusicCommentsMore = () => {
    erDrawerCommentsMore.value.handleClose()
}
const loadingSonComment = (index, index2) => {
    isShowMoreComment.value = true
    repliedCount.value = index
    parentCommentId.value = index2
}
const toUpButton = () => {
    let contentArea = $('.el-scrollbar__view')[$('.el-scrollbar__view').length - 1].scrollHeight
    let step = contentArea / 2

    if (isTop.value === false) {
        const timeTop = setInterval(() => {
            commentsScrollBar.value.setScrollTop(step)
            step = step - 50
            if (step < -50) {
                clearInterval(timeTop)
                isTop.value = true
            }
        }, 15)
    }

}
const loadingCommentsData = async (scroll) => {
    let sightArea = $('.commentAreaContent')
    let contentArea = $('.el-scrollbar__view')
    let index = (contentArea.length - 1)
    let scrollHeight = contentArea[index].scrollHeight
    let infer = (scrollHeight - scroll.scrollTop) - sightArea[0].scrollHeight
    //异步先初始好值
    let init = function () {
        sightArea = $('.commentAreaContent')
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

    // console.log(contentArea[3].scrollHeight-scroll.scrollTop,sightArea[0].scrollHeight)
    // console.log(contentArea,scrollHeight,infer)

    if (infer <= 0 && blockInfer.value === false) {
        isLoadingComments.value = true
        blockInfer.value = true
    }

    if (infer <= 0 && isLoadingComments.value) { //滑动满加载内容

        isLoadingComments.value = false

        const loadingInstance = ElLoading.service({
            target: document.getElementById('commentArea'),
            text: "数据加载中",
            background: "rgba(52,52,52,0.8)",
        })

        requestData.pageNo = requestData.pageNo + 1
        requestData.isChange = false
        if (requestData.sortType === 3 && requestData.pageNo > 1) {
            requestData.cursor = store.state.comment[store.state.comment.length - 1].time
            await getComment(requestData)
            // blockInfer.value = false
            loadingInstance.close()
        } else {
            requestData.cursor = 0
            await getComment(requestData)
            // blockInfer.value = false
            loadingInstance.close()

        }

    }
}

const clickReply = (item) => {
    replyComment.value = true
    selectCommentId.value = item.commentId
}
//发送评论
const sendComment = async () => {
    await formRef.value.validate(async (valid) => {
        console.log(valid)
        if (valid) {
            const loadingInstance = ElLoading.service({
                target: document.getElementById('commentAreaContent'),
                text: "正在发布评论",
                background: "rgba(231,231,231,0.35)",
            })
            let res = await sComment(store.state.playList[store.state.playListIndex].id, form.value.comment, 1, 0, store.state.Cookies, -1)
            let res2 = await store.dispatch('getComment', requestData)
            comments.value = store.state.comment
            console.log(res)
            await loadingInstance.close()
        } else {
            console.log("不合法输入！")
        }
    })

}
//删除评论
const delComment = async (item) => {
    const loadingInstance = ElLoading.service({
        target: document.getElementById('commentAreaContent'),
        text: "删除评论中",
        background: "rgba(231,231,231,0.35)",
    })
    let res = await dComment(store.state.playList[store.state.playListIndex].id, item.commentId, 0, 0, store.state.Cookies)
    await getComment(requestData)
    await loadingInstance.close()
}
//回复
const reply = async () => {
    await formRef2.value.validate(async (valid) => {
        console.log(valid)
        if (valid) {
            const loadingInstance = ElLoading.service({
                target: document.getElementById('replyCommentArea'),
                text: "正在发布评论",
                background: "rgba(231,231,231,0.35)",
            })
            let res = await sComment(store.state.playList[store.state.playListIndex].id, form2.value.replyContent, 2, 0, store.state.Cookies, selectCommentId.value)
            let res2 = await store.dispatch('getComment', requestData)
            comments.value = store.state.comment
            console.log(res)
            await loadingInstance.close()
            replyCommentDrawer.value.handleClose();
        } else {
            console.log("不合法输入！")
        }
    })
}
//不能很好判断点赞与否，害
const likeOrDislike = async (item) => {
    let t = await item.liked ? 0 : 1
    let res = await likeOrDislikeThisComment(store.state.playList[store.state.playListIndex].id, item.commentId, t, 0, store.state.Cookies)
    console.log(item, t, res)
    await getComment(requestData)
}
const getRecomment = () => {

    nextTick(() => {
        commentsScrollBar.value.setScrollTop(0)
    })
    blockInfer.value = false

    requestData.type = 0
    requestData.id = store.state.playList[store.state.playListIndex].id
    requestData.sortType = 1
    requestData.pageNo = 1
    requestData.pageSize = 7
    requestData.isChange = true
    getComment(requestData)

    Recomment.value = true
    Hot.value = false
    New.value = false

}
const getHot = () => {
    nextTick(() => {
        commentsScrollBar.value.setScrollTop(0)
    })
    blockInfer.value = false

    requestData.type = 0
    requestData.id = store.state.playList[store.state.playListIndex].id
    requestData.sortType = 2
    requestData.pageNo = 1
    requestData.pageSize = 15
    requestData.isChange = true
    getComment(requestData)

    Recomment.value = false
    Hot.value = true
    New.value = false

}
const getNew = () => {
    nextTick(() => {
        commentsScrollBar.value.setScrollTop(0)
    })
    blockInfer.value = false

    requestData.type = 0
    requestData.id = store.state.playList[store.state.playListIndex].id
    requestData.sortType = 3
    requestData.pageNo = 1
    requestData.pageSize = 15
    requestData.isChange = true
    getComment(requestData)

    Recomment.value = false
    Hot.value = false
    New.value = true

}
const getComment = async (e) => {
    let res = await store.dispatch('getComment', e)
    // console.log(res)
    if (res === 0) {
        plus.nativeUI.toast("没有评论了", { duration: 'short' })
        blockInfer.value = true
    } else {
        blockInfer.value = false
    }
    comments.value = store.state.comment
}
onMounted(() => {
    comments.value = store.state.comment
    console.log("Mounted阶段")
})
</script>
<script>

import $ from "jquery";

export default {
    name: "musicComments",
    mounted() {
    },
    methods: {
        toUpButtonTouchstart() {
            $('.toUpButton_comment').toggleClass('activeToUpButton_comment')
        },
        toUpButtonTouchend() {
            $('.toUpButton_comment').toggleClass('activeToUpButton_comment')
        }
    }
}
</script>
<style scoped>
.commentArea {
    font-style: normal;
    background-color: #f3f4f6;
}

.commentAreaContent:deep(.el-scrollbar__bar.is-horizontal) {
    height: 0;
}

.commentAreaContent:deep(.el-scrollbar__bar.is-vertical) {
    width: 0;
}

.commentAreaContentLayout:deep(.el-drawer__body) {
    padding: 0 !important;
}

.commentAreaContentLayout:deep(.el-drawer) {
    border-top-right-radius: 2rem;
    border-top-left-radius: 2rem;
}

.commentAreaTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 2rem;
    padding-top: .5rem;
}

.commentAreaTitle .commentAreaTitle_title {
    margin-left: 1rem;
    font-size: 1rem;
    color: #2c2c2c;
    font-weight: bold;
}

.commentAreaTitle .commentAreaTitle_option {
    font-size: .8rem;
    display: flex;
    align-items: center;
    color: #2c2c2c;
}

.commentAreaTitle .commentAreaTitle_option li {
    margin-right: 1rem;
}

.activeLi {
    color: #c45656;
}

.commentAreaTitle .commentAreaTitle_option li:last-child {
    margin-right: .8rem;
}

.commentAreaContent {
    width: 100%;
    height: calc(100vh - 7rem);
    background-color: #f3f4f6;
}

.commentItem {
    width: 100%;
    border-top: rgba(249, 249, 249, 0.1) 1px solid;
    margin: 1rem 0;
    padding-top: 1rem;
    /*background-color: #2c2c2c;*/
}

.commentItem:first-child {
    border-top: #f9f9f9 0 solid;
    margin: 0;
}

.commentItem .commentItem_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 4rem;
    /*background-color: yellow;*/
}

.commentItem .commentItem_header .commentItem_header_left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #2c2c2c;
}

.commentItem .commentItem_header .commentItem_header_left .commentItem_header_left_text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 1rem;
}

.commentItem .commentItem_header .commentItem_header_left .commentItem_header_left_text .nickName {
    font-size: .6rem;
}

.commentItem .commentItem_header .commentItem_header_left .commentItem_header_left_text .timeStr {
    font-size: .6rem;
}

.commentItem .commentItem_header .commentItem_header_left img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    margin-left: 1rem;
}

.commentItem .commentItem_header .commentLikedArea {
    display: flex;
    align-items: center;
    color: #2c2c2c;
}

.commentItem .commentItem_header .commentLikedArea .commentLikedArea_count {
    font-size: .8rem;
}

.commentItem .commentItem_header .commentLikedArea .el-icon {
    font-size: 1.1rem;
    margin: 0 .5rem;
}

.commentItem .commentItem_body {
    position: relative;
    width: 100%;
}

.commentItem .commentItem_body .commentItem_body_text {
    width: 100%;
    padding-left: 5rem;
    font-size: .8rem;
    color: #2c2c2c;
}

.commentItem .commentItem_body .commentItem_body_more {
    /*position: absolute;*/
    display: flex;
    align-items: center;
    padding: 0 5rem;
    font-size: .8rem;
    color: #478dc3;
}

.commentItem .commentItem_body .commentItem_body_more span {
    margin-right: .4rem;
}


.toUpButton_comment {
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

.activeToUpButton_comment.toUpButton_comment {
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


.musicCommentsMoreTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 3rem;
    font-style: normal;
}

.musicCommentsMoreTop .musicCommentsMoreTopBack {
    display: flex;
    align-items: center;
    margin-left: 1rem;
    color: #2c2c2c;
    font-size: 1.8rem;
}

.musicCommentsMoreTop .musicCommentsMoreTopBack span {
    margin-left: 1rem;
    font-size: 1rem;
}



.commentInput {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3rem;
    display: flex;
    background-color: #fdfdfe;
}

.commentInput input {
    width: 18rem;
    height: 3rem;
    text-indent: 1rem;
    border: none;
    outline: none;
    border-radius: 1rem;
}

.commentInput button,
.btnArea button {
    width: 5rem;
    height: 2rem;
    border: none;
    border-radius: 1rem;
    background-color: #f56c6c;
    color: #f9f9f9;
    font-weight: bold;
    margin: .5rem 1rem;
}

.replyCommentArea:deep(.el-overlay) {
    background-color: rgba(253, 253, 253, 0);
}

.replyCommentArea:deep(.el-drawer.btt),
.el-drawer.ttb {
    width: 90%;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
    border-radius: 1rem;
}

.replyCommentArea_layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.replyCommentArea_input input {
    width: 18rem;
    height: 3rem;
    text-indent: 1rem;
    border: none;
    outline: none;
    border-bottom: #ddd solid 1px;
    border-radius: 1rem;
    margin: .2rem 0;
}
</style>