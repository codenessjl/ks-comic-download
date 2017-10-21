import router from '../router'
import store from '../store'
import {ipcRenderer} from 'electron'
import electron from 'electron'

/**
 * @typedef IpcEventResponseEntity - ipc事件响应对象
 * @property {Boolean} success - 是否成功
 * @property {String} message - 响应信息
 * @property {Object} data - 响应结果数据
 */

/**
 * 生成一个响应事件handler
 * 
 * @param {Function} callback 
 * @returns {Function}
 */
function responseHandlerGenerate (callback) {
  /**
   * 生成的响应事件handler
   * 
   * @param {electron.Event} event 
   * @param {IpcEventResponseEntity} res 
   */
  const responseHandler = (event, res) => {
    if (res.success) {
      callback.call(null, { event, store, router }, res.data)
    } else {
      store.dispatch('toast/show', {
        color: 'error',
        text: res.message
      })
    }
  }
  return responseHandler
}

/**
 * 封装ipcRenderer的 on 事件绑定
 * 
 * @param {String} channel 
 * @param {Function} callback 
 */
const on = function on(channel, callback) {
  ipcRenderer.on(channel, responseHandlerGenerate(callback))
  return {
    finally (fn) {
      ipcRenderer.on(channel, fn)
    }
  }
}

/**
 * 封装ipcRenderer的 removeAllListeners 方法
 * 
 * @param {String} channel 
 */
const clear = function clear(channel) {
  ipcRenderer.removeAllListeners(channel)
}

/**
 * 发送异步信息
 * 
 * @param {String} channel 
 */
const send = function send(channel, ...args) {
  ipcRenderer.send(channel, ...args)
}

/**
 * 发送同步信息
 * 
 * @param {String} channel 
 */
const sendSync = function sendSync(channel, ...args) {
  const res = ipcRenderer.sendSync(channel, ...args)
  if (res.success) {
    return res.data
  } else {
    store.dispatch('toast/show', {
      color: 'error',
      text: res.message
    })
  }
}

export default {
  on, clear, send, sendSync,
  install (Vue) {
    Vue.prototype.$ipc = {
      on, clear, send, sendSync
    }
  }
}