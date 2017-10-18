'use strict';
const cheerio = require('cheerio');
const request = require('superagent');
const url = require('url');
const fs = require('fs');
const path = require('path');
const async = require('async');
// 保存图片用路径
var BASIC_SAVE_PATH = './download';
// 网站URL
var webUrl = 'http://manhua.dmzj.com/';
// 获取图片URL
var imgUrlPrefix = 'http://images.dmzj.com/';
// 漫画搜索URL
var searchUrl = 'http://s.acg.178.com/comicsum/search.php';
// 一般请求头
var header = {
	"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
};
// 下载图片请求头
var imgHeader = {
	"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
	"Referer": "http://manhua.dmzj.com/"
};

/**
 * 解析漫画图片地址用
 * 
 * @param {any} p 
 * @param {any} a 
 * @param {any} c 
 * @param {any} k 
 * @param {any} e 
 * @param {any} d 
 * @returns 
 */
function decodeImgUrl(p, a, c, k, e, d) {
	e = function (c) {
		return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
	};
	if (!''.replace(/^/, String)) {
		while (c--) {
			d[e(c)] = k[c] || e(c)
		}
		k = [function (e) {
			return d[e]
		}];
		e = function () {
			return '\\w+'
		};
		c = 1
	};
	while (c--) {
		if (k[c]) {
			p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
		}
	}
	return p
};

/**
 * Unicode转可读字符串
 * 
 * @param {String} unicodeStr 
 * @returns 
 */
function decodeUnicode(unicodeStr) {
	return unescape(unicodeStr.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'));
}

/**
 * 获取漫画图片地址数组
 * 
 * @param {any} comicChapter 
 * @returns 
 */
function getComicPicUrl (chapter) {
	return new Promise((resolve, reject) => {
		var chapterURL = chapter.url;
		request.get(chapterURL).end((err, res) => {
			if (err) {
				console.log(err);
				resolve();
			}
			if (!res.ok) {
				console.log('无法正常获取网页');
				resolve();
			} else {
				var $ = cheerio.load(res.text);
				var script = $('script').eq(0).html();
				// 获取当前章节的图片地址
				var pageEvalStr = script.substring(script.indexOf('return p}')+9, script.indexOf(',0,{}))')+6);
				pageEvalStr = eval('decodeImgUrl'+pageEvalStr); // var pages = pages = [漫画图片地址数组];
				pageEvalStr = pageEvalStr.substring(pageEvalStr.indexOf('['),pageEvalStr.lastIndexOf(']')+1);
				var pages = eval(pageEvalStr);
				pages = pages.map((partURL) => {
					return url.resolve(imgUrlPrefix, partURL);
				})
				resolve(pages);
			}
		})
	})
}

/**
 * 创建文件夹
 * 
 * @param {any} dirPath 
 */
function mkdirsSync(dirPath) {
	var dirArray = dirPath.split(/[/\\]/);
	var current = './';
	for (var depth = 0; depth < dirArray.length; depth++) {
		current = path.join(current, dirArray[depth]);
		if (fs.existsSync(current)) {
			continue;
		} else {
			//尝试创建目录
			fs.mkdirSync(current);
		}
	}
};

/**
 * 搜索漫画信息
 * 
 * @param {String} keyword 
 * @returns 漫画信息列表
 */
function searchComic(keyword) {
	return new Promise((resolve, reject) => {
		request.get(searchUrl).set(header).query({
			s: keyword
		}).end((err, res) => {
			if (res.ok) {
				// 获取漫画信息列表
				var result = res.text.substring(res.text.indexOf('['), res.text.length - 1);
				// Unicode转可读字符串再转JSON格式
				try {
					result = JSON.parse(decodeUnicode(result));
				} catch (e) {
					console.log(e);
					reject('解析失败');
				}
				resolve(result);
			} else {
				reject('连接失败');
			}
		})
	})
}

/**
 * 查询指定漫画的漫画章节信息
 * 
 * @param {String} comicURL 
 * @returns 
 */
function getComicSetion(comicURL) {
	return new Promise((resolve, reject) => {
		request.get(comicURL).set(header).end((err, res) => {
			if (res.ok) {
				var $ = cheerio.load(res.text);
				var comicAllSections = [];
				$('.cartoon_online_border,cartoon_online_border_other').each((index, cartoon) => {
					var header = $(cartoon).prevAll('.photo_part').eq(0).find('h2').text();
					var comicSection = {
						header: header,
						chapters: []
					}
					$(cartoon).find('ul li').each((index, item) => {
						var $item = $(item).find('a');
						comicSection.chapters.push({
							title: $item.text(),
							url: url.resolve(webUrl, $item.attr('href'))
						});
					});
					comicAllSections.push(comicSection);
				});
				resolve(comicAllSections);
			} else {
				reject();
			}
		})
	})
}

/**
 * 下载某章节所有图片
 * 
 * @param {any} comicName 
 * @param {any} chapter 
 * @param {any} event 
 */
function downLoadChapter(comicName,chapter,event) {
	return new Promise((resolve,reject) => {
		var chapterPicUrls = [];
		var folder = path.join(BASIC_SAVE_PATH,comicName,chapter.title);
		if (!fs.existsSync(folder)) {
			mkdirsSync(folder);
		}
		var current = 0;
		var q = async.queue(function (picUrl,finishInner) {
			downLoad(folder,picUrl).then(() => {
				finishInner();
			})
		},3);
		q.drain = function () {
			resolve();
		}
		getComicPicUrl(chapter).then(function (urls) {
			chapterPicUrls = urls;
			q.push(chapterPicUrls,function (err) {
				// 返回下载进度信息
				var downloadInfo = {
					title: chapter.title,
					current: ++current,
					total: chapterPicUrls.length
				}
				event.sender.send('complete-page',downloadInfo);
			});
		})
	})
}

/**
 * 下载单张图片
 * 
 * @param {String} folder 保存图片用路径
 * @param {String} picUrl 图片网络地址
 * @param {Function} finish async回调函数
 * @returns 
 */
function downLoad(folder, picUrl) {
	return new Promise((resolve,reject) => {
		// 转化中文名称的图片名
		var picName = decodeURI(picUrl.substring(picUrl.lastIndexOf('/') + 1));
		if (fs.existsSync(path.join(folder, picName))) {
			resolve();
		} else {
			request.get(picUrl).set(imgHeader).end((err,res) => {
				if (err) {
					resolve();
				} else {
					fs.writeFile(path.join(folder,picName),res.body,function (err) {
						if (err) {
							console.log('图片'+picName+'下载失败');
						}
						resolve();
					})
				}
			});
		}
	});
}

/**
 * 初始化爬虫配置
 * 
 */
function init (nconf) {
	BASIC_SAVE_PATH = nconf.get('BASIC_SAVE_PATH');
	webUrl = nconf.get('BASE_URL');
	imgUrlPrefix = nconf.get('IMG_URL_PREFIX');
	searchUrl = nconf.get('SEARCH_URL');
	header = nconf.get('NORMAL_HEADER');
	imgHeader = nconf.get('IMG_HEADER');
}

module.exports = {
	init: init,
	searchComic: searchComic,
	getComicSetion: getComicSetion,
	downLoadChapter: downLoadChapter
}