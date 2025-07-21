import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, PlayCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, Variants } from 'framer-motion'

const badgeVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, duration: 0.6, type: 'spring' as const }
  }
}

const headlineVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.4, duration: 0.7, type: 'spring' as 'spring' }
  }
}

const subheadlineVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.6, duration: 0.7, type: 'spring' }
  }
}

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.8 + custom * 0.15, duration: 0.6, type: 'spring' }
  })
}

const trustVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 1.2, duration: 0.7, type: 'spring' }
  }
}

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className='relative py-20 lg:py-32 overflow-hidden'>
      {/* Animated Colorful Background */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-blue-400 opacity-30 blur-3xl animate-pulse' />
        <div className='absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-purple-400 opacity-30 blur-2xl animate-pulse delay-2000' />
        <div className='absolute bottom-0 left-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-tl from-green-300 via-blue-300 to-indigo-400 opacity-20 blur-2xl animate-pulse delay-1000' />
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10' />
      </div>

      <div className='container mx-auto px-4 lg:px-8 relative'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* Badge */}
          <motion.div
            variants={badgeVariants}
            initial='hidden'
            animate='visible'
            className='inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-100 shadow-lg backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-indigo-100'
          >
            <Sparkles className='h-5 w-5 text-pink-500 animate-bounce' />
            <span className='text-base font-semibold text-indigo-700 tracking-wide'>
              AI-Powered Shopping Assistant
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={headlineVariants}
            initial='hidden'
            animate='visible'
            className='text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent leading-tight drop-shadow-lg'
          >
            Shop Smarter with{' '}
            <span className='underline decoration-wavy decoration-pink-400'>
              AI
            </span>{' '}
            Product Discovery
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={subheadlineVariants}
            initial='hidden'
            animate='visible'
            className='text-xl md:text-2xl text-indigo-900/80 mb-10 max-w-3xl mx-auto leading-relaxed font-medium'
          >
            Transform your shopping experience with our intelligent assistant
            that finds, compares, and delivers the perfect products tailored to
            your needs.
          </motion.p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <motion.div
              custom={0}
              variants={buttonVariants}
              initial='hidden'
              animate='visible'
              className='w-full sm:w-auto'
            >
              <Button
                size='lg'
                className='text-lg px-8 py-6 group bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white shadow-xl hover:scale-105 transition-transform'
                onClick={() => navigate('/dashboard')}
              >
                Try Now - It's Free
                <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
              </Button>
            </motion.div>
            <motion.div
              custom={1}
              variants={buttonVariants}
              initial='hidden'
              animate='visible'
              className='w-full sm:w-auto'
            >
              <Button
                variant='outline'
                size='lg'
                className='text-lg px-8 py-6 border-2 border-pink-300 bg-white/80 hover:bg-pink-50 hover:border-pink-400 transition-colors flex items-center gap-2'
              >
                <PlayCircle className='h-6 w-6 text-pink-400' />
                Watch Demo
              </Button>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <motion.div
            variants={trustVariants}
            initial='hidden'
            animate='visible'
            className='mt-14 text-center'
          >
            <p className='text-base text-indigo-700 mb-4 font-semibold tracking-wide'>
              Trusted by thousands of smart shoppers
            </p>
            <div className='flex justify-center items-center space-x-10 opacity-90'>
              <div className='flex flex-col items-center'>
                <span className='text-3xl font-extrabold text-pink-500 drop-shadow'>
                  10K+
                </span>
                <span className='text-xs text-indigo-800 mt-1'>
                  Active Users
                </span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-3xl font-extrabold text-yellow-400 drop-shadow'>
                  ★★★★★
                </span>
                <span className='text-xs text-indigo-800 mt-1'>Top Rated</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-3xl font-extrabold text-green-400 drop-shadow'>
                  99.9%
                </span>
                <span className='text-xs text-indigo-800 mt-1'>Uptime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
