import { useEffect } from "react"
import { useSocket } from "../hooks"
import { stringify } from "../lib"

export function Tracker({ isActive }: { isActive: boolean }) {
  const { socket } = useSocket()

  useEffect(() => {
    function publish(e: MouseEvent | Touch) {
      socket?.send(
        stringify({
          coords: {
            x: (e.clientX / window.innerWidth) * 100,
            y: (e.clientY / window.innerHeight) * 100,
          },
          type: "move",
        }),
      )
    }

    const handleMove = (e: MouseEvent) => publish(e)
    const handleTouch = (e: TouchEvent) =>
      e.touches[0] ? publish(e.touches[0]) : null

    if (isActive) {
      window.addEventListener("mousemove", handleMove)
      window.addEventListener("touchmove", handleTouch)
    }

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("touchmove", handleTouch)
    }
  }, [isActive, socket])

  return null
}
