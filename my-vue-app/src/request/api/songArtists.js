import request from "../index.js";
//获取热门歌手
export const getHotArtists = () => {
    return request({
        method: "GET",
        url: '/top/artists?limit=30'
    })
}

//获取歌手分类列表
export const getArtistsCategory = (data) => {
    return request({
        method: "GET",
        url: `/artist/list?type=${data.type}&area=${data.area}&initial=${data.initial}`
    })
}