export default function QuestionCard({ question, hint, children }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Avatar + bubble */}
      <div className="flex flex-col gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-lg select-none">
          🚗
        </div>
        <div
          className="bg-white shadow-sm px-4 py-3.5 max-w-xs"
          style={{ borderRadius: '4px 16px 16px 16px' }}
        >
          <p className="text-neutral-800 font-semibold text-base leading-snug">
            {question}
          </p>
          {hint && (
            <p className="text-neutral-400 text-xs mt-1">{hint}</p>
          )}
        </div>
      </div>

      {/* Options */}
      <div>{children}</div>
    </div>
  )
}
