<script lang="ts">
  import { parse, type ServerConnection } from "@cursed/utils"
  import Cursor from "./Cursor.svelte"
  import { onDestroy, onMount } from "svelte"
  import { socket } from "../socket"

  let cursors: ConnectionMap = {}

  type ConnectionMap = Record<string, ClientConnection>

  function makeClientConnection(
    connection: ServerConnection,
  ): ClientConnection {
    return {
      ...connection,
      // ref: createRef<HTMLDivElement>(),
    }
  }

  function handleMessage(e: MessageEvent) {
    const data = parse(e.data)

    switch (data.type) {
      case "init":
        cursors = data.connections.reduce<ConnectionMap>((acc, connection) => {
          acc[connection.id] = {
            ...connection,
            // ref: createRef<HTMLDivElement>(),
          }

          return acc
        }, {})
        break

      case "connect":
        if (!cursors[data.connection.id]) {
          cursors[data.connection.id] = makeClientConnection(data.connection)
        }
        break

      case "disconnect":
        delete cursors[data.connectionId]
        break

      case "move": {
        const cursor = cursors[data.connectionId]

        if (cursor && cursor.ref.current) {
          cursor.ref.current.style.visibility = "visible"
          cursor.ref.current.style.setProperty("--x", `${data.coords.x}vw`)
          cursor.ref.current.style.setProperty("--y", `${data.coords.y}vh`)
        }
      }
    }
  }

  onMount(() => {
    socket?.addEventListener("message", handleMessage)
  })

  onDestroy(() => {
    socket?.removeEventListener("message", handleMessage)
  })
</script>

{#each Object.values(cursors) as connection}
  <Cursor ref={connection.ref} {connection} />
{/each}
