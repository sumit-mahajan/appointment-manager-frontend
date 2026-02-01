import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ChatContainer } from '@/features/ai/components/ChatContainer'
import { useAuthStore } from '@/features/auth/store/auth.store'

interface MainLayoutProps {
  children: React.ReactNode
  showFooter?: boolean
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  const { isAuthenticated, hasClinic } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
      {isAuthenticated && hasClinic() && <ChatContainer />}
    </div>
  )
}
