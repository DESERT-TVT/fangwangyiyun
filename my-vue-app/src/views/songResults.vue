<template>
    <div className="main">
        <HeaderTop @musicInfos="search" @inputSearch="inputSearchWord" @searchHotWord="hot" :searchWord="data3.searchWord"
            ref="son" />
        <div className="headerV" style="width: 100%;height: 8rem;"></div>
        <IndexContent class="test233" @searchWord="getSearchWord" :searchHotWord="data2.searchHotWord"
            v-if="data.flag === false" :key="1"></IndexContent>
        <SearchResults v-else :musicInfos="data.musicInfos" :inputSearch="data4.inputSearch" :key="2" />
    </div>
</template>

<script setup>
import HeaderTop from '../components/musicSearch/header.vue'
import SearchResults from "../components/musicSearch/body/searchResults.vue";
import IndexContent from '../components/musicSearch/body/IndexContent.vue'
import { useRouter } from 'vue-router'
import { ref, reactive, watch } from 'vue'

const router = useRouter()
//子组件暴露属性
let son = ref()

//从子组件接受的参数
let musicInfos = ref([])
let searchHotWord = ref([])
let inputSearch = ref()

//发给子组件的参数
let data = reactive({
    musicInfos: [],
    flag: false //标记musicInfos中是否有数据
})
let data2 = reactive({
    searchHotWord: [],
    flag: false //标记searchHotWord中是否有数据
})
let data3 = reactive({
    searchWord: 'no',
    flag: false
})
let data4 = reactive({
    inputSearch: 'no',
    flag: false //inputSearch
})
//获取从header搜索到的音乐信息
const search = async (e) => {
    musicInfos.value = await e._value
    data.musicInfos = await e._value
    data.flag = true
}
//获取从header那得到的inputSearch词信息
const inputSearchWord = async (e) => {
    inputSearch.value = await e
    data4.inputSearch = await e
    data4.flag = true
}
//获取从header那得到的hot词信息
const hot = async (e) => {
    searchHotWord.value = await e._value
    data2.searchHotWord = await e._value
    // console.log(data2.searchHotWord)
    data2.flag = true
}


//获取从indexContent那得到的搜索词语信息
const getSearchWord = (e) => {
    data3.searchWord = e
    data3.flag = true
    // console.log(data3.searchWord)
}
</script>

<style lang="scss"></style>