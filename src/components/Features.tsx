import {
  Zap,
  Shield,
  Users,
  Search,
  ShoppingBag,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { motion, Variants } from 'framer-motion'

const features = [
  {
    icon: <Zap className='h-8 w-8 text-yellow-400' />,
    title: 'Lightning Fast Search',
    description:
      'Find products across thousands of stores in seconds with our advanced AI algorithms.'
  },
  {
    icon: <Shield className='h-8 w-8 text-indigo-500' />,
    title: 'Price Protection',
    description:
      'Never overpay again. We track prices and alert you to the best deals automatically.'
  },
  {
    icon: <Users className='h-8 w-8 text-pink-400' />,
    title: 'Personalized Recommendations',
    description:
      'Get product suggestions tailored to your preferences, budget, and shopping history.'
  },
  {
    icon: <Search className='h-8 w-8 text-blue-400' />,
    title: 'Smart Comparison',
    description:
      'Compare features, prices, and reviews across multiple retailers instantly.'
  },
  {
    icon: <ShoppingBag className='h-8 w-8 text-green-400' />,
    title: 'One-Click Purchase',
    description:
      'Buy from your favorite stores with secure, streamlined checkout process.'
  },
  {
    icon: <TrendingUp className='h-8 w-8 text-purple-400' />,
    title: 'Trend Analysis',
    description:
      'Stay ahead with insights on trending products and seasonal deals.'
  }
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.12, duration: 0.7, type: 'spring' }
  })
}

const FeaturesHeroSection = () => {
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
              Why FetchKart?
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
            className='text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent leading-tight drop-shadow-lg'
          >
            Powerful Features for Smart Shopping
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, type: 'spring' }}
            className='text-xl text-indigo-900/80 max-w-2xl mx-auto leading-relaxed font-medium'
          >
            Our AI-powered platform combines cutting-edge technology with
            intuitive design to revolutionize your shopping experience.
          </motion.p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial='hidden'
              animate='visible'
              className='bg-white/90 p-8 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-2xl transition-shadow group relative overflow-hidden'
              whileHover={{
                scale: 1.04,
                boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)'
              }}
            >
              <div className='absolute -top-6 -right-6 opacity-10 pointer-events-none'>
                {feature.icon}
              </div>
              <div className='text-primary mb-4 z-10 relative'>
                {feature.icon}
              </div>
              <h3 className='text-xl font-semibold mb-3 z-10 relative bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent'>
                {feature.title}
              </h3>
              <p className='text-muted-foreground leading-relaxed z-10 relative'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesHeroSection
