import React, { ReactElement } from 'react'
import { render, RenderOptions, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScoringProvider } from '@/context/scoring-context'
import type { Session } from '@/types'

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withScoring?: boolean
  initialScoringState?: {
    currentSession?: Session | null
    currentPosition?: number
    currentTarget?: number
    isScoring?: boolean
  }
}

const AllTheProviders = ({ 
  children, 
  withScoring = false,
  initialScoringState = {}
}: {
  children: React.ReactNode
  withScoring?: boolean
  initialScoringState?: CustomRenderOptions['initialScoringState']
}) => {
  if (withScoring) {
    return (
      <ScoringProvider>
        {children}
      </ScoringProvider>
    )
  }

  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { withScoring, initialScoringState, ...renderOptions } = options
  
  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders 
        {...props} 
        withScoring={withScoring}
        initialScoringState={initialScoringState}
      />
    ),
    ...renderOptions,
  })
}

// Clay shooting specific test helpers
export const clayShootingHelpers = {
  // Simulate rapid scoring sequence
  async simulateRapidScoring(
    hitButton: HTMLElement,
    missButton: HTMLElement,
    sequence: ('hit' | 'miss')[]
  ) {
    const user = userEvent.setup()
    
    for (const result of sequence) {
      if (result === 'hit') {
        await user.click(hitButton)
      } else {
        await user.click(missButton)
      }
      // Small delay to simulate real-world usage
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  },

  // Create mock session data
  createMockSession(overrides: Partial<Session> = {}): Session {
    return {
      id: 'test-session',
      groundName: 'Test Ground',
      shooterName: 'Test Shooter',
      date: new Date('2024-01-01'),
      positions: [],
      isComplete: false,
      totalScore: 0,
      percentage: 0,
      ...overrides,
    }
  },

  // Simulate complete 25-target round
  async simulateComplete25TargetRound(
    hitButton: HTMLElement,
    missButton: HTMLElement,
    hitCount: number = 20
  ) {
    const user = userEvent.setup()
    const missCount = 25 - hitCount
    
    // Create a realistic shooting pattern
    const sequence: ('hit' | 'miss')[] = []
    
    // Distribute hits and misses randomly but realistically
    for (let i = 0; i < 25; i++) {
      if (sequence.filter(s => s === 'hit').length < hitCount) {
        sequence.push(Math.random() > 0.3 ? 'hit' : 'miss')
      } else {
        sequence.push('miss')
      }
    }
    
    // Ensure exact hit count
    while (sequence.filter(s => s === 'hit').length !== hitCount) {
      const missIndex = sequence.findIndex(s => s === 'miss')
      const hitIndex = sequence.findIndex(s => s === 'hit')
      
      if (sequence.filter(s => s === 'hit').length < hitCount && missIndex !== -1) {
        sequence[missIndex] = 'hit'
      } else if (sequence.filter(s => s === 'hit').length > hitCount && hitIndex !== -1) {
        sequence[hitIndex] = 'miss'
      }
    }
    
    await this.simulateRapidScoring(hitButton, missButton, sequence)
  },

  // Wait for scoring animations to complete
  async waitForScoringUpdate() {
    // Wait for state updates and any animations
    await new Promise(resolve => setTimeout(resolve, 100))
  },

  // Assertions for clay shooting specific scenarios
  expectScoreDisplay(expectedScore: number, expectedTotal: number = 25) {
    const scoreDisplay = screen.getByTestId(/score-display|current-score/i)
    expect(scoreDisplay).toHaveTextContent(`${expectedScore}/${expectedTotal}`)
  },

  expectPercentageDisplay(expectedPercentage: number) {
    const percentageDisplay = screen.getByTestId(/percentage|score-percentage/i)
    expect(percentageDisplay).toHaveTextContent(`${expectedPercentage}%`)
  },
}

// Re-export everything
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { customRender as render }
export { clayShootingHelpers }