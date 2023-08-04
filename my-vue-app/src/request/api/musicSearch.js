import request from "../index.js";
//获取搜索音乐数据
export const getMusicSearched = (keywords, limit, offset) => {
    return request({
        method: "GET",
        url: '/cloudsearch',
        params: {
            keywords,
            limit,
            offset
        }
    })
}
//获取默认搜索关键词
export const getSearchWordDefault = () => {
    return request({
        method: "GET",
        url: '/search/default'
    })
}

//获取热搜列表(详细)
export const getSearchHotDetail = () => {
    return request({
        method: "GET",
        url: '/search/hot/detail'
    })
}

//获取指定搜索建议词
export const getSuggestWord = (data) => {
    return request({
        method: "GET",
        url: `/search/suggest?keywords=${data}&type=mobile`
    })
}