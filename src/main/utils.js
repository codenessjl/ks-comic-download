import {app} from 'electron'
import path from 'path'
import crypto from 'crypto'

export const ipcMsg = {
  /**
   * 返回一个ipc成功消息
   * 
   * @param {any} data 
   * @returns {Object}
   */
  success (data) {
    return {
      success: true,
      message: '',
      data: data
    }
  },
  /**
   * 返回一个ipc失败消息
   * 
   * @param {String} msg 
   * @returns {Object}
   */
  failed (msg) {
    return {
      success: false,
      message: msg,
      data: null
    }
  }
}

const TEMP_DIR_NAME = 'KS_COMIC_TEMP'
const TEMP_DIR = path.join(app.getPath('temp'), TEMP_DIR_NAME)
/**
 * 获取缓存文件夹路径
 * 
 * @returns {String}
 */
export function getTempDir () {
  return TEMP_DIR
}

/**
 * md5的字符串hash
 * 
 * @param {String} str 
 * @returns {String}
 */
export function hash(str) {
  const md5 = crypto.createHash('md5')
  return md5.update(str).digest('hex')
}

/**
 * 休眠一段时间
 * 
 * @param {Number} time 
 * @returns {Promise}
 */
export function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve()
    }, time);
  })
}