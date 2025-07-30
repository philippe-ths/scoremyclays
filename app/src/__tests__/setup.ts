import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Next.js image component
vi.mock('next/image', () => ({
  default: vi.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// MVP Sporting Clays specific test data
export const MOCK_SPORTING_CLAYS_DATA = {
  session: {
    id: 'test-session-1',
    groundName: 'Test Clay Ground',
    shooterName: 'Test Shooter',
    date: new Date('2024-01-01'),
    positions: [],
    isComplete: false,
    totalScore: 0,
    percentage: 0,
    discipline: 'sporting-clays',
    totalPositions: 10,
    targetsPerPosition: 10,
  },
  position: {
    id: 'test-position-1',
    sessionId: 'test-session-1',
    number: 1,
    name: 'High Tower',
    shots: [],
    score: 0,
    isComplete: false,
    totalTargets: 10,
  },
  shot: {
    id: 'test-shot-1',
    positionId: 'test-position-1',
    targetNumber: 1,
    result: 'hit' as const,
    timestamp: new Date('2024-01-01T10:00:00Z'),
  },
  // Helper for generating complete session data
  generateCompleteSession: (hits: number = 78) => ({
    id: 'complete-session-1',
    groundName: 'Test Ground',
    shooterName: 'Test Shooter',
    date: new Date(),
    positions: Array(10)
      .fill(null)
      .map((_, i) => ({
        id: `position-${i + 1}`,
        number: i + 1,
        name: `Position ${i + 1}`,
        shots: Array(10)
          .fill(null)
          .map((_, j) => ({
            id: `shot-${i}-${j}`,
            targetNumber: j + 1,
            result: i * 10 + j < hits ? 'hit' : 'miss',
          })),
        score: Math.min(10, Math.max(0, hits - i * 10)),
        isComplete: true,
        totalTargets: 10,
      })),
    isComplete: true,
    totalScore: hits,
    percentage: Math.round((hits / 100) * 100),
    discipline: 'sporting-clays',
    totalPositions: 10,
    targetsPerPosition: 10,
  }),
} as const;
