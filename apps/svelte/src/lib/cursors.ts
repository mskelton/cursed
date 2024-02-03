import { writable } from "svelte/store"
import { subscribe } from "./socket"
import { type ServerConnection, parse } from "@cursed/utils"

type ConnectionMap = Record<string, ServerConnection>

export const cursors = writable<ConnectionMap>({})

subscribe((event) => {
  const data = parse(event.data)

  switch (data.type) {
    case "info":
      cursors.set(
        data.connections.reduce<ConnectionMap>(
          (acc, cur) => ({ ...acc, [cur.id]: cur }),
          {},
        ),
      )
      break

    case "connect":
      cursors.update((cursors) => ({
        ...cursors,
        [data.connection.id]: data.connection,
      }))
      break

    case "disconnect":
      cursors.update((cursors) => {
        delete cursors[data.connectionId]
        return cursors
      })
      break

    case "move": {
      cursors.update((cursors) => {
        const connection = cursors[data.connectionId]
        if (!connection) return cursors

        return {
          ...cursors,
          [data.connectionId]: { ...connection, coords: data.coords },
        }
      })
      break
    }
  }
})
