# Onboarding Form — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 7-step chat-style conversational onboarding form with dot progress, slide transitions, and React Context state — ending with auto-navigation to /recommendations.

**Architecture:** All step config lives in a static data file. A useReducer-based context holds answers and current step. OnboardingPage is data-driven — it reads the current step's config and renders the right input type (OptionButton list or PriorityChips). CSS keyframe animations handle slide transitions on step change; a `key` prop forces remount to replay the animation.

**Tech Stack:** React 18, React Router v7, Tailwind CSS v4, React Context + useReducer

---

## File Map

**Create:**
- `src/data/onboardingSteps.js` — step config array (7 steps, question/hint/type/options)
- `src/context/OnboardingContext.jsx` — context, reducer, `OnboardingProvider`
- `src/hooks/useOnboarding.js` — `useOnboarding()` hook
- `src/components/onboarding/ProgressDots.jsx` — dot row, current step = wider pill
- `src/components/onboarding/QuestionCard.jsx` — car avatar + chat bubble wrapper
- `src/components/onboarding/OptionButton.jsx` — single-select pill row button
- `src/components/onboarding/PriorityChips.jsx` — multi-select chip grid (min-3 guard)
- `src/components/onboarding/StepNavigation.jsx` — Back / Next buttons with disabled states

**Modify:**
- `src/pages/OnboardingPage.jsx` — replace placeholder with full form orchestration
- `src/App.jsx` — wrap routes with `OnboardingProvider`
- `src/index.css` — add `@keyframes` + `.animate-slide-in-right/left` utilities

---

## Task 1: Add CSS Slide Animations

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add keyframes and utility classes**

Append to the bottom of `src/index.css`:

```css
@keyframes slideInFromRight {
  from { transform: translateX(32px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

@keyframes slideInFromLeft {
  from { transform: translateX(-32px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

@layer utilities {
  .animate-slide-in-right {
    animation: slideInFromRight 0.28s ease-out both;
  }
  .animate-slide-in-left {
    animation: slideInFromLeft 0.28s ease-out both;
  }
}
```

- [ ] **Step 2: Verify CSS compiles**

```powershell
npm run build 2>&1 | Select-Object -Last 5
```
Expected: `✓ built in ...ms` — no errors.

- [ ] **Step 3: Commit**

```powershell
git add src/index.css
git commit -m "feat: add slide-in keyframe animations for onboarding transitions"
```

---

## Task 2: Create Step Config Data

**Files:**
- Create: `src/data/onboardingSteps.js`

- [ ] **Step 1: Write the steps config**

Write `src/data/onboardingSteps.js`:

