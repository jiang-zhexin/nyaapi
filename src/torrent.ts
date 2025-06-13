import { BenDecoder } from '@zhexin/bencoder'
import { encodeBase64 } from '@std/encoding'

export async function torrent(torrent: Response): Promise<Torrent> {
    const torrentlike = BenDecoder<RawTorrent>(await torrent.bytes())
    return {
        announce_list: torrentlike['announce-list'].flat(),
        creation_date: torrentlike['creation date'],
        files: torrentlike.info.files?.map((f) => {
            return { length: f.length, path: f.path } as File
        }),
        length: torrentlike.info.length,
        name: torrentlike.info.name,
        piece_length: torrentlike.info['piece length'],
        pieces: encodeBase64(torrentlike.info.pieces),
    }
}

interface Torrent {
    announce_list: string[]
    creation_date: number
    files?: File[]
    length: number
    name: string
    piece_length: number
    pieces: string
}

interface File {
    length: number
    path: string[]
}

interface RawTorrent {
    'announce': string
    'announce-list': string[][]
    'comment': string
    'created by': string
    'creation date': number
    'encoding': string
    'info': {
        'files'?: RawFile[]
        'length': number
        'name': string
        'name.utf-8': string
        'piece length': number
        'pieces': Uint8Array
        'publisher'?: string
        'publisher.utf-8'?: string
        'publisher-url'?: string
        'publisher-url.utf-8'?: string
    }
}

interface RawFile {
    'length': number
    'path': string[]
    'path.utf-8'?: string
    'filehash'?: Uint8Array
    'ed2k'?: Uint8Array
}
