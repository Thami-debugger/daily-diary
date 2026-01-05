import { AuthProvider } from './contexts/AuthContext';

export const metadata = {
  title: 'Daily Diary',
  description: 'Your daily planning journal',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
      <body style={{ 
        width: '100%', 
        height: '100%', 
        margin: 0, 
        padding: 0, 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'auto'
      }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
