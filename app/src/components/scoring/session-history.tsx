'use client'

import { useState, useEffect } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatTime, getRelativeTime , STORAGE_KEYS } from '@/lib/utils'
import { type Session } from '@/types'

export function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setIsLoading(true)
      
      // For MVP, load from localStorage
      // In production, this would query PowerSync
      const cached = localStorage.getItem(STORAGE_KEYS.SESSIONS_CACHE)
      if (cached) {
        const sessions = JSON.parse(cached, (key, value) => {
          if (key === 'date' || key === 'createdAt' || key === 'updatedAt' || key === 'timestamp') {
            return new Date(value)
          }
          return value
        }) as Session[]
        
        // Sort by date descending (newest first)
        sessions.sort((a, b) => b.date.getTime() - a.date.getTime())
        setSessions(sessions)
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const groupSessionsByGround = (sessions: Session[]) => {
    const grouped = sessions.reduce((acc, session) => {
      const groundName = session.groundName
      if (!acc[groundName]) {
        acc[groundName] = []
      }
      acc[groundName].push(session)
      return acc
    }, {} as Record<string, Session[]>)

    return Object.entries(grouped).sort(([, a], [, b]) => {
      // Sort by most recent session in each group
      const latestA = Math.max(...a.map(s => s.date.getTime()))
      const latestB = Math.max(...b.map(s => s.date.getTime()))
      return latestB - latestA
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Session History</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="w-12 h-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
        <p className="text-gray-500 mb-4">Start your first scoring session to see it here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-clay-primary">Session History</h2>
      <div className="space-y-3">
        {sessions.map((session) => {
          // Calculate hits and misses from session data
          const totalHits = session.totalScore || 0
          const totalShots = session.totalTargets || 0
          const totalMisses = totalShots - totalHits
          const percentage = totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0
          
          return (
            <Card key={session.id} className="card-primary">
              <CardHeader>
                <CardTitle className="text-clay-text-primary">{session.groundName}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between text-sm text-clay-text-secondary">
                  <span>{formatDate(session.date)}</span>
                  <span>{getRelativeTime(session.date)}</span>
                </div>
                <div className="mt-2 text-clay-text-primary">
                  <span className="font-bold">{totalHits}</span> hits, <span className="font-bold">{totalMisses}</span> misses
                  <span className="ml-2 text-clay-accent">({percentage}%)</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

interface SessionCardProps {
  session: Session
}

function SessionCard({ session }: SessionCardProps) {
  const handleSessionClick = () => {
    // TODO: Navigate to session detail view
    console.log('View session:', session.id)
  }

  return (
    <Card 
      className="session-card cursor-pointer"
      onClick={handleSessionClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{session.shooterName}</span>
              <span className="text-sm text-muted-foreground">
                • {formatDate(session.date)}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatTime(session.date)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                {session.totalScore}/{session.totalTargets} targets
              </span>
              <span>
                {session.percentage}%
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                session.isComplete 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {session.isComplete ? 'Complete' : 'In Progress'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="score-medium">
              {session.totalScore}
              <span className="text-lg text-muted-foreground">/{session.totalTargets}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {getRelativeTime(session.date)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}