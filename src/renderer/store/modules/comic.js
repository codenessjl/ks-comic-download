import Vue from 'vue'

const state = {
  latestSearchName: '',
  searchName: '',
  comicSources: [],
  list: [],
  currentWatchIndex: -1
}

const getters = {
  currentComic (state) {
    if (state.currentWatchIndex !== -1) {
      return state.list[state.currentWatchIndex]
    } else {
      return null
    }
  }
}

const mutations = {
  setList (state, list) {
    state.list = list
  },
  clearList (state) {
    state.list = []
  },
  setComicSources (state, comicSources) {
    state.comicSources = comicSources
  },
  setSearchName (state, value) {
    state.searchName = value
  },
  saveLatestSearchName (state) {
    state.latestSearchName = state.searchName
    state.searchName = ''
  },
  setComicDetail (state, detail) {
    Vue.set(state.list[state.currentWatchIndex], 'detail', detail)
  },
  setCurrentWatchIndex (state, index) {
    state.currentWatchIndex = index
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
