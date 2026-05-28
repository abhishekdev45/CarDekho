function ScoreBar({ score, highlight }) {
  const pct = Math.min(Math.round((score / 10) * 100), 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${highlight ? 'bg-primary-500' : 'bg-neutral-300'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-4 text-right ${highlight ? 'text-primary-600' : 'text-neutral-500'}`}>
        {score}
      </span>
    </div>
  )
}

export default function ComparisonTable({ comparisonData }) {
  const { dimensions, cars } = comparisonData

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100">
        <h3 className="text-base font-bold text-neutral-900">How they compare</h3>
        <p className="text-xs text-neutral-500 mt-0.5">Scores out of 10</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="bg-neutral-50">
              <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide px-5 py-3 w-32">
                Category
              </th>
              {cars.map((c, i) => (
                <th
                  key={i}
                  className={`text-left text-xs font-semibold uppercase tracking-wide px-4 py-3 ${i === 0 ? 'text-primary-600' : 'text-neutral-500'}`}
                >
                  {i === 0 && <span className="block text-primary-400 text-[10px] font-normal normal-case mb-0.5">Best match</span>}
                  {c.name.replace(/^Maruti Suzuki /, 'M. Suzuki ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim, di) => (
              <tr key={dim.key} className={di % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                <td className="px-5 py-3 text-sm text-neutral-700 font-medium whitespace-nowrap">
                  {dim.label}
                </td>
                {cars.map((c, ci) => (
                  <td key={ci} className="px-4 py-3 min-w-[120px]">
                    <ScoreBar score={c.scores[dim.key] || 0} highlight={ci === 0} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
