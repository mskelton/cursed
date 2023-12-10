<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { stringify } from "@cursed/utils"
  import { socket } from "../socket"

  export let isActive = false

  function handleMove(event: MouseEvent | TouchEvent) {
    if (!isActive) return

    const source = "touches" in event ? event.touches[0] : event
    if (!source) return

    socket?.send(
      stringify({
        type: "move",
        coords: {
          x: (source.clientX / window.innerWidth) * 100,
          y: (source.clientY / window.innerHeight) * 100,
        },
      }),
    )
  }

  onMount(() => {
    window.addEventListener("mousemove", handleMove)
    window.addEventListener("touchmove", handleMove)
  })

  onDestroy(() => {
    window.removeEventListener("mousemove", handleMove)
    window.removeEventListener("touchmove", handleMove)
  })
</script>
