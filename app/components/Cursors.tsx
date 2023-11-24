"use client"

import { createRef, useEffect, useRef } from "react"
import { useMap } from "usehooks-ts"
import { useSocket } from "../hooks"
import { parse } from "../lib"
import { ClientConnection, ServerConnection } from "../types"
import { Cursor } from "./Cursor"

function makeClientConnection(connection: ServerConnection): ClientConnection {
  return {
    ...connection,
    ref: createRef<HTMLDivElement>(),
  }
}

export function Cursors() {
  const { socket } = useSocket()
  const [cursors, actions] = useMap<string, ClientConnection>()
  const cursorsRef = useRef(cursors)
  cursorsRef.current = cursors

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const data = parse(e.data)

      switch (data.type) {
        case "init":
          actions.setAll(
            data.connections.reduce((acc, connection) => {
              acc.set(connection.id, {
                ...connection,
                ref: createRef<HTMLDivElement>(),
              })

              return acc
            }, new Map<string, ClientConnection>()),
          )
          break

        case "connect":
          if (cursorsRef.current.has(data.connection.id)) return
          actions.set(data.connection.id, makeClientConnection(data.connection))
          break

        case "disconnect":
          actions.remove(data.connectionId)
          break

        case "move": {
          const cursor = cursorsRef.current.get(data.connectionId)

          if (cursor && cursor.ref.current) {
            cursor.ref.current.style.visibility = "visible"
            cursor.ref.current.style.top = `${data.coords.y}%`
            cursor.ref.current.style.left = `${data.coords.x}%`
          }
        }
      }
    }

    socket?.addEventListener("message", handleMessage)

    return () => {
      socket?.removeEventListener("message", handleMessage)
    }
  }, [socket, actions])

  return (
    <>
      {[...cursors.keys()].map((key) => {
        const item = cursors.get(key)

        return item ? (
          <Cursor key={key} ref={item.ref} connection={item} />
        ) : null
      })}
    </>
  )
}
