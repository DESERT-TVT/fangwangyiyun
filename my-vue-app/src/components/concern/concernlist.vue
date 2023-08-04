<template>
    <div>
        <el-scrollbar>
            <div class="scrollbar-flex-content">
                <div v-for="(item, index) in  store.state.userInfos.follows" :key="index" class="scrollbar-demo-item">
                    <img :src="item.avatarUrl" style="width: 3rem;height: 3rem;border-radius: 50%;" />
                    <span>{{ item.nickname }}</span>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup>
import store from "../../store/index.js";

</script>

<style lang="scss" scoped>
.scrollbar-flex-content {
    display: flex;
    background-color: #f5f5f5;
}

.scrollbar-demo-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 5rem;
    height: 5rem;
    text-align: center;
    border-radius: 50%;

    span {
        margin-top: 0.3rem;
        font-size: .2rem;
        color: #aaaaaa;
        // flex-wrap: nowrap;
        white-space: nowrap;
    }
}
</style>