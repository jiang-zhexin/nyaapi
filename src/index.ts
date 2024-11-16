import { filter } from './filter.ts'
import { Hono } from 'hono'

const app = new Hono()

app.notFound((c) => {
	return c.text('This API only filter torrent info. You need to go https://nyaa.si to download binary file.', 400)
})

app.on('GET', ['/', '/user/:name'], async (c) => {
	if (c.req.query('page') === 'rss') {
		return c.text('Unsupport rss page.', 400)
	}
	const nyaa = await fetch(`https://nyaa.si${c.req.path}`)
	const result = await filter(nyaa)
	return c.json(result)
})

Deno.serve(app.fetch)
