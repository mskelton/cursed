import { createRef, useEffect, useRef, useState } from "react"
import { useSocket } from "../hooks"
import { parse } from "../lib"
import { ClientConnection, ServerConnection } from "../types"
import { Cursor } from "./Cursor"

type ConnectionMap = Record<string, ClientConnection>

function makeClientConnection(connection: ServerConnection): ClientConnection {
  return {
    ...connection,
    ref: createRef<HTMLDivElement>(),
  }
}

export function Cursors() {
  const { socket } = useSocket()
  const [cursors, setCursors] = useState<ConnectionMap>({})
  const cursorsRef = useRef(cursors)
  cursorsRef.current = cursors

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const data = parse(e.data)

      switch (data.type) {
        case "init":
          setCursors(
            data.connections.reduce<ConnectionMap>((acc, connection) => {
              acc[connection.id] = {
                ...connection,
                ref: createRef<HTMLDivElement>(),
              }

              return acc
            }, {}),
          )
          break

        case "connect":
          if (!cursorsRef.current[data.connection.id]) {
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
          const cursor = cursorsRef.current[data.connectionId]

          if (cursor && cursor.ref.current) {
            cursor.ref.current.style.visibility = "visible"
            cursor.ref.current.style.setProperty("--x", `${data.coords.x}vw`)
            cursor.ref.current.style.setProperty("--y", `${data.coords.y}vh`)
          }
        }
      }
    }

    socket?.addEventListener("message", handleMessage)

    return () => {
      socket?.removeEventListener("message", handleMessage)
    }
  }, [socket])

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
