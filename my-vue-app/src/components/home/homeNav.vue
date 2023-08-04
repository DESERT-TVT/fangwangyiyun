<template>
    <div class="navMenu">
        <el-scrollbar height="100%">
            <div class="navMenuTop">
                <div class="userHead" @click="$router.push('/userInfo')">
                    <img :src=store.state.userInfos.avatarUrl alt="用户头像">
                    <div v-if="store.state.userInfos.gender == 0" style="color: #010101">未设置性别</div>
                    <div v-if="store.state.userInfos.gender == 1" style="color: #010101"><svg t="1690877731332" class="icon"
                            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2491" width="20"
                            height="20">
                            <path
                                d="M394.927119 361.941356c-65.98176 0-128.025838 25.692149-174.679391 72.346725-96.296183 96.311533-96.296183 253.015527 0.01535 349.310687 46.653553 46.654576 108.682281 72.332399 174.647669 72.332399 65.965387 0 127.994116-25.693172 174.664042-72.346725 96.29516-96.296183 96.29516-252.984828 0-349.295338C522.936585 387.634528 460.90888 361.941356 394.927119 361.941356zM535.774985 749.783615c-37.627992 37.627992-87.658456 58.341756-140.863215 58.341756-53.204759 0-103.220896-20.712741-140.847865-58.325383-77.667917-77.667917-77.667917-204.043163-0.016373-281.712103 37.627992-37.619806 87.659479-58.33971 140.879588-58.33971 53.204759 0 103.219873 20.719904 140.847865 58.33971C613.427552 545.755802 613.427552 672.131047 535.774985 749.783615z"
                                p-id="2492"></path>
                            <path
                                d="M868.171444 135.676076c-4.482081-4.481058-10.565636-7.002484-16.899902-7.002484l-329.066621 0.01535c-13.196557 0-23.902386 10.706853-23.902386 23.902386 0 13.20372 10.706853 23.902386 23.902386 23.902386l305.164235-0.016373 0 305.179584c0 13.204743 10.705829 23.902386 23.902386 23.902386 13.196557 0 23.902386-10.698666 23.902386-23.902386L875.173928 152.575977C875.174951 146.234549 872.653525 140.158157 868.171444 135.676076z"
                                p-id="2493"></path>
                        </svg></div>
                    <div v-if="store.state.userInfos.gender == 2" style="color: #010101"><svg t="1690877688161" class="icon"
                            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2350" width="20"
                            height="20">
                            <path
                                d="M519.658935 673.068396c81.129762 0 157.397796-31.572066 214.762295-88.937588 118.423133-118.421087 118.423133-311.085084 0-429.507194C677.057755 97.259114 600.788697 65.668629 519.658935 65.668629c-81.128739 0-157.39882 31.590486-214.744899 88.954985-118.402667 118.42211-118.402667 311.086108 0 429.507194C362.279558 641.496329 438.548616 673.068396 519.658935 673.068396zM346.474594 196.183148c46.267766-46.266743 107.764376-71.734788 173.184341-71.734788 65.419965 0 126.937041 25.468045 173.203784 71.734788 95.499028 95.500051 95.499028 250.889097 0 346.389148-46.266743 46.245254-107.765399 71.713298-173.203784 71.713298-65.420989 0-126.916575-25.468045-173.184341-71.713298C250.995009 447.072245 250.995009 291.682175 346.474594 196.183148z"
                                p-id="2351"></path>
                            <path
                                d="M793.986861 800.462854 549.061592 800.462854l0.008186-71.2743c0-16.22452-13.164834-29.389354-29.391401-29.389354s-29.389354 13.163811-29.389354 29.389354l-0.007163 71.2743L245.349429 800.462854c-16.225543 0-29.389354 13.163811-29.389354 29.390377s13.163811 29.392424 29.389354 29.392424l244.925269 0-0.00614 71.236438c0 16.22452 13.163811 29.389354 29.390377 29.389354s29.391401-13.163811 29.391401-29.389354l0.007163-71.236438L793.986861 859.245655c16.225543 0 29.391401-13.165858 29.391401-29.392424S810.213427 800.462854 793.986861 800.462854z"
                                p-id="2352"></path>
                        </svg></div>
                </div>
                <div class="userInfos">
                    <div class="userName">{{ store.state.userInfos.nickname }}</div>

                </div>
            </div>
            <div class="navMenuCard1">
                <div class="cardTitle">
                    <span>个人服务</span>
                </div>
                <div class="cardContent">
                    <el-scrollbar height="17.5rem">
                        <ul>
                            <li><el-icon>
                                    <Message />
                                </el-icon><span>我的消息</span></li>
                            <li><el-icon>
                                    <MostlyCloudy />
                                </el-icon><span>云中心</span></li>
                            <li><el-icon>
                                    <Avatar />
                                </el-icon><span>创作者中心</span></li>
                            <li><el-icon>
                                    <ForkSpoon />
                                </el-icon><span>饮食中心</span></li>
                            <li><el-icon>
                                    <ShoppingCart />
                                </el-icon><span>商城</span></li>
                            <li><el-icon>
                                    <Pouring />
                                </el-icon><span>天气</span></li>
                            <li><el-icon>
                                    <Setting />
                                </el-icon><span>设置</span></li>
                            <li><el-icon>
                                    <Clock />
                                </el-icon><span>定时关机</span></li>
                            <li><el-icon>
                                    <CircleClose />
                                </el-icon><span>我的消息</span></li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
            <div class="navExit">
                <el-button class="navExitButton" @click="drawer = true">关闭侧栏/退出程序</el-button>
                <el-drawer ref="elDrawer" v-model="drawer" title="关闭侧栏/退出程序" :direction="direction">
                    <div class="closeNav" tabindex="0" @click="closeNav">
                        <el-icon>
                            <Back />
                        </el-icon>
                        <span>关闭侧栏</span>
                    </div>
                    <div class="exit" tabindex="0" @click="logout">
                        <el-icon>
                            <CloseBold />
                        </el-icon>
                        <span>退出登录</span>
                    </div>
                </el-drawer>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'
