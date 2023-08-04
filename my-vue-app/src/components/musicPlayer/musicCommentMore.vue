<template>
    <div class="commentMoreArea" id="commentMoreArea" v-if="isLoadingDataFinished === true">
        <div class="commentMoreAreaContent" id="commentMoreAreaContent">
            <el-scrollbar ref="commentsMoreScrollBar" @scroll="loadingCommentsData" :noresize="true">
                <div class="commentMoreAreaContentLayout">
                    <div class="ParentCommentArea">
                        <div class="commentMoreItem_header">
                            <div class="commentMoreItem_header_left">
                                <img :src="commentData.ownerComment.user.avatarUrl" alt="?">
                                <div class="commentMoreItem_header_left_text">
                                    <p class="nickName">{{ commentData.ownerComment.user.nickname }}</p>
                                    <p class="timeStr">{{ commentData.ownerComment.timeStr }}</p>
                                </div>
                            </div>
                            <div class="commentLikedArea">
                                <span class="commentLikedArea_count">{{ commentData.ownerComment.likedCount }}</span>
                                <el-icon>
                                    <Star />
                                </el-icon>
                            </div>
                        </div>
                        <div class="commentMoreItem_body">
                            <div class="commentMoreItem_body_text">
                                <span>{{ commentData.ownerComment.content }}</span>
                            </div>
                        </div>
                        <div class="commentMoreItemTitle"><span>全部回复</span></div>
                    </div>
                    <div class="commentMoreItem" v-for="(item, index) in commentData.comments" :key="index">
                        <div class="commentMoreItem_header">
                            <div class="commentMoreItem_header_left">
                                <img :src="item.user.avatarUrl" alt="?">
                                <div class="commentMoreItem_header_left_text">
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
                        <div class="commentMoreItem_body">
                            <div class="commentMoreItem_body_text" @click="clickReply(item)">
                                <span>{{ item.content }}</span>
                            </div>
                            <div class="commentMoreItem_body_reply" v-for="(item2, index2) in item.beReplied" :key="index2"
                                v-if="item.beReplied[0].beRepliedCommentId !== item.parentCommentId">
                                <div class="replyName"><span>{{ item2.user.nickname + ':' }}</span></div>
                                <div class="replyContent"><span>{{ item2.content }}</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="replyCommentArea">
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
</template>
<script setup>
import { Star, Delete } from '@element-plus/icons-vue'
import { onMounted, ref, watch, defineProps } from 'vue'
import store from '../../store/index.js'
import { ElLoading } from "element-plus";
import $ from 'jquery'
import { dComment, likeOrDislikeThisComment, sComment } from "../../request/api/musicComment.js";
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
let directionMoreComment = ref('btt')
let props = defineProps(['parentCommentId'])
let commentData = ref({})
let isLoadingDataFinished = ref(false)
let commentsMoreScrollBar = ref()
let isTop = ref(true)
let isLoadingComments = ref(false)
let blockInfer = ref(false)
let selectCommentId = ref(0)
let requestData = {
    parentCommentId: props.parentCommentId,
    id: store.state.playList[store.state.playListIndex].id,
    type: 0,
    time: 0,
    limit: 20,
    page: 0,//当前页数
}

