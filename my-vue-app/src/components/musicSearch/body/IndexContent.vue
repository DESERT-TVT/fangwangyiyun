
<template>
    <div class="searchContent" id="searchContent">
        <el-scrollbar>
            <div class="toArtist" @click="$router.push('/songArtists')">
                <div class="artistHeadPic"></div>
                <div class="artistTitle">
                    <span>周杰伦</span>
                </div>

            </div>
            <div class="tableArea">
                <el-scrollbar>
                    <div class="content">
                        <div v-for="(item, index) in 1" :key="item" class="card">
                            <div class="cardTitle">
                                <span>热搜榜</span>
                            </div>
                            <div class="cardList">
                                <div v-for="(item2, index2) in props.searchHotWord" :key="item2"
                                    @click="SearchThisWord(props.searchHotWord[index2].searchWord)" class="cardItem"
                                    :id="'cardItem' + index2" @touchstart="cardItemTouchstart(index2)"
                                    @touchend="cardItemTouchend(index2)">
                                    <span class="itemIndex">{{ index2 + 1 }}</span>
                                    <span class="searchWord">
                                        {{ props.searchHotWord[index2].searchWord }}
                                        <img v-if="props.searchHotWord[index2].iconUrl != null"
                                            :src="props.searchHotWord[index2].iconUrl">
                                    </span>
                                    <span class="describeContent">
                                        {{ props.searchHotWord[index2].content }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { watch } from "vue";
const props = defineProps(['searchHotWord'])
const emit = defineEmits(['searchWord'])
// console.log(props)
const SearchThisWord = (data) => {
    // console.log(data)
    emit('searchWord', data)
}
watch(props, (newValue, oldValue) => {
}, { deep: true, immediate: true })


</script>
<script>
import $ from "jquery";

export default {
    methods: {
        cardItemTouchstart(index) {
            console.log(index)
            $('#cardItem' + index).toggleClass('activeCardItem')
        },
        cardItemTouchend(index) {
            $('#cardItem' + index).toggleClass('activeCardItem')
        },
    }
}
</script>

<style scoped>
.searchContent {
    width: 100%;
    height: calc(100vh - 14.5rem);
    margin-top: .8rem;
    /*background-color: #dadada;*/
}

.searchContent .el-loading-mask {
    top: -0.5rem;
}

.searchContent .toArtist {
    margin: 0 auto;
    width: 90%;
    height: 5rem;
    border-radius: 1rem;
    background-color: #fdfdfd;
    display: flex;
    align-items: center;
    /*justify-content: space-between;*/

    /*color: #f9f9f9;*/
}

.toArtist .artistHeadPic {
    margin-left: 1rem;
    height: 4rem;
    width: 4rem;
    background-image: url("../../../assets/img/zhou.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
}

.toArtist .artistTitle {
    margin-left: 4rem;
    height: 100%;
    width: 8rem;
    /*background-color: #535bf2;*/
    padding: 1rem 0;
    color: #2c2c2c;
    font-weight: bold;
    text-align: center;
    line-height: 3rem;
}

.searchContent .tableArea {
    width: 100%;
}

.searchContent .tableArea .content {
    display: flex;
    margin: 1rem auto;
    justify-content: center;
    /*width: 49.5rem;*/
}

.searchContent .tableArea .content .card {
    width: 90%;
    border-radius: 1rem;
    background-color: #fdfdfd;
    /*box-shadow: #2c2c2c 0 0 .1rem;*/
}

.searchContent .tableArea .content .card .cardTitle {
    width: 100%;
    height: 3.5rem;
    padding: 1rem;
    border-bottom: rgba(159, 148, 148, 0.2) solid 1px;
    color: #2c2c2c;
    font-size: 1rem;
    font-weight: bold;
}

.searchContent .tableArea .content .card .cardList {
    width: 100%;
    margin-top: .5rem;
}

.searchContent .tableArea .content .card .cardList .cardItem {
    display: flex;
    align-items: center;
    width: 100%;
    height: 2rem;
}

.activeCardItem.cardItem {
    background-color: #e8e8e8;
}

.searchContent .tableArea .content .card .cardList .cardItem .itemIndex {
    padding-left: 1rem;
    margin-right: .3rem;
    color: #2c2c2c;
    font-weight: bold;
}

.searchContent .tableArea .content .card .cardList .cardItem:nth-child(1) .searchWord,
.searchContent .tableArea .content .card .cardList .cardItem:nth-child(2) .searchWord,
.searchContent .tableArea .content .card .cardList .cardItem:nth-child(3) .searchWord {
    font-weight: bold;
    font-size: .9rem;
}

.searchContent .tableArea .content .card .cardList .cardItem .searchWord {
    display: block;
    width: 100%;
    margin-right: .1rem;
    color: #2c2c2c;
    font-size: .8rem;
}

.searchContent .tableArea .content .card .cardList .cardItem img {
    width: 1rem;
    transform: translateY(7.5%);
}

.searchContent .tableArea .content .card .cardList .cardItem .describeContent {
    margin-left: 1rem;
    font-size: .7rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(0, 0, 0, 0.5);
}

.searchContent .el-scrollbar__bar.is-horizontal {
    height: 0;
}

.searchContent .el-scrollbar__bar.is-vertical {
    width: 0;
}
</style>