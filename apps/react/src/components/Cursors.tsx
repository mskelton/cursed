import { createRef, useEffect, useState } from "react"
import { parse, ServerConnection, stringify } from "@cursed/utils"
import { useSocket } from "../hooks"
import { ClientConnection } from "../types"
import { Cursor } from "./Cursor"

type ConnectionMap = Record<string, ClientConnection>

function makeClientConnection(connection: ServerConnection): ClientConnection {
  return {
    ...connection,
    ref: createRef<HTMLDivElement>(),
  }
}

export function Cursors() {
  const { send, socket } = useSocket()
  const [cursors, setCursors] = useState<ConnectionMap>({})

  useEffect(() => {
    // Fire off the info message to get the current connections when we
    // initialize the component.
    send(stringify({ type: "info" }))
  }, [send])

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const data = parse(e.data)

      switch (data.type) {
        case "info":
          setCursors(
            data.connections.reduce<ConnectionMap>((acc, connection) => {
              acc[connection.id] = makeClientConnection(connection)
              return acc
            }, {}),
          )
          break

        case "connect":
          if (!cursors[data.connection.id]) {
            setCursors((prev) => ({
              ...prev,
              [data.connection.id]: makeClientConnection(data.connection),
            }))
          }
          break

        case "disconnect":
          setCursors((prev) => {
            const { [data.connectionId]: _, ...next } = prev
            return next
          })
          break

        case "move": {
          const cursor = cursors[data.connectionId]
          const { x, y } = data.coords

          if (cursor && cursor.ref.current) {
            cursor.ref.current.style.visibility = "visible"
            cursor.ref.current.style.setProperty("--x", `${x}vw`)
            cursor.ref.current.style.setProperty("--y", `${y}vh`)
          }
        }
      }
    }

    socket?.addEventListener("message", handleMessage)

    return () => {
      socket?.removeEventListener("message", handleMessage)
    }
  }, [cursors, send, socket])

  return (
    <>
      {Object.values(cursors).map((connection) => (
        <Cursor
          key={connection.id}
          ref={connection.ref}
          connection={connection}
        />
      ))}
    </>
  )
}
