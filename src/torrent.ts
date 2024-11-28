import { BenDecoder } from '@zhexin/bencoder'

export async function torrent(torrent: Response): Promise<Torrent> {
    const torrentlike = BenDecoder(await torrent.bytes()) as RawTorrent
    const result = {
        announce: torrentlike.announce,
        announce_list: torrentlike['announce-list'],
        comment: torrentlike.comment,
        created_by: torrentlike['created by'],
        creation_date: torrentlike['creation date'],
        encoding: torrentlike.encoding,
        info: {
            files: torrentlike.info.files,
            length: torrentlike.info.length,
            name: torrentlike.info.name,
            piece_length: torrentlike.info['piece length'],
        },
    }
    result.info.files ?? delete result.info.files
    return result
}

interface Torrent {
    announce: string
    announce_list: string[][]
    comment: string
    created_by: string
    creation_date: number
    encoding: string
    info: {
        files?: file[]
        length: number
        name: string
        piece_length: number
    }
}

interface RawTorrent {
    'announce': string
    'announce-list': string[][]
    'comment': string
    'created by': string
    'creation date': number
    'encoding': string
    'info': {
        'files'?: file[]
        'length': number
        'name': string
        'piece length': number
        'pieces': Uint8Array
    }
}

interface file {
    length: number
    path: string[]
}
