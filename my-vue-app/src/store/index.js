import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"
import { getMusicComment, getMusicLyric, getMusicSonComment } from "../request/api/musicList.js";
import { getAccount, getLevel, getUserMusicList } from "../request/api/local.js";
import { getconcernlist, getfollowedslist } from "../request/api/concern.js"
import { getMusicListSongAll } from "../request/api/userMusicList.js";
export default createStore({
    state: {
        //用户信息
        userInfos: {
            userId: 0,
            id: 32953014,      //用户id
            nickname: '用户名称',    //用户名称
            gender: 0,       //用户性别0未设置，1男，2女
            avatarUrl: 'http://p1.music.126.net/Se0n1_p0z8_DUQXNLILOKQ==/109951167721662139.jpg',   //用户头像url
            signature: '用户简历',   //用户简历
            backgroundUrl: 'http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg',   //用户背景图
            follows: {},    //关注
            followeds: {},  //粉丝
            level: 99//等级
        },
        //音乐播放列表,默认值
        playList: [{
            al: {
                id: 170703290,
                name: "剧好听的歌 第8期",
                pic: 5639395138885805,
                picUrl: "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                pic_str: "5639395138885805",
            },
            ar: [{
                name: "胡夏",
            }],
            id: 2068042777,
            name: "诀爱 (Live版)"
        }],
        userMusicList: [],   //用户歌单
        userFavoriteMusicListId: 0,//用户喜爱歌单ID（用于添加收藏）
        userFavoriteMusicList: {},//用户喜爱歌单信息
        userFavoriteSongList: [],//用户最喜爱歌单歌曲列表
        playModel: 0, //播放模式
        //歌曲评论
        comment: [{

        }],
        //歌曲子评论
        sonCommentData: {

        },
        currentSongListId: 0,//当前歌单ID
        lastSongListId: 0,//上次歌单ID
        currentSongListId2: 0,//当前歌单ID
        lastSongListId2: 0,//上次歌单ID
        playListIndex: 0,//默认音乐列表下标
        isPlaying: false,//当前是否播放歌曲（判断播放暂停按钮）
        detailShow: false,//是否展示歌曲详情页
        CommentShow: false,//是否展示评论区
        lyricList: {},//歌词
        currentTime: 0,//当前播放时间
        duration: 0,//歌曲总时长
        isLyricShow: false,//是否展示歌词
        searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [],//搜索历史
        isLogin: false,//当前是否登录
        isPlayerShow: true,//是否显示底部播放器
        isBottomNavShow: true,//是否显示底部导航栏
        isToolShow: true,//是否显示浮动工具
        token: '',//用户登录标识
        Cookies: localStorage.getItem('cookie') !== null ? localStorage.getItem('cookie') : ''//cookies
    },
    //同步操作，数据提交至 mutations ，可用于登录成功后读取用户信息写到缓存里
    mutations: {
        // 登录
        updateCookies: function (state, value) {
            state.Cookies = value
            localStorage.setItem('cookie', state.Cookies)
            // console.log(state.Cookies)
        },
        // 登录状态
        updateIsLogin(state, value) {
            state.isLogin = value
        },
        //退出
        deleteIsLogin(state) {
            state.isLogin = false
        },
        updateUserInfos: function (state, value) {
            //对象合并
            let temp = Object.assign({}, state.userInfos, value)
            state.userInfos = temp
            // console.log(state.userInfos);
        },
        // 记录token
        updateToken(state, value) {
            state.token = value
            localStorage.setItem('token', state.token)
        },
        //删除token
        deleteToken(state) {
            state.token = ''
            localStorage.removeItem("token")
        },
        updateSearchHistory(state, value) {
            let needAdd = 0
            for (let i = 0; i < state.searchHistory.length; i++) {
                if (state.searchHistory[i] === value) {
                    console.log("搜索词存在，不必重复添加")
                    //搜索词再次被搜索，放置列表第一位
                    state.searchHistory.splice(i, 1)
                    state.searchHistory.unshift(value)
                    break
                }
                else {
                    needAdd = needAdd + 1
                }
            }
            if (needAdd === state.searchHistory.length) {
                console.log("搜索词不存在，添加")
                state.searchHistory.unshift(value)
            }
            //存入localStorage
            localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory))
        },
        deleteAllSearchHistory(state) {
            state.searchHistory = []
            localStorage.removeItem("searchHistory")
        },
        updateCurrentSongListId: function (state, value) {
            // state.lastSongListId = state.currentSongListId
            state.currentSongListId = value
        },
        updateCurrentSongListId2: function (state, value) {
            // state.lastSongListId = state.currentSongListId
            state.currentSongListId2 = value
        },
        updateLyricList: function (state, value) {
            state.lyricList = value
        },
        updateDuration(state, value) {
            state.duration = value
        },
        updateIsPlaying: function (state, value) {
            state.isPlaying = value
        },
        updateCurrentTime(state, value) {
            state.currentTime = value
        },
        updateDetailShow: function (state) {
            state.detailShow = !state.detailShow
        },
        updateIsLyricShow(state, value) {
            state.isLyricShow = value
        },
        updateComment: function (state, value) {
            state.comment = value
        },
        updateUserFavoriteMusicList: function (state, value) {
            state.userFavoriteMusicList = value
        },
        updateUserFavoriteMusicListId: function (state, value) {
            state.userFavoriteMusicListId = value
        },
        updateUserMusicList: function (state, value) {
            state.userMusicList = value
        },
        updateLastSongListId2: function (state, value) {
            state.lastSongListId2 = value
        },
        addMusicToPlayListNext(state, value) {
            let needAdd = 0
            //查找是否在歌曲列表中
            //查找是否在歌曲列表中
            for (let i = 0; i < state.playList.length; i++) {
                if (state.playList[i].id === value.id) {
                    console.log("歌曲存在，不必重复添加")
                    state.playList.splice(i, 1)
                    state.playList.splice(state.playListIndex + 1, 0, value)
                    break
                } else {
                    needAdd = needAdd + 1
                }
            }
            if (needAdd === state.playList.length) {
                console.log("歌曲不存在，添加到歌单")
                //在播放器选中的这首歌后面添加歌曲
                state.playList.splice(state.playListIndex + 1, 0, value)
                // state.playList.push(value)
            }
        },
        updatePlayListIndex: function (state, value) {
            state.playListIndex = value
            // console.log(state.playListIndex)
        },
        updatePlayModel: function (state, value) {
            state.playModel = value
            // console.log(value)
        },
        updateIsPlayerShow(state, value) {
            state.isPlayerShow = value
        },
        updateIsBottomNavShow(state, value) {
            state.isBottomNavShow = value
        },
        // 退出
        deleteUserInfos: function (state) {
            state.userInfos = {
                id: 0,
                nickname: '用户名称',
                gender: 0,
                avatarUrl: 'http://p1.music.126.net/Se0n1_p0z8_DUQXNLILOKQ==/109951167721662139.jpg',
                signature: '用户简历',
                backgroundUrl: '',
                follows: 999,
                followeds: 999,
                level: 99,
            }
        },
        deleteUserMusicList: function (state, value) {
            state.userMusicList = []
        },
        deleteCookies: function (state, value) {
            state.Cookies = ''
            localStorage.removeItem("cookie")

        },
        deleteUserFavoriteMusicList: function (state, value) {
            state.userFavoriteMusicList = {}
        },
        deleteUserFavoriteMusicListId: function (state, value) {
            state.userFavoriteMusicListId = 0
        },
        deleteUserFavoriteSongList: function (state, value) {
            state.userFavoriteSongList = []
        },
        //点歌播放
        updateLastSongListId: function (state, value) {
            state.lastSongListId = value
        },
        updatePlayList: function (state, value) {
            state.playList = value
            // console.log(state.playList)
        },
        //歌曲评论
        updateCommentShow: function (state) {
            state.CommentShow = !state.CommentShow
        },
        addMusicToPlayListTail(state, value) {
            console.log(value)
            let needAdd = 0
            //查找是否在歌曲列表中
            for (let i = 0; i < state.playList.length; i++) {
                if (state.playList[i].id === value.id) {
                    console.log("歌曲存在，不必重复添加")
                    state.playListIndex = i
                    break
                } else {
                    needAdd = needAdd + 1
                }
            }
            if (needAdd === state.playList.length) {
                console.log("歌曲不存在，添加到歌单")
                //头部添加
                state.playList.push(value)
                //添加歌曲后，当前播放下标转至最新歌曲
                state.playListIndex = state.playList.length - 1
            }
        },
        //关注
        updateconcernlist(state, value) {
            // console.log(value);
            // let res = Object.keys(value.follows);
            // console.log(res);
            state.userInfos.follows = value
        },
        updatefollowedslist(state, value) {
            // console.log(value);
            state.userInfos.followeds = value
        }
    },
    // dispatch：含有异步操作,数据提交至actions ，可用于向后台提交数据
    actions: {
        // getLogin: async function (context, value) {
        //     let res = await getPhoneLogin(value)
        //     await context.commit('updateCookies', res.data.cookie)
        //     //获取用户信息
        //     await context.dispatch('getUserInfos')
        //     //获取用户歌单信息
        //     await context.dispatch('getUserMusicList', res.data.account.id)
        //     //获得用户最喜爱歌单歌曲
        //     await context.dispatch('getFavoriteSongList')
        //     // console.log(res)
        //     return res
        // },

        //异步获得歌词数据
        getLyric: async function (context, value) {
            let res = await getMusicLyric(value)
            // console.log(res)
            context.commit("updateLyricList", res.lrc)
        },
        //异步获得评论数据
        getComment: async function (context, value) {
            let res = await getMusicComment(value)
            if (res.data.comments.length > 0) {
                // console.log(res)
                if (value.isChange === true) {
                    context.commit("updateComment", res.data.comments)
                    return res.data.totalCount
                } else {
                    await context.commit("addComment", res.data.comments)
                    return res.data.totalCount
                }
            } else {

                // console.log("当前歌曲没有评论数据", res)
                return 0
            }

        },
        //异步获得个人信息
        getUserInfos: async function (context, value) {
            let res = await getAccount(encodeURIComponent(localStorage.getItem('cookie')))

            let levelRes = await getLevel(encodeURIComponent(localStorage.getItem('cookie')))
            // console.log(levelRes);
            // console.log(res)
            // console.log(context.state.userInfos)
            if (res.profile != null ||
                res.account != null ||
                context.state.isLogin ||
                context.state.token ||
                localStorage.getItem('token')) {
                // console.log("用户数据已更新")
                context.commit("updateUserInfos", res.profile)
                context.commit('updateUserInfos', levelRes.data)
                // console.log(res, levelRes, context.state.userInfos)

            } else {
                // console.log("当前没有获取到登陆状态")
            }

        },
        //异步获得个人歌单信息
        getUserMusicList: async function (context, value) {
            // console.log(value);
            let res = await getUserMusicList(value, encodeURIComponent(localStorage.getItem('cookie')))
            let tempArr = []
            for (let i = 1; i < res.playlist.length; i++) {
                tempArr.push(res.playlist[i])
            }
            // console.log(tempArr)
            context.commit('updateUserFavoriteMusicList', res.playlist[0])
            context.commit('updateUserFavoriteMusicListId', res.playlist[0].id)
            context.commit('updateUserMusicList', tempArr)
        },
        //异步获得最喜爱歌单
        getFavoriteSongList: async function (context, value) {
            let res = await getMusicListSongAll(
                context.state.userFavoriteMusicListId,
                localStorage.getItem('cookie'))
            context.commit('updateUserFavoriteSongList', res.data.songs)
        },
        //异步获取关注,粉丝
        getconcernlist: async function (context, value) {
            // console.log(context.state.userInfos.id);
            let res = await getconcernlist(context.state.userInfos.userId)
            let res1 = await getfollowedslist(context.state.userInfos.userId)
            // console.log(res);
            context.commit('updateconcernlist', res.follow)
            context.commit('updatefollowedslist', res1.followeds)
        }
    },
    modules: {

    },
    //持久化vuex(默认持久化state中所有)
    plugins: [createPersistedState({
        storage: window.sessionStorage  // 同localStorage相同，只是将vuex的所有值存储到sessionStorage中
    })]
})