```js
export const STEPS = [
  {
    id: 'budget',
    question: "What's your budget for the car?",
    hint: 'Include on-road costs in your estimate',
    type: 'single',
    options: [
      { value: 'under-7l',  label: 'Under 7L',   emoji: '💰' },
      { value: '7l-10l',    label: '7L – 10L',   emoji: '💵' },
      { value: '10l-15l',   label: '10L – 15L',  emoji: '💳' },
      { value: '15l-25l',   label: '15L – 25L',  emoji: '🏦' },
      { value: '25l-plus',  label: '25L+',        emoji: '💎' },
    ],
  },
  {
    id: 'usage',
    question: 'How will you mainly use the car?',
    hint: 'Pick the one that fits your daily life',
    type: 'single',
    options: [
      { value: 'office-commute', label: 'Daily office commute',  emoji: '🏢' },
      { value: 'family',         label: 'Family usage',          emoji: '👨‍👩‍👧' },
      { value: 'highway',        label: 'Long highway trips',    emoji: '🛣️' },
      { value: 'city',           label: 'City driving',          emoji: '🏙️' },
      { value: 'weekend',        label: 'Weekend travel',        emoji: '🏖️' },
      { value: 'mixed',          label: 'Mixed usage',           emoji: '🔄' },
    ],
  },
  {
    id: 'travelers',
    question: 'Who usually travels with you?',
    hint: 'This helps us find the right space and comfort level',
    type: 'single',
    options: [
      { value: 'alone',        label: 'Mostly alone',              emoji: '👤' },
      { value: 'couple',       label: 'Couple',                    emoji: '👫' },
      { value: 'small-family', label: 'Small family',              emoji: '👨‍👩‍👧' },
      { value: 'large-family', label: 'Large family',              emoji: '👨‍👩‍👧‍👦' },
      { value: 'parents',      label: 'Parents frequently travel', emoji: '👴' },
      { value: 'kids',         label: 'Kids frequently travel',    emoji: '🧒' },
    ],
  },
  {
    id: 'experience',
    question: 'How confident are you behind the wheel?',
    hint: 'Be honest — this helps us match the right car',
    type: 'single',
    options: [
      { value: 'first-time',  label: 'First-time buyer',   emoji: '🌱' },
      { value: 'beginner',    label: 'Beginner',           emoji: '🚘' },
      { value: 'comfortable', label: 'Comfortable driver', emoji: '👍' },
      { value: 'enthusiast',  label: 'Enthusiast',         emoji: '🏎️' },
    ],
  },
  {
    id: 'roadConditions',
    question: 'What kind of roads do you usually drive on?',
    hint: 'Think about your typical daily route',
    type: 'single',
    options: [
      { value: 'smooth-city',   label: 'Smooth city roads',    emoji: '🛤️' },
      { value: 'heavy-traffic', label: 'Heavy traffic',        emoji: '🚦' },
      { value: 'bad-roads',     label: 'Bad roads / potholes', emoji: '⚠️' },
      { value: 'highway-heavy', label: 'Highway heavy',        emoji: '🛣️' },
      { value: 'rural',         label: 'Rural / village roads',emoji: '🌾' },
    ],
  },
  {
    id: 'priorities',
    question: 'What matters most to you in a car?',
    hint: 'Pick at least 3 — you can choose more',
    type: 'multi',
    minSelect: 3,
    options: [
      { value: 'safety',           label: 'Safety',          emoji: '🛡️' },
      { value: 'mileage',          label: 'Mileage',         emoji: '⛽' },
      { value: 'low-maintenance',  label: 'Low maintenance', emoji: '🔧' },
      { value: 'comfort',          label: 'Comfort',         emoji: '🛋️' },
      { value: 'performance',      label: 'Performance',     emoji: '🏎️' },
      { value: 'features',         label: 'Features / tech', emoji: '📱' },
      { value: 'resale',           label: 'Resale value',    emoji: '📈' },
      { value: 'premium',          label: 'Premium feel',    emoji: '✨' },
    ],
  },
  {
    id: 'ownership',
    question: 'What kind of ownership experience do you want?',
    hint: 'This shapes everything — brand, variant, body type',
    type: 'single',
    options: [
      { value: 'stress-free',  label: 'Stress-free ownership', emoji: '😌' },
      { value: 'premium-feel', label: 'Premium feel',          emoji: '👑' },
      { value: 'fun-to-drive', label: 'Fun to drive',          emoji: '😄' },
      { value: 'family-comfort',label: 'Family comfort',       emoji: '🏠' },
      { value: 'rugged',       label: 'Rugged confidence',     emoji: '💪' },
      { value: 'attention',    label: 'Attention on road',     emoji: '👀' },
    ],
  },
]

export const TOTAL_STEPS = STEPS.length
```

- [ ] **Step 2: Commit**

```powershell
git add src/data/onboardingSteps.js
git commit -m "feat: add onboarding step config for all 7 steps"
```

---

## Task 3: Create OnboardingContext

**Files:**
- Create: `src/context/OnboardingContext.jsx`

- [ ] **Step 1: Create the context directory**

```powershell
New-Item -ItemType Directory -Force -Path "e:\CarDekho\src\context" | Out-Null
```

