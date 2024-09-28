import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: '/blogger.png',
  // your git repo url
  //用于生成编辑 链接。
  docsRepo: 'https://github.com/liuzhemax/blog.git',
  docsDir: 'docs',
  docsBranch: 'main',
  // lastUpdated: { text: 'Last Updated'},
  appearance: true,
  //页脚
  footer: { message: '', copyright: 'Copyright © 2024 阿哲 www.azhe.asia' },
  profile: {
    name: '阿哲',
    description: '强大自己是解决问题的唯一办法',
    avatar: '/blogger.png',
    circle: true, // 是否为圆形头像
    layout: 'right', // 个人信息在左侧还是右侧，'left' | 'right'
  },

  navbar,
  social: [
    { icon: 'github', link: '/' },
  ],

})
