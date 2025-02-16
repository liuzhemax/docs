---
home: true
config:
 -
    type: hero
    full: true
    background: tint-plate
    hero:
      name: 阿哲
#      tagline: 运维开发人员
      text: 强大自己是解决问题的唯一办法
      actions:
        -
          theme: brand
          text: 我的博客 →
          link: https://liuzhemax.github.io/
        -
          theme: brand
          text: 自动化运维平台体验
          link: /notes/devops/612j7li8/  
        -
          theme: brand
          text: K8S管理平台体验
          link: /notes/kubernetes/6q3h4sff/              
        -
          theme: alt
          text: Gitee
          link: https://gitee.com/lucky_liuzhe/
 -
    type: custom
 -
    type: features
    features:
      -
        title: 主机管理
        icon: 💻
        details: 支持多种录入方式，手动录入,Excel录入、云主机录入和同步等功能
      -
        title: 在线终端
        icon: 🖼️
        details: 支持在线 Web 终端
      -
        title: 应用管理
        icon: 🚀
        details: 支持应用根据项目维度划分、区分多个环境配置，应用预发布配置准备
      -
        title: 批量发布
        icon: ⚖
        details: 支持应用批量发布多台机, 日志查看及快速回滚
      -
        title: 批量操作
        icon: ⚡️
        details: 支持远程机器批量执行命令 以及批量执行上传文件
      -
        title: 调度任务
        icon: 📦
        details: 支持cron 表达式, 定时执行命令
      -
        title: 消息通知
        icon: 👨‍💻
        details: 支持邮件、钉钉、企业微信通知
      -
        title: 功能强大
        icon: 🎨
        details: 命令批量执行, 任务定时调度, 日常任务提醒、事件记录、故障记录等
---
<p style="text-align: center;font-size: 25px"><strong>快速入门</strong></p>
<br>
<CardGrid>
  <LinkCard icon="/noteicon/py.svg" title="Python基础" href="/notes/python/" />
  <LinkCard icon="/noteicon/django.png" title="Django入门到进阶" href="/notes/django/" />
  <LinkCard icon="/noteicon/vue.svg" title="前端基础" href="/notes/web/" />
  <LinkCard icon="/noteicon/k8s.png" title="K8S入门到进阶" href="/notes/k8s/" />
  <LinkCard icon="/noteicon/golang.svg" title="Go基础" href="/notes/go/" />
  <LinkCard icon="/noteicon/color.png" title="Gin入门" href="/notes/gin/" />
</CardGrid>

<br>
<p style="text-align: center;font-size: 25px"><strong>开源项目</strong></p>
<br>

<CardGrid>
<LinkCard icon="/noteicon/gitee.png" title="项目前端" href="https://gitee.com/lucky_liuzhe/devops_web/">

自动化运维平台前端

</LinkCard>

<LinkCard icon="/noteicon/gitee.png" title="项目后端" href="https://gitee.com/lucky_liuzhe/devops_api/">

自动化运维平台后端

</LinkCard>
</CardGrid>

<CardGrid>
<LinkCard icon="/noteicon/gitee.png" title="项目前端" href="https://gitee.com/lucky_liuzhe/k8s_web/">

K8S管理平台前端

</LinkCard>

<LinkCard icon="/noteicon/gitee.png" title="项目后端" href="https://gitee.com/lucky_liuzhe/k8s_api/">

K8S管理平台后端

</LinkCard>
</CardGrid>