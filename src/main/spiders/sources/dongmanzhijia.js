import BasicSpider from '../BasicSpider'
import superagent from 'superagent'
import {app} from 'electron'
// 如果需要修改编码，可以使用 superagent-charset 库
// require('superagent-charset')(request)
import cheerio from 'cheerio'
import url from 'url'
import path from 'path'
import fs from 'fs-extra'
import * as utils from '../../utils'

/**
 * 解析漫画图片地址用
 * @returns 
 */
function decodeImgUrl(p, a, c, k, e, d) {
	e = function (c) {
		return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
	}
	if (!''.replace(/^/, String)) {
		while (c--) {
			d[e(c)] = k[c] || e(c)
		}
		k = [function (e) {
			return d[e]
		}]
		e = function () {
			return '\\w+'
		}
		c = 1
	}
	while (c--) {
		if (k[c]) {
			p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
		}
	}
	return p
}

/**
 * Unicode转可读字符串
 * 
 * @param {String} unicodeStr 
 * @returns 
 */
function decodeUnicode(unicodeStr) {
	return unescape(unicodeStr.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'))
}

export default class DMZJSpider extends BasicSpider {

  static SOURCE_NAME = '动漫之家'

  constructor() {
    super()
    // 网站URL
    this.webUrl = 'http://manhua.dmzj.com/'
    // 获取图片URL
    this.imgUrlPrefix = 'http://images.dmzj.com/'
    // 漫画搜索URL
    this.searchUrl = 'http://s.acg.dmzj.com/comicsum/search.php'
    // 一般请求头
    this.header = {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
    }
    // 下载图片请求头
    this.imgHeader = {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
      "Referer": "http://manhua.dmzj.com/"
    }

    this.request = superagent.agent()

    this.tempDir = utils.getTempDir()
  }

  /**
   * 获取封面图片，并保存到缓存文件夹中
   * 
   * @param {String} coverUrl 
   * @returns {Promise<String>}
   * @memberof DMZJSpider
   */
  async fetchCoverImg (coverUrl) {
    const { request, tempDir, imgHeader } = this
    return new Promise((resolve, reject) => {
      const suffixWithDot = coverUrl.slice(coverUrl.lastIndexOf('.'))
      const tempFilePath = path.join(tempDir, utils.hash(coverUrl) + suffixWithDot)
      if (fs.existsSync(tempFilePath)) {
        // 文件存在，直接返回路径
        resolve('file:///' + tempFilePath)
      } else {
        let stream = fs.createWriteStream(tempFilePath)
        stream.on('close', () => {
          resolve('file:///' + tempFilePath)
        }).on('error', (err) => {
          reject(err)
        })
        request.get(coverUrl).set(imgHeader).pipe(stream)
      }
    })
  }

  /**
   * 获取一个章节的漫画图片地址数组
   * 
   * @async
   * @param {any} chapter 
   * @returns {Promise<String[]>}
   */
  async getComicPicUrl (chapter) {
    const {request, imgUrlPrefix} = this
    const chapterURL = chapter.url
    const res = await request.get(chapterURL)
    if (!res.ok) {
      throw new Error('无法获取该章节图片列表信息')
    } else {
      const $ = cheerio.load(res.text)
      const script = $('script').eq(0).html()
      // 获取当前章节的图片地址
      let pageEvalStr = script.substring(script.indexOf('return p}') + 9, script.indexOf(',0,{}))') + 6)
      pageEvalStr = eval('decodeImgUrl' + pageEvalStr)
      pageEvalStr = pageEvalStr.substring(pageEvalStr.indexOf('['), pageEvalStr.lastIndexOf(']') + 1)
      const pages = eval(pageEvalStr)
      return pages.map((partURL) => {
        return url.resolve(imgUrlPrefix, partURL)
      })
    }
  }


  /**
   * 
   * @override
   * @param {String} keyword 
   * @returns 
   * @memberof DMZJSpider
   */
  async search (keyword) {
    const {request, searchUrl, header} = this
    const res = await request.get(searchUrl).set(header).accept('json').query({s: keyword})
    if (res.ok) {
      // 获取漫画信息列表
      let comicList = res.text.substring(res.text.indexOf('['), res.text.length - 1)
      // Unicode转可读字符串再转JSON格式
      comicList = JSON.parse(decodeUnicode(comicList))
      const result = []
      for (let comic of comicList) {
        let coverUrl = await this.fetchCoverImg(comic.comic_cover)
        result.push({
          name: comic.comic_name,
          author: comic.authors,
          siteUrl: comic.comic_url,
          coverUrl: coverUrl,
          desc: comic.description,
          country: comic.zone,
          type: comic.types
        })
      }
      return result
    } else {
      throw new Error('搜索失败')
    }
  }

  /**
   * 
   * @override
   * @param {Comic} comic 
   * @returns 
   * @memberof DMZJSpider
   */
  async getComicSections (comic) {
    const {request, webUrl, header} = this
    const res = await request.get(comic.siteUrl).set(header)
    if (res.ok) {
      const $ = cheerio.load(res.text)
      const comicAllSections = []
      $('.cartoon_online_border,.cartoon_online_border_other').each((index, cartoon) => {
        const sectionTitle = $(cartoon).prevAll('.photo_part').eq(0).find('h2').text()
        const section = {
          sectionTitle: sectionTitle,
          chapters: []
        }
        $(cartoon).find('ul li').each((i, item) => {
          const $item = $(item).find('a');
          section.chapters.push({
            title: $item.text(),
            url: url.resolve(webUrl, $item.attr('href'))
          })
        })
        comicAllSections.push(section)
      })
      return comicAllSections
    } else {
      throw new Error('获取漫画章节信息失败')
    }
  }

  /**
   * 下载单张图片
   * 
   * @param {String} folder 保存图片用路径
   * @param {String} picUrl 图片网络地址
   * @param {Function} finish async回调函数
   * @returns 
   */
  async downLoad(folder, picUrl) {
    const {request, imgHeader} = this
    // 转化中文名称的图片名
    const picName = decodeURI(picUrl.substring(picUrl.lastIndexOf('/') + 1))
    const saveFile = path.join(folder, picName)
    const exist = await fs.exists(saveFile)
    if (exist) {
      return
    } else {
      return new Promise((resolve, reject) => {
        let stream = fs.createWriteStream(saveFile)
        stream.on('close', () => {
          resolve()
        }).on('error', (err) => {
          reject(err)
        })
        request.get(picUrl).set(imgHeader).pipe(stream)
      })
    }
  }


  /**
   * 
   * @override
   * @param {any} entity 
   * @param {any} savePath 
   * @param {any} operate
   * @memberof DMZJSpider
   */
  async downloadChapter (entity, savePath, operate) {
    let current = 0
    const chapterPicUrls = await this.getComicPicUrl(entity.chapter)
    // 初始化下载图片数量
    operate.init({
      sumNum: chapterPicUrls.length,
      savePath: savePath
    })
    for(let picUrl of chapterPicUrls) {
      await this.downLoad(savePath, picUrl)
      await utils.sleep(100)
      current++
      if (current < chapterPicUrls.length) {
        operate.update(current)
      } else {
        operate.finish()
      }
    }
  }
}