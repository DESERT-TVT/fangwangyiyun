<template>
    <div class="userInfosContentArea"
        v-if="store.state.userMusicList.length > 0 && store.state.Cookies !== '' && store.state.Cookies !== undefined">
        <el-scrollbar>
            <div class="headerInfos">
                <div class="userHeadPic">
                    <img :src=store.state.userInfos.avatarUrl alt="?">
                </div>
                <div class="headerInfosWrapper">
                    <span class="userName">{{ store.state.userInfos.nickname }}</span>
                    <div class="tip">
                        <ul>
                            <li><span>{{ store.state.userInfos.follows.length + '关注' }}</span></li>
                            <li><span>{{ store.state.userInfos.followeds.length + '粉丝' }}</span></li>
                            <li><span>{{ 'Lv' + store.state.userInfos.level }}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="favoriteMusic">
                <div class="favoriteMusic_left" @click="gotoMusicListFavorite(store.state.userFavoriteMusicListId)">
                    <div class="icon_favorite">
                        <img :src="store.state.userFavoriteMusicList.coverImgUrl" alt="?">
                    </div>
                    <div class="favoriteMusic_text">
                        <p>{{ store.state.userFavoriteMusicList.name }}</p>
                        <p>{{ store.state.userFavoriteMusicList.trackCount + '首' }}</p>
                    </div>
                </div>
                <div class="favoriteMusic_right"></div>
            </div>
            <div class="myMusicList" id="myMusicList">
                <div class="myMusicList_title">
                    <div class="myMusicList_title_left">
                        <span>创建歌单(1个)</span>
                    </div>
                    <div class="myMusicList_title_right">
                        <el-icon @click="addMusicListButton">
                            <Plus />
                        </el-icon>
                        <el-icon @click="delMusicListButton">
                            <Delete />
                        </el-icon>
                    </div>
                </div>
                <el-scrollbar>
                    <div class="myMusicListLayout">
                        <div v-for="(item, index) in store.state.userMusicList" class="myMusicListItem">
                            <div class="myMusicListItem_left" @click="goToMusicList(item.id)">
                                <div class="myMusicList_img">
                                    <img :src="item.coverImgUrl" alt="?">
                                </div>
                                <div class="myMusicList_text">
                                    <p>{{ item.name }}</p>
                                    <p>{{ item.trackCount + '首' }}</p>
                                </div>
                            </div>
                            <div class="myMusicListItem_right">

                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>

        </el-scrollbar>
        <el-drawer v-model="addMusicList" ref="addMusicListArea" title="标题" :with-header="false" :direction="direction"
            size="25%">
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
        <el-drawer v-model="delMusicList" ref="delMusicListArea" title="标题" :with-header="false" :direction="direction"
            size="40%" :destroy-on-close="true">
            <el-scrollbar>
                <div class="myMusicListLayout">
                    <div v-for="(item, index) in store.state.userMusicList" class="myMusicListItem">
                        <div class="myMusicListItem_left">
                            <div class="myMusicList_img">
                                <img :src="item.coverImgUrl" alt="?">
                            </div>
                            <div class="myMusicList_text">
                                <p>{{ item.name }}</p>
                                <p>{{ item.trackCount + '首' }}</p>
                            </div>
                        </div>
                        <div class="myMusicListItem_right">
                            <el-icon @click="delMusicListFun(item.id)">
                                <Delete />
                            </el-icon>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </el-drawer>
    </div>
    <div style="display: flex;align-items: center;justify-content: center;height: calc(100vh - 13rem);width: 100%" v-else>
        不登录你想看什么？
    </div>
</template>

<script setup>
import { Plus, Delete } from '@element-plus/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from "vue-router";
import { addMusicToList, createMusicList, deleteMusicList } from "../../request/api/userMusicList.js";
import { ElLoading } from "element-plus";
import store from "../../store/index.js";

