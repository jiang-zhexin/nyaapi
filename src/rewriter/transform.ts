import { HTMLRewriter } from 'htmlrewriter'

export async function transform(rewriter: HTMLRewriter, resp: Response) {
    await resp.body?.pipeTo(
        new WritableStream({
            write: async (chunk) => {
                await rewriter.write(chunk)
            },
        }),
    )
    return rewriter.end()
}
