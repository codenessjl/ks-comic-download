# 如何为 ks-comic-download 添加可用漫画源

### clone项目到本地

```
git clone https://github.com/hzxszsk/ks-comic-download.git ./ks-comic-download
```

### 项目源码目录结构

该结构位于`src`目录下，为了方便查看，只保留了主进程相关的目录结构

```
|-main          // 主进程相关文件
  |-index.dev.js
  |-index.js
  |-spiders
    |-BasicSpider.js
    |-index.js
    |-sources
      |-dongmanzhijia.js
  |-utils.js
|-renderer      // 渲染进程相关文件
  |- ... 
```

其中，`utils.js`中有一些可能会用到的公共方法，详情查看 [utils工具类文档](./utils.md)。

若要添加新的漫画源，则需要在 `/main/spider/source` 目录下新建一个js文件。

### 漫画源文件说明

1. 该文件最终需要使用 `export default` 一个类，该类需要继承 `BasicSpider.js` 内的 `BasicSpider` 类

2. 为导出类设置 `SOURCE_NAME` 静态属性，该属性的值为漫画源选择时需要显示的名称(string类型)

3. 在导出的类中实现 search 、 getComicSections 和 downloadChapter 三个方法（为保证代码风格一致，请尽量使用 `async/await` 来进行实现

4. `search` 方法的参数为一个关键字字符串keyword，该方法用来实现漫画的搜索功能，返回一个 [Comic漫画对象](#comic-struct) 的数组

5. `getComicSections` 方法提供一个 [Comic漫画对象](#comic-struct) 类型的参数，用来实现获取漫画的所有章节信息的功能，因为一些漫画需要区分本篇、番外以及其他类型的章节，而漫画网站会将这不同类型的章节分开展示，因此为了方便展示，你需要将不同类型的 [Chapter章节信息对象](#chapter-struct) 数组放在不同的 [Section章节分块对象](#section-struct) 内，并返回一个Section对象的数组

6. `downloadChapter` 方法提供三个参数，[DownloadEntity下载内容对象](#downloadEntity-struct) entity、漫画保存路径字符串savePath（该字符串的内容为 `用户设置保存路径 + 漫画名称 + 漫画分块章节名 + 漫画章节名`）和包含init、update和finish三个修改下载状态函数的对象，用来实现某个漫画章节的下载和实时进度显示。
    
    - init 初始化下载状态，调用时需要传入一个对象
    ```
    {
      sumNum: 该章节总共的漫画图片数,
      savePath: 保存该章节图片的文件夹路径
    }
    ```

    - update 更新下载进度，调用时传入一个数字，表示当前已经下载完的漫画页数

    - finish 完成当前章节下载，调用时不需要传入参数，调用后渲染进程会将当前章节从下载队列中移除，添加到提醒列表中


**文件结构示例：**

```js
import BasicSpider from '../BasicSpider'

export default class YourSpider extends BasicSpider {

  static SOURCE_NAME = '漫画源名称'

  /**
   * 初始化需要的变量
   * @memberof BasicSpider
   */
  constructor () {}

  /**
   * 通过漫画名称搜索漫画，返回 Comic 漫画对象的数组
   * 
   * @async
   * @param {String} keyword 
   * @returns {Array<Comic>}
   */
  async search (keyword) {}

  /**
   * 通过漫画对象获取漫画章节信息，返回 Section 章节分块对象的数组
   * 
   * @async
   * @param {Comic} comic 
   * @returns {Array<Section>}
   */
  async getComicSections (comic) {}

  /**
   * 下载某章节漫画
   * 
   * @param {DownloadEntity} entity 下载内容对象
   * @param  savePath 下载路径  {String}
   * @param {Object} operate {init, update, finish}
   */
  async downloadChapter (entity, savePath, operate) {}
}

```

### 可用对象结构

- <span id="comic-struct">Comic - 漫画对象</span>
```
{
  name:           漫画名称    {String}
  author:         漫画作者    {String}
  siteUrl:        网站链接    {String}
  coverUrl:       封面地址    {String}
  desc:           漫画简介    {String}
  country:        国家地区    {String}
  type:           漫画类别    {String}
}
```

- <span id="section-struct">Section - 漫画章节分块对象</span>
```
{
  sectionTitle:   章节块名称   {String}
  chapters:       章节数组     {Array<Chapter>}
}
```

- <span id="chapter-struct">Chapter - 章节对象</span>
```
{
  title:          章节标题    {String}
  url:            章节URL     {String}
}
```

- <span id="downloadEntity-struct">DownloadEntity - 下载内容对象</span>
```
// DownloadEntity 是从渲染进程传来的一个对象，因此会包含一些可能用不到的属性
{
  name:           下载状态中显示的名称     {String}
  sumNum:         需要下载的图片总数       {number} 默认为0
  downloadedNum:  已经下载的图片数         {number} 默认为0
  comicName:      漫画名称                {String}
  coverUrl:       封面Url地址             {String}
  sectionTitle:   章节块名称              {String}
  chapter:        当前需要下载的章节对象   {Chapter}
}
```