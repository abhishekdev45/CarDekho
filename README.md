# Car Buying Advisor

A conversational car recommendation platform designed to help confused buyers go from "I don't know what to buy" to "I feel confident about my shortlist."

Instead of building a traditional filter-heavy car search experience, I focused on solving the actual user problem: most buyers do not understand technical car specs well enough to know what they should filter for.

The product behaves more like an advisor than a catalog.
**[Live Demo](https://car-dekho-bice.vercel.app/)**


---

# What I Built and Why

I built a full-stack web application where users answer a short conversational onboarding flow about:

- budget
- driving habits
- road conditions
- family usage
- ownership preferences
- emotional priorities

The system then:

1. Identifies the buyer persona
2. Calculates weighted recommendation scores
3. Explains why specific cars match the user
4. Highlights tradeoffs
5. Generates a confident shortlist
6. Allows comparison between the final recommendations

The core idea was to reduce decision fatigue and make recommendations feel explainable and trustworthy instead of purely algorithmic.

I intentionally focused more on recommendation quality and user confidence than on building a large feature set.

---

# What I Deliberately Cut

Given the 2–3 hour constraint, I intentionally avoided features that would consume engineering time without improving the core recommendation experience.

I deliberately cut:

- authentication
- admin dashboards
- large datasets
- advanced filtering/search pages
- database setup
- AI APIs/LLM integrations
- overly polished animations
- extensive testing
- production-grade caching/auth systems

I also avoided turning this into a generic "compare cars" platform because I felt the assignment was really testing product thinking and scoping decisions rather than CRUD complexity.

The highest-value thing to build first was the recommendation/advisor experience itself.

---

# Tech Stack and Why

## Frontend

- React + Vite
- Tailwind CSS

### Why

- Fastest setup and iteration speed
- Great developer experience during a time-boxed assignment
- Easy component reuse and rapid UI building

---

## Backend

- Node.js + Express

### Why

- Lightweight and simple for building recommendation APIs
- Minimal setup overhead
- Easy separation of recommendation logic into utilities/services

---

## Data Layer

- Static JSON dataset

### Why

- Faster iteration during the assignment
- Allowed me to focus on recommendation logic instead of schema design/migrations
- Sufficient for demonstrating the recommendation engine

---

# Recommendation System Design

The backend recommendation system uses:

- weighted scoring
- persona mapping
- rule-based recommendation logic
- tradeoff detection
- recommendation explainability

No AI APIs were used.

The recommendation engine considers:

- driving usage
- family needs
- ownership preferences
- city vs highway driving
- road quality
- maintenance expectations
- safety priorities

The system also attempts to explain:

- why a car was recommended
- possible ownership tradeoffs
- why certain categories were deprioritized

This was intentionally designed to feel more like a human advisor than a traditional filter engine.

---

# What I Delegated to AI Tools

I used Claude primarily to accelerate implementation speed during the limited assignment window.

I communicated the product idea, user flow, recommendation behavior, and overall experience I wanted to build, then used AI tools to generate much of the initial codebase including:

- frontend scaffolding
- reusable UI components
- onboarding flow structure
- recommendation engine boilerplate
- backend API setup
- utility functions
- styling/layout generation

The AI tools were especially useful for rapidly iterating on UI and reducing repetitive coding work.

---

# What I Did Manually

I intentionally wanted to avoid building a traditional filter/search platform and instead focus on a recommendation advisor experience for confused buyers who may not understand technical car specifications.

I manually:

- designed the conversational onboarding flow
- decided how the recommendation experience should feel
- structured the persona-driven recommendation approach
- reviewed generated code and refined implementation details
- cleaned up and simplified parts of the generated codebase
- improved recommendation logic and scoring behavior

The AI tools helped accelerate execution, but I treated them more as implementation assistants while I focused on product thinking, reviewing outputs, and shaping the overall experience.

---

# Where AI Tools Helped Most

AI tools were extremely effective for:

- reducing setup time
- generating repetitive frontend code
- accelerating iteration speed
- quickly exploring UI structures
- producing initial utility functions
- generating data set
- generating form fields

They were especially valuable during the early scaffolding phase.

---

# Where AI Tools Got in the Way

The generated logic initially felt too generic and overly "filter-like."

Some common issues:

- recommendation scoring lacked nuance
- recommendations became too similar
- too many additive scores and not enough penalties/tradeoffs/diverse
- components were occasionally over-engineered
- some abstractions were unnecessary

I had to manually refine:

- recommendation explainability
- scoring balance
- persona behavior
- tradeoff handling
- shortlist diversity

The biggest lesson was that AI accelerated implementation, but product judgment and refinement still required manual thinking.

---

# If I Had Another 4 Hours

I would add:

## 1. Real Dataset Normalization

Use actual review/spec data and normalize scores dynamically instead of static scoring.

---

## 2. Conversational Recommendation Chat

A lightweight guided conversational flow with memory between questions.

---

## 3. Ownership Cost Simulation

Fuel + insurance + maintenance estimation over 5 years.

---

## 4. Recommendation Diversity Engine

Ensure shortlists contain meaningfully different options instead of near-identical cars.

---

## 5. Smarter Explainability

More personalized recommendation explanations and regret-prevention insights.

---

## 6. Save & Share Shortlists

Allow users to revisit or share recommendations.

---

## 7. User Feedback Loop

Capture which recommendations users liked/disliked and improve scoring adaptively.

---



---

# Final Thought

The main product decision in this assignment was intentionally avoiding a traditional filter/search experience.

I wanted to focus on helping users make decisions confidently rather than simply helping them browse cars.
