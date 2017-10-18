<template>
  <v-layout>
    <v-progress-linear :indeterminate="true" :color="themeColor" v-if="loading"></v-progress-linear>
    <v-flex v-else-if="comic != null" xs12>
      <v-btn flat :color="themeColor" :to="backRoute"><v-icon>keyboard_arrow_left</v-icon>返回列表</v-btn>
      <v-subheader>漫画信息</v-subheader>
      <v-layout class="comic-main">
        <v-flex xs5 sm4 md3 class="comic-cover ml-4">
          <img :src="comic.coverUrl">
        </v-flex>
        <v-flex xs5 offset-xs2 sm7 offset-sm1 md8 offset-md1>
          <v-flex class="mb-2" xs12>漫画名: {{comic.name}}</v-flex>
          <v-flex class="mb-2" xs12>作者: {{comic.author}}</v-flex>
          <v-flex class="mb-2" xs12>地区: {{comic.country}}</v-flex>
          <v-flex class="mb-2" xs12>类型: {{comic.type}}</v-flex>
          <v-flex class="mb-2" xs12>简介: {{comic.desc}}</v-flex>
        </v-flex>
      </v-layout>
      <v-subheader>章节信息</v-subheader>
      <v-tabs dark v-model="currentSection">
        <v-tabs-bar :class="{[themeColor]: true}">
          <v-tabs-slider class="yellow"></v-tabs-slider>
          <v-tabs-item v-for="(section, index) in comic.detail" :key="index" :href="`#section-${index}`" ripple>{{section.sectionTitle}}</v-tabs-item>
        </v-tabs-bar>
        <v-tabs-items>
          <v-tabs-content v-for="(section, index) in comic.detail" :key="index" :id="`section-${index}`">
            <v-container fluid grid-list-md>
              <v-layout row wrap>
                <v-flex xs4 sm3 md2 v-for="(chapter, i) in section.chapters" :key="i">
                  <v-checkbox :label="chapter.title" v-model="downloadGroup" :value="chapter" light></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-flex>
    <h4 class="text-xs-center" v-else>找不到对应的漫画，请重新搜索</h4>
  </v-layout>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import {ipcRenderer} from 'electron'

export default {
  name: 'comic-detail',
  data () {
    return {
      loading: false,
      currentSection: null,
      downloadGroup: []
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
  created () {
    let currentWatchIndex = this.$store.state.comic.list.indexOf(this.$route.params.comic)
    this.$store.commit('comic/setCurrentWatchIndex', currentWatchIndex)
    ipcRenderer.on('getComicDetail-res', (event, res) => {
      if (res.success) {
        this.$store.commit('comic/setComicDetail', res.data)
      } else {
        this.$store.dispatch('toast/show', {
          color: 'error',
          text: res.message
        })
      }
    })
    this.$nextTick(() => {
      if (this.comic && (!this.comic.detail || this.comic.detail.length === 0)) {
        ipcRenderer.send('getComicDetail', this.comic)
      }
    })
  },
  beforeDestory () {
    ipcRenderer.removeAllListeners('getComicDetail-res')
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
</style>
