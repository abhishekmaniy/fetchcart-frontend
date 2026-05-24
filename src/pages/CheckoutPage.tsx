import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Crown,
  Loader2,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

type PlanId = 'pro' | 'team'
type BillingCycle = 'monthly' | 'yearly'

const plans = {
  pro: {
    id: 'pro',
    name: 'Pro',
    icon: Crown,
    monthlyPrice: 299,
    yearlyPrice: 2999,
    description: 'For power shoppers who want unlimited AI discovery.',
    features: [
      'Unlimited AI searches',
      'Advanced product comparison',
      'Real-time price tracking',
      'Smart recommendations',
      'Favorites and saved comparisons',
      'Priority search processing'
    ]
  },
  team: {
    id: 'team',
    name: 'Team',
    icon: Zap,
    monthlyPrice: 999,
    yearlyPrice: 9999,
    description: 'For teams, resellers, and procurement workflows.',
    features: [
      'Everything in Pro',
      '5 team seats',
      'Shared comparison workspace',
      'Bulk product tracking',
      'Export reports',
      'API access ready'
    ]
  }
} satisfies Record<PlanId, any>

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('pro')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [isProcessing, setIsProcessing] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setDark(prev => !prev)
  }

  const selectedPlan = plans[selectedPlanId]
  const PlanIcon = selectedPlan.icon

  const price = useMemo(() => {
    return billingCycle === 'monthly'
      ? selectedPlan.monthlyPrice
      : selectedPlan.yearlyPrice
  }, [selectedPlan, billingCycle])

  const handleCheckout = async () => {
    try {
      setIsProcessing(true)

      await new Promise(resolve => setTimeout(resolve, 900))

      toast({
        title: 'Checkout ready',
        description: `Selected ${selectedPlan.name} ${billingCycle} plan. Razorpay API can be connected here.`
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className='h-screen w-screen overflow-hidden bg-hero p-3 sm:p-4'>
      <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl' />
        <div className='absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl' />
      </div>

      <div className='mx-auto flex h-full max-w-6xl flex-col gap-3 overflow-hidden'>
        <header className='glass flex h-14 shrink-0 items-center justify-between rounded-2xl border border-border/70 px-3 shadow-soft'>
          <Button
            variant='ghost'
            onClick={() => navigate('/search')}
            className='h-9 rounded-xl px-3 text-sm text-muted-foreground hover:bg-accent/70 hover:text-foreground'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Dashboard
          </Button>

          <div className='flex items-center gap-2'>
            <Badge className='hidden rounded-full bg-accent px-3 py-1 text-primary hover:bg-accent sm:inline-flex'>
              <ShieldCheck className='mr-1.5 h-3.5 w-3.5' />
              Secure checkout
            </Badge>

            <Button
              variant='ghost'
              size='icon'
              onClick={toggleTheme}
              className='h-9 w-9 rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground'
            >
              {dark ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
            </Button>
          </div>
        </header>

        <section className='grid min-h-0 flex-1 gap-3 overflow-hidden lg:grid-cols-[0.92fr_1.08fr]'>
          <div className='glass flex min-h-0 flex-col rounded-2xl border border-border/70 p-4 shadow-elegant'>
            <div className='min-h-0 flex-1'>
              <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow'>
                <Sparkles className='h-5 w-5 text-white' />
              </div>

              <h1 className='font-display text-3xl leading-tight tracking-tight sm:text-4xl'>
                Complete your{' '}
                <span className='text-gradient italic'>upgrade</span>
              </h1>

              <p className='mt-2 max-w-md text-sm leading-relaxed text-muted-foreground'>
                Pick your plan and billing cycle. Razorpay checkout will connect
                here after backend integration.
              </p>

              <div className='mt-5 grid gap-4'>
                <div>
                  <label className='mb-1.5 block text-sm font-medium'>
                    Select plan
                  </label>

                  <Select
                    value={selectedPlanId}
                    onValueChange={value => setSelectedPlanId(value as PlanId)}
                  >
                    <SelectTrigger className='h-11 rounded-xl border-border/70 bg-card/70'>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value='pro'>Pro Plan</SelectItem>
                      <SelectItem value='team'>Team Plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='mb-1.5 block text-sm font-medium'>
                    Billing cycle
                  </label>

                  <div className='grid grid-cols-2 rounded-xl border border-border/70 bg-card/70 p-1'>
                    <button
                      type='button'
                      onClick={() => setBillingCycle('monthly')}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        billingCycle === 'monthly'
                          ? 'bg-primary-gradient text-white shadow-soft'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Monthly
                    </button>

                    <button
                      type='button'
                      onClick={() => setBillingCycle('yearly')}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        billingCycle === 'yearly'
                          ? 'bg-primary-gradient text-white shadow-soft'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-4 shrink-0 rounded-2xl border border-border/70 bg-card/70 p-4'>
              <div className='flex items-end justify-between gap-3'>
                <div>
                  <p className='text-xs text-muted-foreground'>Total payable</p>
                  <div className='mt-1 flex items-end gap-2'>
                    <span className='font-display text-4xl leading-none'>
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    <span className='mb-1 text-xs text-muted-foreground'>
                      / {billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </div>

                {billingCycle === 'yearly' && (
                  <Badge className='rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10'>
                    Save 16%
                  </Badge>
                )}
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className='mt-4 h-11 w-full rounded-xl bg-primary-gradient text-white shadow-elegant hover:shadow-glow'
              >
                {isProcessing ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Starting checkout...
                  </>
                ) : (
                  <>
                    Continue to Razorpay
                    <BadgeCheck className='ml-2 h-4 w-4' />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className='glass min-h-0 overflow-hidden rounded-2xl border border-border/70 p-4 shadow-soft'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <div className='inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs text-primary'>
                  <PlanIcon className='h-3.5 w-3.5' />
                  {selectedPlan.name} plan
                </div>

                <h2 className='mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl'>
                  What you get with{' '}
                  <span className='text-gradient italic'>
                    {selectedPlan.name}
                  </span>
                </h2>

                <p className='mt-2 text-sm text-muted-foreground'>
                  {selectedPlan.description}
                </p>
              </div>

              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-glow'>
                <PlanIcon className='h-5 w-5' />
              </div>
            </div>

            <div className='mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2'>
              {selectedPlan.features.map((feature: string) => (
                <div
                  key={feature}
                  className='flex items-center gap-3 rounded-xl border border-border/70 bg-card/70 p-3'
                >
                  <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-primary'>
                    <Check className='h-3.5 w-3.5' />
                  </span>

                  <span className='text-sm font-medium'>{feature}</span>
                </div>
              ))}
            </div>

            <div className='mt-4 rounded-2xl border border-border/70 bg-card/70 p-4'>
              <div className='flex items-start gap-3'>
                <ShieldCheck className='mt-0.5 h-5 w-5 shrink-0 text-primary' />

                <div>
                  <h3 className='text-sm font-semibold'>
                    Payment integration ready
                  </h3>
                  <p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
                    Connect backend create-order and verify-payment APIs here.
                    After Razorpay verification, update the user plan in your
                    database.
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-4 grid grid-cols-3 gap-2'>
              {['Fast AI', 'Secure', 'Cancel anytime'].map(item => (
                <div
                  key={item}
                  className='rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-center text-xs font-medium text-muted-foreground'
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default CheckoutPage