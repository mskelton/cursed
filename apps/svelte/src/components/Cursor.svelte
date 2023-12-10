<script lang="ts">
  import clsx from "clsx"
  import ColorHash from "color-hash"
  import { type ServerConnection } from "@cursed/utils"
  import Arrow from "./icons/Arrow.svelte"

  export let connection: ServerConnection

  const hash = new ColorHash({ lightness: 0.3 })
  const color = hash.hex(connection.user.name)
</script>

<div
  class={clsx(
    "fixed flex translate-x-[--x] translate-y-[--y] gap-1 rounded text-xs",
    connection.coords.x ? "visible" : "invisible",
  )}
  style={`--x: ${connection.coords.x}vw; --y: ${connection.coords.y}vh`}
>
  <Arrow {color} />

  <span
    class="relative -left-1.5 top-4 rounded-sm px-1.5 py-0.5 text-white"
    style={`background-color: ${color}`}
  >
    {connection.user.name}
  </span>
</div>
