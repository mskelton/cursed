import { ServerConnection } from "@cursed/utils"

export interface ClientConnection extends ServerConnection {
  /**
   * The ref to the cursor element. This allows updating the position without
   * re-rendering the React tree.
   */
  ref: React.RefObject<HTMLDivElement>
}
