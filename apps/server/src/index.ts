import {
  type ClientMessage,
  parse,
  type ServerConnection,
  type ServerMessage,
  stringify,
} from "@cursed/utils"

const GROUP_ID = "cursed"
const connections = new Map<string, ServerConnection>()

function parseMessage(raw: string | Buffer) {
  return parse<ClientMessage>(
    typeof raw === "string" ? raw : new TextDecoder().decode(raw),
  )
}

const server = Bun.serve<{ connectionId: string }>({
  port: 8081,
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
      // If the user isn't found, something went wrong so let's just bail
      const connection = connections.get(ws.data.connectionId)
      if (!connection) return

      // Subscribe the new user to the group
      ws.subscribe(GROUP_ID)

      // Notify other users of the new user
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
          // Ignore users we don't recognize
          const connection = connections.get(ws.data.connectionId)
          if (!connection) return

          // Update the saved coordinates for this user
          connections.set(ws.data.connectionId, {
            ...connection,
            coords: message.coords,
          })

          // Send the updated coordinates to all other users
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
      // Remove the user from the list of users
      connections.delete(ws.data.connectionId)

      // Unsubscribe the user from the group
      ws.unsubscribe(GROUP_ID)

      // Notify other users that this user was closed
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
