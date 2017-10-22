<template>
  <div>
    <v-subheader>软件使用步骤</v-subheader>
    <v-stepper non-linear class="bg-opacity" v-model="step">
      <v-stepper-header v-model="step">
        <template v-for="(stepper, index) in steppers">
          <v-stepper-step :step="index + 1" :key="index" editable>{{stepper.header}}</v-stepper-step>
          <v-divider v-if="index + 1 < steppers.length" :key="index"></v-divider>
        </template>
      </v-stepper-header>
      <v-stepper-content :step="index + 1" v-for="(stepper, index) in steppers" :key="index">
        <v-layout class="step-item">
          <ol>
            <li v-for="(content, cIndex) in stepper.contents" :key="cIndex">
              <p>{{content.text}}</p>
              <img class="step-img" :src="content.img">
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
      step: 1,
      steppers: [{
        header: '搜索漫画',
        contents: [{
          text: '在顶部的搜索框内输入要搜索的漫画的关键字',
          img: 'static/step1-1.jpg'
        }, {
          text: '选择你要下载的漫画',
          img: 'static/step1-2.jpg'
        }]
      }, {
        header: '下载章节',
        contents: [{
          text: '选择要下载的漫画的章节',
          img: 'static/step2-1.jpg'
        }, {
          text: '点击下载按钮',
          img: 'static/step2-2.jpg'
        }]
      }, {
        header: '查看下载状态',
        contents: [{
          text: '打开侧边栏',
          img: 'static/step3-1.jpg'
        }, {
          text: '选择“下载状态”',
          img: 'static/step3-2.jpg'
        }, {
          text: '查看下载进度信息',
          img: 'static/step3-3.jpg'
        }]
      }]
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
