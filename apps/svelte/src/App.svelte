<script lang="ts">
  import Cursors from "./components/Cursors.svelte"
  import Tracker from "./components/Tracker.svelte"
  import PlayIcon from "./components/icons/PlayIcon.svelte"
  import PauseIcon from "./components/icons/PauseIcon.svelte"
  import GitHubIcon from "./components/icons/GitHubIcon.svelte"

  let isActive = true

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === " " && e.target === document.body) {
      isActive = !isActive
    }
  }
</script>

<div>
  <Cursors />
  <Tracker {isActive} />

  <div
    class="flex min-h-[100svh] flex-col items-center justify-center p-12 text-center"
  >
    <h1 class="mb-8 text-5xl font-bold">Cursed</h1>
    <p class="mb-4 text-xl text-gray-400">Multiplayer live cursors</p>

    <div
      class="isolate flex items-center justify-center gap-4 rounded-lg bg-gray-950 p-2"
    >
      <button
        class="text-gray-200 transition-colors hover:text-indigo-500"
        type="button"
        on:click={() => (isActive = !isActive)}
      >
        <span class="sr-only">{isActive ? "Pause" : "Play"}</span>
        <svelte:component
          this={isActive ? PauseIcon : PlayIcon}
          class="h-8 w-8"
        />
      </button>

      <a
        class="text-gray-200 transition-colors hover:text-indigo-500"
        href="https://github.com/mskelton/cursed"
      >
        <span class="sr-only">View source on GitHub</span>
        <GitHubIcon class="h-8 w-8" />
      </a>
    </div>
  </div>
</div>

<svelte:window on:keydown|preventDefault={onKeyDown} />
