<template>
    <div class="headerTop">
        <!-- 返回按钮 -->
        <div class="backButton" id="backButton">
            <el-icon v-show="inputSearch === '' || inputSearch === undefined" @click="$router.go(-1)">
                <Back />
            </el-icon>
            <el-icon v-show="inputSearch !== '' && inputSearch !== undefined" @click="reloading">
                <Back />
            </el-icon>
        </div>
        <!--    搜索栏-->
        <div class="search">
            <el-input v-model="inputSearch" ref="inputRef" class="songSearched" :placeholder="placeholder"
                :prefix-icon="Search" @keyup.enter="songSearch()" @click="isSuggestWordShow = true" />
        </div>
        <!--    建议搜索-->
        <el-drawer v-model="isSuggestWordShow" title="您可能想搜索：" ref="SuggestWord" :with-header="true" :direction="direction"
            size="100%" @opened="focusProblem">
            <div ref="focus" tabindex="0"></div>
            <div class="suggestItem" :id="'suggestItem' + index" v-if="suggest != null" v-for="(item, index) in suggest"
                @touchstart="suggestItemTouchstart(index)" @touchend="suggestItemTouchend(index)" :key="index"
                @click="suggestSearch(item.keyword)">
                <el-icon>
                    <Search />
                </el-icon>
                {{ item.keyword }}
            </div>
        </el-drawer>
        <!--    搜索-->
        <div class="musicSearchButton" @click="songSearch()">
            <el-icon>
                <Search />
            </el-icon>
        </div>
    </div>
    <div class="historyTitle"><span>历史记录</span></div>
    <div class="searchHistoryArea">
        <div style="width: 1rem"></div>
        <el-scrollbar>
            <div class="searchHistory" v-show="searchHistory.length > 0">
                <span class="searchHistoryItem" :id="'searchHistoryItem' + index" v-for="(item, index) in searchHistory"
                    :key="index" @click="historyWordSearch(item)" @touchstart="searchHistoryTouchstart(index)"
                    @touchmove="searchHistoryTouchmove(index)" @touchcancel="searchHistoryTouchcancel(index)"
                    @touchend="searchHistoryTouchend(index)">
                    {{ item }}
                </span>
            </div>
        </el-scrollbar>
        <div style="width: 1rem"></div>
    </div>
    <div class="deleteAllSearchHistory" @click="deleteAllSearchHistory">
        <el-icon>
            <Delete />
        </el-icon>
    </div>
</template>

<script setup>
import { onMounted, ref, defineExpose, defineEmits, nextTick, defineProps, watch } from 'vue'
import { Search, Back, Delete } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import { getMusicSearched, getSearchWordDefault, getSearchHotDetail, getSuggestWord } from "../../request/api/musicSearch.js";
import { ElLoading } from 'element-plus'
import $ from 'jquery'
import { debounce } from "lodash";
import { useStore } from 'vuex'
const store = useStore()
const router = useRouter()
const isSuggestWordShow = ref(false)
const direction = ref('ttb')
let placeholder = ref('')
let inputSearch = ref('')
let musicInfos = ref([])
let searchHotWord = ref([])
let suggest = ref([])
let SuggestWord = ref()
let searchHistory = ref([])
searchHistory.value = store.state.searchHistory
const emit = defineEmits(['musicInfos', 'searchHotWord', 'inputSearch'])
const props = defineProps(['searchWord'])
// console.log(props)

//监听是否点击热搜词，点击了要跳转搜索歌曲
watch(props, async (newValue, oldValue) => {
    if (newValue.searchWord === 'no') {

    } else {
        inputSearch.value = await props.searchWord
        await songSearch()
    }
}, { deep: true })
//搜索建议监听
watch(inputSearch, debounce(async (newValue, oldValue) => {
    await suggestWord()

}, 200), {})



//获得热搜词语
const hotSong = async () => {
    let res = await getSearchHotDetail()
    searchHotWord.value = res.data
    // console.log(searchHotWord.value);
    emit('searchHotWord', searchHotWord)
    // console.log(searchHotWord.value)
}
//获得大家都在搜
const defaultSearchedWord = async () => {
    let res = await getSearchWordDefault()
    const tempStr = '大家都在搜 '
    placeholder.value = tempStr.concat(res.data.realkeyword)
    // console.log(placeholder.value)

}
//歌曲搜索
const songSearch = async () => {
    SuggestWord.value.handleClose()
    const loadingInstance = ElLoading.service({
        target: document.getElementById('searchContent'),
        text: "数据加载中",
        background: "rgba(52,52,52,0.8)",
    })
    //如果输入框未输入内容，把默认placeholder内容作为搜索词
    if (inputSearch.value == '' || inputSearch == undefined) {
        const loadingInstance = ElLoading.service({ target: document.getElementById('searchContent') })
        inputSearch.value = $(".el-input__inner").attr("placeholder").substring(6)
        store.commit('updateSearchHistory', inputSearch.value)
    } else {
        store.commit('updateSearchHistory', inputSearch.value)
        // console.log(inputSearch.value,searchHistory)
    }
    let res = await getMusicSearched(inputSearch.value, 20, 0)
    musicInfos.value = res.result.songs
    emit('musicInfos', musicInfos)
    emit('inputSearch', inputSearch.value)
    nextTick(() => {
        // Loading should be closed asynchronously
        loadingInstance.close()
    })
}
//添加建议词语
const suggestWord = async () => {
    let res = await getSuggestWord(inputSearch.value)
    if (res.result != null) {
        // console.log(res)
        suggest.value = res.result.allMatch

    } else {
        // console.log("搜索建议数据为空，不更新")
    }
}
//建议词语搜索
const suggestSearch = (data) => {
    inputSearch.value = data
    songSearch()
}
//历史词语搜索
const historyWordSearch = (data) => {
    inputSearch.value = data
    songSearch()
}
//删除所有搜索历史
const deleteAllSearchHistory = () => {
    // console.log("删除所有历史成功")
    store.commit('deleteAllSearchHistory')
    // console.log(store.state.searchHistory)
    searchHistory.value = []
}
onMounted(() => {
    defaultSearchedWord()
    hotSong()
})