- [ ] **Step 2: Write OnboardingContext.jsx**

Write `src/context/OnboardingContext.jsx`:

```jsx
import { createContext, useReducer } from 'react'
import { TOTAL_STEPS } from '../data/onboardingSteps'

const initialState = {
  currentStep: 0,
  direction: 'forward',
  answers: {
    budget: null,
    usage: null,
    travelers: null,
    experience: null,
    roadConditions: null,
    priorities: [],
    ownership: null,
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.key]: action.value },
      }
    case 'NEXT_STEP':
      return {
        ...state,
        direction: 'forward',
        currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1),
      }
    case 'PREV_STEP':
      return {
        ...state,
        direction: 'backward',
        currentStep: Math.max(state.currentStep - 1, 0),
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export const OnboardingContext = createContext(null)

export function OnboardingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  )
}
```

- [ ] **Step 3: Commit**

```powershell
git add src/context/OnboardingContext.jsx
git commit -m "feat: add OnboardingContext with reducer for step and answer state"
```

---

## Task 4: Create useOnboarding Hook

**Files:**
- Create: `src/hooks/useOnboarding.js`

- [ ] **Step 1: Write useOnboarding.js**

Write `src/hooks/useOnboarding.js`:

```js
import { useContext } from 'react'
import { OnboardingContext } from '../context/OnboardingContext'

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider')
  return ctx
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/hooks/useOnboarding.js
git commit -m "feat: add useOnboarding hook"
```

---

## Task 5: Create ProgressDots Component

**Files:**
- Create: `src/components/onboarding/ProgressDots.jsx`

- [ ] **Step 1: Create the onboarding components directory**

```powershell
New-Item -ItemType Directory -Force -Path "e:\CarDekho\src\components\onboarding" | Out-Null
```

- [ ] **Step 2: Write ProgressDots.jsx**

Write `src/components/onboarding/ProgressDots.jsx`:

```jsx
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
```

- [ ] **Step 3: Commit**

```powershell
git add src/components/onboarding/ProgressDots.jsx
git commit -m "feat: add ProgressDots component"
```

---

## Task 6: Create QuestionCard Component

**Files:**
- Create: `src/components/onboarding/QuestionCard.jsx`

- [ ] **Step 1: Write QuestionCard.jsx**

Write `src/components/onboarding/QuestionCard.jsx`:

```jsx
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
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/onboarding/QuestionCard.jsx
git commit -m "feat: add QuestionCard chat-bubble component"
```

---

## Task 7: Create OptionButton Component

**Files:**
- Create: `src/components/onboarding/OptionButton.jsx`

- [ ] **Step 1: Write OptionButton.jsx**

Write `src/components/onboarding/OptionButton.jsx`:

```jsx
export default function OptionButton({ emoji, label, selected, onClick }) {
  return (
    <button
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
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/onboarding/OptionButton.jsx
git commit -m "feat: add OptionButton single-select pill component"
```

---

## Task 8: Create PriorityChips Component

**Files:**
- Create: `src/components/onboarding/PriorityChips.jsx`

- [ ] **Step 1: Write PriorityChips.jsx**

Write `src/components/onboarding/PriorityChips.jsx`:

```jsx
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
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/onboarding/PriorityChips.jsx
git commit -m "feat: add PriorityChips multi-select component with min-select guard"
```

---

## Task 9: Create StepNavigation Component

**Files:**
- Create: `src/components/onboarding/StepNavigation.jsx`

- [ ] **Step 1: Write StepNavigation.jsx**

Write `src/components/onboarding/StepNavigation.jsx`:

```jsx
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
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/onboarding/StepNavigation.jsx
git commit -m "feat: add StepNavigation back/next component"
```

---

## Task 10: Implement OnboardingPage

**Files:**
- Modify: `src/pages/OnboardingPage.jsx`

- [ ] **Step 1: Replace OnboardingPage with full implementation**

Write `src/pages/OnboardingPage.jsx`:

