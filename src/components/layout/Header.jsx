import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary-600">Car</span>
            <span className="text-2xl font-bold text-neutral-800">Dekho</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/advisor"
              className="text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
            >
              Find My Car
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
