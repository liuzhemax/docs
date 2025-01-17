---
title: K8S管理平台
createTime: 2024/10/10 20:35:24
permalink: /notes/kubernetes/
---
::: tip
K8S管理平台，基于JWT技术实现前后端分离，基于角色访问控制RBAC，提供对系统的权限控制。由于K8S本身命令行操作复杂，增加学习和运维成本，通过图形化、平台化的方式可以更好的管理K8S基础设施资源。
:::

### 功能特性
 - 首页: 统一展示集群资源信息
 - YAML应用: 支持编写YAML方式创建K8S资源
 - K8S集群: 支持查看集群各节点资源详细信息
 - 资源操作: 支持常用资源按命名空间查看创建删除，如: Deployment、Daemonset、Statefulset、Pod等
 - 容器终端: 支持在线web终端进入容器执行命令
 - 容器日志: 支持在线web终端查看容器日志
 - 系统管理: 支持菜单权限分配，用户角色授权
 - 免费开源: 前后端代码完全开源, 方便二次开发

### 技术栈
 - Python 3.11
 - Djnago DRF 5.1
 - Vue 3
 - Element Plus
 - MySQL 8.0

### 功能预览
 - 首页
![](/images/首页1.png)
![](/images/首页2.png)
 - YAML应用
![](/images/YAML.png)
 - Node详情
![](/images/node详情.png)
 - Deployment详情
![](/images/deployment详情.png)
 - Pod列表
![](/images/pod列表.png)
 - 容器终端
![](/images/容器终端.png)
 - 容器日志
![](/images/容器日志.png)
 - 个人中心
![](/images/个人中心2.png)
 - 用户管理
![](/images/用户管理2.png)
 - 分配角色
![](/images/角色分配2.png)
 - 角色管理
![](/images/角色管理2.png)
 - 分配权限
![](/images/角色权限2.png)
 - 菜单管理
![](/images/菜单管理2.png)
