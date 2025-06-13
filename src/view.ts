import { HTMLRewriter } from 'htmlrewriter'

import { AttributeHandler, TextHandler } from './rewriter/index.ts'
import { TreeHandler } from './rewriter/tree.ts'
import { ClearMagnet, ExportTreeNode, NyaaItem } from './common.ts'
import { transform } from './rewriter/transform.ts'

export async function view(response: Response): Promise<NyaaItem> {
    const titleHandler = new TextHandler('div.panel-heading > h3.panel-title')
    const infoHandler = new TextHandler('div.row > div.col-md-5')
    const dateHandler = new AttributeHandler('div.row > div:nth-child(4)', 'data-timestamp')
    const torrentHandler = new AttributeHandler('div.panel-footer.clearfix > a', 'href')
    const filesHandler = new TreeHandler('div.torrent-file-list.panel-body > ul li')

    const rewriter = new HTMLRewriter(() => {})
        .on(titleHandler.selector, titleHandler)
        .on(infoHandler.selector, infoHandler)
        .on(dateHandler.selector, dateHandler)
        .on(torrentHandler.selector, torrentHandler)
        .on(filesHandler.selector, filesHandler)

    await transform(rewriter, response)

    const title = titleHandler.Value.map((value) => value.trim())
    const info = infoHandler.Value.map((value) => value.trim())
    // from /download/${id}.torrent to ${id}
    const id = parseInt(torrentHandler.Value[0].slice(10, torrentHandler.Value[0].length - 8))

    return {
        id: id,
        title: title[0],
        category: info[0],
        torrent: `https://nyaa.si/download/${id}.torrent`,
        magnet: ClearMagnet(torrentHandler.Value[1]),
        size: info[6],
        date: parseInt(dateHandler.Value[0]),
        seeders: parseInt(info[3]),
        leechers: parseInt(info[5]),
        completed: parseInt(info[7]),
        submitter: info[2],
        hash: info[8],
        information: info[4],
        include: ExportTreeNode(filesHandler.TreeNode),
    }
}
