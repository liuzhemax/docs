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
          { text: 'K8S入门到进阶', link: '/notes/k8s/' },
          { text: 'Python基础', link: '/notes/python/' },
          { text: 'Django入门到进阶', link: '/notes/django/' },
          { text: '前端基础', link: '/notes/web/' }
    ]
  },
    {
    text: '开源项目',
    icon: 'teenyicons:webpack-outline',
    items: [
          { text: '自动化运维平台', link: '/notes/devops/' },
    ]
  },
  {
    text: '更多',
    icon: 'mingcute:more-3-line',
    items: [
          { text: '站点导航', link: '/notes/more/' },
    ]
  },
  { text: '关于', link: '/about/README.md', icon: 'clarity:heart-line',  },
])
