import "./globals.css"
import { Cursors } from "./components/Cursors"
import { GitHubIcon, PauseIcon, PlayIcon } from "./components/icons"
import { Tracker } from "./components/Tracker"
import { Provider } from "./providers"
import { useEffect, useState } from "react"

export function App() {
  const [isActive, setIsActive] = useState(true)
  const Icon = isActive ? PauseIcon : PlayIcon

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === " " && e.target === document.body) {
        setIsActive((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isActive])

  return (
    <Provider>
      <div>
        <Cursors />
        <Tracker isActive={isActive} />

        <div className="flex min-h-[100svh] flex-col items-center justify-center p-12 text-center">
          <h1 className="mb-8 text-5xl font-bold">Cursed</h1>
          <p className="mb-4 text-xl text-gray-400">Multiplayer live cursors</p>

          <div className="isolate flex items-center justify-center gap-4 rounded-lg bg-gray-950 p-2">
            <button
              className="text-gray-200 transition-colors hover:text-indigo-500"
              onClickCapture={() => setIsActive(!isActive)}
            >
              <span className="sr-only">{isActive ? "Pause" : "Play"}</span>
              <Icon className="h-8 w-8" />
            </button>

            <a
              className="text-gray-200 transition-colors hover:text-indigo-500"
              href="https://github.com/mskelton/cursed"
            >
              <span className="sr-only">View source on GitHub</span>
              <GitHubIcon className="h-8 w-8" />
            </a>
          </div>
        </div>
      </div>
    </Provider>
  )
}
