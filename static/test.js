const superagent = require('superagent')
const cheerio = require('cheerio')
const url = require('url')
const path = require('path')
const fs = require('fs-extra')

/**
 * Unicode转可读字符串
 * 
 * @param {String} unicodeStr 
 * @returns 
 */
function decodeUnicode(unicodeStr) {
  return unescape(unicodeStr.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'))
}

class DMZJSpider {
  constructor() {
    // 网站URL
    this.webUrl = 'http://manhua.dmzj.com/'
    // 获取图片URL
    this.imgUrlPrefix = 'http://images.dmzj.com/'
    // 漫画搜索URL
    this.searchUrl = 'http://s.acg.dmzj.com/comicsum/search.php'
    // 一般请求头
    this.header = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }
    // 下载图片请求头
    this.imgHeader = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
      Referer: 'http://manhua.dmzj.com/'
    }

    this.request = superagent.agent()

    this.tempDir = __dirname
  }

  /**
     * 获取封面图片内容
     * 
     * @param {String} coverUrl 
     * @memberof DMZJSpider
     */
  fetchCoverImg(coverUrl) {
    return new Promise((resolve, reject) => {
      const { request, tempDir, imgHeader } = this
      const suffixWithDot = coverUrl.slice(coverUrl.lastIndexOf('.'))
      const tempFilePath = path.join(tempDir, Date.now() + suffixWithDot)
      let stream = fs.createWriteStream(tempFilePath)
      stream.on('close', () => {
        resolve('file:///' + tempFilePath)
      }).on('error', (err) => {
        reject(err)
      })
      request.get(coverUrl).set(imgHeader).pipe(stream)
    })
  }

  async search(keyword) {
    const { request, searchUrl, header } = this
    const res = await request.get(searchUrl).set(header).accept('json').query({ s: keyword })
    if (res.ok) {
      // 获取漫画信息列表
      var comicList = res.text.substring(
        res.text.indexOf('['),
        res.text.length - 1
      )
      // Unicode转可读字符串再转JSON格式
      comicList = JSON.parse(decodeUnicode(comicList))
      const result = []
      for (var i in comicList) {
        var comic = comicList[i]
        let coverUrl = await this.fetchCoverImg(comic.comic_cover)
        console.log(coverUrl)
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
}

DMZJSpider.SOURCE_NAME = '动漫之家'

async function main() {
  const spider = new DMZJSpider()
  let comicList = await spider.search('英雄学院')
  console.log(comicList)
}

main()