const loadingCommentsData = async (scroll) => {
    let sightArea = $('.commentMoreAreaContent')
    let contentArea = $('.el-scrollbar__view')
    let index = (contentArea.length - 1)
    let scrollHeight = contentArea[index].scrollHeight
    let infer = (scrollHeight - scroll.scrollTop) - sightArea[0].scrollHeight
    //异步先初始好值
    let init = function () {
        sightArea = $('.commentMoreAreaContent')
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

    if (infer <= 5 && blockInfer.value === false) {
        isLoadingComments.value = true
        blockInfer.value = true
    }

    if (infer <= 5 && isLoadingComments.value) { //滑动满加载内容
        isLoadingComments.value = false

        const loadingInstance = ElLoading.service({
            target: document.getElementById('commentMoreArea'),
            text: "数据加载中",
            background: "rgba(52,52,52,0.8)",
        })

        requestData.page = requestData.page + 1
        let res = await store.dispatch('getSonComment', requestData)


        if (res.data.data.comments.length > 0) {
            requestData.time = res.data.data.time
            res.data.data.comments.forEach(item => {
                commentData.value.comments.push(item)
            })
            blockInfer.value = false
        } else {
            blockInfer.value = true
            // alert("没有评论了")
            plus.nativeUI.toast("没有评论了", { duration: 'short' })
        }
        loadingInstance.close()
    }
    // console.log(commentData.value.comments.length,infer)
}
//不能很好判断点赞与否，害
const likeOrDislike = async (item) => {
    let t = await item.liked ? 0 : 1
    let res = await likeOrDislikeThisComment(store.state.playList[store.state.playListIndex].id, item.commentId, t, 0, store.state.Cookies)
    await getSonComment()
    console.log(item, t, res)
}
const getSonComment = async () => {
    let res = await store.dispatch('getSonComment', requestData)
    isLoadingDataFinished.value = true
    commentData.value = res.data.data
    requestData.time = res.data.data.time
    // console.log(commentData.value)
    // console.log(requestData.parentCommentId)
    console.log(res.data.data, res.data.data.time, props.parentCommentId)
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
            let res = await sComment(store.state.playList[store.state.playListIndex].id, form.value.comment, 2, 0, store.state.Cookies, props.parentCommentId)
            await getSonComment()
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
    await getSonComment()
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
            await getSonComment()
            console.log(res)
            await loadingInstance.close()
            replyCommentDrawer.value.handleClose();
        } else {
            console.log("不合法输入！")
        }
    })
}
onMounted(() => {
    getSonComment()
})
</script>
<script>
export default {
    name: "musicCommentMore"
}
</script>

<style scoped>
.commentMoreArea {
    font-style: normal;
    /*background-color: #2c2c2c;*/
}

.commentMoreAreaContent {
    width: 100%;
    height: calc(100vh - 8.3rem);
    /*background-color: #2c2c2c;*/
}

.ParentCommentArea {
    width: 100%;
    font-size: .7rem;

}

.commentMoreItemTitle {
    width: 100%;
    height: 2rem;
    /*background-color: #79bbff;*/
    font-size: .8rem;
    color: #2c2c2c;
    padding-left: 1rem;
    font-weight: bold;
}

.commentMoreItem {
    width: 100%;
    border-bottom: rgba(249, 249, 249, 0.1) 1px solid;
    margin: 1rem 0;
    padding-top: 1rem;

}

.commentMoreItem:last-child {
    border-bottom: #f9f9f9 0 solid;
    margin: 0;
}

.commentMoreItem_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 4rem;
    /*background-color: yellow;*/
}

.commentMoreItem_header_left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #2c2c2c;
}

.commentMoreItem_header_left .commentMoreItem_header_left_text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 1rem;
}

.commentMoreItem_header_left .commentMoreItem_header_left_text .nickName {
    font-size: .6rem;
}

.commentMoreItem_header_left .commentMoreItem_header_left_text .timeStr {
    font-size: .6rem;
}

.commentMoreItem_header_left img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    margin-left: 1rem;
}

.commentLikedArea {
    display: flex;
    align-items: center;
    color: #2c2c2c;
}

.commentLikedArea .commentLikedArea_count {
    font-size: .8rem;
}

.commentLikedArea .el-icon {
    font-size: 1.1rem;
    margin: 0 .5rem;
}

.commentMoreItem_body {
    position: relative;
    width: 100%;
    color: #2c2c2c;
}

.commentMoreItem_body .commentMoreItem_body_text {
    width: 100%;
    padding-left: 5rem;
    font-size: .8rem;
}

.commentMoreItem .commentMoreItem_body .commentMoreItem_body_reply {
    border-left: #2c2c2c 1px solid;
    margin: .5rem 5rem;
    padding: 0 1rem;
}

.commentMoreItem .commentMoreItem_body .commentMoreItem_body_reply .replyName {
    font-style: italic;
    font-size: .8rem;
    color: #79bbff;
}

.commentMoreItem .commentMoreItem_body .commentMoreItem_body_reply .replyContent {
    font-size: .8rem;
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

.replyCommentArea>>>.el-overlay {
    background-color: rgba(253, 253, 253, 0);
}

.replyCommentArea>>>.el-drawer.btt,
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