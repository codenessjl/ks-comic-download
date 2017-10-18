import Vue from 'vue'

const state = {
  show: false,
  text: '',
  color: 'info',
  timeout: 3000
}

const getters = {
}

const mutations = {
  setText (state, text) {
    state.text = text
  },
  setColor (state, color) {
    state.color = color
  },
  setShow (state, show) {
    state.show = show
  }
}

const actions = {
  show ({ commit }, ops) {
    commit('setText', ops.text)
    commit('setColor', ops.color)
    commit('setShow', true)
  },
  close ({ commit }) {
    commit('setText', '')
    commit('setShow', false)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
