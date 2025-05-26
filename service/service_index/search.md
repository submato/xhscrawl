## 搜索笔记

## 参数
- 关键字

## 局限性
- 之前一个账号一天大概搜索60次，每次可获取20个笔记。最近xhs在次数上频繁调整，10月12日作者测得500次没有遇到限制。
- 只支持翻10页

具体限制以自己具体情况为准

## how to run
代码以最简单朴素的方式编写，只需以下步骤
1. 向作者获取源码文件，放置本目录下
2. 替换自己cookie
3. 换上自己想要的参数

- 每一个参数都有说明
- 保证能够跑起来

## 如何获取 && 价格

价格：500

## 运行结果示例
```json
{
    "code": 0,
    "success": true,
    "msg": "成功",
    "data": {
        "has_more": true,
        "items": [
            {
                "model_type": "note",
                "note_card": {
                    "cover": {
                        "height": 4338,
                        "width": 826,
                        "url": "https://sns-img-qc.xhscdn.com/1040g00830pmr0uq76s6g5o40qpu09deadhev7v0",
                        "trace_id": "1040g00830pmr0uq76s6g5o40qpu09deadhev7v0",
                        "info_list": [
                            {
                                "image_scene": "FD_PRV_WEBP",
                                "url": "http://sns-webpic-qc.xhscdn.com/202310031843/272a33723bee8e8c3e7bda41c2c441a7/1040g00830pmr0uq76s6g5o40qpu09deadhev7v0!nc_n_webp_prv_1"
                            },
                            {
                                "image_scene": "FD_WM_WEBP",
                                "url": "http://sns-webpic-qc.xhscdn.com/202310031843/c9bc98b1a3b36e57ec89e941d2fee0ae/1040g00830pmr0uq76s6g5o40qpu09deadhev7v0!nc_n_webp_mw_1"
                            }
                        ],
                        "file_id": "1040g00830pmr0uq76s6g5o40qpu09deadhev7v0"
                    },
                    "image_list": [
                        {
                            "url": "http://ci.xiaohongshu.com/1040g00830pmr0uq76s6g5o40qpu09deadhev7v0?imageView2/2/w/1080/format/jpg",
                            "trace_id": "1040g00830pmr0uq76s6g5o40qpu09deadhev7v0",
                            "info_list": [
                                {
                                    "url": "http://sns-webpic-qc.xhscdn.com/202310031843/272a33723bee8e8c3e7bda41c2c441a7/1040g00830pmr0uq76s6g5o40qpu09deadhev7v0!nc_n_webp_prv_1",
                                    "image_scene": "FD_PRV_WEBP"
                                },
                                {
                                    "image_scene": "FD_WM_WEBP",
                                    "url": "http://sns-webpic-qc.xhscdn.com/202310031843/c9bc98b1a3b36e57ec89e941d2fee0ae/1040g00830pmr0uq76s6g5o40qpu09deadhev7v0!nc_n_webp_mw_1"
                                }
                            ],
                            "file_id": "1040g00830pmr0uq76s6g5o40qpu09deadhev7v0",
                            "height": 4338,
                            "width": 826
                        }
                    ],
                    "type": "normal",
                    "user": {
                        "nick_name": "123",
                        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/619c460051d52af1c0b8fdce.jpg?imageView2/2/w/80/format/jpg",
                        "user_id": "6080d67c000000000100b5ca",
                        "nickname": "123"
                    },
                    "interact_info": {
                        "liked": false,
                        "liked_count": "0"
                    }
                },
                "id": "6519c0cd000000001c014d47"
            },
            
        ]
    }
}
```




## 付费后你将获得
  - 源文件(包含3个文件，v01.00重构后，不依赖本项目):授人以渔，之后想怎么用就怎么用。
    - js文件：js逆向文件，提供xs逆向。
    - py文件：主运行文件，以易懂为主要目标进行编写，就像demo一样一看就懂。
    - md文件：how to run的保姆教程，包括如何获取cookie、笔记id是什么等
