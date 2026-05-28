import Button from '../ui/Button'

export default function StepNavigation({ canGoBack, canGoNext, onBack, onNext, isLast }) {
  return (
    <div className="flex justify-between items-center mt-6">
      <Button
        variant="secondary"
        size="md"
        onClick={onBack}
        disabled={!canGoBack}
        className={!canGoBack ? 'invisible' : ''}
      >
        ← Back
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={onNext}
        disabled={!canGoNext}
      >
        {isLast ? 'See My Cars →' : 'Next →'}
      </Button>
    </div>
  )
}
