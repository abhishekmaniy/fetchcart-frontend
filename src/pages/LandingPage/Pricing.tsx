import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-react'
import { motion, Variants } from 'framer-motion'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for casual shoppers',
    features: [
      '5 AI searches per day',
      'Basic price comparison',
      'Email notifications',
      'Standard support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    description: 'Ideal for frequent shoppers',
    features: [
      'Unlimited AI searches',
      'Advanced price tracking',
      'Real-time deal alerts',
      'Priority support',
      'Custom shopping lists',
      'Trend analysis'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    period: 'per month',
    description: 'For businesses and power users',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.7, type: 'spring' }
  })
}

const Pricing = () => {
  return (
    <section className='relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50'>
      {/* Animated Colorful Background */}
      <div className='absolute inset-0 -z-10 pointer-events-none'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className='absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-blue-400 opacity-30 blur-3xl'
        />
        <motion.div
          initial={{ scale: 0.7, opacity: 0.4 }}
          animate={{ scale: 1.1, opacity: 0.7 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 1
          }}
          className='absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-purple-400 opacity-30 blur-2xl'
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0.3 }}
          animate={{ scale: 1.05, opacity: 0.5 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.5
          }}
          className='absolute bottom-0 left-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-tl from-green-300 via-blue-300 to-indigo-400 opacity-20 blur-2xl'
        />
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10' />
      </div>

      <div className='container mx-auto px-4 lg:px-8 relative'>
        <div className='max-w-4xl mx-auto text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, type: 'spring' }}
            className='inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-100 shadow-lg backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-indigo-100'
          >
            <Sparkles className='h-5 w-5 text-pink-500 animate-bounce' />
            <span className='text-base font-semibold text-indigo-700 tracking-wide'>
              Pricing Plans
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
            className='text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent leading-tight drop-shadow-lg'
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, type: 'spring' }}
            className='text-xl text-indigo-900/80 max-w-2xl mx-auto leading-relaxed font-medium'
          >
            Choose the plan that fits your shopping needs. All plans include our
            core AI features.
          </motion.p>
        </div>

        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              custom={i}
              variants={cardVariants}
              initial='hidden'
              animate='visible'
              className={`relative bg-white/90 p-8 rounded-2xl shadow-lg border transition-shadow group overflow-hidden ${
                plan.popular
                  ? 'border-primary shadow-xl scale-105 z-10'
                  : 'border-border'
              }`}
              whileHover={{
                scale: 1.04,
                boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)'
              }}
            >
              {plan.popular && (
                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 z-20'>
                  <span className='bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow'>
                    Most Popular
                  </span>
                </div>
              )}

              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent'>
                  {plan.name}
                </h3>
                <div className='mb-2 flex justify-center items-end gap-2'>
                  <span className='text-4xl font-bold'>{plan.price}</span>
                  <span className='text-muted-foreground text-base'>
                    /{plan.period}
                  </span>
                </div>
                <p className='text-muted-foreground'>{plan.description}</p>
              </div>

              <ul className='space-y-4 mb-8'>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className='flex items-center'>
                    <Check className='h-5 w-5 text-primary mr-3 flex-shrink-0' />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
