import { Header } from '@/components/layout/header';
import { SessionHistory } from '@/components/scoring/session-history';

export default function HistoryPage() {
  return (
    <div className='min-h-screen bg-clay-bg'>
      <Header />

      <main className='container mx-auto px-4 py-6 space-y-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-clay-text-primary'>
            Session History
          </h1>
        </div>

        {/* Session History Component */}
        <SessionHistory />

        {/* Tips for new users */}
        <div className='bg-white rounded-lg p-6 shadow-sm mt-6'>
          <h2 className='text-lg font-semibold text-clay-text-primary mb-3'>
            💡 Pro Tips
          </h2>
          <ul className='space-y-2 text-clay-text-secondary text-sm'>
            <li>• Your sessions are automatically saved locally on your device</li>
            <li>• Use offline mode to track scores without internet connection</li>
            <li>• Review past sessions to identify improvement areas</li>
            <li>• Sessions sync when you&apos;re back online</li>
          </ul>
        </div>
      </main>
    </div>
  );
} 