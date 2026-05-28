import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const features = [
  {
    icon: '🎯',
    title: 'Personalized for You',
    description: 'Answer a few questions and get recommendations tailored to your lifestyle, budget, and needs.',
  },
  {
    icon: '🧠',
    title: 'Guided Decision Making',
    description: "Confused about which car to buy? We break it down simply — no jargon, no overwhelm.",
  },
  {
    icon: '⚖️',
    title: 'Side-by-Side Comparison',
    description: 'Compare your top picks on what actually matters to you — not just spec sheets.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-primary-100 text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Car Buying Made Simple
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 leading-tight mb-6">
            Find the perfect car{' '}
            <span className="text-primary-600">for your life</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto mb-10">
            Stop googling &ldquo;best car under 10 lakhs.&rdquo; Answer a few simple questions
            and we&rsquo;ll recommend the right car for <em>you</em> — not everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/advisor')}>
              Find My Car →
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/advisor')}>
              How it works
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-800 mb-4">
            A smarter way to buy your car
          </h2>
          <p className="text-center text-neutral-500 mb-12 max-w-xl mx-auto">
            Most car buyers are overwhelmed. We guide you step-by-step.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to find your car?
          </h2>
          <p className="text-primary-100 mb-8">
            Takes less than 3 minutes. No registration required.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/advisor')}
          >
            Start Now — It&rsquo;s Free
          </Button>
        </div>
      </section>
    </div>
  )
}
