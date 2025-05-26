# 新增关注列表

## 可以干什么

获取 消息下"新增关注"列表信息

<img width="250" alt="image" src="https://raw.githubusercontent.com/submato/xhscrawl/main/source/WechatIMG122.jpeg">

对应图片中"新增关注"中的信息


## api

/api/sns/web/v1/you/connections


## 如何获取 && 价格

价格：600

## 付费后你将获得
  - 源文件(包含3个文件，v01.00重构后，不依赖本项目):授人以渔，之后想怎么用就怎么用。
    - js文件：js逆向文件，提供xs逆向。
    - py文件：主运行文件，以易懂为主要目标进行编写，就像demo一样一看就懂。
    - md文件：how to run的保姆教程，包括如何获取cookie、笔记id是什么等



## 数据Demo：

```json
{
    "data": {
        "message_list": [
            {
                "user": {
                    "userid": "5f09XXXXXX00000100724e",
                    "nickname": "test",
                    "images": "XXXXx",
                    "fstatus": "none",
                    "red_official_verify_type": 0
                },
                "time": 1691744646,
                "score": 256006636,
                "track_type": "1",
                "id": "256006636",
                "type": "follow/you",
                "title": "开始关注你了"
            }
        ],
        "has_more": true,
        "cursor": 255095077
    },
    "code": 0,
    "success": true,
    "msg": "成功"
}

```

