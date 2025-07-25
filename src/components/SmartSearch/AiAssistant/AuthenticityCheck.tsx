import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge, Camera, Check, Shield, Upload } from 'lucide-react'
import React from 'react'

type AuthCheck = {
  name: string
  status: 'pass' | 'warning' | 'fail'
  message: string
}

type AuthResult = {
  overallScore: number
  productAuthenticity: 'genuine' | 'fake' | 'unknown'
  sellerReputation: 'good' | 'average' | 'bad'
  checks: AuthCheck[]
}

const AuthenticityCheck = ({
  authResult,
  authUrl,
  setAuthUrl,
  checkAuthenticity,
  isChecking
}: {
  isChecking: boolean
  authResult: AuthResult
  authUrl: string
  setAuthUrl: (url: string) => void
  checkAuthenticity: () => {}
}) => {
  return (
    <div className='space-y-6'>
      <Card className='border-border bg-card'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2 text-foreground'>
            <Shield className='h-5 w-5' />
            <span>Product & Seller Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='auth-url' className='text-foreground'>
              Product URL
            </Label>
            <Input
              id='auth-url'
              placeholder='Paste product URL to analyze authenticity...'
              value={authUrl}
              onChange={e => setAuthUrl(e.target.value)}
              className='bg-background border-border text-foreground'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-foreground'>
              Upload Product Images (Optional)
            </Label>
            <div className='flex space-x-2'>
              <Button variant='outline' size='sm'>
                <Camera className='h-4 w-4 mr-2' />
                Take Photo
              </Button>
              <Button variant='outline' size='sm'>
                <Upload className='h-4 w-4 mr-2' />
                Upload Images
              </Button>
            </div>
          </div>

          <Button
            onClick={checkAuthenticity}
            className='w-full'
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <Shield className='h-4 w-4 mr-2 animate-spin' />
                Analyzing authenticity...
              </>
            ) : (
              <>
                <Shield className='h-4 w-4 mr-2' />
                Check Authenticity
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {authResult && (
        <Card className='border-border bg-card'>
          <CardContent className='p-6'>
            <div className='text-center space-y-4'>
              <div className='flex items-center justify-center space-x-4'>
                <div className='text-4xl font-bold text-primary'>
                  {authResult.overallScore}/100
                </div>
                <Shield className='h-12 w-12 text-primary' />
              </div>

              <div className='space-y-2'>
                <Badge className='text-lg px-4 py-2 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'>
                  Product appears {authResult.productAuthenticity.toUpperCase()}
                </Badge>

                <div className='text-lg font-semibold text-blue-600 dark:text-blue-400'>
                  Seller reputation: {authResult.sellerReputation.toUpperCase()}
                </div>
              </div>

              <div className='space-y-3 mt-6'>
                {authResult.checks.map((check: any, index: number) => (
                  <div
                    key={index}
                    className='flex items-start space-x-3 p-3 bg-secondary/30 dark:bg-secondary/50 rounded-lg'
                  >
                    <Check className='h-5 w-5 text-green-600 dark:text-green-400' />
                    <div className='flex-1'>
                      <div className='font-medium text-foreground'>
                        {check.name}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {check.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AuthenticityCheck
