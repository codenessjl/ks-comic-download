import { app, BrowserWindow, ipcMain, Tray } from 'electron'
import { autoUpdater } from 'electron-updater'
import fs from 'fs-extra'
import path from 'path'
import Spider from './spiders'
import * as utils from './utils'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, appIcon
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

/**
 * 创建窗口
 */
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 540,
    useContentSize: true,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * 绑定ipcMain相关事件
 */
function bindIpcMain() {
  let spider

  // 获取漫画源信息
  ipcMain.on('getComicSources', (event) => {
    event.returnValue = utils.ipcMsg.success(Spider.getSourceInfo())
  })

  // 根据漫画名搜素漫画
  ipcMain.on('search', async (event, search) => {
    spider = Spider.getSourceInstance(search.sourceName)
    try {
      let searchRes = await spider.search(search.searchName)
      event.sender.send('search-res', utils.ipcMsg.success(searchRes))
    } catch (err) {
      event.sender.send('search-res', utils.ipcMsg.failed(err.message))
    }
  })
  
  ipcMain.on('getComicSections', async (event, comic) => {
    try {
      let sections = await spider.getComicSections(comic)
      event.sender.send('getComicSections-res', utils.ipcMsg.success(sections))
    } catch (err) {
      event.sender.send('getComicSections-res', utils.ipcMsg.failed('获取漫画章节信息失败'))
    }
  })

  ipcMain.on('download', async (event, entity, savePath) => {
    const sender = event.sender
    const init = function init(sumNum) {
      sender.send('download-init', utils.ipcMsg.success(sumNum))
    }
    const update = function update(downloadedNum) {
      sender.send('download-progress', utils.ipcMsg.success(downloadedNum))
    }
    const finish = function finish() {
      sender.send('download-finish', utils.ipcMsg.success(null))
    }
    // 生成存储文件夹
    savePath = path.join(savePath, entity.comicName, entity.sectionTitle, entity.chapter.title)
    await fs.ensureDir(savePath)
    spider.downloadChapter(entity, savePath, {init, update, finish})
  })
}

app.on('ready', createWindow)
app.on('ready', bindIpcMain)
app.on('ready', () => {
  const tempPath = utils.getTempDir()
  if (!fs.existsSync(tempPath)) {
    fs.mkdirpSync(tempPath)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  // 清空缓存文件夹 
  fs.emptyDirSync(utils.getTempDir())
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
