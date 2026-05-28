export default function PriorityChips({ options, selected, onChange, minSelect }) {
  const toggle = (value) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange(next)
  }

  const remaining = minSelect - selected.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {options.map(({ value, label, emoji }) => {
          const active = selected.includes(value)
          return (
            <button
              key={value}
              onClick={() => toggle(value)}
              className={[
                'flex items-center gap-1.5 px-3.5 py-2 rounded-full',
                'text-sm font-medium transition-colors duration-150 cursor-pointer',
                active
                  ? 'bg-primary-50 border-2 border-primary-600 text-primary-700'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300',
              ].join(' ')}
            >
              <span>{emoji}</span>
              {label}
            </button>
          )
        })}
      </div>

      <p className={[
        'text-xs text-center transition-colors',
        selected.length >= minSelect ? 'text-primary-600' : 'text-neutral-400',
      ].join(' ')}>
        {selected.length === 0
          ? `Pick at least ${minSelect}`
          : remaining > 0
          ? `${remaining} more to continue`
          : `${selected.length} selected ✓`}
      </p>
    </div>
  )
}
