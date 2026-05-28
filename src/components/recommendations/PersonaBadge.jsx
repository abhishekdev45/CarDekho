const PERSONA_ICONS = {
  'Practical City Commuter': '🏙️',
  'Family Comfort Buyer': '👨‍👩‍👧',
  'Premium Aspirer': '✨',
  'Enthusiast Driver': '🏎️',
  'Stress-Free Owner': '😌',
}

export default function PersonaBadge({ persona }) {
  const icon = PERSONA_ICONS[persona.title] || '🚗'

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-3xl flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-0.5">
            Your Buyer Profile
          </p>
          <h2 className="text-xl font-bold text-neutral-900">{persona.title}</h2>
        </div>
      </div>
      <p className="text-neutral-600 text-sm leading-relaxed mb-4">{persona.description}</p>
      <div className="flex flex-wrap gap-2">
        {persona.topPriorities.map(priority => (
          <span
            key={priority}
            className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100"
          >
            {priority}
          </span>
        ))}
      </div>
    </div>
  )
}
