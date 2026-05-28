import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../hooks/useOnboarding'
import { useRecommendations } from '../hooks/useRecommendations'
import PersonaBadge from '../components/recommendations/PersonaBadge'
import RecommendationCard from '../components/recommendations/RecommendationCard'
import ComparisonTable from '../components/recommendations/ComparisonTable'

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-36 bg-neutral-200 rounded-2xl" />
      <div className="h-5 bg-neutral-200 rounded w-40" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map(i => <div key={i} className="h-96 bg-neutral-200 rounded-2xl" />)}
      </div>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-16">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-lg font-bold text-neutral-800 mb-2">Something went wrong</h2>
      <p className="text-sm text-neutral-500 mb-6">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-full hover:bg-primary-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

export default function RecommendationsPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useOnboarding()
  const { answers } = state

  const answersComplete = answers.budget && answers.usage && answers.ownership &&
    Array.isArray(answers.priorities) && answers.priorities.length >= 3

  useEffect(() => {
    if (!answersComplete) navigate('/advisor', { replace: true })
  }, [answersComplete, navigate])

  const { data, loading, error } = useRecommendations(answers)

  if (!answersComplete) return null

  const handleStartOver = () => {
    dispatch({ type: 'RESET' })
    navigate('/advisor')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">
            Your personalised results
          </p>
          <h1 className="text-2xl font-bold text-neutral-900">Here are your top car matches</h1>
        </div>

        {loading && <LoadingSkeleton />}
        {error && <ErrorState message={error} onRetry={() => window.location.reload()} />}

        {data && (
          <>
            <PersonaBadge persona={data.persona} />

            <h2 className="text-base font-bold text-neutral-800 mb-4">Your top picks</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              {data.recommendations.map((rec, i) => (
                <RecommendationCard key={rec.car.id} recommendation={rec} rank={i} />
              ))}
            </div>

            <div className="mb-10">
              <ComparisonTable comparisonData={data.comparisonData} />
            </div>

            <div className="text-center py-4">
              <p className="text-sm text-neutral-500 mb-3">Want to explore different options?</p>
              <button
                type="button"
                onClick={handleStartOver}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors"
              >
                ← Start over with new answers
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
