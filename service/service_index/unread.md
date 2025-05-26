# name

## 可以干什么

获取 "赞和收藏"、"新增关注"、"评论和@" 未读数量。可用于后续各个列表查询详细信息

<img width="250" alt="image" src="https://raw.githubusercontent.com/submato/xhscrawl/main/source/WechatIMG122.jpeg">

对应图片中"赞和收藏"、"新增关注"、"评论和@"上的小红点数量

## api
/api/sns/web/unread_count


## 如何获取 && 价格

价格：500


## 付费后你将获得
  - 源文件(包含3个文件，v01.00重构后，不依赖本项目):授人以渔，之后想怎么用就怎么用。
    - js文件：js逆向文件，提供xs逆向。
    - py文件：主运行文件，以易懂为主要目标进行编写，就像demo一样一看就懂。
    - md文件：how to run的保姆教程，包括如何获取cookie、笔记id是什么等



## 数据Demo：

```json
{
    "data": {
        "unread_count": 0, //未读总数
        "likes": 0, //点赞收藏未读总数
        "connections": 0,//关注未读数
        "mentions": 0 //评论和@未读总数
    },
    "code": 0,
    "success": true,
    "msg": "成功"
}
```

