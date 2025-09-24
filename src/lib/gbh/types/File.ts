export interface IFileHeader {
  name: string
  version: number
}

export interface IChunkHeader {
  name: string
  offset: number
  size: number
}
