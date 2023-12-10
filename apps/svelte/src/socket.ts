import { faker } from "@faker-js/faker"

export let socket: WebSocket | null = null

const name = `${faker.person.firstName()} ${faker.person.lastName()}`
const url = `ws://${location.hostname}:8081/chat?name=${name}`

let disconnected = false

function connect() {
  socket = new WebSocket(url)

  socket.addEventListener("open", () => {
    if (disconnected) {
      console.log("Reconnected to server.")
      disconnected = false
    }
  })

  socket.addEventListener("close", () => {
    console.error("Lost connection to server. Retrying in 1 second...")
    disconnected = true

    setTimeout(connect, 1000)
  })

  return socket
}

connect()
