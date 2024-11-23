import { Element, TextChunk } from 'htmlrewriter'

export class AttributeHandler {
    readonly selector: string
    protected targetAttribute: string
    constructor(selector: string, targetAttribute: string) {
        this.selector = selector
        this.targetAttribute = targetAttribute
    }

    Value: string[] = []
    element = (element: Element) => {
        const category = element.getAttribute(this.targetAttribute)
        if (category) {
            this.Value.push(category)
        }
    }
}

export class TextHandler {
    readonly selector: string
    constructor(selector: string) {
        this.selector = selector
    }

    Value: string[] = []
    protected textbuffer: string = ''
    text = (text: TextChunk) => {
        this.textbuffer += text.text
        if (text.lastInTextNode) {
            this.buffers = this.buffers.map((item) => item + this.textbuffer)
            this.textbuffer = ''
        }
    }

    protected buffers: string[] = []
    element = (element: Element) => {
        this.buffers.push('')
        element.onEndTag(() => {
            this.Value.push(this.buffers.pop() as string)
        })
    }
}
