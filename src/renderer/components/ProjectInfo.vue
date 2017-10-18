<template>
  <v-layout wrap>
    <v-flex xs12 sm10 offset-sm1 md6 offset-md3 lg4 offset-lg4>
      <v-card>
        <v-card-title>
          <v-flex>
            <h5 class="text-xs-center">项目介绍</h5>
            <p>作者：<a href="https://github.com/hzxszsk"v-electron-link>KainStar</a></p>
            <p>
              框架、UI库：
              <a href="https://electron.atom.io/docs/" v-electron-link>Electron</a>、
              <a href="https://vuejs.org/" v-electron-link>Vue</a>、
              <a href="https://vuex.vuejs.org/zh-cn/" v-electron-link>Vuex</a>、
              <a href="https://router.vuejs.org/zh-cn/" v-electron-link>Vue-Router</a>、
              <a href="https://vuetifyjs.com/" v-electron-link>Vuetify</a>
            </p>
            <p>源代码地址：<a href="https://github.com/hzxszsk" v-electron-link>github</a></p>
          </v-flex>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'project-info',
  computed: {
    ...mapState({
      themeColor: state => state.setting.themeColor
    }),
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
