

=======
项目名：fund后台`。

## 安装node, git， 

 - 最新稳定node版本

### 开发环境配置

vscode

## 开发


## 联调


## 打包

`npm build`

- 打包并上传服务器，请务必配置正确服务器目标地址
`build:product`

- 修改服务器目标地址config/deploy.js

` deployTo: xxx/xxx`
## 单独部署
`npm run deploy`

## 打tag 生成changelog
`npm run changelog`

## 打tag
`git tag`  查看tag
`git tag v0.1.1` 添加tag
`git push origin tag v0.1.1`  推送tag


####  代理配置

本地代理：
-   package.json  proxy: http://127.0.0.1/
  "http://223.203.221.79:8090",

`Fiddler` 线上代理：

- `regex:^https?:\/\/xx\.com/(.*\.map.*)$` `d:/my/build/$1`
  代理静态资源访问本地map。使用说明https://blog.csdn.net/hahavslinb/article/details/78791219


### 发布

| 发布产品 | 发布模块 |
| --- | --- |
| `[xxx]` | `[xxx]` |

> 发布时的备注

### 错误告警及监控
使用sentry错误日志上报http://223.203.221.89:9000/sentry/lottery-h5/


### 相关人员

| 角色 | 人员 |
| --- | --- |
| 产品经理 | 刘曦 |
| 前端开发 | 钱明卫，吴宇，宋景阳 |
| 后台开发 | 老宋 |
| 交互设计 | 刘曦 |
| ui设计 | 赵路瑶 |


### 其他
 <!-- static create: <TOwnProps>(options?: FormCreateOption<TOwnProps>) => <ComponentDecorator extends Component<any>>(target: ComponentDecorator) => ComponentDecorator -->
- [原型](http://www.mtdyw.co/admin_2018) 
- 账号：admin8
- 密码 ：admin88
- [ui](https://pro.modao.cc/app/d7334f4efc86cf137ea25ff9ef78c871c86c83b5?#screen=sa6e15ba8f3153545227700)
- [ui蓝湖切图用这个](https://lanhuapp.com/web/#/item/board?pid=4c7bcfce-de35-4bd3-aec3-a4c8239e33b7)
- [接口文档](http://223.203.221.87:8088/zchat-srv/docs)
- http://www.mtdyw.co/ web端播放器网站

=======
 项目备注
=======
<!-- 坑 -->
parmas.ts = Date.parse(new Date().toString()) 


    "postbuild": "react-snap",

在使用 initialValue 设置默认值时  如果设置的是为空 但是 select对应的是number的话  那么会出现设置placehoder不生效的情况 要定义initialvalue为underfined

<!-- replace 只能替换一个 不能替换全局 如果想要替换全局需要用到正则 加一个 /替换原素/g -->