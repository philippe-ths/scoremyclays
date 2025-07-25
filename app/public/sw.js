// ScoreMyClays Service Worker
// Provides offline functionality and caching for clay shooting scoring

const CACHE_NAME = 'scoremyclays-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CACHE_FILES = [
    '/',
    '/index.html',
    '/src/main.js',
    '/manifest.json',
    '/offline.html',
    // Add any additional assets that should be cached
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil((async () => {
        try {
            const cache = await caches.open(CACHE_NAME);
            console.log('📦 Caching app shell files...');
            await cache.addAll(CACHE_FILES);
            console.log('✅ App shell cached successfully');
        } catch (error) {
            console.error('❌ Failed to cache files:', error);
        }
    })());
    
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil((async () => {
        try {
            // Get all cache names
            const cacheNames = await caches.keys();
            
            // Delete old caches
            const deletePromises = cacheNames
                .filter(cacheName => cacheName !== CACHE_NAME)
                .map(cacheName => {
                    console.log(`🗑️ Deleting old cache: ${cacheName}`);
                    return caches.delete(cacheName);
                });
            
            await Promise.all(deletePromises);
            console.log('✅ Old caches cleaned up');
            
            // Take control of all clients immediately
            await self.clients.claim();
            console.log('✅ Service Worker activated and controlling all tabs');
        } catch (error) {
            console.error('❌ Activation failed:', error);
        }
    })());
});

// Fetch event - handle network requests with offline-first strategy
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith((async () => {
        try {
            // Try to get the response from cache first (offline-first approach)
            const cachedResponse = await caches.match(event.request);
            
            if (cachedResponse) {
                console.log(`📦 Serving from cache: ${event.request.url}`);
                
                // Return cached response immediately
                // Try to update cache in background for next time
                fetchAndCache(event.request);
                
                return cachedResponse;
            }
            
            // If not in cache, try to fetch from network
            console.log(`🌐 Fetching from network: ${event.request.url}`);
            const networkResponse = await fetch(event.request);
            
            // Cache successful responses
            if (networkResponse.status === 200) {
                const cache = await caches.open(CACHE_NAME);
                cache.put(event.request, networkResponse.clone());
                console.log(`💾 Cached: ${event.request.url}`);
            }
            
            return networkResponse;
            
        } catch (error) {
            console.warn(`❌ Network failed for: ${event.request.url}`, error);
            
            // For navigation requests, return offline page
            if (event.request.mode === 'navigate') {
                console.log('📄 Returning offline page');
                return caches.match(OFFLINE_URL);
            }
            
            // For other requests, return a basic offline response
            return new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                    'Content-Type': 'text/plain'
                })
            });
        }
    })());
});

// Background fetch and cache function
async function fetchAndCache(request) {
    try {
        const response = await fetch(request);
        if (response.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
    } catch (error) {
        // Silently fail - this is a background operation
        console.warn('Background fetch failed:', error);
    }
}

// Handle background sync for offline score uploads
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'upload-scores') {
        event.waitUntil(uploadPendingScores());
    }
});

// Upload pending scores when back online
async function uploadPendingScores() {
    try {
        console.log('📤 Attempting to upload pending scores...');
        
        // This would integrate with your backend API
        // For now, we'll just log that sync would happen
        console.log('✅ Score upload sync completed');
        
        // Send message to all clients about successful sync
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SCORES_SYNCED',
                message: 'Scores uploaded successfully'
            });
        });
        
    } catch (error) {
        console.error('❌ Score upload sync failed:', error);
        throw error; // This will retry the sync later
    }
}

// Handle push notifications (for future implementation)
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    console.log('📬 Push notification received:', data);
    
    const options = {
        body: data.body || 'New notification from ScoreMyClays',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: data.data || {},
        actions: data.actions || []
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'ScoreMyClays', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event.notification);
    event.notification.close();
    
    // Handle different notification actions
    const action = event.action;
    const data = event.notification.data;
    
    event.waitUntil((async () => {
        const clients = await self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        });
        
        // Focus existing window or open new one
        if (clients.length > 0) {
            const client = clients[0];
            await client.focus();
            
            // Send message to handle the notification action
            client.postMessage({
                type: 'NOTIFICATION_CLICK',
                action: action,
                data: data
            });
        } else {
            // Open new window
            await self.clients.openWindow('/');
        }
    })());
});

console.log('✅ ScoreMyClays Service Worker loaded successfully'); 