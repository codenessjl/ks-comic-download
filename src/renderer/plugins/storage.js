/**
 * Storage 父类
 * @class Storage
 */
class Storage {
  constructor (storage) {
    this.storage = storage
  }

  /**
   * 获取一个storage的存储对象
   * 
   * @param {String} key 
   * @returns {String|Object}
   * @memberof Storage
   */
  get (key) {
    let str = this.storage.getItem(key)
    let res = ''
    if (str) {
      try {
        res = JSON.parse(str)
      } catch (error) {
        res = str
      }
    }
    return res
  }

  /**
   * 设置一个storage的存储对象
   * 
   * @param {String} key 
   * @param {String} data 
   * @returns {Storage}
   * @memberof Storage
   */
  set (key, data) {
    try {
      // 存储的是JSON字符串
      this.storage.setItem(key, JSON.stringify(data))
    } catch (err) {
      // 存储的不是JSON字符串
      this.storage.setItem(key, data)
    }
    return this
  }

  /**
   * 删除一个storage的存储对象
   * 
   * @param {String} key 
   * @returns {Storage}
   * @memberof Storage
   */
  remove (key) {
    this.storage.removeItem(key)
    return this
  }

  /**
   * 删除storage的所有存储对象
   * 
   * @returns {Storage}
   * @memberof Storage
   */
  clear () {
    this.storage.clear()
    return this
  }
}

/**
 * Storage的localStorage实现类
 * @class LocalStorage
 * @extends {Storage}
 */
class LocalStorage extends Storage {
  constructor () {
    super(window.localStorage)
  }
}

export const ls = new LocalStorage()

export default {
  install (Vue) {
    Vue.prototype.$ls = ls
  }
}
