# homefeed首页推荐

## 可以干什么
获取首页推荐的所有笔记id

## api
/api/sns/web/v1/homefeed


## 如何获取 && 价格

价格：400

## 付费后你将获得
  - 源文件(包含3个文件，v01.00重构后，不依赖本项目):授人以渔，之后想怎么用就怎么用。
    - js文件：js逆向文件，提供xs逆向。
    - py文件：主运行文件，以易懂为主要目标进行编写，就像demo一样一看就懂。
    - md文件：how to run的保姆教程，包括如何获取cookie、笔记id是什么等



## 数据Demo：

```json
{
    "code":0,
    "success":true,
    "msg":"成功",
    "data":{
        "cursor_score":"1.6955287849700022E9",
        "items":[
            {
                "model_type":"note",
                "note_card":{
                    "type":"video",
                    "display_title":"谁能解释成都这种现象。。。😅😅",
                    "user":{
                        "nick_name":"来都来了",
                        "avatar":"https://sns-avatar-qc.xhscdn.com/avatar/62662907b227432e38badba6.jpg",
                        "user_id":"6094e4ee000000000101cff8",
                        "nickname":"来都来了"
                    },
                    "interact_info":{
                        "liked":false,
                        "liked_count":"3312"
                    },
                    "cover":{
                        "height":1920,
                        "width":1440,
                        "url":"https://sns-img-bd.xhscdn.com/9e9ce11e-584c-f645-202b-3b1d1a1a0582",
                        "trace_id":"",
                        "file_id":""
                    }
                },
                "track_id":"2c8cqkeoi7jq1i4426vod",
                "ignore":false,
                "id":"64f89145000000001d01549a"
            }
        ]
    }
}
```
