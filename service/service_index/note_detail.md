## 笔记详情

## 参数
- 笔记id
- xsec_token 与笔记id一一对应，在对应url上

## how to run
代码以最简单朴素的方式编写，只需以下步骤
1. 向作者获取源码文件，放置本目录下
2. 替换自己cookie
3. 换上自己想要的参数

- 每一个参数都有说明
- 保证能够跑起来

## 关于水印
该接口的获取的图片在右下脚或中间会有水印。作者提供获取无水印的方法(无须http交互)，价格在原价格上加300

## 如何获取 && 价格

价格：700



## 付费后你将获得
  - 源文件(包含3个文件，v01.00重构后，不依赖本项目):授人以渔，之后想怎么用就怎么用。
    - js文件：js逆向文件，提供xs逆向。
    - py文件：主运行文件，以易懂为主要目标进行编写，就像demo一样一看就懂。
    - md文件：how to run的保姆教程，包括如何获取cookie、笔记id是什么等



## 结果示例
```json
{
    "code": 0,
    "success": true,
    "msg": "成功",
    "data": {
        "cursor_score": "",
        "items": [
            {
                "id": "64cca5ba000000001201e1af",
                "model_type": "note",
                "note_card": {
                    "type": "normal",
                    "desc": "#头像分享[话题]# #鲜花分享[话题]# #古风头像[话题]# #女生头像[话题]# #动漫女生头像[话题]# #好看的女生头像[话题]# #头像[话题]# #荷花[话题]# #莲花[话题]# #粉色系[话题]# #好运[话题]# #仙气飘飘[话题]# #幸运[话题]# #美[话题]#",
                    "user": {
                        "user_id": "57d245e15e87e71c8569ff89",
                        "nickname": "天天Ai绘画师",
                        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/649171cc68f5a9af3e14f04d.jpg"
                    },
                    "at_user_list": [],
                    "last_update_time": 1691133371000,
                    "share_info": {
                        "un_share": false
                    },
                    "note_id": "64cca5ba000000001201e1af",
                    "interact_info": {
                        "collected_count": "117",
                        "comment_count": "2",
                        "share_count": "5",
                        "followed": false,
                        "relation": "none",
                        "liked": false,
                        "liked_count": "201",
                        "collected": false
                    },
                    "image_list": [
                        {
                            "url_pre": "http://sns-webpic-qc.xhscdn.com/202403051117/586cd1e8771f5ba27939c9593c6dd650/1040g00830nbhf4sg5s0048mchf2u3vs9oe03hn8!nd_prv_wlteh_webp_3",
                            "url_default": "http://sns-webpic-qc.xhscdn.com/202403051117/d01a1858cdec53331e31b9a707a616dd/1040g00830nbhf4sg5s0048mchf2u3vs9oe03hn8!nd_dft_wlteh_webp_3",
                            "file_id": "",
                            "height": 1920,
                            "width": 1920,
                            "url": "",
                            "trace_id": "",
                            "info_list": [
                                {
                                    "image_scene": "WB_PRV",
                                    "url": "http://sns-webpic-qc.xhscdn.com/202403051117/586cd1e8771f5ba27939c9593c6dd650/1040g00830nbhf4sg5s0048mchf2u3vs9oe03hn8!nd_prv_wlteh_webp_3"
                                },
                                {
                                    "image_scene": "WB_DFT",
                                    "url": "http://sns-webpic-qc.xhscdn.com/202403051117/d01a1858cdec53331e31b9a707a616dd/1040g00830nbhf4sg5s0048mchf2u3vs9oe03hn8!nd_dft_wlteh_webp_3"
                                }
                            ]
                        }
                    ],
                    "tag_list": [
                        {
                            "id": "5be3d55439270b00014ba522",
                            "name": "美",
                            "type": "topic"
                        }
                    ],
                    "time": 1691133370000,
                    "title": "遇见荷花小姐姐，好运莲莲！▏古风女生头像"
                }
            }
        ],
        "current_time": 1709608648497
    }
}

```



