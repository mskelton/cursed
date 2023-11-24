import "./globals.css"
import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import { Provider } from "./providers"

const rubik = Rubik({ subsets: ["latin"] })

export const metadata: Metadata = {
  description: "Multi-player live cursors",
  title: "Cursed",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark dark:bg-gray-950" lang="en">
      <body className={rubik.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
