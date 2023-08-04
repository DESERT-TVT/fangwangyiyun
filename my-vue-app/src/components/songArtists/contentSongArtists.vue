<template>
    <div class="artistsListArea">
        <div class="artistsListAreaTitle">热门歌手</div>
        <el-scrollbar>
            <div class="artistsList">
                <div class="artistsListItem" v-for="(item, index) in artistsData" :key="index" @click="test(item.id)">
                    <el-image :src="item.picUrl" />
                    <span class="artistsName">{{ item.name }}</span>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { defineProps, watch, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()

let artistsData = ref([])
let props = defineProps(['HotArtists'])
watch((props), (newValue, oldValue) => {
    artistsData.value = newValue.HotArtists
    console.log(artistsData.value)
}, { deep: true, immediate: true })

const test = (id) => {
    console.log(id)
    router.push({
        path: '/artistlnfos',
        query: {
            id
        }
    })
}

</script>

<style scoped>
.artistsListArea {
    width: 100%;
    height: calc(100vh - 21.1rem);
}

.artistsListAreaTitle {
    width: 100%;
    padding: .5rem 1rem;
    color: #2c2c2c;
    font-size: .8rem;
    background-color: #f3f4f6;

}

.artistsListArea .artistsList {
    margin: 0 auto;
    width: 95%;
    background-color: #fdfdfd;
    border-radius: 2rem;
    border: #2c2c2c solid 1px;
    padding: .5rem 0;
}

.artistsListArea .artistsList .artistsListItem {
    display: flex;
    align-items: center;
    padding-left: .5rem;
    padding-top: .8rem;
    margin-bottom: 1rem;
    width: 100%;
    height: 4rem;
}

.artistsListArea .artistsList .artistsListItem:hover {
    background-color: #d5d5d5;
}

.artistsListArea .artistsList .artistsListItem:last-child {
    margin-bottom: 0;
}

.artistsListArea .artistsList .artistsListItem .el-image {
    margin: 0 .5rem;
    width: 3.8rem;
    height: 3.8rem;
    border-radius: 50%;
}

.artistsListArea .artistsList .artistsListItem span {
    margin: 0 .5rem;
    color: #2c2c2c;
}
</style>