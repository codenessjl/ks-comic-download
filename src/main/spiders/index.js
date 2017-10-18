import BasicSpider from './BasicSpider'

// 保存所有的爬虫源类
const sources = {}
// 保存实例化的爬虫类实例
const instances = {}

const files = require.context('./sources/', false, /\.js$/)
files.keys().forEach(key => {
  sources[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default {
  /**
   * 获取一个漫画类的实例
   * 
   * @param {String} name 
   * @returns {BasicSpider}
   */
  getSourceInstance (name) {
    // 如果当前没有实例化的类对象，就实例化一个对象并添加到instances集合中
    if (!instances[name]) {
      instances[name] = new sources[name]()
    }
    return instances[name]
  },
  /**
   * 获取所有漫画源的信息
   * 
   * @returns 
   */
  getSourceInfo () {
    let info = []
    for (var key in sources) {
      if (sources.hasOwnProperty(key)) {
        var source = sources[key]
        info.push({
          name: key,
          text: source.SOURCE_NAME
        })
      }
    }
    return info
  }
}
