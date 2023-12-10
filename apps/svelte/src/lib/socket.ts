import { ClientMessage, stringify } from "@cursed/utils"
import { faker } from "@faker-js/faker"

type Subscriber = (event: MessageEvent) => void

const subscribers: Set<Subscriber> = new Set()
let socket: WebSocket | null = null
let disconnected = false

const name = `${faker.person.firstName()} ${faker.person.lastName()}`
const url = `ws://${location.hostname}:8081/chat?name=${name}`

function connect() {
  socket = new WebSocket(url)

  socket.addEventListener("open", () => {
    if (disconnected) {
      console.log("Reconnected to server.")
      disconnected = false
    }
  })

  socket.addEventListener("message", (event) => {
    subscribers.forEach((callback) => callback(event))
  })

  socket.addEventListener("close", () => {
    console.error("Lost connection to server. Retrying in 1 second...")
    disconnected = true

    setTimeout(connect, 1000)
  })
}

connect()

export function send(message: ClientMessage) {
  if (socket?.readyState !== WebSocket.OPEN) return
  socket.send(stringify(message))
}

export function subscribe(callback: Subscriber) {
  subscribers.add(callback)
  return () => subscribers.delete(callback)
}
