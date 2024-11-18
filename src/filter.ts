import { HTMLRewriter } from 'htmlrewriter'

import { AttributeHandler, TextHandler } from './rewriter/index.ts'

interface nyaa_torrent {
    id: number
    category: string
    title: string
    torrent: string
    magnet: string
    size: string
    time: number
    seeders: number
    leechers: number
    downloads: number
}

export async function filter(response: Response): Promise<nyaa_torrent[]> {
    const category = new AttributeHandler('tr td:first-child a', 'title')
    const id = new AttributeHandler('tr td:nth-child(2) a:not([class])', 'href')
    const title = new AttributeHandler('tr td:nth-child(2) a:not([class])', 'title')
    const torrent = new AttributeHandler('tr td:nth-child(3) a:first-child', 'href')
    const magnet = new AttributeHandler('tr td:nth-child(3) a:nth-child(2)', 'href')
    const size = new TextHandler('tr td:nth-child(4)')
    const time = new AttributeHandler('tr td:nth-child(5)', 'data-timestamp')
    const seeders = new TextHandler('tr td:nth-child(6)')
    const leechers = new TextHandler('tr td:nth-child(7)')
    const downloads = new TextHandler('tr td:nth-child(8)')

    await new HTMLRewriter()
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
        .transform(response)
        .arrayBuffer()

    const result = id.Value.map((id, index) => ({
        id: parseInt(id.slice(6)),
        category: category.Value[index],
        title: title.Value[index],
        torrent: `https://nyaa.si${torrent.Value[index]}`,
        magnet: `magnet:?xt=${magnetParse(magnet.Value[index])?.xt}`,
        size: size.Value[index],
        time: parseInt(time.Value[index]),
        seeders: parseInt(seeders.Value[index]),
        leechers: parseInt(leechers.Value[index]),
        downloads: parseInt(downloads.Value[index]),
    }))

    return result
}

function magnetParse(magnet: string) {
    const { searchParams } = new URL(magnet)
    return {
        raw: magnet,
        xt: searchParams.get('xt'),
        dn: searchParams.get('amp;dn'),
        tr: searchParams.getAll('amp;tr'),
    }
}
