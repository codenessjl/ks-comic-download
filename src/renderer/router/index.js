import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      // 主页
      path: '/index',
      name: 'index',
      component: require('@/components/Index')
    },
    {
      path: '/userSetting',
      name: 'user-setting',
      component: require('@/components/UserSetting')
    },
    {
      path: '/projectInfo',
      name: 'project-info',
      component: require('@/components/ProjectInfo')
    },
    {
      path: '/searchList',
      name: 'search-list',
      component: require('@/components/SearchList')
    },
    {
      path: '/comicDetail',
      name: 'comic-detail',
      component: require('@/components/ComicDetail')
    },
    {
      path: '/downloadInfo',
      name: 'download-info',
      component: require('@/components/DownloadInfo')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
