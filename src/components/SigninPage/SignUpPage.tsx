import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Header from '../Header'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import type { User, UserInputManual, UserInputGoogle } from '../../../types'


type ManualFormValues = {
  username: string
  email: string
  password: string
}

type Payload =
  | { type: 'google'; user: UserInputGoogle }
  | { type: 'manual'; user: UserInputManual }

const SignUpPage = () => {
  // const navigate = useNavigate()
  const form = useForm<ManualFormValues>({
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  const [msg, setMsg] = useState<string>('')
  const [msgType, setMsgType] = useState<'success' | 'error' | 'info'>('info')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (googleCredential?: CredentialResponse) => {
    setLoading(true)
    setMsg('')
    try {
      let payload: Payload

      if (googleCredential?.credential) {
        const googleDecoded = jwtDecode<any>(googleCredential.credential)

        // Defensive extraction
        const name = googleDecoded?.name ?? 'Google User'
        const email = googleDecoded?.email
        const picture = googleDecoded?.picture

        if (!email) {
          setMsg('Google login did not return an email. Cannot continue.')
          setMsgType('error')
          setLoading(false)
          return
        }

        payload = {
          type: 'google',
          user: {
            name,
            email,
            imageUrl: picture
          }
        }
      } else {
        const userData = form.getValues()

        if (!userData.username || !userData.email || !userData.password) {
          setMsg('Please fill in all required fields.')
          setMsgType('error')
          setLoading(false)
          return
        }

        payload = {
          type: 'manual',
          user: {
            name: userData.username,
            email: userData.email,
            password: userData.password
          }
        }
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/create`,
        payload
      )

      const data: {
        message: string
        user?: User
      } = res.data

      setMsg(data.message || 'Signup complete.')
      setMsgType('success')

      if (payload.type === 'google') {
        // If using react-router:
        // navigate('/dashboard')
        window.location.href = '/dashboard'
      } else {
        form.reset()
        // Stay on page; user must verify email.
      }
    } catch (error: any) {
      console.error('Signup failed:', error)
      const apiMessage =
        error?.response?.data?.message || 'Something went wrong. Please try again.'
      setMsg(apiMessage)
      setMsgType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-indigo-100 flex flex-col'>
      <Header />
      <div className='flex flex-1 items-center justify-center'>
        <div className='relative bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md overflow-hidden'>
          {/* Decorative blobs */}
          <div className='absolute -top-16 -left-16 w-60 h-60 bg-gradient-to-br from-indigo-400 via-pink-300 to-yellow-200 opacity-20 blur-2xl rounded-full z-0' />
          <div className='absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tr from-yellow-300 via-pink-200 to-purple-300 opacity-20 blur-2xl rounded-full z-0' />

          <div className='relative z-10'>
            <h2 className='text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent drop-shadow'>
              Create your FetchKart account
            </h2>

            <Form {...form}>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleLogin()
                }}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='username'
                  rules={{ required: 'Username is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder='your username' {...field} />
                      </FormControl>
                      <FormDescription>Pick a unique username.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder='you@example.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='••••••••'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {msg && (
                  <div
                    className={
                      msgType === 'error'
                        ? 'text-red-600 text-sm'
                        : msgType === 'success'
                        ? 'text-green-600 text-sm'
                        : 'text-gray-600 text-sm'
                    }
                  >
                    {msg}
                  </div>
                )}

                <Button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Please wait…' : 'Sign Up'}
                </Button>
              </form>
            </Form>

            <div className='my-6 flex items-center'>
              <div className='flex-grow border-t border-gray-200' />
              <span className='mx-2 text-gray-400 text-xs'>OR</span>
              <div className='flex-grow border-t border-gray-200' />
            </div>

            <GoogleLogin
              onSuccess={credentialResponse => {
                handleLogin(credentialResponse)
              }}
              onError={() => {
                setMsg('Google sign-in failed. Please try again.')
                setMsgType('error')
              }}
              width='100%'
            />

            <p className='mt-6 text-center text-sm text-gray-500'>
              Already have an account?{' '}
              <a
                href='/signin'
                className='text-indigo-600 hover:underline font-medium'
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
