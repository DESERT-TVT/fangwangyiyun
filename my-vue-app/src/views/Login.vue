<template>
    <span class="Test" @click="test">立即体验</span>
    <div class="formo">
        <img src="../assets/img/logo.png" alt="" class="icon">
        <div class="box" v-if="Loginstates === 'huoqu'">
            <button class="btn" @click="qrLogin">获取二维码</button>
        </div>
        <div class="box" v-if="Loginstates === 'qr'">
            <img id="qrimg">
            <div id="qrStatus">二维码状态</div>
            <button class="back" @click="changeLogin">重新获取</button>
        </div>

    </div>
</template>
<script setup>
import store from '../store/index.js'
import { useRouter } from "vue-router/dist/vue-router"
import { getQrKey, getLoginStatus, getQr, checkQr } from "../request/api/login"
import { ref } from "vue";
let qrkey
let timer
store.commit('updateIsPlayerShow', false)
store.commit('updateIsBottomNavShow', false)
const router = useRouter()
let Loginstates = ref("huoqu")
const qrLogin = async () => {
    Loginstates.value = 'qr'
    let res = await getQrKey()
    qrkey = res.data.unikey
    let res2 = await getQr(qrkey)
    document.querySelector("#qrimg").src = res2.data.qrimg
    timer = setInterval(async () => {
        let qrStatus = await checkQr(qrkey)
        if (qrStatus.code === 800) {
            // message:"二维码不存在或已过期"
            clearInterval(timer)
        }
        else if (qrStatus.code === 801) {
            document.querySelector('#qrStatus').innerText = '等待扫码'
        }
        else if (qrStatus.code === 802) {
            // message:"授权中"
            // nickname:"XXX"
            document.querySelector('#qrStatus').innerText = '等待确定'
        }
        else if (qrStatus.code === 803) {
            // message :"授权登陆成功"
            clearInterval(timer)
            document.querySelector('#qrStatus').innerText = '登陆成功'
            // // console.log(qrStatus.cookie);
            store.commit('updateToken', res.token)
            store.commit('updateCookies', qrStatus.cookie)
            store.commit('updateIsLogin', true)
            let info = await getLoginStatus(qrStatus.cookie)
            store.commit('updateUserInfos', info.data.profile)
            await router.push('/home')
        }
    }, 3000)
}
const changeLogin = () => {
    Loginstates.value = 'huoqu'
    clearInterval(timer)
}
const test = () => {
    router.push('/home')
}
</script>

<style lang="scss" scoped>
.Test {
    position: absolute;
    right: .8rem;
    color: #d3d7da;
    font-size: .8rem;
    font-weight: 500;
}

.formo {
    width: 100vw;
    height: calc(100vh - 2rem);
    background-color: #fefefe;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .icon {
        position: relative;
        top: -6rem;
    }
}

.box {
    height: 6rem;
    // width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .btn {
        font-size: 1rem;
        width: 15rem;
        height: 2.4rem;
        background-color: #fe3a3b;
        border: none;
        color: #fcedeb;
        border-radius: 1.2rem;
    }




}

#qrStatus {
    font-size: 8px;
    color: #d0d0d0;
}

.back {
    font-size: 1rem;
    width: 10rem;
    height: 2.4rem;
    background-color: #fe3a3b;
    border: none;
    color: #fcedeb;
    border-radius: 1.2rem;
}
</style>