// Service Worker for cookie consent and analytics
const CACHE_NAME = 'vitals-docs-v1';
const CONSENT_STORAGE_KEY = 'vitals-cookie-consent';

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/vitals/',
        '/vitals/index.html',
        '/vitals/icon.png',
        '/vitals/icon-light.png',
        '/vitals/icon-dark.png'
      ]).catch(err => {
        console.log('Cache failed for some resources:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      });
    })
  );
});

// Message event - handle consent tracking
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRACK_EVENT') {
    const { eventName, properties, hasConsent } = event.data;
    
    if (!hasConsent) {
      console.log('Analytics blocked - no consent');
      return;
    }
    
    // Track the event (send to analytics endpoint)
    trackAnalytics(eventName, properties);
  }
  
  if (event.data && event.data.type === 'UPDATE_CONSENT') {
    const { consent } = event.data;
    console.log('Cookie consent updated:', consent);
    
    // Store consent status
    event.ports[0].postMessage({ success: true });
  }
});

// Analytics tracking function
async function trackAnalytics(eventName, properties) {
  try {
    // In production, send to your analytics endpoint
    const analyticsData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...properties
    };
    
    console.log('Analytics event:', analyticsData);
    
    // Example: Send to your backend
    // await fetch('https://your-api.com/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(analyticsData)
    // });
  } catch (error) {
    console.error('Failed to track analytics:', error);
  }
}

// Track page views
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    // Page view - only track if consent given
    const url = new URL(event.request.url);
    
    // Post message to clients about page view
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'PAGE_VIEW',
            path: url.pathname
          });
        });
      })
    );
  }
});
