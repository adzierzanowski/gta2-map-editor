import { Chunk, type IBlockInfo, type IColumnInfo, BlockInfo } from '@lib/gbh'
import { p3dStr } from '@lib/geometry'

self.onmessage = (e: MessageEvent) => {
  if (e.data.kind === 'loadBlocks') {
    loadBlocks(e.data.chunk, e.data.buf)
  }
}

const loadBlocks = (chunk_: Chunk, buf: ArrayBufferLike) => {
  const chunk = new Chunk(chunk_, buf)

  const base = chunk.u32arr(256 * 256)
  const columnSize = chunk.u32()
  const columnEntries = chunk.u32arr(columnSize)
  const blockCount = chunk.u32()
  const blockInfo: IBlockInfo[] = []

  while (!chunk.eof) {
    const left = chunk.u16()
    const right = chunk.u16()
    const top = chunk.u16()
    const bottom = chunk.u16()
    const lid = chunk.u16()
    const arrows = chunk.u8()
    const slope = chunk.u8()
    blockInfo.push({ left, right, top, bottom, lid, arrows, slope })
  }

  const columns: { [columnId: number]: IColumnInfo } = {}

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const columnId = base[y * 256 + x]

      let column: IColumnInfo = columns[columnId]
      if (!column) {
        const columnData = columnEntries.subarray(columnId)

        const height = columnData[0] & 0xff
        const offset = (columnData[0] >> 8) & 0xff
        column = {
          height,
          offset,
          blockIds: columnData.subarray(1, 1 + height - offset),
        }
        columns[columnId] = column
      }

      for (let z = 0; z < 8; z++) {
        if (z < column.offset || z >= column.height) {
        } else {
          const blockId = column.blockIds[z - column.offset]
          const block = new BlockInfo(blockInfo[blockId])
          self.postMessage({
            kind: 'block',
            block,
            pos: p3dStr({ x, y, z }),
          })
        }
      }
    }
    self.postMessage({ kind: 'progress', progress: y / 256 })
  }

  self.postMessage({ kind: 'done' })
}