import { Message, MostlyCloudy, Avatar, ForkSpoon, ShoppingCart, Pouring, Setting, Clock, CircleClose, CloseBold, Back } from '@element-plus/icons-vue'
const router = useRouter()
// drawer
const drawer = ref(false)
const direction = ref('btt')
</script>
<script>
import store from "../../store/index.js";
import { getLogout } from "../../request/api/home.js";

export default {
    name: "homeNav",
    methods: {
        closeNav() {
            //给外层抽屉发送关闭请求信息
            this.$emit('navMsg', true)
            this.$refs.elDrawer.handleClose()
        },
        logout: async function () {
            store.commit('deleteIsLogin')
            store.commit('deleteToken')
            store.commit('deleteUserInfos')
            store.commit('deleteUserMusicList')
            store.commit('deleteCookies')
            store.commit('deleteUserFavoriteMusicList')
            store.commit('deleteUserFavoriteMusicListId')
            store.commit('deleteUserFavoriteSongList')
            let res = await getLogout()
            this.closeNav()
            this.$router.push('/')
        }
    }
}
</script>
<style lang="scss">
.navMenu {
    z-index: 100;
    position: absolute;
    border-top-right-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
    /*box-shadow: #545454 .1rem 0 .5rem;*/
    width: 20rem;
    height: 100%;
    background-color: #f3f4f6;
    left: 0;
    transition: .5s;
}

.active.navMenu {
    opacity: 1;
    z-index: 12;
    left: 0;
}

.navMenu .navMenuTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem auto;
    width: 90%;
    height: 10rem;
    border-radius: 1.5rem;
    box-shadow: #fdfdfd 0 0 .2rem;
    background-color: #fdfdfd;
}

.navMenu .navMenuTop .userHead {
    text-align: center;
    padding-top: 1.6rem;
    height: 100%;
    width: 8rem;
    /*background-color: #646cff;*/
}

.navMenu .navMenuTop .userHead img {
    margin: 0 auto;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
}

