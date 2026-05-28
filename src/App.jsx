import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import RecommendationsPage from './pages/RecommendationsPage'
import ComparePage from './pages/ComparePage'
import { OnboardingProvider } from './context/OnboardingContext'

export default function App() {
  return (
    <OnboardingProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/advisor" element={<OnboardingPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Route>
      </Routes>
    </OnboardingProvider>
  )
}
