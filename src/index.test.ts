import { app } from './index.ts'

Deno.test('/', async () => {
    const resp = await app.request('http://localhost/?page=rss')
    if (resp.status === 200) {
        const data = await resp.json()
        console.log(data.slice(0, 3))
    } else {
        throw new Error(await resp.text())
    }
})
