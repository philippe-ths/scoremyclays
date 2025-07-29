import { Header } from '@/components/layout/header';
import { NewSessionButton } from '@/components/scoring/new-session-button';
import { SessionHistory } from '@/components/scoring/session-history';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <main className='container mx-auto px-4 py-6 space-y-6'>
        {/* App Title and Description */}
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold text-gray-900'>ScoreMyClays</h1>
          <p className='text-gray-600'>
            Track your sporting clays scores offline and online
          </p>
        </div>

        {/* New Session Button */}
        <div className='flex justify-center'>
          <NewSessionButton />
        </div>

        {/* Session History */}
        <SessionHistory />
      </main>
    </div>
  );
}
