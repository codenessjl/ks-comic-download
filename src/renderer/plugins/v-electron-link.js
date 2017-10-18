import { shell } from 'electron'
import path from 'path'

// for development code complete
import Vue from 'vue'

const eventStore = {}
let _uid = 0

/**
 * 绑定链接点击事件
 * 
 * @param {HTMLElement} el 
 * @param {Vue.VNodeDirective} binding 
 */
function addLinkEvent(el, binding) {
  const clickEvent = function (e) {
    e.preventDefault()
  
    const href = binding.value || el.getAttribute('href'),
          modifiers = binding.modifiers
    
    if (typeof href !== 'string' || !href) {
      throw new Error('electron-link have a empty value')
    }

    if (modifiers.file) {
      if (modifiers.inFolder) {
        // 打开文件所在文件夹
        shell.showItemInFolder(path.resolve(href))
      } else {
        // 用默认打开方式打开文件
        shell.openItem(path.resolve(href))
      }
    } else if (modifiers.toTrash) {
      // 移除到回收站
      shell.moveItemToTrash(path.resolve(href))
    } else {
      // 浏览器打开
      shell.openExternal(href)
    }
  }
  let linkId = _uid++
  el.dataset.linkId = linkId
  eventStore[linkId] = clickEvent

  el.addEventListener('click', clickEvent, false)
}

/**
 * 更新链接点击事件
 * 
 * @param {HTMLElement} el 
 * @param {Vue.VNodeDirective} binding 
 */
function updateLinkEvent(el, binding) {
  if(binding.value === binding.oldValue) {
      return
  }
  removeLinkEvent(el)
  addLinkEvent(el, binding)
}

/**
 * 移除链接点击事件
 * 
 *@param {HTMLElement} el 
 */
function removeLinkEvent(el) {
  el.removeEventListener('click', eventStore[el.dataset.linkId])
}

export default {
  install (Vue) {
    Vue.directive('electron-link', {
      bind: (el, binding) => {
        addLinkEvent(el, binding)
      },
      update: (el, binding) => {
        updateLinkEvent(el, binding)
      },
      unbind: (el, binding) => {
        removeLinkEvent(el)
      }
    })
  }
}