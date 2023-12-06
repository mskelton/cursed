import { ServerConnection } from "./connection"

export interface Coords {
  /** The x-position of the cursor */
  x: number
  /** The y-position of the cursor */
  y: number
}

export type ServerMessage =
  | { connections: ServerConnection[]; type: "init" }
  | { connection: ServerConnection; type: "connect" }
  | { connectionId: string; type: "disconnect" }
  | {
      connectionId: string
      coords: Coords
      type: "move"
    }

export type ClientMessage = {
  coords: Coords
  type: "move"
}
