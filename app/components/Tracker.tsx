"use client"

import { useEffect, useState } from "react"
import { useSocket } from "../hooks"
import { stringify } from "../lib"

export function Tracker() {
  const [isActive, setIsActive] = useState(true)
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

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsActive(false)
      } else if (e.key === " ") {
        setIsActive((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    if (isActive) {
      window.addEventListener("mousemove", handleMove)
      window.addEventListener("touchmove", handleTouch)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("touchmove", handleTouch)
    }
  }, [isActive, socket])

  return null
}
