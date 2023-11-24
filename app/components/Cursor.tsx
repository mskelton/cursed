import clsx from "clsx"
import hashbow from "hashbow"
import { forwardRef } from "react"
import { ClientConnection } from "../types"
import { Arrow } from "./Arrow"

export interface CursorProps {
  connection: ClientConnection
}

export const Cursor = forwardRef<HTMLDivElement, CursorProps>(function Cursor(
  { connection },
  ref,
) {
  const color = hashbow(connection.user.name, 100, 30)

  return (
    <div
      ref={ref}
      className={clsx(
        "fixed flex gap-1 rounded text-xs",
        // If we don't have any initial coordinates for the user, hide this
        // cursor. This happens when a new client first connects.
        connection.coords.x ? "visible" : "invisible",
      )}
      style={{
        left: `${connection.coords.x}%`,
        top: `${connection.coords.y}%`,
      }}
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
