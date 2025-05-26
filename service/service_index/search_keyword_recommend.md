# 搜索关键字

## 可以干什么
顾名思义，获取在搜索推荐下拉框信息，文字推荐、用户推荐都是一样的
<img width="439" alt="image" src="https://github.com/submato/xhscrawl/assets/55040284/ef5480be-b44b-4c39-91e7-6b19f014fcb0">


## api
/api/sns/web/v1/search/recommend

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
    "code": 1000,
    "success": true,
    "msg": "成功",
    "data": {
        "search_cpl_id": "241544667f0e460789bd7d8e70fe9343",
        "word_request_id": "936a3bfe-f1f0-4dc3-b54d-5d2c2d3f74a2#1695455852278",
        "sug_items": [
            {
                "type": "top_note",
                "text": "美女照片全身",
                "highlight_flags": [
                    true,
                    true,
                    false,
                    false,
                    false,
                    false
                ],
                "search_type": "notes"
            },
            {
                "highlight_flags": [
                    true,
                    false,
                    false,
                    false,
                    false
                ],
                "search_type": "notes",
                "type": "top_note",
                "text": "美.女壁纸"
            },
            {
                "text": "美.女头像",
                "highlight_flags": [
                    true,
                    false,
                    false,
                    false,
                    false
                ],
                "search_type": "notes",
                "type": "top_note"
            }
        ]
    }
}

```

