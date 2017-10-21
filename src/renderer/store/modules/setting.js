import Vue from 'vue'
import util from 'util'
import { ls } from '../../plugins/storage'
import path from 'path'
import fs from 'fs-extra'

const state = {
  themeColor: 'light-blue',
  usingSourceName: 'dongmanzhijia',
  savePath: path.join(__static, '../download'),
  //TODO: 桌面提示开关，背景图片
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
    const ext = path.extname(state.backgroundImageSrc)
    return `data:image/${ext === 'jpg' ? 'jpeg' : 'png'};base64,${fs.readFileSync(state.backgroundImageSrc).toString('base64')}`
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
