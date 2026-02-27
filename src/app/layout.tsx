import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { PostHogProvider } from "@/components/providers/posthog-provider"
import { Auth0Provider } from '@auth0/nextjs-auth0'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProcureSci - Modern SaaS Platform",
  description: "Streamline your workflow with ProcureSci",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PostHogProvider>
          <Auth0Provider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </Auth0Provider>
        </PostHogProvider>
      </body>
    </html>
  )
} 