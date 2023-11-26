import { ClientMessage, ServerMessage } from "../types"

export function stringify<
  T extends ServerMessage | ClientMessage = ClientMessage,
>(data: T) {
  return JSON.stringify(data)
}

export function parse<T extends ServerMessage | ClientMessage = ServerMessage>(
  data: string,
): T {
  return JSON.parse(data)
}
