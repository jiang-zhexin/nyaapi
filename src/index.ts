import { filter } from './filter.ts'

async function main(request: Request): Promise<Response> {
	const { pathname, searchParams, search } = new URL(request.url)
	if (!(pathname === '/' || pathname.startsWith('/user/'))) {
		return new Response('This API only filter torrent info. You need to go https://nyaa.si to download binary file.', { status: 400 })
	}
	if (pathname === '/' && searchParams.get('page') === 'rss') {
		return new Response('Unsupport rss page.', { status: 400 })
	}
	const nyaa = await fetch(`https://nyaa.si${pathname}${search}`)
	const response = await filter(nyaa)
	return response
}

Deno.serve(main)