```jsx
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
```

- [ ] **Step 2: Commit**

```powershell
git add src/pages/OnboardingPage.jsx
git commit -m "feat: implement OnboardingPage with 7-step data-driven form"
```

---

## Task 11: Add OnboardingProvider to App

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Wrap routes with OnboardingProvider**

Write `src/App.jsx`:

```jsx
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import RecommendationsPage from './pages/RecommendationsPage'
import ComparePage from './pages/ComparePage'
import { OnboardingProvider } from './context/OnboardingContext'

export default function App() {
  return (
    <OnboardingProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/advisor" element={<OnboardingPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Route>
      </Routes>
    </OnboardingProvider>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/App.jsx
git commit -m "feat: wrap app with OnboardingProvider so answers persist to recommendations"
```

---

## Task 12: Final Verification

**Files:** None — verification only.

- [ ] **Step 1: Run build to catch any compile errors**

```powershell
npm run build 2>&1 | Select-Object -Last 8
```
Expected: `✓ built in ...ms` with no TypeScript/import errors.

- [ ] **Step 2: Start dev server**

```powershell
npm run dev
```
Open `http://localhost:5173/advisor`.

- [ ] **Step 3: Walk the full flow**

| Action | Expected |
|--------|----------|
| Load `/advisor` | Step 1 shown — budget question in chat bubble, 5 options, dot 1 active |
| Back button | Invisible (step 1, can't go back) |
| Next button | Disabled (no answer yet) |
| Click "7L – 10L" | Option highlights blue, Next becomes enabled |
| Click Next | Slides to Step 2, dot 2 active, previous dots filled |
| Click Back | Slides back to Step 1, dot 1 active again |
| Advance to Step 6 | Multi-select chips render, counter shows "Pick at least 3" |
| Select 2 chips | Counter shows "1 more to continue", Next disabled |
| Select 3rd chip | Counter shows "3 selected ✓", Next enabled |
| Complete Step 7 | Clicking "See My Cars →" navigates to `/recommendations` |

- [ ] **Step 4: Final commit**

```powershell
git add .
git commit -m "chore: onboarding form complete and verified"
```

---

## Self-Review

**Spec coverage:**
- ✅ 7 steps with exact options from spec → Task 2
- ✅ Budget, Usage, Travelers, Experience, Road Conditions, Priorities, Ownership → Task 2
- ✅ Step 6 multi-select chips with min-3 → Task 8
- ✅ React Context for state → Task 3
- ✅ `useOnboarding` hook → Task 4
- ✅ `QuestionCard` reusable component → Task 6
- ✅ `OptionButton` reusable component → Task 7
- ✅ Progress dots indicator → Task 5
- ✅ Next/Back navigation → Task 9
- ✅ Smooth slide transitions (CSS) → Task 1
- ✅ All answers in centralized state → Task 3 (reducer)
- ✅ Auto-navigate to /recommendations after Step 7 → Task 10
- ✅ Mobile responsive — all components use Tailwind flex/max-w → throughout
- ✅ Next disabled until answer selected → Task 10 (`canGoNext`)
- ✅ Back invisible on Step 1 → Task 9 (`invisible` class)

**Placeholder scan:** All code blocks are complete. No TBDs.

**Type consistency:**
- `STEPS[i].id` values (`budget`, `usage`, `travelers`, `experience`, `roadConditions`, `priorities`, `ownership`) match `initialState.answers` keys in OnboardingContext — ✅
- `step.type === 'multi'` check used in OnboardingPage matches `type: 'multi'` in STEPS config — ✅
- `dispatch({ type: 'SET_ANSWER', key: step.id, value })` — `key` matches `answers` object keys — ✅
- `PriorityChips` receives `selected` as array, `onChange` returns array — consistent with `answers.priorities: []` in initial state — ✅
- `canGoNext` checks `Array.isArray(answer) && answer.length >= step.minSelect` for multi — handles initial `[]` safely — ✅
