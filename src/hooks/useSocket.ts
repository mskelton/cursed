import { useEffect, useState } from "react"
import { useUser } from "../providers"

interface Subscriber<
  T extends keyof WebSocketEventMap = keyof WebSocketEventMap,
> {
  (type: T, socket: WebSocket, e: WebSocketEventMap[T]): void
}

const sockets = new Map<string, WebSocket>()
const subscribers = new Map<string, Set<Subscriber>>()

function join(url: string) {
  if (sockets.has(url)) {
    return sockets.get(url)!
  }

  let disconnected = false
  function connect() {
    const socket = new WebSocket(url)

    socket.addEventListener("open", (e) => {
      if (disconnected) {
        console.log("Reconnected to server.")
        disconnected = false
      }

      subscribers.get(url)?.forEach((fn) => fn("open", socket, e))
    })

    socket.addEventListener("close", (e) => {
      console.error("Lost connection to server. Retrying in 1 second...")
      disconnected = true

      sockets.delete(url)
      subscribers.get(url)?.forEach((fn) => fn("close", socket, e))

      setTimeout(connect, 1000)
    })

    return socket
  }

  const socket = connect()
  sockets.set(url, socket)
  return socket
}

function subscribe(url: string, fn: Subscriber) {
  join(url)

  if (!subscribers.has(url)) {
    subscribers.set(url, new Set())
  }

  subscribers.get(url)?.add(fn)
  return () => {
    subscribers.get(url)?.delete(fn)
  }
}

export function useSocket() {
  const { name } = useUser()
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const url = `ws://${location.hostname}:3001/chat?name=${name}`

    return subscribe(url, (type, socket) => {
      switch (type) {
        case "open":
          setSocket(socket)
          break

        case "close":
          setSocket(null)
          break
      }
    })
  }, [name])

  return { socket }
}
