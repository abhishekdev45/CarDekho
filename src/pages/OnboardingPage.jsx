import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { STEPS, TOTAL_STEPS } from '../data/onboardingSteps'
import { useOnboarding } from '../hooks/useOnboarding'
import ProgressDots from '../components/onboarding/ProgressDots'
import QuestionCard from '../components/onboarding/QuestionCard'
import OptionButton from '../components/onboarding/OptionButton'
import PriorityChips from '../components/onboarding/PriorityChips'
import StepNavigation from '../components/onboarding/StepNavigation'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useOnboarding()
  const { currentStep, direction, answers } = state
  const step = STEPS[currentStep]
  const answer = answers[step.id]

  useEffect(() => { dispatch({ type: 'RESET' }) }, [])

  const canGoNext = step.type === 'multi'
    ? Array.isArray(answer) && answer.length >= step.minSelect
    : answer !== null

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS - 1) {
      navigate('/recommendations')
    } else {
      dispatch({ type: 'NEXT_STEP' })
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50 flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-md">
        <ProgressDots total={TOTAL_STEPS} current={currentStep} />

        <div
          key={`${currentStep}-${direction}`}
          className={direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}
        >
          <QuestionCard question={step.question} hint={step.hint}>
            {step.type === 'multi' ? (
              <PriorityChips
                options={step.options}
                selected={Array.isArray(answer) ? answer : []}
                onChange={(value) =>
                  dispatch({ type: 'SET_ANSWER', key: step.id, value })
                }
                minSelect={step.minSelect}
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                {step.options.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={answer === opt.value}
                    onClick={() =>
                      dispatch({ type: 'SET_ANSWER', key: step.id, value: opt.value })
                    }
                  />
                ))}
              </div>
            )}
          </QuestionCard>
        </div>

        <StepNavigation
          canGoBack={currentStep > 0}
          canGoNext={canGoNext}
          onBack={() => dispatch({ type: 'PREV_STEP' })}
          onNext={handleNext}
          isLast={currentStep === TOTAL_STEPS - 1}
        />
      </div>
    </div>
  )
}
