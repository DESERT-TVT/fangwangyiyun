import request from "../index.js";
//获得账号信息(登陆)
// &timestamp=1503019930000
export const getAccount = (cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/user/account?cookie=${cookies}&timestamp=${timestamp}`,
    })
}
//获取用户等级信息
export const getLevel = (cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/user/level?cookie=${cookies}&timestamp=${timestamp}`,
    })
}
//获取用户信息 , 歌单，收藏，mv, dj 数量
// data:
// artistCount: 0
// code: 200
// createDjRadioCount: 0
// createdPlaylistCount: 1
// djRadioCount: 0
// mvCount: 0
// newProgramCount: 0
// programCount: 0
// subPlaylistCount: 0
export const getSubCount = (cookies) => {
    return request({
        method: "GET",
        url: `/user/subcount?cookie=${cookies}`,
    })
}
//获取用户歌单
// 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户歌单
// 必选参数 : uid : 用户 id
// 可选参数 :
// limit : 返回数量 , 默认为 30
// offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
export const getUserMusicList = (uid, cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/user/playlist?uid=${uid}&cookie=${cookies}&timestamp=${timestamp}`,
    })
}

