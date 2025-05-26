# 消息-评论和@列表

## 可以干什么
获取 消息下"评论和@"列表信息

<img width="250" alt="image" src="https://raw.githubusercontent.com/submato/xhscrawl/main/source/WechatIMG122.jpeg">

对应图片中"评论和@"中的信息

## api
/api/sns/web/v1/you/mentions


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
    "code": 0,
    "success": true,
    "msg": "成功",
    "data": {
        "message_list": [
            {
                "track_type": "26",
                "type": "comment/comment",
                "title": "回复了我的评论",
                "time": 1691668228,
                "user_info": {
                    "userid": "5f5c34990000000001001a54",
                    "nickname": "XXX",
                    "image": "https://sns-avatar-qc.xhscdn.com/XXXXX/jpg",
                    "red_official_verify_type": 0,
                    "indicator": "你的好友"
                },
                "item_info": {
                    "user_info": {
                        "userid": "6451f2af0xxxx6f73",
                        "nickname": "小红薯64Fxxxx69",
                        "image": "https://sns-avatar-qc.xhscdn.com/avatar/645b65431e7abf18da7d1266.jpg?imagxxxxt/jpg",
                        "red_official_verify_type": 0
                    },
                    "status": 0,
                    "type": "note_info",
                    "id": "64576356xx013003f5d",
                    "image": "http://ci.xiaohongshu.com/1000g00xxxxxxxxxxf5ogu0605p2huanqarrj8o8bad0?imageView2/2/w/1080/format/jpg",
                    "image_info": {
                        "width": 1920,
                        "height": 2560,
                        "url": "http://ci.xiaohongshu.com/100xxxxxxxxxd0?imageView2/2/w/1080/format/jpg"
                    },
                    "illegal_info": {
                        "status": 0,
                        "desc": "",
                        "illegal_status": "NORMAL"
                    },
                    "link": "xhsdiscover://item/discovery.645xxxxxxxxd?type=normal&sourceID=notifications&feedType=single"
                },
                "comment_info": {
                    "status": 0,
                    "liked": false,
                    "like_count": 0,
                    "target_comment": {
                        "id": "64d4c70f000000000e001e9c",
                        "content": "@羊羊爱吃草 测试测试",
                        "illegal_info": {
                            "desc": "该评论已删除",
                            "illegal_status": "HIGH_YOURSELF",
                            "status": 2
                        },
                        "user_info": {
                            "userid": "6451f2af0000000029016f73",
                            "nickname": "小红薯64xxxx469",
                            "image": "https://sns-avatar-qc.xhscdn.com/avatarxxxxxda7d1266.jpg?imageView2/2/w/120/format/jpg",
                            "red_official_verify_type": 0
                        },
                        "status": 0,
                        "liked": false,
                        "like_count": 0
                    },
                    "id": "64d4cf0200xxxxx007fe6",
                    "content": "测试测试",
                    "illegal_info": {
                        "status": 1,
                        "desc": "该评论已删除",
                        "illegal_status": "DELETE"
                    }
                },
                "id": "25581xxxx5216",
                "score": 255815216,
                "liked": false,
                "time_flag": 0
            }
        ],
        "has_more": true,
        "cursor": 255132541
    }
}
```

