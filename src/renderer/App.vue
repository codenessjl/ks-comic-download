<template>
  <v-app>
    <!-- 侧边导航栏 -->
    <v-navigation-drawer temporary app v-model="drawer">
      <v-list>
        <template v-for="(item, i) in items">
          <v-list-tile @click="goTo(item.to)" :key="i">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <!-- 顶部工具条 -->
    <v-toolbar app fixed dark :color="themeColor">
      <v-toolbar-title class="ml-0 pl-2">
        <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
        <span>KS漫画下载</span>
      </v-toolbar-title>
      <v-text-field 
          dark
          color="white"
          class="mx-4 search-input"
          tabindex="2"
          v-model="searchName"
          append-icon="search"
          :append-icon-cb="searchComic"
          @keypress.enter="searchComic"
          placeholder="输入漫画名称" ></v-text-field>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <div class="hidden-sm-and-down">
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="goTo('/')"><v-icon>home</v-icon></v-btn>
          <span>首页</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="goTo('/userSetting')"><v-icon>settings</v-icon></v-btn>
          <span>个性设置</span>
        </v-tooltip>
        <!-- 下载完成消息 -->
        <v-menu bottom left>
          <v-btn icon slot="activator">
            <v-badge right :color="`${themeColor} darken-3`" overlap>
              <span slot="badge" dark v-if="haveNotice">{{notices.length}}</span>
              <v-icon>notifications</v-icon>
            </v-badge>
          </v-btn>
          <v-list dense class="notice-list">
            <v-subheader v-if="!haveNotice">暂无下载完成消息</v-subheader>
            <v-btn absolute right icon flat v-show="haveNotice" @click="clearNotices"><v-icon>delete</v-icon></v-btn>
            <v-list-tile avatar v-for="(notice, index) in notices" :key="index">
              <v-list-tile-avatar>
                <v-avatar><img :src="notice.coverUrl"></v-avatar>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ notice.name }} 下载完成</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple v-electron-link.folder="notice.savePath">
                  <v-icon color="grey lighten-1">folder</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
    <main :style="appBackground">
      <v-content>
        <v-container fluid fill-height>
          <transition name="page" appear mode="out-in">
            <router-view></router-view>
          </transition>
        </v-container>
      </v-content>
    </main>
    <!-- 提示信息框 -->
    <v-snackbar
      :timeout="toastTimeout"
      :color="toastColor"
      v-model="toastShow">
      {{toastText}}
      <v-btn dark flat @click="closeToast">关闭</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      drawer: false,
      items: [
        { icon: 'home', text: '主页', to: '/index' },
        { icon: 'file_download', text: '下载状态', to: '/downloadInfo' },
        { icon: 'settings', text: '个性设置', to: '/userSetting' },
        { icon: 'info', text: '项目介绍', to: '/projectInfo' },
      ],
      transitionName: 'page-left'
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.setting.themeColor,
      sourceName: state => state.setting.usingSourceName,
      savePath: state => state.setting.savePath,
      notices: state => state.download.notices
    }),
    // toast相关属性
    ...mapState('toast', {
      toastColor: 'color',
      toastText: 'text',
      toastTimeout: 'timeout'
    }),
    toastShow: {
      get () {
        return this.$store.state.toast.show
      },
      set (value) {
        if (!value) {
          this.closeToast()
        }
      }
    },
    searchName: {
      get () {
        return this.$store.state.comic.searchName
      },
      set (value) {
        this.$store.commit('comic/setSearchName', value)
      }
    },
    appBackground () {
      const bgData = this.$store.getters['setting/backgroundImageData']
      return {
        backgroundImage: `url(${bgData})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    },
    haveNotice () {
      return this.notices.length > 0
    }
  },
  methods: {
    /**
     * 搜索漫画
     */
    searchComic () {
      if (!this.searchName) {
        this.$store.dispatch('toast/show', {
          color: 'error',
          text: '漫画名称不能为空 '
        })
        return
      }
      // 切换到搜索页面
      this.goTo({
        path: '/searchList',
        query: {
          searchName: this.searchName
        }
      })
    },
    /**
     * 切换路由
     * @param {Object|String} route 路由对象
     */
    goTo (route) {
      this.$router.push(route)
    },
    /**
     * 关闭toast
     */
    closeToast () {
      this.$store.dispatch('toast/close')
    },
    clearNotices () {
      this.$store.commit('download/clearNotices')
    },
    /**
     * 初始化应用
     */
    init () {
      let comicSources = this.$ipc.sendSync('getComicSources')
      this.$store.commit('comic/setComicSources', comicSources)
      // 初始化用户设置
      let userSetting = this.$ls.get('USER_SETTING')
      this.$store.commit('setting/setUserSetting', userSetting)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style>
html, body {
  font-family: Roboto, "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  overflow-y: auto;
}
.search-input {
  max-width: 400px;
}
.bg-opacity {
  background: rgba(255,255,255,0.65) !important;
}
.bg-opacity > table {
  background: none !important;
}
.page-enter-active, .page-leave-active {
  transition: all 0.3s ease 0s;
}
.page-enter, .page-leave-to {
  opacity: 0;
}
.notice-list {
  min-width: 200px;
  min-height: 50px;
  max-height: 90vh;
}
</style>
