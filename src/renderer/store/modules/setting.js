import Vue from 'vue'
import util from 'util'
import { ls } from '../../plugins/storage'
import path from 'path'

const state = {
  themeColor: 'light-blue',
  usingSourceName: 'dongmanzhijia',
  savePath: path.join(__static, '../download')
}

const getters = {
  usingSource (state, getters, rootState) {
    let source = rootState.comic.comicSources.find(source => {
      return source.name === state.usingSourceName
    })
    return source
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
