<template>
    <!-- 顶部空白 -->
    <div style="width: 100%;height: 2rem; "></div>
    <!-- 显示路由 -->
    <router-view v-if="isRouterAlive"></router-view>
    <musicPlayer :class="{
        musicPlayer: store.state.isPlayerShow,
        musicPlayer_close: !store.state.isPlayerShow
    }" />
    <bottomNav :class="{
        BottomNav: store.state.isBottomNavShow,
        BottomNav_close: !store.state.isBottomNavShow
    }" />
</template>



<script setup>
import store from './store/index.js'
import musicPlayer from './components/musicPlayer.vue'
import { CaretTop, CaretBottom } from '@element-plus/icons-vue';
import bottomNav from './components/bottomNav.vue';
document.addEventListener('plusready', function () {
    let first = null
    let webView = plus.webview.currentWebview()
    plus.key.addEventListener('backbutton', function () {
        webView.canBack(function (e) {
            if (e.canBack) {
                if (store.state.CommentShow === true) {
                    store.commit('updateCommentShow')
                } else if (store.state.detailShow === true) {
                    store.commit('updateDetailShow')
                } else {
                    webView.back();
                }
            }
        })
    })
})
</script>
<script>
/*下面时重新加载本页面的快速方法，在需要的地方inject['reload']，然后调用this.reload()就好*/
export default {
    name: 'app',
    provide() {
        return {
            reload: this.reload
        }
    },
    data() {
        return {
            isRouterAlive: true
        }
    },
    methods: {
        reload() {
            this.isRouterAlive = false
            this.$nextTick(() => {
                this.isRouterAlive = true
            })
        },
    },


}
</script>
<style scoped lang="scss">
.musicPlayer {
    transition: .4s;
}

.musicPlayer_close {
    position: fixed;
    bottom: -6rem;
    transition: .8s;
}

.BottomNav {
    position: fixed;
    bottom: 0;
    transition: .36s;
}

.BottomNav_close {
    position: fixed;
    bottom: -4rem;
    transition: .5s;
}

.AlexOption {
    z-index: 5;
    position: fixed;
    top: 32%;
    right: 2%;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #2c2c2c;
    box-shadow: #2c2c2c 0 0 .5rem;
    transition: .5s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    color: #f9f9f9;
}

.activeAlexOption {
    z-index: 5;
    position: fixed;
    top: 56%;
    right: 2%;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #f9f9f9;
    box-shadow: #f9f9f9 0 0 .5rem;
    transition: .5s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: #2c2c2c;
}

.AlexOptionBar {
    z-index: 4;
    position: fixed;
    top: 32%;
    right: 2%;
    width: 3rem;
    height: 3rem;
    background-color: #f9f9f9;
    box-shadow: #f9f9f9 0 0 .5rem;
    border-top-right-radius: 1.5rem;
    border-top-left-radius: 1.5rem;
    transition: .5s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    color: #2c2c2c;
    opacity: 0;
}

.activeAlexOptionBar {
    opacity: 1;
    z-index: 4;
    position: fixed;
    top: 32%;
    right: 2%;
    width: 3rem;
    height: 30%;
    border-radius: 1.5rem;
    background-color: #2c2c2c;
    box-shadow: #2c2c2c 0 0 .5rem;
    transition: .5s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: #f9f9f9;
}

.reload {
    font-size: 1rem;
    width: 1.8rem;
    height: 4rem;
    background-color: #f9f9f9;
    box-shadow: #f9f9f9 0 0 .5rem;
    border-radius: .9rem;
    text-align: center;
    display: flex;
    align-items: center;
    color: #2c2c2c;
    font-weight: bold;
}

/*!* 进入动画 *!*/
/*.moveCartoon-enter-active {*/
/*  animation: move 1s;*/
/*}*/

/*!* 离开动画 *!*/
/*.moveCartoon-leave-active {*/
/*  !*animation: move 1s;*!*/
/*}*/

/*@keyframes move {*/
/*  from {*/
/*    opacity: 0;*/
/*    !*transform: translateY(-100%);*!*/
/*  }*/
/*  to {*/
/*    opacity: 1;*/
/*    !*transform: translateY(0);*!*/
/*  }*/
/*}*/
</style>
