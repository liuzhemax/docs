---
title: django-webssh实现
tags: 
  - django
createTime: 2024/09/28 10:10:50
permalink: /article/1wqckd93/
---

## 实现思路

要想实现类似SSH终端功能并非易事，主要难点在于页面与连接的目标是实时交互的。说起实时交互，相信大家都有接触过，例如qq、微信、在线客服这
些都是，像一些网页版的在线聊天系统常用的实现方案就是websocket。

WebSocket协议与HTTP的主要区别：HTTP是无状态协议，由客户端发起请求，客户端与服务器“一问一答”，因此服务器端无法主动向客户端发送信息。而W
ebSocket是基于TCP长连接的协议，客户端与服务器建立连接后，服务器端随时能向客户端发送信息。

WebSocket协议的主要价值在于其与HTTP的差异（服务器端与客户端能够保持实时的双向通信），使其在某些应用情景下比HTTP更能满足技术需求。

Django Web框架实现WebSocket主要有两种方式：channels和dwebsocket。

Channels是针对Django项目的一个增强框架，使得Django不仅支持HTTP协议，还能支持WebSocket协议。

为了更好的模拟shell终端，还需要一个前端库xterm.js ，这是一个比较成熟的shell终端模拟库，目前大部分公司实现的webssh都是用的这个。

官网：https://xtermjs.org/

## 所需技术

- channels: 是Django的扩展模块，用于处理WebSocket。
- xterm.js：前端模拟 shell 终端的一个库
- paramiko：python下对 ssh2 封装的一个库
- channels_redis: 使用redis作为存储，维护不同消息传递。

## 具体实现

1. xterm.js 在浏览器端模拟 shell 终端, 监听用户输入通过 websocket 将用户输入的内容上传到 django
2. django 接受到用户上传的内容, 将用户在前端页面输入的内容通过 paramiko 建立的 ssh 通道上传到远程服务器执行
3. paramiko 将远程服务器的处理结果返回给 django
4. django 将 paramiko 返回的结果通过 websocket 返回给用户
5. xterm.js 接收 django 返回的数据并将其写入前端页面

![](/images/image-20240923204539855.png)

### 前端（vue)

安装

```vue
npm install xterm
```

前端页面：devops_web/src/views/server/TerminalCreate.vue

```vue
<template>
    <el-dialog
          :model-value="visible"
          title="终端"
          @close="dialogClose"
          width="80%"
    >

     <el-form :model="form" ref="formRef" :rules="formRules" label-width="100px">
      <el-form-item label="SSH IP" prop="ssh_ip"> <!-- pod 名称输入框 -->
        <el-input v-model="form.ssh_ip" />
      </el-form-item>
      <el-form-item label="SSH 端口" prop="ssh_port"> <!-- pod 名称输入框 -->
        <el-input v-model="form.ssh_port" />
      </el-form-item>
      <el-form-item label="用户名" prop="username"> <!-- namespace 输入框 -->
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password"> <!-- pod 名称输入框 -->
        <el-input v-model="form.password" />
      </el-form-item>
        <div id="terminal" /> <!-- 终端视图容器 -->
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="onSubmit">连接</el-button>
        </span>
      </template>

  </el-dialog>
</template>

<script>
    import { Terminal } from 'xterm' // 导入 xterm 包，用于创建和操作终端对象
    import { common as xtermTheme } from 'xterm-style' // 导入 xterm 样式主题
    import 'xterm/css/xterm.css' // 导入 xterm CSS 样式
    import { FitAddon } from 'xterm-addon-fit' // 导入 xterm fit 插件，用于调整终端大小
    import { WebLinksAddon } from 'xterm-addon-web-links' // 导入 xterm web-links 插件，可以捕获 URL 并将其转换为可点击链接
    import 'xterm/lib/xterm.js' // 导入 xterm 库
    export default {
        name: "Terminal",
        props: {
            visible: Boolean,
            row: '',  // 当前行内容
        },
          data() {
            return {
              xterm: '',
              form: {
                username: '', // 默认命名空间为 "default"
                password: '', // 默认 shell 命令为 "bash"
                ssh_ip: '',
                ssh_port: '',
              },
              formRules: {
                  username: [
                      {required: true, message: '请输入用户名', trigger: 'blur'},
                  ],
                  password: [
                      {required: true, message: '请输入密码', trigger: 'blur'},
                  ],
                  ssh_ip: [
                      {required: true, message: '请输入SSH IP地址', trigger: 'blur'},
                  ],
                  ssh_port: [
                      {required: true, message: '请输入SSH端口', trigger: 'blur'},
                  ],

                },
            }
          },
        methods: {
          onRest(){
            this.$refs.formRef.resetFields();
          },
           dialogClose() {
                this.$emit('update:visible', false);  // 当对话框关闭，通过父组件更新为false
                this.onRest(); //重置表单
                window.location.reload();
              },
            onSubmit() {
              // 创建一个新的 Terminal 对象
                this.xterm = new Terminal({
                theme: xtermTheme,  //背景色
                rendererType: 'canvas', //渲染类型
                convertEol: true, //启用时，光标将设置为下一行的开头
                cursorBlink: true,  //光标闪烁
              })

              // 创建并加载 FitAddon 和 WebLinksAddon
               const fitAddon = new FitAddon()
               this.xterm.loadAddon(fitAddon)
               this.xterm.loadAddon(new WebLinksAddon())

              // 打开这个终端，并附加到 HTML 元素上
              this.xterm.open(document.getElementById('terminal'))

              // 调整终端的大小以适应其父元素
               fitAddon.fit()

              // 创建一个新的 WebSocket 连接，并通过 URL 参数传递 pod, namespace, container 和 command 信息
              const ws = new WebSocket(`ws://${process.env.VUE_APP_API_HOST}:${process.env.VUE_APP_API_PORT}/webssh/?host_ip=${this.fo
