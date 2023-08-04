import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import store from '../store/index.js'
//路由对象
const routes = [

    {
        path: '/',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/home.vue')
    },
    {
        path: '/local',
        name: 'local',
        component: () => import('../views/local.vue')
    },
    {
        path: '/songArtists',
        name: 'songArtists',
        component: () => import('../views/songArtists.vue')
    },
    {
        path: '/musicList',
        name: 'musicList',
        component: () => import('../views/musicListView.vue')
    },
    {
        path: '/songResults',
        name: 'songResults',
        component: () => import('../views/songResults.vue')
    },
    {
        path: '/userInfo',
        name: 'userInfo',
        //路由守卫
        beforeEnter: (to, from, next) => {
            if (store.state.isLogin || store.state.token || localStorage.getItem('token') || localStorage.getItem('cookie')) {
                next()
            } else {
                let myAudio = document.getElementById('mp')
                myAudio.pause()
                store.commit('updateIsPlaying', false)
                next('/')
            }
        },
        component: () => import('../views/userInfo.vue')
    },
    {
        path: '/userMusicList',
        name: 'userMusicList',
        component: () => import('../views/userMusicList.vue')
    },
    {
        path: '/userMusicListFavorite',
        name: 'userMusicListFavorite',
        component: () => import('../views/userMusicListFavorite.vue')
    },
    {
        path: '/concern',
        name: 'concern',
        component: () => import('../views/concern.vue')
    },
    {
        path: '/artistlnfos',
        name: 'artistlnfos',
        component: () => import('../views/artistlnfos.vue')
    }
]

const router = createRouter(
    {
        //history模式
        history: createWebHistory('/'),
        //hash 模式
        // history: VueRouter.createWebHashHistory(),
        routes,
    }
)
export default router
