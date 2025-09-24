import { TileInfo } from '@lib/gbh'

const cvs = new OffscreenCanvas(64, 64)
const ctx = cvs.getContext('2d')!
ctx.imageSmoothingEnabled = false
const tileQueue: { eid: number; img: ImageData }[] = []

const renderTile = async (req: { eid: number; img: ImageData }) => {
  const info = new TileInfo(req.eid)

  let bmp = await createImageBitmap(req.img)

  ctx.clearRect(0, 0, 64, 64)
  if (info.flip) {
    ctx.translate(64, 0)
    ctx.scale(-1, 1)
  }
  ctx.translate(32, 32)
  ctx.rotate(info.radians)
  ctx.drawImage(bmp, -32, -32)
  ctx.rotate(-info.radians)
  ctx.translate(-32, -32)
  if (info.flip) {
    ctx.translate(64, 0)
    ctx.scale(-1, 1)
  }

  return ctx.getImageData(0, 0, 64, 64)
}

self.onmessage = async e => {
  switch (e.data.kind) {
    case 'render':
      tileQueue.push(e.data)
      await main()
  }
}

const main = async () => {
  const req = tileQueue.shift()
  if (req) {
    const res = await renderTile(req)
    self.postMessage({ kind: 'result', img: res, eid: req.eid })
  }
}
