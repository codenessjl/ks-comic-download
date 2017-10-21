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
  setComicSections (state, sections) {
    sections.forEach((section) => {
      section.chapters.forEach((chapter) => {
        chapter.selected = false
      })
    })
    Vue.set(state.list[state.currentWatchIndex], 'sections', sections)
  },
  setCurrentWatchIndex (state, index) {
    state.currentWatchIndex = index
  },
  toggleChapter (state, {iSection, iChapter}) {
    const chapter = state.list[state.currentWatchIndex].sections[iSection].chapters[iChapter]
    chapter.selected = !chapter.selected
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
