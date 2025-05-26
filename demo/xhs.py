import json
import os
import re
import execjs
import requests

headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json;charset=UTF-8",
    "origin": "https://www.xiaohongshu.com",
    "pragma": "no-cache",
    "referer": "https://www.xiaohongshu.com/",
    "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
}


def transferCookies(cookies):
    cookiesList = cookies.split(';')
    cookiesJs = []
    for value in cookiesList:
        if value == "":
            continue
        cookiesJs.append(value)
    return cookiesJs



def parsResult(e, cookies, t=None):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, "xhs.js")
    return execjs.compile(open(file_path, 'r', encoding='utf-8').read()).call('XsXt', e, t, transferCookies(cookies))


def sentPostRequest(host, api, data, cookie):
    if cookie == "":
        print("need cookie")
        return

    xs_xt = parsResult(api, cookie, data)

    headers['cookie'] = cookie
    headers['X-s'] = xs_xt['X-s']
    headers['X-t'] = str(xs_xt['X-t'])

    url = host + api
    response = requests.post(url=url, data=json.dumps(data, separators=(",", ":"), ensure_ascii=False).encode("utf-8"), headers=headers)

    return response.json()
def DoApi(param, cookie):
    api = '/api/sns/web/v1/comment/post'
    host = 'https://edith.xiaohongshu.com'
    data = {
        "note_id": param["note_id"],
        "content": param["content"],
        "at_users":  param["at_users"],
    }
    return sentPostRequest(host, api, data, cookie)




if __name__ == '__main__':
    # 向笔记发送评论demo
    # warning 该js逆向只能用于改接口，如需其他接口请联系作者

    cookie = "" # put your cookie here
    param = {
        "note_id": "64e1d603000000001700f40d",
        "content": "hello world",
        "at_users":  []
    }

    response = DoApi(param,cookie)
    print(response)