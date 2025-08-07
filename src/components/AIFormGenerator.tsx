import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface FieldSchema {
  name: string
  type: 'text' | 'slider' | 'checkbox' | 'select' | 'radio'
  label: string
  options?: string[]
  min?: number
  max?: number
  step?: number
}

interface AIFormGeneratorProps {
  query: string
  onSubmit: (data: any) => void
  onBack: () => void
  formSchema: FieldSchema[]
}

const AIFormGenerator = ({
  query,
  onSubmit,
  onBack,
  formSchema
}: AIFormGeneratorProps) => {
  const initialFormData = Array.isArray(formSchema)
    ? formSchema.reduce((acc, field) => {
        if (field.type === 'checkbox') {
          acc[field.name] = []
        } else if (field.type === 'slider') {
          acc[field.name] = field.min ?? 0
        } else {
          acc[field.name] = ''
        }
        return acc
      }, {})
    : {}

  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (
    name: string,
    option: string,
    checked: boolean
  ) => {
    setFormData(prev => {
      const current = prev[name] || []
      return {
        ...prev,
        [name]: checked
          ? [...current, option]
          : current.filter((v: string) => v !== option)
      }
    })
  }

  const handleSubmit = () => {
    const payload = {
      ...formData,
      originalQuery: query
    }
    onSubmit(payload)
  }

  if (!Array.isArray(formSchema)) {
    return <div>Error: Invalid form schema received</div>
  }

  return (
    <section className='relative py-12'>
      <div className='absolute inset-0 -z-10 pointer-events-none'>
        {/* Background bubbles */}
        <motion.div
          className='absolute -top-24 -left-24 w-[250px] h-[250px] rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-blue-400 opacity-20 blur-2xl'
          animate={{ scale: [0.8, 1], opacity: [0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div
          className='absolute top-1/2 right-0 w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-purple-400 opacity-20 blur-2xl'
          animate={{ scale: [0.7, 1.1], opacity: [0.4, 0.7] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 1
          }}
        />
        <motion.div
          className='absolute bottom-0 left-1/2 w-[120px] h-[120px] rounded-full bg-gradient-to-tl from-green-300 via-blue-300 to-indigo-400 opacity-10 blur-2xl'
          animate={{ scale: [0.9, 1.05], opacity: [0.3, 0.5] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.5
          }}
        />
      </div>

      <div className='max-w-2xl mx-auto space-y-8 relative z-10'>
        {/* Header */}
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='icon' onClick={onBack}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div className='flex-1'>
            <div className='flex items-center space-x-2 mb-2'>
              <Sparkles className='h-5 w-5 text-primary' />
              <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent'>
                Refine Your Search
              </h2>
            </div>
            <p className='text-muted-foreground'>
              Based on your request, help us find the perfect match
            </p>
          </div>
        </div>

        {/* Display Query */}
        <div className='bg-secondary/30 p-4 rounded-lg'>
          <Label className='text-sm font-medium text-muted-foreground'>
            Your search:
          </Label>
          <p className='mt-1'>{query}</p>
        </div>

        {/* Dynamic Form */}
        <div className='space-y-6'>
          {formSchema.map(field => {
            const value = formData[field.name]

            if (field.type === 'slider') {
              return (
                <div key={field.name} className='space-y-2'>
                  <Label className='font-semibold'>{field.label}</Label>
                  <Slider
                    value={[value]}
                    onValueChange={val => handleChange(field.name, val[0])}
                    min={field.min ?? 0}
                    max={field.max ?? 100}
                    step={field.step ?? 1}
                  />
                  <div className='text-sm text-muted-foreground'>
                    Selected: ₹{value}
                  </div>
                </div>
              )
            }

            if (field.type === 'checkbox') {
              return (
                <div key={field.name} className='space-y-2'>
                  <Label className='font-semibold'>{field.label}</Label>
                  <div className='grid grid-cols-2 gap-2'>
                    {field.options?.map(option => (
                      <div key={option} className='flex items-center space-x-2'>
                        <Checkbox
                          id={`${field.name}-${option}`}
                          checked={value?.includes(option) || false}
                          onCheckedChange={checked =>
                            handleCheckboxChange(
                              field.name,
                              option,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={`${field.name}-${option}`}
                          className='text-sm cursor-pointer'
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            if (field.type === 'radio') {
              return (
                <div key={field.name} className='space-y-2'>
                  <Label className='font-semibold'>{field.label}</Label>
                  <div className='flex gap-2 flex-wrap'>
                    {field.options?.map(option => (
                      <Button
                        key={option}
                        variant={value === option ? 'default' : 'outline'}
                        onClick={() => handleChange(field.name, option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )
            }

            // Default to text input
            return (
              <div key={field.name} className='space-y-2'>
                <Label htmlFor={field.name} className='font-semibold'>
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  value={value}
                  onChange={e => handleChange(field.name, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            )
          })}
        </div>

        <Button
          onClick={handleSubmit}
          className='w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white font-semibold shadow-lg hover:scale-105 transition-transform'
          size='lg'
        >
          Find My Perfect Products
        </Button>
      </div>
    </section>
  )
}

export default AIFormGenerator
