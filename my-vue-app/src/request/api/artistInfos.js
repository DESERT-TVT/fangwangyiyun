import request from "../index.js";
//获取歌手信息
export const getArtistInfos = (id) => {
    return request({
        method: "GET",
        url: `/artist/detail?id=${id}`,
        withCredentials: true,
    })
}
//获取歌手粉丝数量
export const getArtistFanCount = (id) => {
    return request({
        method: "GET",
        url: `/artist/follow/count?id=${id}`,
        withCredentials: true,
    })
}
//获取歌手详情
export const getArtistDetail = (id) => {
    return request({
        method: "GET",
        url: `/artist/desc?id=${id}`,
        withCredentials: true,
    })
}

//获取歌手所有歌曲
//id : 歌手id
//order : hot ,time 按照热门或者时间排序
// limit: 取出歌单数量 , 默认为 50
// offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
export const getArtistAllSong = (id, order, limit, offset) => {
    return request({
        method: "GET",
        url: `/artist/songs?id=${id}&order=${order}&limit=${limit}&offset=${offset}`,
        withCredentials: true,
    })
}
