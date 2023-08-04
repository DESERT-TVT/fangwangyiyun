import request from "../index.js";
// banner 接口地址 : /banner
// 0: pc
// 1: android
// 2: iphone
// 3: ipad
export const getBanner = () => {
    return request({
        url: "/banner?type=2",
        method: "GET"
    })
}
//获取专辑内容
// 说明 : 调用此接口 , 传入专辑 id, 可获得专辑内容
// 必选参数 : id: 专辑 id
// 接口地址 : /album
// 调用例子 : /album?id=32311
export const getAlbum = (id) => {
    return request({
        url: `/album?id=${id}`,
        method: "GET"
    })
}

//获取发现好歌单
export const getMusicList = () => {
    return request({
        url: `/personalized?limit=8`,
        method: "GET"
    })
}
//获取登录状态
export const getLoginStatus = (cookie = '') => {
    return request({
        url: `/login/status?timestamp=${Date.now()}`,
        method: "POST",
        data: {
            cookie,
        }
    })
}
//退出登录
export const getLogout = () => {
    return request({
        method: "GET",
        url: "/logout",
    })
}