rm.ssh_ip}&host_port=${this.form.ssh_port}&sys_user_name=${this.form.username}&sys_user_passwd=${this.form.password}`);

              // 当 WebSocket 连接打开时，发送一个 resize 消息给服务器，告诉它终端的尺寸
              ws.onopen = () => {
                ws.send(JSON.stringify({
                  type: 'resize',
                  rows: this.xterm.rows,
                  cols: this.xterm.cols
                }))
              }

              // 当从服务器收到消息时，写入终端显示
              ws.onmessage = (evt) => {
                // console.log(evt.data)
                this.xterm.write(evt.data)
              }

              // 当发生错误时，也写入终端显示
              ws.onerror = (evt) => {
                this.xterm.write(evt.data)
              }
              ws.onclose = (evt) => {
                  this.xterm.write('\n\r\x1B[1;3;31m连接关闭！\x1B[0m');
               };

              // 当窗口尺寸变化时，重新调整终端的尺寸，并发送一个新的 resize 消息给服务器
              window.addEventListener('resize', () => {
                fitAddon.fit()
                ws.send(JSON.stringify({
                  type: 'resize',
                  rows: this.xterm.rows,
                  cols: this.xterm.cols
                }))
              })

              // 当在终端中键入字符时，发送一个 input 消息给服务器
              this.xterm.onData((data) => {
                // console.log(data)
                // xterm.write(data);  //写入终端
                ws.send(JSON.stringify({
                  type: 'input',
                  text: data
                }))
              })

            },

        }
    }
</script>

<style scoped>

</style>

```

### 服务端（Django Channels)

安装

```python
pip install channels==2.4.0
pip install channels_redis
pip install paramiko
```

在settings.py文件中注册channels

```python
INSTALLED_APPS = [
    'channels',
]
ASGI_APPLICATION = 'devops.routing.application'
```

devops_api/devops_api/asgi.py

```python
"""
ASGI config for devops_api operation.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this files, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'devops_api.settings')

application = get_asgi_application()

```

### 配置路由

devops_api/devops_api/routing.py

```python
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter


from django.urls import re_path
from devops_api.consumers import SSHConsumer


#如果是 WebSocket 连接 (ws://或 wss://), 则连接会交给 AuthMiddlewareStack验证去请求对象，然后连接将被给到 URLRouter
application = ProtocolTypeRouter({
# 'http': # 普通的HTTP请求不需要我们手动在这里添加，框架会自动加载
# 用于WebSocket认证
    'websocket': AuthMiddlewareStack(
        # 用于WebSocket认证
        URLRouter([
        # URL路由匹配,访问webssh的时候，交给SSHConsumer处理
            re_path(r'^webssh/', SSHConsumer),
        ])
    ),
})
```

### websocket服务端消费

devops_api/devops_api/consumers.py

