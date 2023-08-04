import request from "../index";
// 获取用户关注列表
// 说明: 登录后调用此接口, 传入用户 id, 可以获取用户关注列表

// 必选参数: uid: 用户 id

// 可选参数:

// limit: 返回数量, 默认为 30

// offset: 偏移数量，用于分页, 如 : (页数 - 1) * 30, 其中 30 为 limit 的值, 默认为 0

// 接口地址: /user/follows

// 调用例子: /user/follows ? uid = 32953014
export const getconcernlist = (uid) => {
    return request({
        url: `/user/follows?uid=${uid}`,
        method: "GET"
    })
}
// 获取用户粉丝列表
// 说明: 登录后调用此接口, 传入用户 id, 可以获取用户粉丝列表

// 必选参数: uid: 用户 id

// 可选参数: limit: 返回数量, 默认为 30

// offset: 偏移数量，用于分页, 如 : (页数 - 1) * 30, 其中 30 为 limit 的值, 默认为 0
export const getfollowedslist = (uid) => {
    return request({
        url: `/user/followeds?uid=${uid}`,
        method: "GET"
    })
}