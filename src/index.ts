import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { HTTPException } from 'hono/http-exception'

import { filter } from './filter.ts'
import { view } from './view.ts'

export const app = new Hono()

app.notFound((c) => {
	return c.text('This API only filter torrent info. You need to go https://nyaa.si to download binary file.', 400)
})

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return err.getResponse()
	}
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

async function fetchNyaa(url: string): Promise<Response> {
	const { pathname, search } = new URL(url)
	const nyaa = await fetch(`https://nyaa.si${pathname}${search}`)
	if (nyaa.status !== 200) {
		switch (nyaa.status) {
			case 400:
				throw new HTTPException(400, { message: 'Seem an unsupported query parameter.' })
			default:
				throw new HTTPException(502)
		}
	}
	return nyaa
}

Deno.serve(app.fetch)
