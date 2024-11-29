# Nyaapi
This project is a simple RESTful API wrapper for [nyaa](https://nyaa.si).

## How to use?
### Method
Only `GET`.

### Support Path
* /
* /user/:name
* /view/:id
* /download/:id
* /download/:id.torrent

### Support Query
* f = 0 | 1 | 2
* c = 1_0 | 1_1 | ... | 6_2
* q = any string
* p = 1 | ... | 100
  
### Unsupport Query
* page=rss

### For example
* [/?c=1_3](https://nyaapi.deno.dev/?c=1_3)
* [/user/ANiTorrent](https://nyaapi.deno.dev/user/ANiTorrent)
* [/view/974380](https://nyaapi.deno.dev/view/974380)
* [/download/974380](https://nyaapi.deno.dev/download/974380)

## Policies
* This `https://nyaapi.deno.dev` is only a demo. Due to the limitations of nyaa.si, excessive requests will be quickly blocked.
* If you have a large number of requests, you can deploy for yourself.
* Please comply with the **AGPL license**.

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