<template>
    <!--  头部-->
    <div class="header">
        <!--    返回按钮-->
        <div class="backButton" id="backButton">
            <el-icon @click="$router.go(-1)">
                <Back />
            </el-icon>
        </div>
        <span>歌手</span>
    </div>
    <div className="headerV" style="width: 100%;height: 4rem;"></div>
    <div class="category">
        <div class="categoryArea">
            <el-radio-group v-model="radio1" size="small" @change="getRadio1Data">
                <el-radio-button label="7">华语</el-radio-button>
                <el-radio-button label="96">欧美</el-radio-button>
                <el-radio-button label="8">日本</el-radio-button>
                <el-radio-button label="16">韩国</el-radio-button>
                <el-radio-button label="0">其他</el-radio-button>
            </el-radio-group>
        </div>
        <div class="categoryOther">
            <el-radio-group v-model="radio2" size="small" @change="getRadio2Data">
                <el-radio-button label="1">男</el-radio-button>
                <el-radio-button label="2">女</el-radio-button>
                <el-radio-button label="3">乐队/组合</el-radio-button>
            </el-radio-group>
        </div>
    </div>
</template>

<script setup>
import { Back } from '@element-plus/icons-vue'
import { getHotArtists, getArtistsCategory } from '../../request/api/songArtists.js'
import { onMounted, ref, reactive, defineEmits } from "vue";

const emit = defineEmits(['HotArtists'])

let radio1 = ref('')
let radio2 = ref('')



//点击radio按钮返回选中值
const getRadio1Data = (e) => {//area
    ArtistsCategoryData.area = e
    ArtistsCategory()
    // console.log(e)
}
const getRadio2Data = (e) => {//type
    ArtistsCategoryData.type = e
    ArtistsCategory()
    // console.log(e)
}
//点击分类，获取数据
let ArtistsCategoryData = reactive({
    type: -1,
    area: -1,
    initial: ''
})
const ArtistsCategory = async () => {
    let res = await getArtistsCategory(ArtistsCategoryData)
    let tempData = ref([])
    tempData.value = res.artists
    emit('HotArtists', tempData)
    // console.log(tempData)
}


//获得热门歌手数据
let HotArtistsData = ref([])
const HotArtists = async () => {
    let res = await getHotArtists()
    // console.log(res)
    HotArtistsData.value = res.artists
    emit('HotArtists', HotArtistsData)
    // console.log(HotArtistsData.value)
}



onMounted(() => {
    HotArtists()
})
</script>

<style scoped>
.header {
    position: absolute;
    display: flex;
    align-items: center;
    /*justify-content: space-between;*/
    margin-top: .4rem;
    width: 100%;
    height: 3rem;
    background-color: #f3f4f6;
}

/******************返回按钮样式******************/
.header>.backButton {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    width: 2.5rem;
    background-color: #fdfdfe;
    border-radius: 50%;
    margin-left: .2rem;
}

.header>.backButton .el-icon {
    font-size: 1.5rem;
    color: #2c2c2c;
}

.header>span {
    margin-left: 1rem;
    color: #2c2c2c;
    font-size: 1.2rem;
}

/******************歌手分类样式******************/
.category {
    padding: 1rem 0;
    width: 100%;
    height: 8rem;
}

.category .categoryArea {
    display: flex;
    width: 100%;
    height: 3rem;
}

.category .categoryOther {
    display: flex;
    width: 100%;
    height: 3rem;
}

.category .el-radio-button__inner {
    display: inline;
    background-color: #fdfdfd;
    color: #2c2c2c;
    border: #2c2c2c solid 0;
    border-radius: 1rem;
}

.category .el-radio-button__original-radio {
    position: relative;
}

.category .el-radio-button__original-radio:checked+.el-radio-button__inner {
    color: #fdfdfd;
    background-color: #f56c6c;
    box-shadow: #f56c6c 0 .1rem .3rem !important;
}</style>