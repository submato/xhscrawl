# 获取笔记评论

## 可以干什么
1. 包含两个接口
   1. 获取评论：https://edith.xiaohongshu.com/api/sns/web/v2/comment/sub/page
   2. 获取评论的子评论：https://edith.xiaohongshu.com/api/sns/web/v2/comment/page
2. 获取笔记所有评论，包括子评论
3. 包括发评论的用户名、id、点赞数等。

## 效果
<img width="1305" alt="image" src="https://github.com/submato/xhscrawl/assets/55040284/a8ff72d9-1b5f-4fff-a3e2-786748472561">


## 如何获取 && 价格

价格：1500



## 付费后你将获得
  - 源文件(包含3个文件，v01.00重构后，不依赖本项目):授人以渔，之后想怎么用就怎么用。
    - js文件：js逆向文件，提供xs逆向。
    - py文件：主运行文件，以易懂为主要目标进行编写，就像demo一样一看就懂。
    - md文件：how to run的保姆教程，包括如何获取cookie、笔记id是什么等



## 数据Demo：

作者已经对数据做了预处理，将每一条评论(包含子评论)数据输出。

```json
{
    "target_comment":{
        "id":"64da260d000000002d01a941",
        "user":{
            "id":"5b519a9ee8ac2b35341ab41b",
            "nickname":"momo"
        }
    },
    "id":"64da482c000000002b006e19",
    "user_id":"62821447000000002102428c",
    "user_name":"猴森Ah",
    "content":"哈哈哈哈哈",
    "like_count":"1",
    "at_users":[

    ]
}
```

