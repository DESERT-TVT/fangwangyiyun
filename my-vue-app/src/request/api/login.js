import request from "../index";
//仅二维码登录(账号密码不支持)
export const getQrKey = () => {
    return request({
        url: `/login/qr/key?timestamp=${Date.now()}`,
        method: "GET"
    })
}
export const getQr = (key) => {
    return request({
        url: `/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`,
        method: "GET",
    })
}
export const checkQr = (key) => {
    return request({
        url: `/login/qr/check?key=${key}&timestamp=${Date.now()}`,
        method: "GET",
    })
}
//登录状态
export const getLoginStatus = (cookie = '') => {
    return request({
        url: `/login/status?timestamp=${Date.now()}`,
        method: "POST",
        data: {
            cookie,
        }
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
//获得账号信息(登陆)
export const getAccount = (cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/user/account?cookie=${cookies}&timestamp=${timestamp}`,
    })
}