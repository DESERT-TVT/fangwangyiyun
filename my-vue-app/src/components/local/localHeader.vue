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
                <HomeNav @navMsg="getNavMsg" />
            </el-drawer>
        </div>
        <!--    搜索-->
        <div class="musicSearch" @click="$router.push('/songResults')">
            <el-icon>
                <Search />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Search, Expand } from '@element-plus/icons-vue';
import HomeNav from '../home/homeNav.vue';

let drawer = ref(false)
const direction = ref('ltr')
</script>
<script>
import $ from "jquery";

export default {
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
            $('.navMenu').toggleClass("active")
            this.$refs.elDrawer.handleClose()
        },
        getNavMsg(e) {
            // console.log(e)
            this.flag = e
        }
    }
}
</script>

<style scoped>
/******************************头部样式******************************/
.header {
    position: absolute;

    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: .4rem;
    width: 100%;
    height: 3rem;
    /*background-color: #343434;*/
}

/******************侧导航栏按钮样式******************/
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

.header>.nav:deep(.el-icon) {
    font-size: 1.5rem;
    color: #000000;
}

.header drawerNav:deep(.el-overlay) {
    background-color: rgba(0, 0, 0, 0);
}

.header:deep(.el-drawer__body) {
    padding: 0;
}

.header:deep(.el-drawer) {
    border-top-right-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
    background-color: rgba(7, 7, 7, 0);
    box-shadow: #545454 .1rem 0 .5rem;
}

/******************听歌识曲样式******************/
.header>.musicSearch {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 50%;
    background-color: #fdfdfe;
    margin-right: .2rem;
}

.header>.musicSearch:deep(.el-icon) {
    font-size: 1.5rem;
    color: #000000;
}
</style>