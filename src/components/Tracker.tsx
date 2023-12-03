import { useEffect } from "react"
import { useSocket } from "../hooks"
import { stringify } from "../lib"

export function Tracker({ isActive }: { isActive: boolean }) {
  const { socket } = useSocket()

  useEffect(() => {
    function handleMove(event: MouseEvent | TouchEvent) {
      const source = "touches" in event ? event.touches[0] : event

      socket?.send(
        stringify({
          coords: {
            x: (source.clientX / window.innerWidth) * 100,
            y: (source.clientY / window.innerHeight) * 100,
          },
          type: "move",
        }),
      )
    }

    if (isActive) {
      window.addEventListener("mousemove", handleMove)
      window.addEventListener("touchmove", handleMove)
    }

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("touchmove", handleMove)
    }
  }, [isActive, socket])

  return null
}
