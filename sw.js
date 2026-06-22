const CACHE_NAME = 'apex-tracker-v1';
// هنا نحدد الملفات اللي يحفظها التطبيق في ذاكرة التليفون باش يفتح ديريكت وسريع
const ASSETS = [
  './',
  './index.html'
];

// 1. مرحلة التثبيت (Install)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. مرحلة تشغيل التطبيق وجلب البيانات (Fetch) حتى لو أوفلاين
self.addEventListener('fetch', (e) => {
  // تجاهل طلبات Firebase/Firestore والـ Google APIs — خليهم يمشيو مباشرة بلا كاش
  if (
    e.request.url.includes('firestore.googleapis.com') ||
    e.request.url.includes('googleapis.com') ||
    e.request.url.includes('gstatic.com') ||
    e.request.method !== 'GET'
  ) {
    return; // ما نتدخلش، نخلي الطلب يمشي عادي
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});