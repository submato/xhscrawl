# 话题笔记列表

## 可以干什么
获取话题笔记列表；可以翻页

如：https://www.xiaohongshu.com/page/topics/6193a9cbbcb9c3000136f893?fullscreen=true&naviHidden=yes&xhsshare=CopyLink&appuid=63d9361100000000270282dc&apptime=1714790780

## api
/api/sns/web/v1/search/recommend

## 如何获取 && 价格

价格：500

## 付费后你将获得
  - 源文件(包含2个文件，v01.00重构后，不依赖本项目):授人以渔，之后想怎么用就怎么用。
    - py文件：主运行文件，以易懂为主要目标进行编写，就像demo一样一看就懂。
    - md文件：how to run的保姆教程，包括如何获取cookie、笔记id是什么等


## 数据Demo：

```json
{
    "result":0,
    "success":true,
    "msg":"",
    "data":{
        "notes":[
            {
                "id":"6635e9d9000000001e03bd79",
                "type":"normal",
                "likes":246,
                "inlikes":false,
                "collects":0,
                "title":"跟外刊学写作 | Day29 暗恋的好处与危险",
                "desc":"",
                "user":{
                    "nickname":"跟外刊学写作",
                    "images":"https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo311k8fs0anc0g5peuu8rh92drvbcq5mg?imageView2/2/w/80/format/jpg",
                    "red_official_verify_type":0,
                    "userid":"65def23700000000050089bb"
                },
                "style":0,
                "collected_count":0,
                "images_list":[

                ],
                "image_count":10,
                "request_id":"f8a979f577a2be8e446b6753a29ef05f",
                "style_name":"",
                "create_time":1714809305000,
                "has_music":false,
                "cursor":"GYGHL0vBA9ZzSSqRVrSBuhbzIjMuoDXbs6aT0qGLNvw",
                "deeplink":"xhsdiscover://portrait_feed/6635e9d9000000001e03bd79?sourceId=topic&feedType=multiple&title=''¬e=6635e9d9000000001e03bd79&api_extra={"cursor":"GYGHL0vBA9ZzSSqRVrSBuhbzIjMuoDXbs6aT0qGLNvw","page_id":"6193a9cbbcb9c3000136f893","sort":"hot_desc"}"
            }
        ],
        "total_note_count":16,
        "total_user_count":16,
        "has_more":false,
        "cursor":""
    }
}
```

