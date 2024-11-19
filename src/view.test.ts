import { view } from './view.ts'

Deno.test('one file', async () => {
    const index = await Deno.readFile('./test/view/1901037.html')
    const nyaa = new Response(index)
    const result = await view(nyaa)
    console.log(result)
})

Deno.test('files with dir', async () => {
    const index = await Deno.readFile('./test/view/1886907.html')
    const nyaa = new Response(index)
    const result = await view(nyaa)
    console.log(result)
})

Deno.test('files with dirs', async () => {
    const index = await Deno.readFile('./test/view/974380.html')
    const nyaa = new Response(index)
    const result = await view(nyaa)
    console.log(result)
    // await Deno.writeTextFile('./974380.json', JSON.stringify(result, null, 4))
})
