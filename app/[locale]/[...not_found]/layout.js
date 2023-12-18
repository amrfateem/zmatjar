export const metadata = {
  title: '404',
  description: '404 Page',
}

export default function RootLayout({ children, params: { locale } }) {
 return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
