export default class BasicSpider {

  static SOURCE_NAME = ''

  /**
   * 初始化需要的变量
   * @memberof BasicSpider
   */
  constructor () {}

  /**
   * @typedef Comic - 漫画对象
   * @property {String} name - 漫画名称,
   * @property {String} author - 作者,
   * @property {String} siteUrl - 网站链接,
   * @property {String} coverUrl - 封面地址,
   * @property {String} desc - 漫画简介,
   * @property {String} country - 国家地区,
   * @property {String} type - 漫画类别
   */
  /**
   * 通过漫画名称搜索漫画
   * 
   * @async
   * @param {String} keyword 
   * @memberof BasicSpider
   * @returns {Array<Comic>}
   */
  async search (keyword) {}

  /**
   * @typedef Chapter - 漫画章节对象
   * @property {String} title - 章节标题
   * @property {String} url - 章节URL
   */
  /**
   * @typedef Section - 漫画章节分块对象
   * @property {String} sectionTitle - 章节块名称
   * @property {Array<Chapter>} chapters - 章节数组
   */
  /**
   * 通过漫画对象获取漫画章节信息
   * 
   * @async
   * @param {Comic} comic 
   * @memberof BasicSpider
   * @returns {Array<Section>}
   */
  async getComicSections (comic) {}

  /**
   * 下载某章节漫画
   * 
   * @param {DownloadEntity} entity 下载内容对象
   * @param {String} savePath 下载路径
   * @param {Object} operate {init, update, finish}
   * @memberof BasicSpider
   */
  async downloadChapter (entity, savePath, operate) {}
}
