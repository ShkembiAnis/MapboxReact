
"user client"
import './globals.css'
import AuthWrapper from "@/components/auth/AuthWrapper";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body><AuthWrapper user={undefined} signOut={undefined} > {/* 👈 Context provider */}{children}</AuthWrapper></body>
    </html>
  )
}