//暴露搜索函数，用户可通过其他组件的搜索按钮调用函数，当然也能用本页面的回车键
defineExpose({
    songSearch
})
</script>

<script>
import { ref } from 'vue'
let _this
export default {
    name: 'HeaderTop',
    inject: ['reload'],
    data() {
        return {

        }
    },
    created() {
        _this = this
    },
    methods: {
        reloading() {
            this.reload()
        },
        //解决drawer自动对焦问题！！！
        //还有就是，不能用钩子函数的形式去给组件绑定@click，不然移动端也处理不了
        focusProblem() {
            _this.$refs.focus.focus()
            setTimeout(function () {
                _this.$refs.focus.blur()
            }, 200)
        },
        searchHistoryTouchstart(index) {
            // console.log(index)
            $('#searchHistoryItem' + index).toggleClass('activeSearchHistory')
        },
        searchHistoryTouchmove(index) {
            // $('#playingListItem'+index).toggleClass('move')
        },
        searchHistoryTouchend(index) {
            $('#searchHistoryItem' + index).toggleClass('activeSearchHistory')
        },
        searchHistoryTouchcancel(index) {
            // $('#playingListItem'+index).toggleClass('move')
        },

        suggestItemTouchstart(index) {
            $('#suggestItem' + index).toggleClass('activeSuggestItem')
        },
        suggestItemTouchend(index) {
            $('#suggestItem' + index).toggleClass('activeSuggestItem')
        },

    },
}

</script>

<style lang="scss">
.headerTop {
    position: absolute;

    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: .4rem;
    width: 100%;
    height: 3rem;
    /*background-color: #343434;*/
}

.headerTop .el-overlay {
    top: 92px;
}



.headerTop .el-drawer {
    background-color: #f4f5f7;
}

.headerTop .el-drawer__header {
    color: #2c2c2c;
    padding: .5rem 1rem;
    margin: 0;
}

.headerTop .el-drawer__body {
    padding: .5rem 0;
}

.headerTop .suggestItem {
    font-size: 1.1rem;
    color: #2c2c2c;
    width: 100%;
    height: 3rem;
    line-height: 2.5rem;
    padding-left: 1rem;
}

.activeSuggestItem {
    font-size: 1.1rem;
    /*color: #f56c6c !important;*/
    width: 100%;
    height: 3rem;
    line-height: 2.5rem;
    background-color: #a4a4a4;
    padding-left: 1rem;
}

.headerTop .suggestItem .el-icon,
.headerTop .activeSuggestItem .el-icon {
    margin-right: 1rem;
    font-size: 1.1rem;
}


/******************返回按钮样式******************/
.headerTop>.backButton {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    width: 2.5rem;
    background-color: #fdfdfe;
    border-radius: 50%;
    margin-left: .2rem;
}

.headerTop>.backButton .el-icon {
    font-size: 1.5rem;
    color: #000000;
}

/******************搜索框样式******************/
.headerTop>.search {
    height: 100%;
    width: 75%;
}

.headerTop .el-input {
    height: 2.6rem;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
}

.headerTop .el-input__wrapper {
    border-radius: 30px;
}

.headerTop .el-input .el-input__icon {
    color: #f56c6c;
    font-size: 1.2rem;
}

/******************搜索样式******************/
.headerTop>.musicSearchButton {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 50%;
    background-color: #fdfdfe;
    margin-right: .2rem;
}

.headerTop>.musicSearchButton .el-icon {
    font-size: 1rem;
    color: #000000;
}


/******************历史搜索样式******************/
.searchHistoryArea .el-scrollbar__bar.is-horizontal {
    height: 0;
}

.searchHistoryArea .el-scrollbar__bar.is-vertical {
    width: 0;
}

.searchHistoryArea {
    position: absolute;
    display: flex;
    align-items: center;
    /*justify-content: space-between;*/
    top: 6.8rem;
    width: 100%;
    height: 3rem;
}

.historyTitle {
    z-index: 10;
    top: 5.8rem;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    /*width: 9rem;*/
    margin: 0 .8rem;
    font-size: .8rem;
    font-weight: bold;
    color: #2c2c2c;
}

.searchHistory {
    height: 100%;
    display: flex;

}

.searchHistory .searchHistoryItem {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    margin: .5rem .5rem;
    padding: .5rem;
    text-align: center;
    border-radius: .5rem;
    font-size: .5rem;
    background-color: #f56c6c;
    color: #f9f9f9;
}

.activeSearchHistory.searchHistoryItem {
    background: #c75757;
}

.deleteAllSearchHistory {
    position: absolute;
    right: 0;
    top: 5.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 .5rem;
    text-align: center;
    font-size: 1.2rem;
    color: #2c2c2c;
}
</style>