<script lang="ts">
  import { send } from "../lib/socket"

  export let isActive: boolean

  function onMove(event: MouseEvent | TouchEvent) {
    if (!isActive) return

    const source = "touches" in event ? event.touches[0] : event
    if (!source) return

    send({
      type: "move",
      coords: {
        x: (source.clientX / window.innerWidth) * 100,
        y: (source.clientY / window.innerHeight) * 100,
      },
    })
  }
</script>

<svelte:window on:mousemove={onMove} on:touchmove={onMove} />
