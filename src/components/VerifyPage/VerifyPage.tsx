import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom' 
import axios from 'axios'

const VerifyPage = () => {
  const { userId, token } = useParams<{ userId: string; token: string }>()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying...')
  const navigate = useNavigate() 

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/verify/${token}`
        )

        setStatus('success')
        setMessage(res.data.message || 'Verification successful!')

        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } catch (error: any) {
        setStatus('error')
        setMessage(
          error.response?.data?.message || 'Something went wrong. Please try again later.'
        )
      }
    }

    if (userId && token) {
      verifyEmail()
    } else {
      setStatus('error')
      setMessage('Invalid URL')
    }
  }, [userId, token, navigate])

  return (
    <div className='flex flex-col items-center justify-center h-screen text-center px-4'>
      {status === 'loading' && <p className='text-gray-600 text-lg'>{message}</p>}
      {status === 'success' && <p className='text-green-600 text-lg'>{message}</p>}
      {status === 'error' && <p className='text-red-600 text-lg'>{message}</p>}
    </div>
  )
}

export default VerifyPage
