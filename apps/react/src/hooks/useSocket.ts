import { useCallback, useEffect, useState } from "react"
import { useUser } from "../providers"

interface Subscriber<
  T extends keyof WebSocketEventMap = keyof WebSocketEventMap,
> {
  (type: T, socket: WebSocket, e: WebSocketEventMap[T]): void
}

const sockets = new Map<string, WebSocket>()
const queues = new Map<string, string[]>()
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

    sockets.set(url, socket)
  }

  connect()
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
  const url = `ws://${location.hostname}:8081/chat?name=${name}`

  useEffect(() => {
    function drainQueue(socket: WebSocket) {
      queues.get(url)?.forEach((message) => socket.send(message))
      queues.set(url, [])
    }

    return subscribe(url, (type, socket) => {
      switch (type) {
        case "open":
          drainQueue(socket)
          setSocket(socket)
          break

        case "close":
          setSocket(null)
          break
      }
    })
  }, [url])

  const send = useCallback(
    (message: string) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(message)
      } else {
        queues.get(url)?.push(message)
      }
    },
    [socket, url],
  )

  return { socket, send }
}
