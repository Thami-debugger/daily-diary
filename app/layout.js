export const metadata = {
  title: 'Daily Diary',
  description: 'Your daily planning journal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
