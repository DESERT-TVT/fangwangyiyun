//获取歌单详情页数据
import request from "../index.js";

export const getMusicListItem = (data, cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/playlist/detail?id=${data}&cookie=${cookies}&timestamp=${timestamp}`
    })
}
//获取歌单歌曲
// 注：关于offset，你可以这样理解，假设你当前的歌单有100首歌
// 你传入limit=10&offset=0等价于limit=10，你会得到第1-10首歌曲
// 你传入limit=10&offset=1，你会得到第2-11首歌曲
// 如果你设置limit=10&offset=2，你就会得到第3-12首歌曲
export const getMusicListSong = (data, limit, offset, cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/playlist/track/all?id=${data}&limit=${limit}&offset=${offset}&cookie=${cookies}&timestamp=${timestamp}`
    })
}
//获取歌单所有歌曲
export const getMusicListSongAll = (id, cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/playlist/track/all?id=${id}&cookie=${cookies}`
    })
}

//新建歌单
// 说明 : 调用此接口 , 传入歌单名字可新建歌单
// 必选参数 : name : 歌单名
// 可选参数 :
// privacy : 是否设置为隐私歌单，默认否，传'10'则设置成隐私歌单
// type : 歌单类型,默认'NORMAL',传 'VIDEO'则为视频歌单,传 'SHARED'则为共享歌单
export const createMusicList = (name, cookies) => {
    return request({
        method: "GET",
        url: `/playlist/create?name=${name}&type=NORMAL&cookie=${cookies}`
    })
}
//删除用户歌单
// 说明 : 调用此接口 , 传入歌单 id 可删除歌单
// 必选参数 : id : 歌单 id,可多个,用逗号隔开
// 接口地址 : /playlist/delete
// 调用例子 : /playlist/delete?id=2947311456 , /playlist/delete?id=5013464397,5013427772
export const deleteMusicList = (id, cookies) => {
    return request({
        method: "GET",
        url: `/playlist/delete?id=${id}&cookie=${cookies}`
    })
}

//对歌单添加或删除歌曲
// 说明 : 调用此接口 , 可以添加歌曲到歌单或者从歌单删除某首歌曲 ( 需要登录 )
// 必选参数 :
// op: 从歌单增加单曲为 add, 删除为 del
// pid: 歌单 id
// tracks: 歌曲 id,可多个,用逗号隔开
// 接口地址 : /playlist/tracks
// 调用例子 : /playlist/tracks?op=add&pid=24381616&tracks=347231
// ( 对应把歌曲添加到 ' 我 ' 的歌单 , 测试的时候请把这里的 pid 换成你自己的,
// id 和 tracks 不对可能会报 502 错误)
export const addMusicToList = (op, pid, tracks, cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/playlist/tracks?op=${op}&pid=${pid}&tracks=${tracks}&cookie=${cookies}&timestamp=${timestamp}`
    })
}

//歌单封面上传
//说明 : 登录后调用此接口,使用'Content-Type': 'multipart/form-data'上传图片 formData(name 为'imgFile'),可更新歌单封面(参考:https://github.com/Binaryify/NeteaseCloudMusicApi/blob/master/public/playlist_cover_update.html)
// 必选参数 :
// id: 歌单 id 3143833470
// 可选参数 :
// imgSize : 图片尺寸,默认为 300
// imgX : 水平裁剪偏移,方形图片可不传,默认为 0 imgY : 垂直裁剪偏移,方形图片可不传,默认为 0
// 接口地址 : /playlist/cover/update
// 调用例子 : /playlist/cover/update?id=3143833470&imgSize=200
export const uploadListPic = (picFile, id, imgSize, imgX, imgY, cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "POST",
        url: `/playlist/cover/update?id=${id}&imgSize=${imgSize}&imgX=${imgX}&imgY=${imgY}&cookie=${cookies}&timestamp=${timestamp}`,
        header: {
            'Content-Type': 'multipart/form-data'
        },
        data: picFile,
    })
}

//更新歌单名
// 说明 : 登录后调用此接口,可以单独更新用户歌单名
// 必选参数 :
// id: 歌单id
// name: 歌单名
// 接口地址 : /playlist/name/update
// 调用例子 : /playlist/name/update?id=24381616&name=歌单名
export const uploadListName = (id, name, cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/playlist/name/update?id=${id}&name=${name}&cookie=${cookies}&timestamp=${timestamp}`,
    })
}
//更新歌单描述
//说明 : 登录后调用此接口,可以单独更新用户歌单描述
// 必选参数 :
// id:歌单id
// desc:歌单描述
// 接口地址 : /playlist/desc/update
// 调用例子 : /playlist/desc/update?id=24381616&desc=描述
export const uploadListDesc = (id, desc, cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/playlist/desc/update?id=${id}&desc=${desc}&cookie=${cookies}&timestamp=${timestamp}`,
    })
}