import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/', icon: 'material-symbols:home-outline' },
  { text: '博客', link: 'https://liuzhemax.github.io/', icon: 'material-symbols:article-outline' },
  // { text: '标签', link: '/blog/tags/' },
  // { text: '归档', link: '/blog/archives/' },
  {
    text: '笔记',
    icon: 'material-symbols:stylus-note-outline-rounded',
    items: [
          { text: 'K8S', link: '/notes/k8s/' },
          { text: 'Python', link: '/notes/python/' },
          { text: 'Django', link: '/notes/django/' },
          { text: '前端', link: '/notes/web/' }
    ]
  },
  { text: '关于', link: '/about/README.md', icon: 'clarity:heart-line',  },
])
