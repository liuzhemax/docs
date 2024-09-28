import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  { text: '标签', link: '/blog/tags/' },
  { text: '归档', link: '/blog/archives/' },
  {
    text: '笔记',
    items: [
          { text: 'K8S', link: '/notes/k8s/' },
          { text: 'Python', link: '/notes/python/' },
          { text: 'Django', link: '/notes/django/' }
    ]
  },
  { text: '关于', link: '/about/README.md' },
])