```python
#import websocket
from channels.generic.websocket import WebsocketConsumer
from threading import Thread
from asgiref.sync import async_to_sync
import paramiko
import time
import json


class StreamConsumer(object):
    def __init__(self, websocket):
        self.websocket = websocket


    def connect(self,host_ip,host_port,sys_user_name,sys_user_passwd,term='xterm',cols=150, rows=42):
        #实例化SSHClient
        ssh_client = paramiko.SSHClient()
        #当远程服务器没有本地主机的密钥时自动添加到本地，这样不用在建立连接的时候输入yes或no进行确认
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            #连接ssh服务器，这里是以账号密码方式进行确认
            ssh_client.connect(host_ip,host_port,sys_user_name,sys_user_passwd,timeout=10)
            print("连接成功")
        except Exception as e:
            message  = str(e)
            print(e)
            #self.websocket.send是服务端给客户端发送消息
            self.websocket.send(message)
            print("连接失败")
            return False
        #打开ssh通道，建立长连接
        transport = ssh_client.get_transport()
        #建立会话session
        self.ssh_channel = transport.open_session()
        #获取终端，并设置term和终端大小,width终端宽度，height终端高度
        self.ssh_channel.get_pty(term=term,width=cols,height=rows)
        #激活终端，这样就可以正常登录了
        self.ssh_channel.invoke_shell()
        msg = f"开始连接到{sys_user_name}@{host_ip} \r\n"
        self.websocket.send(msg)
        for i in range(2):
            mess = self.ssh_channel.recv(1024).decode('utf-8','ignore')
            message = json.dumps({'flag': 'success', 'message': mess})
            self.send_to_ws_mes(message)


    #断开websocket和关闭ssh通道
    def close(self):
        try:
            self.websocket.close()
            self.ssh_channel.close()
        except Exception as e:
            pass


    #发送消息到ws
    def send_to_ws_mes(self,event):
        #字符串转换字典
        text_data = json.loads(event)
        message = text_data['message']
        self.websocket.send(message)


    #从websocket接收的数据发送到ssh
    def _ws_to_ssh(self,data):
        try:
            self.ssh_channel.send(data)
        except OSError as e:
            self.close()


    #ssh返回的数据输出给websocket
    def _ssh_to_ws(self):
        try:
            while not self.ssh_channel.exit_status_ready():
                #需要转码为utf-8形式
                data = self.ssh_channel.recv(1024).decode('utf-8')
                message = {'flag': 'success', 'message': data}
                if len(data) != 0:
                    self.send_to_ws_mes(json.dumps(message))
                else:
                    break
        except Exception as e:
            message = {'flag': 'error', 'message': str(e)}
            self.send_to_ws_mes(json.dumps(message))
            self.close()


    def shell(self, data):
        Thread(target=self._ws_to_ssh, args=(data,)).start()
        Thread(target=self._ssh_to_ws).start()


    #前端传过来的数据会加个flag，如果flag是resize，则调用resize_pty方法来动态调整窗口的大小，否则就正常调用执行命令的方法
    def resize_pty(self, cols, rows):
        self.ssh_channel.resize_pty(width=cols, height=rows)


# 继承WebsocketConsumer 类
class SSHConsumer(WebsocketConsumer):
    def connect(self):
        # 有客户端来向后端发起websocket连接的请求时，自动触发
        host_info = self.scope["query_string"].decode()  # b'auth_type=kubeconfig&token=7402e616e80cc5d9debe66f31b7a8ed6'
        self.host_ip = host_info.split('&')[0].split('=')[1]
        #self.host_name = host_info.split('&')[1].split('=')[1]
        self.host_port = host_info.split('&')[1].split('=')[1]
        self.sys_user_name = host_info.split('&')[2].split('=')[1]
        self.sys_user_passwd = host_info.split('&')[3].split('=')[1]
        #accept表示服务端允许和客户端创建连接.
        self.accept()


        self.ssh = StreamConsumer(websocket=self)
        self.ssh.connect(self.host_ip,self.host_port,self.sys_user_name,self.sys_user_passwd)


    def disconnect(self, close_code):
        #客户端与服务端断开连接时，自动触发（客户端断开，服务端也得断开）
        self.ssh.close()


    def receive(self, text_data=None):
        #浏览器基于websocket向后端发送数据，自动触发接收消息。
        #text_data是从客户端端(websocket)接收到的消息
        text_data = json.loads(text_data) #str转换为dict
        # print(text_data)
        if text_data.get('flag') == 'resize': #如果为resize是改变终端通道的大小
            self.ssh.resize_pty(cols=text_data['cols'], rows=text_data['rows'])
        else:#否则正常执行命令
            data = text_data.get('text', '')
            self.ssh.shell(data=data)

```

### 配置channels存储

```shell
docker run --name redis -d -p 6379:6379 redis:5
```

在settings.py配置文件添加redis配置，内容如下：

```python
CHANNEL_LAYERS = {
    # 真实上线使用redis
    # 'default': {
    #     'BACKEND': 'channels_redis.core.RedisChannelLayer',
    #     'CONFIG': {
    #         "hosts": [('127.0.0.1', 6379)],  # 需修改redis的地址
    #     },
    # },
    # 测试阶段，放到内存中即可
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}
```
## 总结
用户打开浏览器--》浏览器发送websocket请求给Django建立长连接--》Django与要操作的服务器建立SSH通道，实时的将收到的用户数据发送给SSH后的
主机，并将主机执行的结果数据返回给浏览器。
