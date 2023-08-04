<template>
    <headerSongArtists @HotArtists="getHotArtistsData" />
    <contentSongArtists :HotArtists="HotArtists" />
</template>






<script setup>
import headerSongArtists from '../components/songArtists/headerSongArtists.vue'
import contentSongArtists from '../components/songArtists/contentSongArtists.vue'
import { ref } from "vue";


let HotArtists = ref([])
const getHotArtistsData = (e) => {
    HotArtists.value = e._value
    // console.log(HotArtists.value)
}

</script>
<script>
export default {
    name: "songArtists"
}
</script>

<style scoped></style>