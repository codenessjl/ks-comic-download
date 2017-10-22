<template>
  <v-layout row wrap>
    <v-progress-linear indeterminate :color="themeColor" v-if="loading"></v-progress-linear>
    <v-flex v-else-if="comic != null" xs12>
      <v-btn flat :color="themeColor" :to="backRoute"><v-icon>keyboard_arrow_left</v-icon>返回列表</v-btn>
      <v-subheader>漫画信息</v-subheader>
      <v-layout row wrap class="comic-main">
        <v-flex xs12 sm4 md3 class="comic-cover ml-4">
          <img :src="comic.coverUrl">
        </v-flex>
        <v-flex xs12 sm6 offset-sm1 md7 offset-md1>
          <v-flex class="mb-2" xs12>漫画名: {{comic.name}}</v-flex>
          <v-flex class="mb-2" xs12>作者: {{comic.author}}</v-flex>
          <v-flex class="mb-2" xs12>地区: {{comic.country}}</v-flex>
          <v-flex class="mb-2" xs12>类型: {{comic.type}}</v-flex>
          <v-flex class="mb-2" xs12>简介: {{comic.desc}}</v-flex>
        </v-flex>
      </v-layout>
      <v-subheader>章节信息</v-subheader>
      <v-flex xs12 v-if="!comic.sections" justify-center>
        <v-progress-circular indeterminate :color="themeColor"></v-progress-circular>
      </v-flex>
      <v-flex v-else xs12 v-for="(section, iSection) in comic.sections" :key="iSection">
        <v-card class="bg-opacity elevation-2">
          <v-btn class="btn-fr" :color="themeColor" @click="selectAllChapters(section.chapters)" flat>选择全部</v-btn>
          <v-subheader>{{section.sectionTitle}}</v-subheader>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex xs4 sm3 md2 v-for="(chapter, iChapter) in section.chapters" :key="iChapter">
                <v-checkbox :label="chapter.title" :input-value="chapter.selected" @change="toggleChapter(iSection, iChapter)" light></v-checkbox>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-btn class="mr-4 mb-4" :color="themeColor" fab dark fixed bottom right @click="pushToDownloadList">
        <v-icon>file_download</v-icon>
      </v-btn>
    </v-flex>
    <h4 class="text-xs-center" v-else>找不到对应的漫画，请重新搜索</h4>
  </v-layout>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
/**
 * @todo 主页（使用方法）编写
 */
export default {
  name: 'comic-detail',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.setting.themeColor,
      latestSearchName: state => state.comic.latestSearchName
    }),
    ...mapGetters({
      comic: 'comic/currentComic'
    }),
    backRoute () {
      return {
        path: '/searchList',
        query: {
          searchName: this.latestSearchName
        }
      }
    }
  },
  methods: {
    selectAllChapters (chapters) {
      chapters.forEach((chapter) => {
        chapter.selected = true
      })
    },
    toggleChapter (iSection, iChapter) {
      this.$store.commit('comic/toggleChapter', {
        iSection,
        iChapter
      })
    },
    pushToDownloadList () {
      this.comic.sections.forEach(section => {
        let downloadChapters = []
        section.chapters.forEach(chapter => {
          if (chapter.selected) {
            downloadChapters.push(chapter)
          }
        })
        this.$store.dispatch('download/addDownloadSection', {
          comicName: this.comic.name,
          coverUrl: this.comic.coverUrl,
          sectionTitle: section.sectionTitle,
          chapters: downloadChapters
        })
      })
    }
  },
  created () {
    let currentWatchIndex = this.$store.state.comic.list.indexOf(this.$route.params.comic)
    this.$store.commit('comic/setCurrentWatchIndex', currentWatchIndex)
    this.$ipc.on('getComicSections-res', ({ event, store, router }, data) => {
      store.commit('comic/setComicSections', data)
    })
    this.$nextTick(() => {
      if (this.comic && (!this.comic.sections || this.comic.sections.length === 0)) {
        this.$ipc.send('getComicSections', this.comic)
      }
    })
  },
  beforeDestory () {
    this.$ipc.clear('getComicSections-res')
  }
}
</script>

<style scoped>
.comic-main {
  height: auto !important;
}
.comic-cover img {
  width: 100%;
}
.btn-fr {
  float: right;
}
</style>
