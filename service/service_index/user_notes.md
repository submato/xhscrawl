# 用户发布的稿件

## 可以干什么
获取用户发布的稿件

## api
/api/sns/web/v1/user_posted


## 如何获取 && 价格

价格：500

## 付费后你将获得
  - 源文件(包含3个文件，v01.00重构后，不依赖本项目):授人以渔，之后想怎么用就怎么用。
    - js文件：js逆向文件，提供xs逆向。
    - py文件：主运行文件，以易懂为主要目标进行编写，就像demo一样一看就懂。
    - md文件：how to run的保姆教程，包括如何获取cookie、笔记id是什么等



## 数据Demo：

```json
"success":true,
    "msg":"成功",
    "data":{
        "cursor":"",
        "notes":[
            {
                "user":{
                    "nick_name":"abby huang",
                    "avatar":"https://sns-avatar-qc.xhscdn.com/avatar/6072114ba6cf27d7b3152d64.jpg",
                    "user_id":"582f71fb5e87e7473ea57207",
                    "nickname":"abby huang"
                },
                "interact_info":{
                    "liked":false,
                    "liked_count":"337",
                    "sticky":false
                },
                "cover":{
                    "file_id":"",
                    "height":1280,
                    "width":1707,
                    "url":"https://sns-img-qc.xhscdn.com/3f9c5c9d-196a-56f3-dc9b-42b1372d0821",
                    "trace_id":""
                },
                "note_id":"6506e5e5000000001500b477",
                "type":"normal",
                "display_title":"怎么带女佣回中国🇨🇳"
            },
        ],
        "has_more":false
    },
    "code":0
}
```

