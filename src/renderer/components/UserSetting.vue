<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-subheader><v-icon>color_lens</v-icon>配色主题</v-subheader>
      <v-avatar @click="setThemeColor(theme)" :key="theme" v-for="theme in supportThemes" :class="{[theme]: true,active: theme === themeColor}" class="mx-3 mb-3" :tile="true" :size="'32px'"></v-avatar>
    </v-flex>
    <v-flex xs10>
      <v-subheader>漫画源选择</v-subheader>
      <v-select 
        :items="comicSources"
        class="mx-3"
        v-model="usingSource"
        single-line></v-select>
    </v-flex>
    <v-flex xs10>
      <v-subheader>漫画保存路径</v-subheader>
      <v-text-field
        readonly
        class="mx-3"
        prepend-icon="folder_open"
        :color="themeColor"
        v-model="savePath"
        @click="setNewSavePath"></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-btn @click="saveUserSetting">保存设置</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapState} from 'vuex'
import {ipcRenderer, remote} from 'electron'
export default {
  name: 'user-setting',
  data () {
    return {
      saving: false,
      supportThemes: ['light-blue', 'red', 'deep-purple', 'green', 'orange', 'grey']
    }
  },
  computed: {
    ...mapState({
      comicSources: state => state.comic.comicSources
    }),
    ...mapState('setting', {
      themeColor: 'themeColor'
    }),
    usingSource: {
      get () {
        return this.$store.getters['setting/usingSource']
      },
      set (value) {
        this.$store.commit('setting/setUsingSourceName', value.name)
      }
    },
    savePath: {
      get () {
        return this.$store.state.setting.savePath
      },
      set (value) {
        this.$store.commit('setting/setSavePath', value)
      }
    }
  },
  methods: {
    setThemeColor (themeColor) {
      this.$store.commit('setting/setThemeColor', themeColor)
    },
    setNewSavePath () {
      remote.dialog.showOpenDialog({
        //默认路径
        // defaultPath: 'Desktop',
        //选择操作，此处是打开文件夹
        properties: [
          'openDirectory',
        ],
        //过滤条件
        filters: [
          { name: 'All', extensions: ['*'] },
        ]
      }, (filePaths) => {
        if (filePaths && filePaths.length > 0) {
          this.savePath = filePaths[0]
        }
      })
    },
    saveUserSetting () {
      this.saving = true
      this.$store.commit('setting/saveUserSetting')
      this.$store.dispatch('toast/show', {
        color: 'success',
        text: '保存成功'
      })
      this.saving = false
    }
  }
}
</script>

<style scoped>
.avatar.active {
  position: relative;
}
.avatar.active:after {
  content: " ";
  position: absolute;
  border: 2px solid #fff;
  box-shadow: 0px 0px 2px rgba(0,0,0, 0.8);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
