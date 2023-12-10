<script lang="ts">
  import Cursor from "./Cursor.svelte"
  import { cursors } from "../lib/cursors"
</script>

{#each Object.values($cursors) as connection}
  <Cursor {connection} />
{/each}
