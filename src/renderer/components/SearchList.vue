<template>
  <v-layout wrap>
    <v-progress-linear indeterminate :color="themeColor" v-if="loading"></v-progress-linear>
    <v-flex v-else-if="haveComic" xs12>
      <v-list three-line>
        <v-subheader>漫画列表</v-subheader>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex xs6 sm4 md3 lg2 v-for="(comic, index) in comicList" :key="index">
              <div class="elevation-3 pa-2 comic-item">
                <img class="comic-cover" :src="comic.coverUrl"/>
                <router-link tag="h6" class="subheading comic-title text-xs-center mt-2" :class="{[themeColor + '--text']: true, 'text--darken-3': true}" :to="{name:'comic-detail', params: {comic}}">{{comic.name}}</router-link>
                <p class="comic-desc">{{comic.desc}}</p>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-list>
    </v-flex>
    <h4 class="text-xs-center" v-else>找不到对应的漫画，请检查搜索关键字是否错误</h4>
  </v-layout>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'search-list',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState({
      comicList: state => state.comic.list
    }),
    ...mapState({
      themeColor: state => state.setting.themeColor
    }),
    haveComic () {
      return this.comicList && this.comicList.length > 0
    }
  },
  methods: {
    fetchComicList () {
      // 获取搜索关键字
      let searchName = this.$route.query.searchName
      // 若关键字与当前保存的不同，则重新获取漫画列表
      if (searchName !== this.$store.state.comic.latestSearchName) {
        // 向主进程发送搜索请求
        this.loading = true
        this.$ipc.send('search', {
          searchName: searchName,
          sourceName: this.$store.state.setting.usingSourceName
        })
      }
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function () {
      this.fetchComicList()
    }
  },
  created () {
    // 搜索结果事件
    this.$ipc.on('search-res', ({ event, store, router }, data) => {
      store.commit('comic/setList', data)
    }).finally(() => {
      this.loading = false
      this.$store.commit('comic/saveLatestSearchName')
    })

    this.fetchComicList()
  },
  beforeDestory () {
    this.$ipc.clear('search-res')
  }
}
</script>

<style scoped>
.comic-item {
  height: 420px;
}
.comic-cover {
  width: 100%;
  height: 250px;
}
.comic-title {
  font-weight: bold;
  cursor: pointer;
}
.comic-title:hover {
  text-decoration: underline;
}
.comic-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  font-size: 13px;
}
</style>