const router = useRouter()
let addMusicList = ref(false)
let addMusicListArea = ref()
let delMusicList = ref(false)
let delMusicListArea = ref()
let direction = ref('btt')
let form = ref({})
let formRef = ref()
let rules = ref({
    name: [
        { required: true, message: '请输入歌单名', trigger: 'blur' },
    ],
})
const gotoMusicListFavorite = (id) => {
    router.push({ path: '/userMusicListFavorite', query: { id: id } })
}
const goToMusicList = (id) => {
    router.push({ path: '/userMusicList', query: { id: id } })
}
const addMusicListButton = () => {
    addMusicList.value = true
}
const delMusicListButton = () => {
    delMusicList.value = true
}
const delMusicListFun = async (id) => {
    const loadingInstance = ElLoading.service({
        target: document.getElementById('myMusicList'),
        text: "正在删除歌单",
        background: "rgba(231,231,231,0.35)",
    })
    let res = await deleteMusicList(id, store.state.Cookies)
    console.log(res)
    if (res.code === 200) {
        console.log("删除成功")
        await store.dispatch('getUserMusicList', store.state.userInfos.id)
        loadingInstance.close()
    } else {
        console.log("系统故障？")
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
            if (res.code === 200) {  //登录成功
                //获取用户歌单信息
                await store.dispatch('getUserMusicList', store.state.userInfos.id)
                loadingInstance.close()
                addMusicListArea.value.handleClose()
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
import { ElLoading } from "element-plus";
import { createMusicList } from "../../request/api/userMusicList.js";

export default {
    name: "localContent",
}
</script>

<style scoped>
.userInfosContentArea:deep(.el-scrollbar__bar.is-horizontal) {
    height: 0;
}

.userInfosContentArea:deep(.el-scrollbar__bar.is-vertical) {
    width: 0;
}

.userInfosContentArea:deep(.el-drawer__body) {
    padding: 0;
}

.userInfosContentArea:deep(.el-drawer) {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}

.userHeadPic img {

    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
}

.userInfosContentArea .headerInfos {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2.5rem auto 1rem;
    width: 90%;
    height: 7rem;
    background-color: #fdfdfd;
    border-radius: 1.2rem;

}

.userInfosContentArea .headerInfos .headerInfosWrapper {
    text-align: center;
}

.userInfosContentArea .headerInfos .headerInfosWrapper .userName {
    color: #2c2c2c;
    font-size: 1.2rem;
    font-weight: bold;
}

.userInfosContentArea .headerInfos .headerInfosWrapper .tip {
    color: #959595;
    font-size: .5rem;
}

.userInfosContentArea .headerInfos .headerInfosWrapper .tip ul {
    display: flex;
    justify-content: center;
    align-items: center;
}

.userInfosContentArea .headerInfos .headerInfosWrapper .tip li {
    margin-right: .8rem;
}

/*我喜欢的音乐*/
.userInfosContentArea .favoriteMusic {
    margin: 3rem auto 1rem;
    width: 90%;
    height: 5rem;
    background-color: #fdfdfd;
    border-radius: 1rem;
}

.userInfosContentArea .favoriteMusic .favoriteMusic_left {
    height: 100%;
    display: flex;
    /*justify-content: center;*/
    align-items: center;
}

.icon_favorite {
    margin-left: .5rem;
    height: 4rem;
    width: 4rem;
    /*background-color: #2c2c2c;*/
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon_favorite img {
    height: 4rem;
    width: 4rem;
    border-radius: 1rem;
}

.favoriteMusic_text {
    margin-left: .5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    /*text-align: center;*/
    /*align-items: center;*/
    justify-content: center;
    /*justify-content: center;*/
    /*align-items: center;*/
}

/*我的歌单*/
.userInfosContentArea .myMusicList {
    margin: 1rem auto;
    width: 90%;
    height: 16rem;

    border-radius: 1rem;

}

.myMusicListLayout {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fdfdfd;
    padding: .5rem 0;
    border-radius: 1rem;
}

.myMusicList_title {
    width: 100%;
    height: 2rem;
    /*background-color: #535bf2;*/
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #6c6c6c;
}

.myMusicList_title span {
    margin-left: .5rem;
}

.myMusicList_title .el-icon {
    margin-right: 1rem;
}

.myMusicListItem {
    width: 100%;
    height: 5rem;
    /*background-color: #535bf2;*/
    /*padding-left: .5rem;*/
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.myMusicListItem_left {
    height: 100%;
    display: flex;
    /*justify-content: center;*/
    align-items: center;
}

.myMusicListItem_right {
    display: flex;
    align-items: center;
    height: 100%;
    width: 2.5rem;
    color: #f56c6c;
    margin-right: .5rem;
    justify-content: center;

}

.myMusicList_img {
    margin-left: .5rem;
    height: 4rem;
    width: 4rem;
    /*background-color: #2c2c2c;*/
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.myMusicList_img img {
    width: 4rem;
    height: 4rem;
    border-radius: 1rem;
}

.myMusicList_text {
    color: #2c2c2c;
    margin-left: .5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    /*text-align: center;*/
    /*align-items: center;*/
    justify-content: center;
    /*justify-content: center;*/
    /*align-items: center;*/
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
</style>