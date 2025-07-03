# Table of content

- [简介](#%E7%AE%80%E4%BB%8B)
- [性能](#%E6%80%A7%E8%83%BD)
- [changelog](#changelog)
- [how to run demo](#how-to-run-demo)
- [常见Q&A](#%E5%B8%B8%E8%A7%81qa)
- [作者提供的服务](#%E4%BD%9C%E8%80%85%E6%8F%90%E4%BE%9B%E7%9A%84%E6%9C%8D%E5%8A%A1)
- [作者联系方式、寻求帮助、合作](#%E4%BD%9C%E8%80%85%E8%81%94%E7%B3%BB%E6%96%B9%E5%BC%8F--%E5%AF%BB%E6%B1%82%E5%B8%AE%E5%8A%A9--%E5%90%88%E4%BD%9C)
- [Star History](#star-history)

![Static Badge](https://img.shields.io/badge/author-submato-gree)
![Static Badge](https://img.shields.io/badge/GitHub-blue?logo=GitHub&labelColor=black)
![Static Badge](https://img.shields.io/badge/author-3.7%2F3.8-blue?logo=Python&label=python&labelColor=black)
![Static Badge](https://img.shields.io/badge/Node.js-v18.16.1-blue?logo=Node.js&labelColor=black)
![Static Badge](https://img.shields.io/badge/java-1.8-blue?logo=java&labelColor=black)

# 声明

**作者声明：没有在任何平台进行代码售卖，请谨慎鉴别，上当受骗作者一律不负责**

**本项目仅供学习交流，严禁用于任何商业和非法用途，非本人使用而产生的纠纷与一切后果均与本人无关。**

# 简介

1. 本项项目是针对web端。小红书web的api都有加密，主要就是x-s。本项目是用python逆向小红书x-s。

2.由于小红书风控愈发严格，作者也提供在线获取小红书数据接口，包含web、app端。


# 作者提供的服务

## 1.在线获取xs、xt、xhs数据等

在线获取xs、xt、xhs数据等
接口文档：https://dataflow.apifox.cn/

https://github.com/submato/xhscrawl/blob/main/apiserver.md(弃用)

后续会增加各平台的逆向

## 2.创建小红书账号指南

[创建小红书账号指南](https://github.com/submato/xhscrawl/blob/main/service/service_index/account_manual.md)   


## 3.提供逆向单个api的源码

### 性能
本项目采用js计算，请求rt百毫秒级


### how to run demo

找到[demo/xhs.py](https://github.com/submato/xhscrawl/blob/main/demo/xhs.py) ,将自己需要的参数、cookie进行手动替换运行即可

- python环境
  - execjs包(可能编辑器会找不到这个包，真正名字叫PyExecJS)
  - 等其他import依赖
- java环境
- node js环境，需要支持ES13的 node js版本，也就是node js版本要晚于June 2022


### api源码列表
- **以下api均为web端api**

| 名称(里面有返回参数及价格)    | 
| ------------------------------------ |
|[发送评论](https://github.com/submato/xhscrawl/blob/main/service/service_index/comment.md)                   |
| [获取笔记详情](https://github.com/submato/xhscrawl/blob/main/service/service_index/note_detail.md)    |
| [笔记搜索](https://github.com/submato/xhscrawl/blob/main/service/service_index/search.md)                  |
| [用户搜索](https://github.com/submato/xhscrawl/blob/main/service/service_index/usersearch.md)                  |
| [获取笔记评论](https://github.com/submato/xhscrawl/blob/main/service/service_index/get_comment.md)                  |
| [收藏笔记](https://github.com/submato/xhscrawl/blob/main/service/service_index/collect_note.md)                |
| [给笔记点赞](https://github.com/submato/xhscrawl/blob/main/service/service_index/like_note.md)  |
| [给评论点赞](https://github.com/submato/xhscrawl/blob/main/service/service_index/like_comment.md)  |
| [获取用户所有笔记](https://github.com/submato/xhscrawl/blob/main/service/service_index/user_notes.md)  |
| [获取用户详情](https://github.com/submato/xhscrawl/blob/main/service/service_index/user_info.md)  |
| [获取关键词搜索推荐信息](https://github.com/submato/xhscrawl/blob/main/service/service_index/search_keyword_recommend.md)  |
| [homefeed首页推荐](https://github.com/submato/xhscrawl/blob/main/service/service_index/homefeed.md)  |
| [自动发布笔记](https://github.com/submato/xhscrawl/blob/main/service/service_index/creat_note.md) |
| [消息-评论和@列表](https://github.com/submato/xhscrawl/blob/main/service/service_index/mentions.md)  |
| [消息-赞和收藏](https://github.com/submato/xhscrawl/blob/main/service/service_index/likes.md)  |
| [消息-新增关注列表](https://github.com/submato/xhscrawl/blob/main/service/service_index/connections.md)  |
| [未读通知数](https://github.com/submato/xhscrawl/blob/main/service/service_index/unread.md)  |
| [关注用户](https://github.com/submato/xhscrawl/blob/main/service/service_index/follow.md)  |
| [专业号-发送私信](https://github.com/submato/xhscrawl/blob/main/service/service_index/pro_chat_sent_msg.md)  |
| [专业号-私信列表](https://github.com/submato/xhscrawl/blob/main/service/service_index/pro_msg_list.md)  |
| [专业号-与某用户历史聊天消息](https://github.com/submato/xhscrawl/blob/main/service/service_index/pro_chat_history.md)  |
| [创作中心-笔记列表](https://github.com/submato/xhscrawl/blob/main/service/service_index/creator_note_list.md)  |
| [二维码登录获取cookie](https://github.com/submato/xhscrawl/blob/main/service/service_index/login_qrcode.md)  |
| [创作中心-话题推荐接口](https://github.com/submato/xhscrawl/blob/main/service/service_index/topic_recommend.md)  |
| [话题下笔记列表](https://github.com/submato/xhscrawl/blob/main/service/service_index/topic_notes.md)  |
| [本账号用户信息](https://github.com/submato/xhscrawl/blob/main/service/service_index/user_me.md)  |
| [专业号名片](https://github.com/submato/xhscrawl/blob/main/service/service_index/pro-card.md)  |
| 若没有你需要的接口,联系作者有偿开发，[提需前必看](https://github.com/submato/xhscrawl/blob/main/service/service_index/feature_notice.md)    |

# 常见Q&A

[常见Q&A](https://github.com/submato/xhscrawl/blob/main/service/service_index/feature_notice.md) 

# 联系作者
telegram： https://t.me/xhsdatasever

Email: lukalaoban@gmail.com
# Star History

[![Star History Chart](https://api.star-history.com/svg?repos=submato/xhscrawl&type=Date)](https://star-history.com/#submato/xhscrawl&Date)

