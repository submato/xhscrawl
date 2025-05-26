# 用户信息

## 可以干什么
包含用户以下信息：

1. 用户名、头像、性别(如果用户有设置)、用户地区(如果用户有设置)、实际ip地区、年龄(如果用户有设置)
2. 简介
3. 用户粉丝数、关注数、点赞与收藏数


## api
向作者购买收费版本～


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
    "code": 0,
    "success": true,
    "msg": "成功",
    "data": {
        "tab_public": {
            "collection": false
        },
        "extra_info": {
            "fstatus": "none"
        },
        "result": {
            "message": "success",
            "success": true,
            "code": 0
        },
        "basic_info": {
            "gender": 0,
            "ip_location": "广东",
            "desc": "📮Xx11_08_",
            "imageb": "https://sns-avatar-qc.xhscdn.com/avatar/62acd39c1f83d1a235742781.jpg?imageView2/2/w/540/format/webp",
            "nickname": "我要去捉鱼",
            "images": "https://sns-avatar-qc.xhscdn.com/avatar/62acd39c1f83d1a235742781.jpg?imageView2/2/w/360/format/webp",
            "red_id": "Xx11_08"
        },
        "interactions": [
            {
                "type": "follows",
                "name": "关注",
                "count": "12"
            },
            {
                "type": "fans",
                "name": "粉丝",
                "count": "1204"
            },
            {
                "type": "interaction",
                "name": "获赞与收藏",
                "count": "7685"
            }
        ],
        "tags": [
            {
                "icon": "http://ci.xiaohongshu.com/icons/user/gender-male-v1.png",
                "name": "18岁",
                "tagType": "info"
            },
            {
                "name": "广东广州",
                "tagType": "location"
            }
        ]
    }
}
```

