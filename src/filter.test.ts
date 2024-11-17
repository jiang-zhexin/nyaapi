import { filter } from './filter.ts'

Deno.test('/', async () => {
    const nyaa = await fetch('https://nyaa.si')
    const result = await filter(nyaa)
    console.log(result[0])
})
