import { Palette } from './Palette'

let pal: undefined | Palette = undefined
const cvs = new OffscreenCanvas(64, 64)
const ctx = cvs.getContext('2d')!
ctx.imageSmoothingEnabled = false

const pageQueue: { pageId: number; page: Uint8Array }[] = []

self.onmessage = async (e: MessageEvent) => {
  switch (e.data.kind) {
    case 'pal':
      pal = new Palette(e.data.palb, e.data.palx, e.data.ppal)
      break
    case 'page':
      pageQueue.push({ page: e.data.page, pageId: e.data.pageId })
      break
  }
}

const loadPage = async (req: { pageId: number; page: Uint8Array }) => {
  let tileId = 16 * req.pageId
  let tiles: Map<number, ImageData> = new Map()

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const imgData = new ImageData(64, 64)
      const ppalId = pal!.ppalForTile(tileId)

      const tileOffset = y * 256 * 64 + x * 64
      for (let line = 0; line < 64; line++) {
        const lineOffset = tileOffset + line * 256
        for (let i = 0; i < 64; i++) {
          const x = req.page.subarray(lineOffset)[i]
          const color = pal!.colorForPpal(ppalId, x)
          imgData.data.set(color.rgba, line * 64 * 4 + i * 4)
        }
      }

      tiles.set(tileId, imgData)

      tileId++
    }
  }

  self.postMessage({ kind: 'result', tiles })
}

const main = async () => {
  if (pageQueue.length > 0) {
    const req = pageQueue.shift()
    if (req && pal) {
      await loadPage(req)
    }
  }

  setTimeout(main, 0)
}

main()
