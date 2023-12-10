import { User } from "./user"

export interface ServerConnection {
  /** The coordinates for this user */
  coords: { x: number; y: number }
  /** The unique id of the connection */
  id: string
  /** The user associated to this connection */
  user: User
}
