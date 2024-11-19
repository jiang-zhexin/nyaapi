import { TreeNode } from './rewriter/tree.ts'

export interface NyaaTorrent {
    id: number
    title: string
    category: string
    torrent: string
    magnet: string
    size: string
    date: number
    seeders: number
    leechers: number
    completed: number
}

export interface NyaaItem extends NyaaTorrent {
    submitter: string
    hash: string
    information: string
    include: FileList[]
}

export function ClearMagnet(magnet: string) {
    return `magnet:?xt=${ParseMagnet(magnet)?.xt}`
}

export function ParseMagnet(magnet: string) {
    const { searchParams } = new URL(magnet)
    return {
        raw: magnet,
        xt: searchParams.get('xt'),
        dn: searchParams.get('amp;dn'),
        tr: searchParams.getAll('amp;tr'),
    }
}

export type FileList = file | dir

interface file {
    type: 'file'
    name: string
    size: string
}

interface dir {
    type: 'dir'
    name: string
    include: FileList[]
}

export function ExportTreeNode(td: TreeNode<string>): FileList[] {
    function exportTreeNode(td: TreeNode<string>): FileList {
        if (td.children.length === 0) {
            const left = td.data.lastIndexOf('(')
            const right = td.data.lastIndexOf(')')
            return {
                type: 'file',
                name: td.data.slice(0, left),
                size: td.data.slice(left + 1, right),
            }
        }
        return {
            type: 'dir',
            name: td.data,
            include: td.children.map((td) => exportTreeNode(td)),
        }
    }
    return td.children.map((td) => exportTreeNode(td))
}
