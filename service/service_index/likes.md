# 赞和收藏

## 可以干什么
获取赞和收藏消息通知列表

<img width="250" alt="image" src="https://raw.githubusercontent.com/submato/xhscrawl/main/source/WechatIMG122.jpeg">

对应图片中"赞和收藏"中的信息

## api
/api/sns/web/v1/you/likes


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
        "result": {
            "success": true,
            "code": 0,
            "message": ""
        },
        "message_list": [
            {
                "time": 1691744740,
                "time_flag": 0,
                "title": "赞了你的笔记",
                "score": 256007121,
                "user_info": {
                    "userid": "5fsadasd0100724e",
                    "nickname": "彬彬彬彬彬嗷",
                    "image": "httpsasdasdasdasdb.jpg?imageView2/2/w/120/format/jpg",
                    "fstatus": "none",
                    "red_official_verify_type": 0
                },
                "item_info": {
                    "image_info": {
                        "url": "http://ci.xiaXXXXximageView2/2/w/1080/format/jpg",
                        "width": 2560,
                        "height": 1706
                    },
                    "illegal_info": {
                        "status": 0,
                        "desc": "",
                        "illegal_status": "NORMAL"
                    },
                    "link": "xhsdiscover://item/discovXXXXXXXtype=normal&sourceID=notifications&feedType=single",
                    "user_info": {
                        "userid": "6451f2af00xxxxxxf73",
                        "nickname": "小红薯_",
                        "image": "https://img.xiaohongshu.com/avatar/7121a416be8e543266fd62xxxxxxe_1c_1x.jpg",
                        "red_official_verify_type": 0
                    },
                    "status": 0,
                    "type": "note_info",
                    "id": "64cf6400xxxx00b02ada9",
                    "image": "http://cixxxxxx/w/1080/format/jpg"
                },
                "track_type": "6",
                "liked": false,
                "id": "25600xxxx21",
                "type": "liked/item"
            },
            {
                "score": 256006596,
                "liked": false,
                "time_flag": 0,
                "id": "256006596",
                "time": 1691744639,
                "user_info": {
                    "red_official_verify_type": 0,
                    "userid": "5f096cdXXXXXX4e",
                    "nickname": "彬彬嗷",
                    "image": "htXXXXmat/jpg",
                    "fstatus": "none"
                },
                "item_info": {
                    "type": "note_info",
                    "id": "6457XXXXX",
                    "image": "XXXX",
                    "image_info": {
                        "width": 1920,
                        "height": 2560,
                        "url": "xXXXX"
                    },
                    "illegal_info": {
                        "status": 0,
                        "desc": "",
                        "illegal_status": "NORMAL"
                    },
                    "link": "XXXX",
                    "user_info": {
                        "userid": "6451f2af0000000029016f73",
                        "nickname": "小红薯_",
                        "image": "XXXX",
                        "red_official_verify_type": 0
                    },
                    "status": 0
                },
                "track_type": "6",
                "type": "liked/item",
                "title": "赞了你的笔记"
            },
        ],
        "has_more": true,
        "cursor": 255351370
    },
    "code": 0,
    "success": true,
    "msg": "成功"
}

```

