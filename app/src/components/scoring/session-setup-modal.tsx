'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useScoring } from '@/context/scoring-context'
import { validateGroundName, validateShooterName } from '@/lib/utils'

interface SessionSetupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SessionSetupModal({ isOpen, onClose }: SessionSetupModalProps) {
  const [groundName, setGroundName] = useState('')
  const [shooterName, setShooterName] = useState('')
  const [errors, setErrors] = useState<{ ground?: string; shooter?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { startNewSession } = useScoring()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    const groundError = validateGroundName(groundName)
    const shooterError = validateShooterName(shooterName)
    
    if (groundError || shooterError) {
      setErrors({
        ground: groundError || undefined,
        shooter: shooterError || undefined,
      })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Start new session
      startNewSession({
        groundName: groundName.trim(),
        shooterName: shooterName.trim(),
      })
      
      // Close modal
      onClose()
      
      // TODO: Navigate to position setup
      console.log('Session started, navigate to position setup')
    } catch (error) {
      console.error('Failed to start session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setGroundName('')
    setShooterName('')
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="card-primary">
        <CardHeader>
          <CardTitle className="text-clay-text-primary">Start New Session</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Shooting Ground Input */}
            <div className="space-y-2">
              <label 
                htmlFor="groundName" 
                className="text-sm font-medium text-clay-text-secondary"
              >
                Shooting Ground
              </label>
              <input
                id="groundName"
                type="text"
                value={groundName}
                onChange={(e) => setGroundName(e.target.value)}
                placeholder="e.g., Bisley Shooting Ground"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-clay-accent focus:border-clay-accent ${
                  errors.ground ? 'border-red-500' : 'border-clay-border'
                }`}
                autoComplete="organization"
              />
              {errors.ground && (
                <p className="text-sm text-red-600">{errors.ground}</p>
              )}
            </div>

            {/* Shooter Name Input */}
            <div className="space-y-2">
              <label 
                htmlFor="shooterName" 
                className="text-sm font-medium text-clay-text-secondary"
              >
                Shooter Name
              </label>
              <input
                id="shooterName"
                type="text"
                value={shooterName}
                onChange={(e) => setShooterName(e.target.value)}
                placeholder="e.g., John Doe"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-clay-accent focus:border-clay-accent ${
                  errors.shooter ? 'border-red-500' : 'border-clay-border'
                }`}
                autoComplete="name"
              />
              {errors.shooter && (
                <p className="text-sm text-red-600">{errors.shooter}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                type="submit"
                loading={isLoading}
                className="font-semibold"
              >
                Start
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}