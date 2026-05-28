export default function ProgressDots({ total, current }) {
  return (
    <div className="flex justify-center items-center gap-2 py-4">
      {Array.from({ length: total }).map((_, i) => {
        const done   = i < current
        const active = i === current
        return (
          <div
            key={i}
            className={[
              'h-2.5 rounded-full transition-all duration-300',
              active ? 'w-7 bg-primary-600' :
              done   ? 'w-2.5 bg-primary-600' :
                       'w-2.5 bg-neutral-200',
            ].join(' ')}
          />
        )
      })}
    </div>
  )
}
