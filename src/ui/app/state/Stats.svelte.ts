import { writable, type Writable } from 'svelte/store'

export interface IStats {
  lastBlockUpdateTime: number
  blockMeshesCount: number
}

export const stats: {
  [key in keyof IStats]: Writable<IStats[key]>
} = {
  lastBlockUpdateTime: writable(0),
  blockMeshesCount: writable(0),
}