.navMenu .navMenuTop .userHead .userName {
    margin-top: .5rem;
    color: #2c2c2c;
    font-weight: bold;
    font-size: .8rem;
}

.navMenu .navMenuTop .userInfos {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12rem;
    height: 100%;
    color: #2c2c2c;
    font-size: .8rem;
    /*background-color: #c45656;*/
}

.navMenu .navMenuCard1,
.navMenu .navMenuCard2 {
    margin: 1rem auto;

    width: 90%;
    height: 20rem;
    border-radius: 1.5rem;
    box-shadow: #fdfdfd 0 0 .8rem;
    background-color: #fdfdfd;
}

.navMenu .navMenuCard1 .cardTitle,
.navMenu .navMenuCard2 .cardTitle {
    padding-left: .8rem;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    border-bottom: rgba(114, 105, 105, 0.3) solid 1px;
    font-size: .7rem;
    color: #2c2c2c;
}

.navMenu .navMenuCard1 .cardContent,
.navMenu .navMenuCard2 .cardContent {
    width: 100%;
    height: 17.5rem;
    color: #2c2c2c;
}


.navMenu .navMenuCard1 .cardContent li,
.navMenu .navMenuCard2 .cardContent li {
    display: flex;
    align-items: center;
    margin-top: .8rem;
    padding-left: .8rem;
    width: 100%;
    height: 2.5rem;
    transition: background-color .3s;
}

.navMenu .navMenuCard1 .cardContent li:nth-child(1),
.navMenu .navMenuCard2 .cardContent li:nth-child(1) {
    margin-top: 0;
}

.navMenu .navMenuCard1 .cardContent li:last-child,
.navMenu .navMenuCard2 .cardContent li:last-child {
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
}

.navMenu .navMenuCard1 .cardContent li .el-icon,
.navMenu .navMenuCard2 .cardContent li .el-icon {
    font-size: 1.5rem;
}

.navMenu .navMenuCard1 .cardContent li span,
.navMenu .navMenuCard2 .cardContent li span {
    padding-left: .8rem;
    font-size: .8rem;
}

.navMenu .navMenuCard1 .cardContent li:hover,
.navMenu .navMenuCard2 .cardContent li:hover {
    /*background-color: #1c1c1c;*/
    color: #f56c6c;
}


/**************************底部抽屉按钮样式**********************/
.navMenu .navExit {
    margin: 0 auto;
    width: 50%;
    height: 3rem;
}

.navMenu .navExit .navExitButton.el-button {
    background-color: #f56c6c;
    color: #f9f9f9;
    border: #f9f9f9 solid 0;
    border-radius: 1rem;
    height: 2.5rem;
}

.navMenu .navExit .navExitButton.el-button:hover {
    background-color: #1c1c1c;
}

.navMenu .navExit .el-drawer {
    border-top-right-radius: 1.5rem;
    border-top-left-radius: 1.5rem;
    border-bottom-right-radius: 0;
    color: #2c2c2c;
    background-color: #FDFDFDFF;
}

.navMenu .navExit .el-drawer__header {
    height: 3.5rem;
    margin: 0;
    padding-bottom: 1rem;
    color: #2c2c2c;
    border-bottom: rgba(249, 249, 249, 1) solid 1px;
}

.navMenu .navExit .el-drawer__title {
    font-size: .8rem;
}

.navMenu .navExit .el-drawer__close-btn {
    font-size: 1rem;
}

.navMenu .navExit .el-drawer__body {
    padding: 0;
}

.navMenu .closeNav,
.navMenu .exit {
    display: flex;
    align-items: center;
    padding: 1rem 1.2rem;
    width: 100%;
    height: 5rem;
    line-height: 3rem;
    transition: background-color .3s;
    font-size: 1.5rem;
}

.navMenu .closeNav span,
.navMenu .exit span {
    margin-left: .8rem;
    font-size: 1.2rem;
}

.navMenu .closeNav:hover,
.navMenu .exit:hover {
    background-color: #e0e0e0;
}

.navMenu .exit:hover .el-icon {
    color: red;
}
</style>