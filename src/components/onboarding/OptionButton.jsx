export default function OptionButton({ emoji, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl',
        'text-sm font-medium transition-colors duration-150 cursor-pointer',
        selected
          ? 'bg-primary-50 border-2 border-primary-600 text-primary-700'
          : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:bg-primary-50',
      ].join(' ')}
    >
      {emoji && <span className="text-lg">{emoji}</span>}
      {label}
    </button>
  )
}
