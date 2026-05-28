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
      return { ...initialState, answers: { ...initialState.answers } }
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
