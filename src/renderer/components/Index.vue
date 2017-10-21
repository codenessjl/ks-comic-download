<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-card>
        <v-card-media id="logo" :src="logo" alt="electron-vue" height="200px" contain></v-card-media>
      </v-card>
    </v-flex>
    <v-flex xs12 md6>
      <span class="title">
        Welcome to your new project!
      </span>
      <system-information></system-information>
    </v-flex>
    <v-flex xs12 md6>
      <div class="doc">
        <div class="title">Getting Started</div>
        <p>
          electron-vue comes packed with detailed documentation that covers everything from internal configurations, using the project structure, building your application, and so much more.
        </p>
        <button @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">Read the Docs</button><br><br>
      </div>
      <div class="doc">
        <div class="title alt">Other Documentation</div>
        <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
        <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapState} from 'vuex'
import SystemInformation from './LandingPage/SystemInformation'

//TODO: 主页
export default {
  name: 'index',
  data () {
    return {
      logo: require('@/assets/logo.png')
    }
  },
  computed: {
  },
  components: { SystemInformation },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style>
.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: .8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
