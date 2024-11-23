import { Element, TextChunk } from 'htmlrewriter'

export class TreeHandler {
    readonly selector: string
    constructor(selector: string) {
        this.selector = selector
    }

    protected textbuffer: string = ''
    text = (text: TextChunk) => {
        this.textbuffer += text.text.trim()
    }

    TreeNode: TreeNode<string> = newTreeNode('root')
    element = (element: Element) => {
        const prNode = this.TreeNode
        const treeNode = newTreeNode('')
        prNode.children.push(treeNode)
        this.TreeNode = treeNode

        if (this.textbuffer !== '') {
            prNode.data += this.textbuffer
            this.textbuffer = ''
        }

        element.onEndTag(() => {
            this.TreeNode = prNode
            treeNode.data += this.textbuffer
            this.textbuffer = ''
        })
    }
}

function newTreeNode<V>(zeroValue: V): TreeNode<V> {
    return {
        data: zeroValue,
        children: [],
    }
}

export interface TreeNode<V> {
    data: V
    children: TreeNode<V>[]
}
