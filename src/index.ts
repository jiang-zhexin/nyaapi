import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { HTTPException } from 'hono/http-exception'

import { filter } from './filter.ts'
import { view } from './view.ts'
import { torrent } from './torrent.ts'

export const app = new Hono()

app.notFound((c) => {
    return c.text('This API only filter torrent info. Allow Path: "/", "/user/:name", "/view/:id", "/download/:id"', 400)
})

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse()
    }
    console.error(err)
    return c.text('Server throw a unkown error!', 500)
})

app.on(
    'GET',
    ['/', '/user/:name'],
    validator('query', (value, c) => {
        if (value.page === 'rss') {
            return c.text('Unsupport rss page.', 400)
        }
    }),
    async (c) => {
        const nyaa = await fetchNyaa(c.req.url)
        const result = await filter(nyaa)
        return c.json(result)
    },
)

app.get('/view/:id', async (c) => {
    const nyaa = await fetchNyaa(c.req.url)
    const result = await view(nyaa)
    return c.json(result)
})

app.get('/download/:id', async (c) => {
    const nyaa = await fetchNyaa(c.req.url.endsWith('.torrent') ? c.req.url : `${c.req.url}.torrent`)
    const result = await torrent(nyaa)
    return c.json(result)
})

async function fetchNyaa(url: string): Promise<Response> {
    const { pathname, search } = new URL(url)
    const target = `https://nyaa.si${pathname}${search}`
    const nyaa = await fetch(target)
    if (nyaa.status !== 200) {
        console.error(`fetch ${target} but get nyaa status: ${nyaa.status}`)
        switch (nyaa.status) {
            case 400:
                throw new HTTPException(400, { message: 'Seem an unsupported query parameter.' })
            case 403:
                throw new HTTPException(403, { message: 'You have exceeded the maximum number of pages. Please make your search query less broad.' })
            case 404:
                throw new HTTPException(404, { message: 'The path you requested does not exist on this server.' })
            default:
                throw new HTTPException(502, { message: 'Nyaa return a unkown response.' })
        }
    }
    return nyaa
}

Deno.serve(app.fetch)
