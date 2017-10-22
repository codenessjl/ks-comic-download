<template>
  <div>
    <v-subheader>软件使用步骤</v-subheader>
    <v-stepper non-linear class="bg-opacity" v-model="step">
      <v-stepper-header v-model="step">
        <v-stepper-step step="1" editable>搜索漫画</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" editable>下载章节</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" editable>查看下载状态</v-stepper-step>
      </v-stepper-header>
      <v-stepper-content step="1">
        <v-layout class="step-item">
          <ol>
            <li>
              <p>在顶部的搜索框内输入要搜索的漫画的关键字</p>
              <img class="step-img" :src="'static/step1-1.jpg'">
            </li>
            <li>
              <p>选择你要下载的漫画</p>
              <img class="step-img" :src="'static/step1-2.jpg'">
            </li>
          </ol>
        </v-layout>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-layout class="step-item">
          <ol>
            <li>
              <p>选择要下载的漫画的章节</p>
              <img class="step-img" :src="'static/step2-1.jpg'">
            </li>
            <li>
              <p>点击下载按钮</p>
              <img class="step-img" :src="'static/step2-2.jpg'">
            </li>
          </ol>
        </v-layout>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-layout class="step-item">
          <ol>
            <li>
              <p>打开侧边栏</p>
              <img class="step-img" :src="'static/step3-1.jpg'">
            </li>
            <li>
              <p>选择“下载状态”</p>
              <img class="step-img" :src="'static/step3-2.jpg'">
            </li>
            <li>
              <p>查看下载进度信息</p>
              <img class="step-img" :src="'static/step3-3.jpg'">
            </li>
          </ol>
        </v-layout>
      </v-stepper-content>
      <v-flex xs4 d-flex>
        <v-btn :color="themeColor" class="white--text" @click="prevStep" :disabled="step <= 1">上一步</v-btn>
        <v-btn :color="themeColor" class="white--text" @click="nextStep" :disabled="step >= 3">下一步</v-btn>
      </v-flex>
    </v-stepper>    
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'usage-steps',
  data() {
    return {
      step: 1
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.setting.themeColor
    })
  },
  methods: {
    nextStep () {
      this.step = parseInt(this.step) + 1
    },
    prevStep () {
      this.step = parseInt(this.step) - 1
    }
  }
}
</script>

<style scoped>
.step-item {
  min-height: 300px;
}
.step-img {
  max-width: 100%;
}
</style>
