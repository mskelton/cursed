import { User } from "./user"

export interface ServerConnection {
  /** The coordinates for this user */
  coords: { x: number; y: number }
  /** The unique id of the connection */
  id: string
  /** The user associated to this connection */
  user: User
}

export interface ClientConnection extends ServerConnection {
  /**
   * The ref to the cursor element. This allows updating the position without
   * re-rendering the React tree.
   */
  ref: React.RefObject<HTMLDivElement>
}
