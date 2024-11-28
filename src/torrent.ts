import { BenDecoder } from '@zhexin/bencoder'

export async function torrent(torrent: Response): Promise<Torrent> {
    const torrentlike = BenDecoder<RawTorrent>(await torrent.bytes())
    const result = {
        announce_list: torrentlike['announce-list'].flat(),
        creation_date: torrentlike['creation date'],
        files: torrentlike.info.files?.map((f) => {
            return { length: f.length, path: f.path } as file
        }),
        length: torrentlike.info.length,
        name: torrentlike.info.name,
        piece_length: torrentlike.info['piece length'],
        pieces: btoa(String.fromCharCode(...torrentlike.info.pieces)),
    }
    result.files ?? delete result.files
    return result
}

interface Torrent {
    announce_list: string[]
    creation_date: number
    files?: file[]
    length: number
    name: string
    piece_length: number
    pieces: string
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
