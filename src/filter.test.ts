import { filter } from './filter.ts'

Deno.test('/', async () => {
    const index = await Deno.readFile('./test/index.html')
    const nyaa = new Response(index)
    const result = await filter(nyaa)
    console.log(result.slice(0, 3))
})
