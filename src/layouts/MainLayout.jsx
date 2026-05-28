import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-neutral-100 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          © 2026 CarDekho Advisor · Helping you find your perfect car
        </div>
      </footer>
    </div>
  )
}
