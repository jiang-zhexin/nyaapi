# Nyaapi

This project is a simple RESTful API wrapper for [nyaa](https://nyaa.si).

## How to use?

### Use in JavaScript

```JavaScript
// main.ts
const resp = await fetch('https://nyaapi.deno.dev')
if (resp.status !== 200) {
    console.error(await resp.text())
    return
} 
console.log(await resp.json())
```

### Method

Only `GET`.

### Param

| Support Path          | Support Query          | For example                                                         |
| --------------------- | ---------------------- | ------------------------------------------------------------------- |
| /                     | c = 1_0, 1_1 ,... ,6_2 | [/?c=1_3](https://nyaapi.deno.dev/?c=1_3)                           |
| /user/:name           | f = 0, 1, 2            | [/user/ANiTorrent?f=1](https://nyaapi.deno.dev/user/ANiTorrent?f=1) |
| /view/:id             | q = any string         | [/view/974380](https://nyaapi.deno.dev/view/974380)                 |
| /download/:id         | p = 1, ..., 100        | [/download/974380](https://nyaapi.deno.dev/download/974380)         |
| /download/:id.torrent | (other nyaa's query)   |                                                                     |

> [!WARNING]
> Unsupport Query: page=rss

## Policies

* This `https://nyaapi.deno.dev` is only a demo.
* Do not frequently request this API. Due to the limitations of nyaa.si, excessive requests will be quickly blocked.
* If you have a large number of requests, you can deploy for yourself.

> [!IMPORTANT]
> Please comply with the **AGPL license**.

## Deploy

```bash
# To install Deno
curl -fsSL https://deno.land/install.sh | sh

git clone git@github.com:jiang-zhexin/nyaapi.git
cd nyaapi
deno install
deno task run
# Then your can visit http://localhost:8000
```
