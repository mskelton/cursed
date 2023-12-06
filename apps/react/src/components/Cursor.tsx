import clsx from "clsx"
import ColorHash from "color-hash"
import { forwardRef } from "react"
import { ClientConnection } from "../types"
import { Arrow } from "./Arrow"

const hash = new ColorHash({ lightness: 0.3 })

export interface CursorProps {
  connection: ClientConnection
}

export const Cursor = forwardRef<HTMLDivElement, CursorProps>(function Cursor(
  { connection },
  ref,
) {
  const color = hash.hex(connection.user.name)

  return (
    <div
      ref={ref}
      className={clsx(
        "fixed flex translate-x-[--x] translate-y-[--y] gap-1 rounded text-xs",
        // If we don't have any initial coordinates for the user, hide this
        // cursor. This happens when a new client first connects.
        connection.coords.x ? "visible" : "invisible",
      )}
      style={
        {
          "--x": `${connection.coords.x}vw`,
          "--y": `${connection.coords.y}vh`,
        } as React.CSSProperties
      }
    >
      <Arrow color={color} />

      <span
        className="relative -left-1.5 top-4 rounded-sm px-1.5 py-0.5 text-white"
        style={{ backgroundColor: color }}
      >
        {connection.user.name}
      </span>
    </div>
  )
})
