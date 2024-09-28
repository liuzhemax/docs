import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

/**
 * 配置 单个 note
 */
const k8s = defineNoteConfig({
  dir: 'k8s',
  link: '/notes/k8s/',
  sidebar: [
      { text: 'k8s学习笔记', link: '/notes/k8s/' },
      { text: 'k8s入门', prefix: 'introduction',
      collapsed: false,
      items: 'auto',
      // items: [
      //   { text: '介绍1', link: 'foo1' },
      //   { text: '介绍2', link: 'foo2' },
      //   { text: '介绍3', link: 'foo3' },
      // ],
    },
    { text: 'k8s进阶', prefix: 'upgrade',
      collapsed: false,
      items: 'auto',
      // items: [
      //   { text: '介绍1', link: 'bar' },
      //   { text: '介绍1', link: 'intro' },
      //   { text: '介绍1', link: 'intro' },
      //   { text: '介绍1', link: 'intro' },
      // ],
    },
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
  notes: [k8s]
})


