export interface IAnim {
  /** Number of the base tile to animate */
  base: number

  /** Duration expressed in a number of game ticks during which
   * a single frame is displayed */
  frameRate: number

  /** Number of times that the animation is played. 0 = infinite */
  repeat: number

  /** Number of tiles in the animation */
  length: number

  /** Tiles making up the animation */
  tiles: number[]
}
