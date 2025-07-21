import React from 'react'
import { useForm } from 'react-hook-form'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
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

const SignInPage = () => {
  const form = useForm()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-indigo-100 flex flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <div className="relative bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md overflow-hidden">
          {/* Animated background blobs */}
          <div className="absolute -top-16 -left-16 w-60 h-60 bg-gradient-to-br from-indigo-400 via-pink-300 to-yellow-200 opacity-20 blur-2xl rounded-full z-0" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tr from-yellow-300 via-pink-200 to-purple-300 opacity-20 blur-2xl rounded-full z-0" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent drop-shadow">
              Sign In to FetchKart
            </h2>
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="your username" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                >
                  Sign In
                </Button>
              </form>
            </Form>
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-2 text-gray-400 text-xs">OR</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>
            <GoogleLogin
              onSuccess={credentialResponse => {
                const credentialResponseDecoded = jwtDecode(
                  credentialResponse.credential as string
                )
                console.log(credentialResponseDecoded)
              }}
              onError={() => {
                console.log('Login Failed')
              }}
              width="100%"
            />
            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <a
                href="/signup"
                className="text-indigo-600 hover:underline font-medium"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage