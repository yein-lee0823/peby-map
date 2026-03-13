import type { Metadata } from 'next'
import '../styles/globals.css'
import localFont from 'next/font/local'

const pretendard = localFont({
  src: [
    {
      path: '../assets/fonts/PretendardVariable.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'peby-map',
  description: '페비앱 지도 서비스',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
