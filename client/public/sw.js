const CACHE_NAME = 'pdf-editor-pro-v1.0.0';
const STATIC_CACHE = 'pdf-editor-static-v1';
const DYNAMIC_CACHE = 'pdf-editor-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/favicon.ico'
];

// API endpoints to cache dynamically
const API_CACHE_PATTERNS = [
  /\/api\/pdf\/.*\/info/,
  /\/api\/pdf\/.*\/preview/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching static files');
      return cache.addAll(STATIC_FILES);
    }).catch((error) => {
      console.error('Service Worker: Cache failed', error);
    })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Ensure the service worker takes control immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests
  if (request.method !== 'GET') {
    // Don't cache non-GET requests
    return;
  }
  
  event.respondWith(
    handleRequest(request, url)
  );
});

async function handleRequest(request, url) {
  // Check if it's an API request
  if (url.pathname.startsWith('/api/')) {
    return handleApiRequest(request, url);
  }
  
  // Handle static assets
  if (isStaticAsset(url.pathname)) {
    return handleStaticAsset(request);
  }
  
  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    return handleNavigation(request);
  }
  
  // Default: try cache first, then network
  return cacheFirst(request);
}

async function handleApiRequest(request, url) {
  // For PDF info and preview, use cache-first strategy
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return cacheFirst(request, DYNAMIC_CACHE);
  }
  
  // For other API requests, use network-first
  return networkFirst(request, DYNAMIC_CACHE);
}

async function handleStaticAsset(request) {
  // Static assets: cache-first strategy
  return cacheFirst(request, STATIC_CACHE);
}

async function handleNavigation(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If nothing in cache, return offline page
    return caches.match('/');
  }
}

async function cacheFirst(request, cacheName = STATIC_CACHE) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    throw error;
  }
}

async function networkFirst(request, cacheName = DYNAMIC_CACHE) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/static/') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico')
  );
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'pdf-upload') {
    event.waitUntil(syncPendingUploads());
  }
});

async function syncPendingUploads() {
  // Handle offline PDF uploads when connection is restored
  try {
    const pendingUploads = await getStoredUploads();
    
    for (const upload of pendingUploads) {
      try {
        await retryUpload(upload);
        await removeStoredUpload(upload.id);
      } catch (error) {
        console.error('Failed to sync upload:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications for updates
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'PDF Editor Pro has an update!',
    icon: '/pwa-icon-192.png',
    badge: '/pwa-icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('PDF Editor Pro', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      cacheUrls(event.data.payload)
    );
  }
});

async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  await cache.addAll(urls);
}

// Utility functions for IndexedDB storage
async function getStoredUploads() {
  // In a real implementation, you'd use IndexedDB
  return [];
}

async function removeStoredUpload(id) {
  // Remove from IndexedDB
}

async function retryUpload(upload) {
  // Retry the upload
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: upload.formData
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  return response;
}