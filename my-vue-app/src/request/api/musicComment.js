import request from "../index.js";
//给评论点赞
// 说明 : 调用此接口 , 传入 type, 资源 id, 和评论 id cid 和 是否点赞参数 t 即可给对 应评论点赞 ( 需要登录 )
// 必选参数 : id : 资源 id, 如歌曲 id,mv id
// cid : 评论 id
// t : 是否点赞 , 1 为点赞 ,0 为取消点赞
// type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
// 0: 歌曲
// 1: mv
// 2: 歌单
// 3: 专辑
// 4: 电台
// 5: 视频
// 6: 动态
// 接口地址 : /comment/like
// 调用例子 : /comment/like?id=29178366&cid=12840183&t=1&type=0 对应给 https://music.163.com/#/song?id=29178366 最热门的评论点赞
// 注意： 动态点赞不需要传入 id 参数，需要传入动态的 threadId 参数,
// 如：/comment/like?type=6&cid=1419532712&threadId=A_EV_2_6559519868_32953014&t=0， threadId 可通过 /event，/user/event 接口获取
export const likeOrDislikeThisComment = (id, cid, t, type, cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/comment/like?id=${id}&cid=${cid}&t=${t}&type=${type}&timestamp=${timestamp}&cookie=${cookies}`
    })
}

// 发送评论
// 必选参数
// t:1 发送, 2 回复
// type: 数字,资源类型,对应歌曲,mv,专辑,歌单,电台,视频对应以下类型
// 0: 歌曲
// 1: mv
// 2: 歌单
// 3: 专辑
// 4: 电台
// 5: 视频
// 6: 动态
// id:对应资源 id
// content :要发送的内容
// commentId :回复的评论 id (回复评论时必填)
// 调用例子 : /comment?t=1&type=1&id=5436712&content=test (往广岛之恋 mv 发送评论: test)
// 注意：如给动态发送评论，则不需要传 id，需要传动态的 threadId,如：/comment?t=1&type=6&threadId=A_EV_2_6559519868_32953014&content=test
export const sComment = (id, content, t, type, cookies, commentId) => {
    let timestamp = new Date().getTime()
    if (commentId === -1) {
        console.log("发送评论")
        return request({
            method: "GET",
            url: `/comment?id=${id}&content=${content}&t=${t}&type=${type}&timestamp=${timestamp}&cookie=${cookies}`
        })
    } else {
        console.log("回复评论")
        return request({
            method: "GET",
            url: `/comment?id=${id}&content=${content}&t=${t}&type=${type}&commentId=${commentId}&timestamp=${timestamp}&cookie=${cookies}`
        })
    }

}



// 删除评论
// 必选参数
// t:0 删除
// type: 数字,资源类型,对应歌曲,mv,专辑,歌单,电台,视频对应以下类型
//    0: 歌曲
//    1: mv
//    2: 歌单
//    3: 专辑
//    4: 电台
//    5: 视频
//    6: 动态
// id:对应资源 id content :内容 id,可通过 /comment/mv 等接口获取
// 调用例子 : /comment?t=0&type=1&id=5436712&commentId=1535550516319 (在广岛之恋 mv 删除评论)
// 注意：如给动态删除评论，则不需要传 id，需要传动态的 threadId,如：/comment?t=0&type=6&threadId=A_EV_2_6559519868_32953014&commentId=1419516382
export const dComment = (id, commentId, t, type, cookies) => {
    let timestamp = new Date().getTime()
    return request({
        method: "GET",
        url: `/comment?id=${id}&commentId=${commentId}&t=${t}&type=${type}&timestamp=${timestamp}&cookie=${cookies}`
    })
}

