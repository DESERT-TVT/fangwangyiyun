<template>
    <!--  头部-->
    <div class="header">
        <!--    侧栏-->
        <div class="nav">
            <el-icon @click="drawer = true">
                <Expand />
            </el-icon>
        </div>
        <div class="drawerNav">
            <el-drawer ref="elDrawer" v-model="drawer" :with-header="false" :direction="direction" size="20rem">
                <homeNav @navMsg="getNavMsg" />
            </el-drawer>
        </div>
        <!--    搜索栏-->
        <div class="search">
            <el-input clearable class="w-50 m-2" placeholder="搜索你喜欢的歌曲吧" :prefix-icon="Search" @focus="Focus" />
        </div>
        <!--    听歌识曲-->
        <div class="musicRecognition">
            <el-icon>
                <Microphone />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import homeNav from './home/homeNav.vue'
import { ref } from 'vue'
import { Search, Microphone, Expand } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
//el-drawer 模板
const router = useRouter()
const drawer = ref(false)
const direction = ref('ltr')

const Focus = () => {
    let currentPath = router.currentRoute._value.fullPath
    // console.log(currentPath)
    if (currentPath != '/songResults') {
        router.push('/songResults')
        // console.log('跳轉')
    }
    // console.log('搜索框選中')

}

</script>

<script>
import $ from "jquery";
export default {
    name: "Header",
    data() {
        return {
            flag: false
        }
    },
    watch: {
        flag: {
            deep: true,
            immediate: true,
            handler(newValue, oldValue) {
                if (newValue == true) {
                    this.$refs.elDrawer.handleClose()
                    this.flag = false
                } else {

                }
            }
        }
    },
    methods: {
        //用于点击侧栏选项时，同步关闭侧栏的功能！勿删！
        closeNav() {
            // $('.navMenu').toggleClass("active")
            this.$refs.elDrawer.handleClose()
        },
        getNavMsg(e) {
            console.log(e)
            this.flag = e
        }
    }
}
</script>
<style lang="scss">
.header {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: .4rem;
    width: 100%;
    height: 3rem;

}

.header>.nav {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    width: 2.5rem;
    background-color: #fdfdfe;
    border-radius: 50%;
    margin-left: .2rem;
}

.header>.nav .el-icon {
    font-size: 1.5rem;
    color: #000000;

}

.header>.drawerNav .el-overlay {
    background-color: rgba(0, 0, 0, 0);
}

.header .el-drawer__body {
    padding: 0;
}

.header .el-drawer {
    border-top-right-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
    background-color: rgba(7, 7, 7, 0);
    box-shadow: #545454 .1rem 0 .5rem;
}

// 搜索框样式
.header>.search {
    height: 100%;
    width: 75%;
}

.header .el-input {
    height: 2.6rem;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
}

.header .el-input__wrapper {
    border-radius: 30px;
}

.header .el-input .el-input__icon {
    color: #f56c6c;
    font-size: 1.2rem;
}

/******************听歌识曲样式******************/
.header>.musicRecognition {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 50%;
    background-color: #fdfdfe;
    margin-right: .2rem;
}

.header>.musicRecognition .el-icon {
    font-size: 1.5rem;
    color: #000000;
}
</style>