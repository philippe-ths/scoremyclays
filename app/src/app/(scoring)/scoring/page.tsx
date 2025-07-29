'use client'

import { useState } from 'react'

import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ScoringData {
  currentStand: number
  totalStands: number
  currentPair: number
  totalPairs: number
  hits: number
  misses: number
  noBirds: number
  standScores: number[]
  currentStandHits: number
}

export default function ScoringPage() {
  const [scoring, setScoring] = useState<ScoringData>({
    currentStand: 1,
    totalStands: 10,
    currentPair: 1,
    totalPairs: 5,
    hits: 0,
    misses: 0,
    noBirds: 0,
    standScores: [],
    currentStandHits: 0
  })

  const [lastAction, setLastAction] = useState<'hit' | 'miss' | 'no-bird' | null>(null)

  const handleScore = (result: 'hit' | 'miss' | 'no-bird') => {
    setLastAction(result)
    
    setScoring(prev => {
      const newScoring = { ...prev }
      
      if (result === 'hit') {
        newScoring.hits += 1
        newScoring.currentStandHits += 1
      } else if (result === 'miss') {
        newScoring.misses += 1
      } else {
        newScoring.noBirds += 1
      }

      // Check if we need to move to next pair/stand
      const totalShots = newScoring.hits + newScoring.misses + newScoring.noBirds
      const shotsPerPair = 2
      const shotsPerStand = shotsPerPair * newScoring.totalPairs

      if (totalShots % shotsPerPair === 0) {
        // Completed a pair
        if (newScoring.currentPair < newScoring.totalPairs) {
          newScoring.currentPair += 1
        } else if (newScoring.currentStand < newScoring.totalStands) {
          // Move to next stand
          newScoring.standScores.push(newScoring.currentStandHits)
          newScoring.currentStand += 1
          newScoring.currentPair = 1
          newScoring.currentStandHits = 0
        }
      }

      return newScoring
    })

    // Clear the last action after animation
    setTimeout(() => setLastAction(null), 300)
  }

  const undoLastShot = () => {
    // Simple undo - would need more sophisticated logic for production
    setScoring(prev => {
      if (prev.hits + prev.misses + prev.noBirds === 0) return prev
      
      const newScoring = { ...prev }
      if (prev.hits > 0) {
        newScoring.hits -= 1
        newScoring.currentStandHits = Math.max(0, newScoring.currentStandHits - 1)
      } else if (prev.misses > 0) {
        newScoring.misses -= 1
      } else if (prev.noBirds > 0) {
        newScoring.noBirds -= 1
      }
      
      return newScoring
    })
  }

  const totalScore = scoring.hits
  const totalShots = scoring.hits + scoring.misses + scoring.noBirds
  const percentage = totalShots > 0 ? Math.round((scoring.hits / totalShots) * 100) : 0

  return (
    <div className="min-h-screen bg-clay-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Score Overview Card */}
        <Card className="card-primary p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-clay-primary">{totalScore}</div>
              <div className="text-sm text-clay-text-secondary">Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-clay-accent">{percentage}%</div>
              <div className="text-sm text-clay-text-secondary">Hit Rate</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="font-semibold text-green-600">{scoring.hits}</div>
              <div className="text-clay-text-secondary">Hits</div>
            </div>
            <div>
              <div className="font-semibold text-red-600">{scoring.misses}</div>
              <div className="text-clay-text-secondary">Misses</div>
            </div>
            <div>
              <div className="font-semibold text-orange-600">{scoring.noBirds}</div>
              <div className="text-clay-text-secondary">No Birds</div>
            </div>
          </div>
        </Card>

        {/* Stand Progress */}
        <Card className="card-secondary p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-clay-text-primary">
              Stand {scoring.currentStand} of {scoring.totalStands}
            </h3>
            <span className="text-sm text-clay-text-secondary">
              Pair {scoring.currentPair} of {scoring.totalPairs}
            </span>
          </div>
          
          <div className="w-full bg-clay-surface rounded-full h-2">
            <div 
              className="bg-clay-accent h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((scoring.currentStand - 1) / scoring.totalStands + 
                         (scoring.currentPair - 1) / (scoring.totalPairs * scoring.totalStands)) * 100}%` 
              }}
            />
          </div>
        </Card>

        {/* Scoring Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="hit"
              size="touch-lg"
              onClick={() => handleScore('hit')}
              className={`w-full h-24 text-2xl font-bold ${
                lastAction === 'hit' ? 'animate-pulse' : ''
              }`}
            >
              HIT
            </Button>
            
            <Button
              variant="miss"
              size="touch-lg"
              onClick={() => handleScore('miss')}
              className={`w-full h-24 text-2xl font-bold ${
                lastAction === 'miss' ? 'animate-pulse' : ''
              }`}
            >
              MISS
            </Button>
            
            <Button
              variant="no-bird"
              size="touch-lg"
              onClick={() => handleScore('no-bird')}
              className={`w-full h-24 text-2xl font-bold ${
                lastAction === 'no-bird' ? 'animate-pulse' : ''
              }`}
            >
              NO BIRD
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              variant="outline"
              size="touch"
              onClick={undoLastShot}
              disabled={totalShots === 0}
              className="font-semibold"
            >
              UNDO
            </Button>
            
            <Button
              variant="secondary"
              size="touch"
              onClick={() => {
                // TODO: Implement pause/save functionality
                console.log('Pause round')
              }}
              className="font-semibold"
            >
              PAUSE
            </Button>
          </div>
        </div>

        {/* Stand History */}
        {scoring.standScores.length > 0 && (
          <Card className="card-secondary p-4">
            <h3 className="font-semibold text-clay-text-primary mb-3">Stand History</h3>
            <div className="grid grid-cols-5 gap-2">
              {scoring.standScores.map((score, index) => (
                <div key={index} className="text-center">
                  <div className="bg-clay-surface rounded-lg p-2">
                    <div className="font-bold text-clay-primary">{score}</div>
                    <div className="text-xs text-clay-text-secondary">Stand {index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}