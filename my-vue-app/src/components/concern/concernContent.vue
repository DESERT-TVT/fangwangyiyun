<template>
    <div class="box">
        <div class="box-top">
            <div class="title">
                我的关注
            </div>
            <div class="selection">
                <div class="btn" :class="{ active: itemIndex === 1 }" @click="btnClick(1)">
                    全部
                </div>
                <div class="btn" :class="{ active: itemIndex === 2 }" @click="btnClick(2)">
                    音乐人
                </div>
                <div class="btn" :class="{ active: itemIndex === 3 }" @click="btnClick(3)">
                    朋友
                </div>
            </div>
        </div>
        <div class="content">
            <div v-if="itemIndex == 1">我是苹果</div>
            <div v-if="itemIndex == 2">我是杨桃</div>
            <div v-if="itemIndex == 3">我是杨梅</div>
        </div>
    </div>
</template>

<script setup>

</script>
<script>
export default {
    data() {
        return {
            itemIndex: 1
        }
    },
    methods: {
        btnClick(index) {
            this.itemIndex = index
        }
    }
}
</script>
<style lang="scss" scoped>
.box {
    border-top: 1px solid #d4d4d4;
    display: flex;
    // justify-self: center;
    align-items: center;
    flex-direction: column;

    .box-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 95%;
        height: 2rem;
        // background-color: aqua;
        font-size: 0.8rem;
        font-weight: 700;
        line-height: 2rem;

        .title {
            color: #3b3b3b;
            letter-spacing: 0.1rem;
        }

        .selection {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #a2a2a2;

            .btn {
                margin: 0 .4rem;
                font-size: 0.5rem;
            }

            .active {
                color: #3b3b3b;
            }
        }
    }
}
</style>