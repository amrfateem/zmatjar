export const metadata = {
  title: '404',
  description: '404 Page',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
