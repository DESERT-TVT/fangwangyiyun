<template>
    <div class="bottomNavArea">
        <div :class="{
            finding: !isFindingClicked,
            finding_clicked: isFindingClicked
        }" @click="findingCssChange">
            <el-icon>
                <Headset />
            </el-icon>
            <div><span>发现</span></div>
        </div>
        <div :class="{
            my: !isMyClicked,
            my_clicked: isMyClicked
        }" @click="myCssChange">
            <el-icon>
                <User />
            </el-icon>
            <div><span>我的</span></div>
        </div>
        <div :class="{
            interest: !isInterestClicked,
            interest_clicked: isInterestClicked
        }" @click="interestCssChange">
            <el-icon>
                <BellFilled />
            </el-icon>
            <div><span>关注</span></div>
        </div>
    </div>
</template>

<script setup>
import { User, BellFilled, Headset } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from "vue-router";
let router = useRouter()

let isFindingClicked = ref(false)
let isMyClicked = ref(false)
let isInterestClicked = ref(false)
const findingCssChange = () => {
    isFindingClicked.value = true
    isMyClicked.value = false
    isInterestClicked.value = false
    router.push('/home')
}
const myCssChange = () => {
    isFindingClicked.value = false
    isMyClicked.value = true
    isInterestClicked.value = false
    router.push('/local')
}
const interestCssChange = () => {
    isFindingClicked.value = false
    isMyClicked.value = false
    isInterestClicked.value = true
    router.push('/concern')
}
</script>
<script>

export default {

}
</script>

<style scoped>
.bottomNavArea {
    z-index: 2;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3rem;
    background-color: #fdfdfe;
    box-shadow: #fdfdfe 0 0 .5rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #2c2c2c;
    font-size: .8rem;
    padding-bottom: .5rem;
}

.bottomNavArea:deep(.el-icon) {
    font-size: 1.5rem;
}

.bottomNavArea .finding,
.bottomNavArea .my,
.bottomNavArea .interest {
    height: 2.5rem;
    width: 2.5rem;
    text-align: center;
}

.bottomNavArea .finding_clicked,
.bottomNavArea .my_clicked,
.bottomNavArea .interest_clicked {
    height: 2.5rem;
    width: 2.5rem;
    text-align: center;
    /*border-radius: 50%;*/
    color: red;
}
</style>