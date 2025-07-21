import { Star, Sparkles } from 'lucide-react'
import { motion, AnimatePresence, Variant } from 'framer-motion'
import React, { useState, useEffect } from 'react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fashion Enthusiast',
    avatar: 'SJ',
    content:
      "FetchCart has completely transformed how I shop online. The AI recommendations are spot-on, and I've saved hundreds of dollars with their price tracking.",
    rating: 5
  },
  {
    name: 'Mike Chen',
    role: 'Tech Professional',
    avatar: 'MC',
    content:
      "As someone who researches extensively before buying, FetchCart's comparison features are a game-changer. It saves me hours of manual searching.",
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Small Business Owner',
    avatar: 'ER',
    content:
      'The enterprise features help me source products for my business efficiently. The API integration is seamless and the support team is fantastic.',
    rating: 5
  },
  {
    name: 'Priya Patel',
    role: 'Student',
    avatar: 'PP',
    content:
      'I love how easy it is to find the best deals. The personalized recommendations are always on point!',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Gadget Reviewer',
    avatar: 'DK',
    content:
      "FetchCart's trend analysis keeps me ahead of the curve. The UI is beautiful and the experience is seamless.",
    rating: 5
  },
  {
    name: 'Lina Müller',
    role: 'Travel Blogger',
    avatar: 'LM',
    content:
      'I use FetchCart to find travel gear and accessories. The one-click purchase and price alerts are a lifesaver!',
    rating: 5
  }
]

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, duration: 0.7 }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
    transition: { type: 'spring' as const, duration: 0.5 }
  })
}

const getNextIndex = (current: number, dir: number, length: number) =>
  (current + dir + length) % length

const Testimonials = () => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection(1)
      setIndex(prev => getNextIndex(prev, 1, testimonials.length))
    }, 5000)
    return () => clearTimeout(timer)
  }, [index])

  const paginate = (dir: number) => {
    setDirection(dir)
    setIndex(prev => getNextIndex(prev, dir, testimonials.length))
  }

  return (
    <section
      id='testimonials'
      className='py-24 bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 overflow-hidden relative'
    >
      <div className='absolute inset-0 -z-10 pointer-events-none'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className='absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-blue-400 opacity-30 blur-3xl'
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
          className='absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-purple-400 opacity-30 blur-2xl'
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
          className='absolute bottom-0 left-1/2 w-[250px] h-[250px] rounded-full bg-gradient-to-tl from-green-300 via-blue-300 to-indigo-400 opacity-20 blur-2xl'
        />
      </div>
      <div className='container mx-auto px-4 lg:px-8'>
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, type: 'spring' }}
            className='inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-100 shadow-lg backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-indigo-100'
          >
            <Sparkles className='h-5 w-5 text-pink-500 animate-bounce' />
            <span className='text-base font-semibold text-indigo-700 tracking-wide'>
              Loved by Shoppers Worldwide
            </span>
          </motion.div>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent'>
            What Our Users Say
          </h2>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Join thousands of satisfied customers who have revolutionized their
            shopping experience.
          </p>
        </div>

        <div className='flex flex-col items-center'>
          <div className='relative w-full max-w-xl mx-auto'>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={testimonials[index].name} 
                custom={direction}
                variants={variants}
                initial='enter'
                animate='center'
                exit='exit'
                className='bg-white/90 p-10 rounded-2xl shadow-xl border border-indigo-100 flex flex-col items-center text-center min-h-[340px]'
                transition={{ type: 'spring', duration: 0.7 }}
              >
                <div className='flex items-center mb-4 justify-center'>
                  {[...Array(testimonials[index].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='h-5 w-5 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <p className='text-lg text-indigo-900 mb-8 leading-relaxed font-medium'>
                  "{testimonials[index].content}"
                </p>
                <div className='flex items-center justify-center'>
                  <div className='w-14 h-14 bg-gradient-to-br from-indigo-500 via-pink-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mr-4'>
                    {testimonials[index].avatar}
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold text-indigo-700'>
                      {testimonials[index].name}
                    </div>
                    <div className='text-pink-500 text-sm'>
                      {testimonials[index].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Navigation Arrows */}
            <button
              aria-label='Previous testimonial'
              onClick={() => paginate(-1)}
              className='absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-indigo-100 border border-indigo-200 rounded-full p-2 shadow transition-colors'
            >
              <svg
                width='24'
                height='24'
                fill='none'
                stroke='currentColor'
                className='text-indigo-500'
              >
                <path
                  d='M15 19l-7-7 7-7'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
            <button
              aria-label='Next testimonial'
              onClick={() => paginate(1)}
              className='absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-pink-100 border border-pink-200 rounded-full p-2 shadow transition-colors'
            >
              <svg
                width='24'
                height='24'
                fill='none'
                stroke='currentColor'
                className='text-pink-500'
              >
                <path
                  d='M9 5l7 7-7 7'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
          {/* Dots */}
          <div className='flex gap-2 mt-8'>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1)
                  setIndex(i)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'bg-gradient-to-r from-indigo-500 via-pink-400 to-yellow-400 shadow'
                    : 'bg-indigo-100'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
