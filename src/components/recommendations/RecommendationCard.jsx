import { useState } from 'react'

function CarImage({ src, name }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div className="w-full h-44 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center rounded-t-2xl">
        <span className="text-5xl">🚗</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-full h-44 object-cover rounded-t-2xl"
      onError={() => setFailed(true)}
    />
  )
}

export default function RecommendationCard({ recommendation, rank }) {
  const { car, matchPercent, whyItFits, strengths, tradeoffs } = recommendation
  const isBestMatch = rank === 0

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden ${isBestMatch ? 'border-primary-400 shadow-md' : 'border-neutral-200'}`}>
      <div className="relative">
        <CarImage src={car.imageUrl} name={car.name} />
        {isBestMatch && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            Best Match
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary-700 text-sm font-bold px-3 py-1 rounded-full border border-primary-200">
          {matchPercent}% match
        </div>
      </div>

      <div className="p-5">
        <div className="mb-1">
          <span className="text-xs text-neutral-500 font-medium">{car.brand} · {car.bodyType}</span>
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-1">{car.name}</h3>
        <p className="text-sm font-semibold text-primary-600 mb-3">{car.priceRange}</p>

        <div className="bg-primary-50 rounded-xl p-3 mb-4">
          <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">Why this fits you</p>
          <p className="text-sm text-neutral-700 leading-relaxed">{whyItFits}</p>
        </div>

        {strengths.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Key strengths</p>
            <ul className="space-y-1.5">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tradeoffs.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Worth noting</p>
            <ul className="space-y-1.5">
              {tradeoffs.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-500">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">◦</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
