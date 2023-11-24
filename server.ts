import { parse, stringify } from "./app/lib/connection"
import { type ServerConnection } from "./app/types/connection"
import { ClientMessage, ServerMessage } from "./app/types/ws"

const GROUP_ID = "cursed"
const connections = new Map<string, ServerConnection>()

function parseMessage(raw: string | Buffer) {
  return parse<ClientMessage>(
    typeof raw === "string" ? raw : new TextDecoder().decode(raw),
  )
}

const server = Bun.serve<{ connectionId: string }>({
  port: process.env.SERVER_PORT || 3001,
  fetch(req, server) {
    const url = new URL(req.url)

    if (url.pathname === "/chat") {
      const name = url.searchParams.get("name")
      const connectionId = Math.random().toString(36).slice(2)

      // Save the connection for later users
      connections.set(connectionId, {
        id: connectionId,
        coords: { x: 0, y: 0 },
        user: {
          id: connectionId,
          name: name || "Anonymous",
        },
      })

      // Upgrade the request to a WebSocket connection. This happens after we
      // save the connection so that `open()` can find the connection.
      const success = server.upgrade(req, { data: { connectionId } })
      return success
        ? undefined
        : new Response("WebSocket upgrade error", { status: 400 })
    }

    return new Response("Hello world")
  },
  websocket: {
    open(ws) {
      // If the connection isn't found, something went wrong so let's just bail
      const connection = connections.get(ws.data.connectionId)
      if (!connection) return

      // Subscribe the new user to the group
      ws.subscribe(GROUP_ID)

      // Notify other connections of the new connection
      ws.publish(GROUP_ID, stringify({ type: "connect", connection }))

      // Send the list of connected users to the new user
      if (!connections.size) return
      setTimeout(() => {
        ws.send(
          stringify<ServerMessage>({
            type: "init",
            connections: [...connections.values()].filter(
              (connection) => connection.id !== ws.data.connectionId,
            ),
          }),
        )
      }, 100)
    },
    message(ws, raw) {
      const message = parseMessage(raw)

      switch (message.type) {
        case "move": {
          // Ignore connections we don't recognize
          const connection = connections.get(ws.data.connectionId)
          if (!connection) return

          // Update the saved coordinates for this connection
          connections.set(ws.data.connectionId, {
            ...connection,
            coords: message.coords,
          })

          // Send the updated coordinates to all other connections
          ws.publish(
            GROUP_ID,
            stringify<ServerMessage>({
              type: "move",
              connectionId: ws.data.connectionId,
              coords: message.coords,
            }),
          )
        }
      }
    },
    close(ws) {
      // Remove the connection from the list of connections
      connections.delete(ws.data.connectionId)

      // Unsubscribe the connection from the group
      ws.unsubscribe(GROUP_ID)

      // Notify other connections that this connection was closed
      server.publish(
        GROUP_ID,
        stringify<ServerMessage>({
          type: "disconnect",
          connectionId: ws.data.connectionId,
        }),
      )
    },
  },
})
