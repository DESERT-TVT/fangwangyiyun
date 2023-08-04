import request from "../index.js";
//获取歌单详情页数据
export const getMusicListItem = (data) => {
    return request({
        method: "GET",
        url: `/playlist/detail?id=${data}`
    })
}
//获取歌单歌曲
// 注：关于offset，你可以这样理解，假设你当前的歌单有100首歌
// 你传入limit=10&offset=0等价于limit=10，你会得到第1-10首歌曲
// 你传入limit=10&offset=1，你会得到第2-11首歌曲
// 如果你设置limit=10&offset=2，你就会得到第3-12首歌曲
export const getMusicListSong = (data, limit, offset) => {
    return request({
        method: "GET",
        url: `/playlist/track/all?id=${data}&limit=${limit}&offset=${offset}`
    })
}
//获取歌单所有歌曲
export const getMusicListSongAll = (id) => {
    return request({
        method: "GET",
        url: `/playlist/track/all?id=${id}`
    })
}

//获取歌词数据
export const getMusicLyric = (data) => {
    return request({
        method: "GET",
        url: `/lyric?id=${data}`
    })
}

//获取歌曲评论
// export const getMusicComment = (data) => {
//     return request({
//         method:"GET",
//         url:`/comment/music?id=${data}&limit=1`
//     })
// }

//获取歌曲评论
// id : 资源 id, 如歌曲 id,mv id
// type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
// 0: 歌曲
// 1: mv
// 2: 歌单
// 3: 专辑
// 4: 电台
// 5: 视频
// 6: 动态
// 可选参数 :
// pageNo:分页参数,第 N 页,默认为 1
// pageSize:分页参数,每页多少条数据,默认 20
// sortType: 排序方式, 1:按推荐排序, 2:按热度排序, 3:按时间排序
// cursor: 当sortType为 3 时且页数不是第一页时需传入,值为上一条数据的 time
export const getMusicComment = (data) => {
    let timestamp = new Date().getTime()
    if (data.sortType === 3 && data.pageNo > 1) {
        console.log("有cursor")
        return request({
            method: "GET",
            url: `/comment/new?type=${data.type}&id=${data.id}&sortType=${data.sortType}&cursor=${data.cursor}&pageSize=${data.pageSize}&pageNo=${data.pageNo}&timestamp=${timestamp}`
        })
    } else {
        console.log("无cursor")
        return request({
            method: "GET",
            url: `/comment/new?type=${data.type}&id=${data.id}&sortType=${data.sortType}&pageSize=${data.pageSize}&pageNo=${data.pageNo}&timestamp=${timestamp}`
        })
    }
}



//获取楼层评论
// 必选参数 :
//     parentCommentId: 楼层评论 id
// id : 资源 id
// type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
// 0: 歌曲
// 1: mv
// 2: 歌单
// 3: 专辑
// 4: 电台
// 5: 视频
// 可选参数 : limit: 取出评论数量 , 默认为 20
// time: 分页参数,取上一页最后一项的 time 获取下一页数据
export const getMusicSonComment = (data) => {
    let timestamp = new Date().getTime()
    if (data.page === 0) {
        return request({
            method: "GET",
            url: `/comment/floor?parentCommentId=${data.parentCommentId}&id=${data.id}&type=${data.type}&limit=${data.limit}&timestamp=${timestamp}`
        })
    } else {
        return request({
            method: "GET",
            url: `/comment/floor?parentCommentId=${data.parentCommentId}&id=${data.id}&type=${data.type}&limit=${data.limit}&time=${data.time}&timestamp=${timestamp}`
        })
    }

}

//下载音乐
export const downloadMusic = (data) => {
    return request({
        method: "GET",
        url: `/song/url?id=${data}`
    })
}

//获取MV
export const getMv = (id) => {
    return request({
        method: "GET",
        url: `/mv/url?id=${id}`
    })
}

//判断歌曲是否有版权
export const getCopyRight = (id) => {
    return request({
        method: "GET",
        url: `/check/music?id=${id}`
    })
}
