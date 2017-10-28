import Vue from 'vue'
import util from 'util'
import { remote } from 'electron';
import { ls } from '../../plugins/storage'
import path from 'path'
import fs from 'fs-extra'

const DEFAULT_LINEAR_BG = `linear-gradient(to left, rgba(93, 213, 245, 0.5), rgba(89, 234, 167, 0.5))`

const state = {
  themeColor: 'light-blue',
  usingSourceName: 'dongmanzhijia',
  savePath: remote.app.getPath('downloads'),
  isNeedDesktopNotice: false,
  backgroundImageSrc: path.join(__static, './background.jpg')
}

const getters = {
  usingSource (state, getters, rootState) {
    let source = rootState.comic.comicSources.find(source => {
      return source.name === state.usingSourceName
    })
    return source
  },
  backgroundImageData (state) {
    let data
    try {
      let base64data = fs.readFileSync(state.backgroundImageSrc).toString('base64')
      const ext = path.extname(state.backgroundImageSrc)
      data = `url(data:image/${ext === 'jpg' ? 'jpeg' : 'png'};base64,${base64data})`
    } catch (error) {
      // 读取背景图片失败时
      data = DEFAULT_LINEAR_BG
    }
    return data
  }
}

const mutations = {
  setUsingSourceName (state, usingSourceName) {
    state.usingSourceName = usingSourceName
  },
  setThemeColor (state, color) {
    state.themeColor = color
  },
  setSavePath (state, savePath) {
    state.savePath = savePath
  },
  setBackgroundImageSrc (state, backgroundImageSrc) {
    state.backgroundImageSrc = backgroundImageSrc
  },
  setDeskTopNotice (state, isNeed) {
    state.isNeedDesktopNotice = isNeed
  },
  setUserSetting (state, setting) {
    for (let key in setting) {
      if (setting.hasOwnProperty(key)) {
        state[key] = setting[key]
      }
    }
  },
  saveUserSetting (state, obj) {
    ls.set('USER_SETTING', state)
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
