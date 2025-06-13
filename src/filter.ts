import { HTMLRewriter } from 'htmlrewriter'

import { AttributeHandler, TextHandler } from './rewriter/index.ts'
import { ClearMagnet, NyaaTorrent } from './common.ts'
import { transform } from './rewriter/transform.ts'

export async function filter(response: Response): Promise<NyaaTorrent[]> {
    const category = new AttributeHandler('tr > td:first-child > a', 'title')
    const id = new AttributeHandler('tr > td:nth-child(2) > a:not([class])', 'href')
    const title = new AttributeHandler('tr > td:nth-child(2) > a:not([class])', 'title')
    const torrent = new AttributeHandler('tr > td:nth-child(3) > a:first-child', 'href')
    const magnet = new AttributeHandler('tr > td:nth-child(3) > a:nth-child(2)', 'href')
    const size = new TextHandler('tr > td:nth-child(4)')
    const time = new AttributeHandler('tr > td:nth-child(5)', 'data-timestamp')
    const seeders = new TextHandler('tr > td:nth-child(6)')
    const leechers = new TextHandler('tr > td:nth-child(7)')
    const downloads = new TextHandler('tr > td:nth-child(8)')

    const rewriter = new HTMLRewriter(() => {})
        .on(category.selector, category)
        .on(id.selector, id)
        .on(title.selector, title)
        .on(torrent.selector, torrent)
        .on(magnet.selector, magnet)
        .on(size.selector, size)
        .on(time.selector, time)
        .on(seeders.selector, seeders)
        .on(leechers.selector, leechers)
        .on(downloads.selector, downloads)

    await transform(rewriter, response)

    return id.Value.map((id, index) => ({
        id: parseInt(id.slice(6)),
        title: title.Value[index],
        category: category.Value[index],
        torrent: `https://nyaa.si${torrent.Value[index]}`,
        magnet: ClearMagnet(magnet.Value[index]),
        size: size.Value[index],
        date: parseInt(time.Value[index]),
        seeders: parseInt(seeders.Value[index]),
        leechers: parseInt(leechers.Value[index]),
        completed: parseInt(downloads.Value[index]),
    }))
}
