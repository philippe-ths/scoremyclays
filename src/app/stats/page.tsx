import { Header } from '@/components/layout/header';

export default function StatsPage() {
  return (
    <div className='min-h-screen bg-clay-bg'>
      <Header />

      <main className='container mx-auto px-4 py-6 space-y-6'>
        <h1 className='text-2xl font-bold text-clay-text-primary mb-6'>
          Your Stats
        </h1>

        {/* Overall Statistics */}
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <div className='text-2xl font-bold text-clay-primary'>0</div>
            <div className='text-sm text-clay-text-secondary'>Total Sessions</div>
          </div>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <div className='text-2xl font-bold text-clay-accent'>0%</div>
            <div className='text-sm text-clay-text-secondary'>Average Hit Rate</div>
          </div>
        </div>

        {/* Recent Performance */}
        <div className='bg-white rounded-lg p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-clay-text-primary mb-4'>
            Recent Performance
          </h2>
          <div className='text-center py-8 text-clay-text-secondary'>
            <p>No shooting sessions recorded yet.</p>
            <p className='text-sm mt-2'>Start your first session to see statistics here!</p>
          </div>
        </div>

        {/* Personal Bests */}
        <div className='bg-white rounded-lg p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-clay-text-primary mb-4'>
            Personal Bests
          </h2>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-clay-text-secondary'>Best Single Session:</span>
              <span className='font-semibold'>-/100</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-clay-text-secondary'>Best Hit Rate:</span>
              <span className='font-semibold'>-%</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-clay-text-secondary'>Longest Streak:</span>
              <span className='font-semibold'>- hits</span>
            </div>
          </div>
        </div>

        {/* Shooting Grounds */}
        <div className='bg-white rounded-lg p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-clay-text-primary mb-4'>
            Shooting Grounds Visited
          </h2>
          <div className='text-center py-4 text-clay-text-secondary'>
            <p>No grounds visited yet.</p>
          </div>
        </div>
      </main>
    </div>
  );
} 