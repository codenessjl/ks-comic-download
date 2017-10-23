import Vue from 'vue'
import IpcEvent from '../../plugins/ipcEvent'
import electron from 'electron'
import path from 'path'

class DownloadEntity {
  constructor (entity) {

    // 下载列表是中显示的标题名
    this.name = `${entity.comicName} - ${entity.sectionTitle} - ${entity.chapter.title}`
    // 需要下载的图片总数
    this.sumNum = 0;
    // 已经下载的图片数
    this.downloadedNum = 0;

    // 漫画信息
    this.comicName = entity.comicName
    this.coverUrl = entity.coverUrl
    this.sectionTitle = entity.sectionTitle
    this.chapter = entity.chapter

    this.savePath = ''
  }
}

const state = {
  list: [],
  notices: [],
  isDownloading: false
}

const getters = {
  
}

const mutations = {
  addListItem (state, newItem) {
    state.list.push(newItem)
  },
  startDownload (state) {
    state.isDownloading = true
  },
  initEntity (state, data) {
    const entity = state.list[0]
    entity.sumNum = data.sumNum
    entity.savePath = data.savePath
  },
  updateEntityProgress (state, data) {
    const entity = state.list[0]
    entity.downloadedNum = data
  },
  finishEntity (state, isNeedNotice) {
    let finished = state.list.shift()
    state.notices.push(finished)
    if (isNeedNotice) {
      // 下载完成桌面提示
      new Notification({
        title: '提示',
        body: finished.name + '下载完毕'
      })
    }
  },
  clearNotices (state) {
    state.notices = []
  }
}

const actions = {
  /**
   * 添加下载任务
   * 
   * @param {any} { state, commit, dispatch } 
   * @param {any} source 
   */
  addDownloadSection ({ state, commit, dispatch }, source) {
    const comicName = source.comicName,
          coverUrl = source.coverUrl,
          sectionTitle = source.sectionTitle

    source.chapters.forEach(function(chapter) {
      commit('addListItem', new DownloadEntity({ comicName, coverUrl, sectionTitle, chapter }))
    })

    dispatch('toast/show', {
      color: 'success',
      text: '已添加到下载队列'
    }, { root: true })

    if (!state.isDownloading) {
      commit('startDownload')
      dispatch('startOneEntity')
    }
  },
  startOneEntity ({ state, commit, rootState }) {
    IpcEvent.send('download', state.list[0], rootState.setting.savePath)
  }
}

/**
 * 初始化下载任务（获得漫画页数，进度条初始化）
 */
IpcEvent.on('download-init', ({event, store, router}, data) => {
  store.commit('download/initEntity', data)
})

/**
 * 更新下载进度
 */
IpcEvent.on('download-progress', ({event, store, router}, data) => {
  store.commit('download/updateEntityProgress', data)
})

/**
 * 完成一个下载任务
 */
IpcEvent.on('download-finish', ({event, store, router}, data) => {
  store.commit('download/finishEntity', store.state.setting.isNeedDesktopNotice)
  if (store.state.download.list.length > 0) {
    store.dispatch('download/startOneEntity')
  }
})

IpcEvent.on('download-error', ({event, store, router}, data) => {
  store.dispatch('toast/show', {
    color: 'error',
    text: '客户端出现了一个错误'
  })
  console.error(data)
})

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
