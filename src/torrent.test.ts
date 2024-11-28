import { torrent } from './torrent.ts'

Deno.test('1904392.torrent', async () => {
    const data = await Deno.readFile('./test/download/1904392.torrent')
    const nyaa = new Response(data)
    const result = await torrent(nyaa)
    console.log(result)
})

Deno.test('974380.torrent', async () => {
    const data = await Deno.readFile('./test/download/974380.torrent')
    const nyaa = new Response(data)
    const result = await torrent(nyaa)
    console.log(result)
})
