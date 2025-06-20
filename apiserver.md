# 简介


# 接口概览

| 接口                     | 对应平台及关键字段 | 每次调用消耗token数  |响应数据 | 接口超时时间 | 最高QPS |
| ------------------------ | ------------------ |   -------- |-------- | ------------ | ------- |
| /api/xhs/xs             | 小红书 xs、xt      | 10 token/次  | 50ms    | 800ms        | 200       |
| /api/xhs/notedetail | 笔记详情                  | 40 token/次                 | 秒级 | 无       |      量大请提前联系作者     | 
| /api/xhs/getcomment | 笔记评论                  | 20 token/次                 | 秒级 | 无       |      量大请提前联系作者     | 
| /api/xhs/getsubcomments | 笔记子评论                  | 20 token/次                 | 秒级 | 无       |      量大请提前联系作者     | 
| /api/xhs/appsearch | app笔记搜索                  | 60 token/次                 | 秒级 | 无       |      量大请提前联系作者     |
| /api/xhs/appuserinfo | (新)APP用户详情                  | 50 token/次                 | 秒级 | 无       |      量大请提前联系作者     |
| /api/xhs/appuserposted | (新)app用户发布笔记列表                  | 40 token/次                 | 秒级 | 无       |      量大请提前联系作者     | 
| /api/xhs/tagnotes | 话题笔记列表                  | 20 token/次                 | 秒级 | 无       |      量大请提前联系作者     | 
| 以下接口不建议使用 | 以下接口不建议使用                 | /                 | / | /       |      /     | 
| /api/xhs/userposted（已下线） | /                  | /                 | 秒级 | 无       |      量大请提前联系作者     | 
| /api/xhs/userinfo （已下线）| /                    | /              | 秒级 | 无       |      量大请提前联系作者     | 
| /api/xhs/websearch （已下线）| /                     | /               | 秒级 | 无       |      量大请提前联系作者     | 

# QPS相关

若对qps有要求请联系作者，作者将为单独您扩充资源。

# 价格

## token消耗优先级

1. 订阅计划 > 单独购买的token。
2. 订阅计划内：到期时间越早，越优先消耗。

## token数充值价格表

单独购买的token没有过期时间，可在任意时间使用。

| 价格                   | 最少充值 |
| ------------  | -------- |
| 1¥/千token      | 5元      |

## 订阅计划


| 周期          | 价格    | token数 | 折扣 |
| ------------- | ------- | ------- | ------- |
| 1个月小量计划A | 100元  | 11w    | 9.09折|
| 1个月小量计划B | 200元  | 25w    | 8折|
| 1个月小量计划 | 500元   | 70w     | 7.14折|
| 1个月中量计划 | 1000元  | 160w     | 6.25折| 
| 1个月大量计划 | 2000元  | 400w    | 5折|



# 接口文档

## 公共HOST

联系作者



## 公共请求头(header)
所有接口都一样
```json
{
  //  Authorization用于标识帐号，从官网'我的'中获取。
  "Authorization": "Token cc87ae3f488357cabd786689c4d9d1675ae85b26",
  "Content-Type": "application/json"  //使用json交互
 
}
```



## 1. GET /api/xhs/notedetail App端图文笔记详情接口 

> token消耗：40

> param:

| 参数         | 类型	| 含义         | 是否必须 |
| ------------ | ------|--------------------- | -------- |
|   noteId  | string |   笔记id    | 必须|

> 返回说明：视频笔记请不要用这个接口，有可能请求失败，且会扣费。

## 2. GET /api/xhs/videonotedetail App端视频笔记详情接口

> token消耗：40

> param:

| 参数         | 类型	| 含义         | 是否必须 |
| ------------ | ------|--------------------- | -------- |
|   noteId  | string |   笔记id    | 必须|

> 返回说明：视频接口为feed流，返回3个视频，第一个为当前视频。若不存在视频笔记则返回剩余两个，或返回空值或失败

> 其他：成功率将比图文接口高

## 3. GET /api/xhs/getcomment  App端笔记评论接口

> token消耗：20

> param:

| 参数         | 类型	| 含义         | 是否必须 |
| ------------ | ------|--------------------- | -------- |
|   noteId  | string |   笔记id    | 必须|
|   start  | string |      翻页，上一次请求最后一条评论的id。不传默认请求第一页。 | 非必需|

## 4. GET /api/xhs/getsubcomments  App端笔记子评论接口

> token消耗：20

> param:

| 参数         | 类型	| 含义         | 是否必须 |
| ------------ | ------|--------------------- | -------- |
|   noteId  | string |   笔记id    | 必须|
|   commentId  | string |   一级评论id（要请求哪条评论的子评论）    | 必须|
|   start  | string |      翻页，上一次请求最后一条评论的id。不传默认请求第一页。 | 非必需|

## 5. GET /api/xhs/appsearch App端笔记搜索接口

> token消耗：60

> param:

| 参数         | 类型	| 含义         | 是否必须 |
| ------------ | ------|--------------------- | -------- |
| keyword    | string  |     要搜索的关键字  |  必须|
| page    | integer  |     第几页，从1开始  |  必须|
| searchId    | string  |   第一次请求可不传，服务端会生成searchId。 翻页时建议携带服务端返回的searchId。多个关键字不要复用searchId。    |  非必须|
| sessionId    | string  |    第一次请求可不传，服务端会生成sessionId。 翻页时建议携带服务端返回的sessionId。   |  非必须|
| sortType    | string  |    笔记排序规则 默认值：general 可选值：综合：general、最新：time_descending、最多点赞：popularity_descending、最多评论：comment_descending、最多收藏：collect_descending   |  非必须|
| filterNoteType    | string  |   筛选笔记类型 默认值：不限 可选值：视频笔记、普通笔记    |  非必须|
| filterNoteTime    | string  |    筛选笔记发布时间 默认值：不限 可选值：一天内、一周内、半年内   |  非必须|
| filterNoteRange    | string  |   筛选笔记搜索范围 默认值：不限 可选值：已看过、未看过、已关注    |  非必须|

