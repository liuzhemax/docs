import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

/**
 * 配置 单个 note
 */
const k8s = defineNoteConfig({
  dir: 'k8s',
  link: '/notes/k8s/',
  sidebar: [
      { text: 'K8S学习笔记', link: '/notes/k8s/',},
      { text: 'K8S入门', prefix: 'introduction', collapsed: false, items: 'auto',},
      { text: 'K8S进阶', prefix: 'upgrade', collapsed: false, items: 'auto',},
  ]
})

const python = defineNoteConfig({
  dir: 'python',
  link: '/notes/python/',
  sidebar: [
      { text: 'Python学习笔记', link: '/notes/python/' },
      { text: 'Python基础', prefix: 'base', collapsed: false, items: 'auto',}
  ]
})

const django = defineNoteConfig({
  dir: 'django',
  link: '/notes/django/',
  sidebar: [
      { text: 'Django学习笔记', link: '/notes/django/' },
      { text: 'Django入门', prefix: 'introduction', collapsed: false, items: 'auto',},
      { text: 'Django进阶', prefix: 'upgrade', collapsed: false, items: 'auto',}
  ]
})

const web = defineNoteConfig({
  dir: 'web',
  link: '/notes/web/',
  sidebar: [
      { text: '前端学习笔记', link: '/notes/web/' },
      { text: 'HTML', prefix: 'introduction', collapsed: false, items: 'auto',},
      { text: 'Vue', prefix: 'upgrade', collapsed: false, items: 'auto',}
  ]
})

const devops = defineNoteConfig({
  dir: 'devops',
  link: '/notes/devops/',
  sidebar: [
      { text: '自动化运维平台', link: '/notes/devops/' },
      { text: '安装文档', prefix: 'install', collapsed: false, items: 'auto',},
      { text: '操作手册', prefix: 'operation', collapsed: false, items: 'auto',},
  ]
})
/**
 * 配置 notes
 */
export default defineNotesConfig({
  // 声明所有笔记的目录，(默认配置，通常您不需要声明它)
  dir: '/notes/',
  link: '/',
  // 在这里添加 note 配置
  notes: [k8s,python,django,web,devops]
})


