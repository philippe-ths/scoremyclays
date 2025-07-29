import { Header } from '@/components/layout/header';

export default function ProfilePage() {
  return (
    <div className='min-h-screen bg-clay-bg'>
      <Header />

      <main className='container mx-auto px-4 py-6 space-y-6'>
        <h1 className='text-2xl font-bold text-clay-text-primary mb-6'>
          Profile
        </h1>

        {/* User Profile */}
        <div className='bg-white rounded-lg p-6 shadow-sm'>
          <div className='flex items-center space-x-4 mb-4'>
            <div className='w-16 h-16 bg-clay-primary rounded-full flex items-center justify-center'>
              <span className='text-white text-xl font-bold'>🎯</span>
            </div>
            <div>
              <h2 className='text-lg font-semibold text-clay-text-primary'>
                Clay Shooter
              </h2>
              <p className='text-clay-text-secondary'>Sporting Clays Enthusiast</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className='bg-white rounded-lg p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-clay-text-primary mb-4'>
            Preferences
          </h2>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='text-clay-text-secondary'>Offline Mode</span>
              <div className='w-12 h-6 bg-clay-accent rounded-full relative'>
                <div className='w-4 h-4 bg-white rounded-full absolute top-1 right-1'></div>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-clay-text-secondary'>Sound Effects</span>
              <div className='w-12 h-6 bg-gray-300 rounded-full relative'>
                <div className='w-4 h-4 bg-white rounded-full absolute top-1 left-1'></div>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-clay-text-secondary'>Auto-sync Sessions</span>
              <div className='w-12 h-6 bg-clay-accent rounded-full relative'>
                <div className='w-4 h-4 bg-white rounded-full absolute top-1 right-1'></div>
              </div>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className='bg-white rounded-lg p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-clay-text-primary mb-4'>
            App Information
          </h2>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-clay-text-secondary'>Version:</span>
              <span className='font-semibold'>1.0.0</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-clay-text-secondary'>Last Sync:</span>
              <span className='font-semibold'>Never</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-clay-text-secondary'>Storage Used:</span>
              <span className='font-semibold'>0 KB</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='bg-white rounded-lg p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-clay-text-primary mb-4'>
            Actions
          </h2>
          <div className='space-y-3'>
            <button className='w-full text-left py-3 px-4 rounded-lg bg-gray-50 text-clay-text-secondary hover:bg-gray-100 transition-colors'>
              Export Session Data
            </button>
            <button className='w-full text-left py-3 px-4 rounded-lg bg-gray-50 text-clay-text-secondary hover:bg-gray-100 transition-colors'>
              Clear Local Storage
            </button>
            <button className='w-full text-left py-3 px-4 rounded-lg bg-gray-50 text-clay-text-secondary hover:bg-gray-100 transition-colors'>
              About ScoreMyClays
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 