## 6. GET /api/xhs/appusersearch App端用户搜索接口

> token消耗：60

> param:

| 参数         | 类型	| 含义         | 是否必须 |
| ------------ | ------|--------------------- | -------- |
| keyword    | string  |     要搜索的关键字  |  必须|
| page    | integer  |     第几页，从1开始  |  必须|
| searchId    | string  |   第一次请求可不传，服务端会生成searchId。 翻页时建议携带服务端返回的searchId。多个关键字不要复用searchId。    |  非必须|



## 7. GET /api/xhs/appuserinfo app用户详情接口

> token消耗：50

> param:

| 参数         | 类型	| 含义         | 是否必须 |
| ------------ | ------|--------------------- | -------- |
|  userId   | string |   用户id    | 必须 |


## 9. GET /api/xhs/appuserposted  APP用户笔记列表
> token消耗：40

> param:

| 参数         | 类型	| 含义         | 是否必须 |
| ------------ | ------|--------------------- | -------- |
|   userId  | string |    用户id   | 必须 |
|   cursor  | string |    翻页，上一次请求到的最后一条作品id。 不传默认请求第一页。   | 非必须 |

> 返回

第一页返回4~6条，翻页每页返回20条



## 11. GET /api/xhs/tagnotes App话题标签笔记列表

> token消耗：20

> param:

| 参数         | 类型	| 含义         | 是否必须 |
| ------------ | ------|--------------------- | -------- |
|   pageId  | string |   标签id    | 必须 |
|   first_load_time  | string |   首次请求的时间，毫秒级时间戳    | 必须 |
|   sort  | string |   排序 默认值：hot（综合） 可选值：hot（综合）、time（最新）、trend（最热）    | 非必须 |
|   session_id  | string |   首次不要传，由服务端生成。 翻页传。    | 非必须 |
|   last_note_ct  | string |   首次不传。翻页传上一次请求返回的最后一条笔记create_time字段    | 非必须 |
|   last_note_id  | string |   首次不传。翻页传上一次请求返回的最后一条笔记id    | 非必须 |
|   cursor_score  | string |   首次不传。翻页传上一次请求返回的最后一条笔记cursor_score字段    | 非必须 |




## 13. POST /api/xhs/xs


### 请求体(json格式)

```json
{
  "a1": "194fa029a780aceej3dvs06kum1qwb6r09b0g5ghp30000317563",
  // 小红书帐号cookie中的a1字段
  "params": {},
  // 请求小红书的接口的参数
  "method": "post",
  // 请求小红书接口的方法
  "api": "/api/sns/web/v2/login/code"
  // 请求小红书接口名
}
```

### 响应参数

```json
{
  'code': 0,

  'msg': '',

  'data': {
    'X-s': 'XXX',
    'X-t': 00000
  }
}

```

### python代码实例

以下示范仅为请求/api/xhs/xs接口

```python
# 以下为笔记详情接口示范

if __name__ == '__main__':
    # 小红书帐号cookie
    cookie = "xxx"
    # 小红书账号cookie a1字段
    a1 = 'xxx'
    # 请求小红书的参数
    param = {
        "source_note_id": "679469900000000018018d98",
        "image_formats": ["jpg", "webp", "avif"],
        "extra": {"need_body_topic": "1"},
        "xsec_token": "ABREBBrQgn7R-7Q0SFGFY0AdTauA-_aziwDDC3DvJxLrs="
    }
    # 请求小红书的api
    api = '/api/sns/web/v1/feed'
    data = {
        "a1": a1,
        "params": param,
        "method": "post",  # 小红书该api方式为post
        "api": api,
    }
    host = "http://apiserver.top"
    Authorization = "xxx"  # apiserver.top 平台的Authorization 填这里

    headers = {
        "Authorization": f"Token {Authorization}",  # 填入Authorization
        "Content-Type": "application/json",  # 确保请求头中包含 Content-Type
    }

    response = requests.post(f"{host}/api/xhs/xs", headers=headers, json=data, )
    xs_xt = response.json().get('data')
    print(xs_xt)

    xhsHeader = {"accept": "application/json, text/plain, */*", "accept-language": "zh-CN,zh;q=0.9",
                 "cache-control": "no-cache", "content-type": "application/json;charset=UTF-8",
                 "origin": "https://www.xiaohongshu.com", "pragma": "no-cache",
                 "referer": "https://www.xiaohongshu.com/",
                 "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
                 "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": "\"Windows\"", "sec-fetch-dest": "empty",
                 "sec-fetch-mode": "cors", "sec-fetch-site": "same-site",
                 "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                 'cookie': cookie,
                 }
    xhsHeader["X-s"] = xs_xt["X-s"]
    xhsHeader["X-t"] = str(xs_xt["X-t"])

    response = requests.post(url='https://edith.xiaohongshu.com/api/sns/web/v1/feed',
                             data=json.dumps(param, separators=(",", ":"), ensure_ascii=False).encode("utf-8"),
                             headers=xhsHeader)

    print(response.json())
```