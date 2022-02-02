const staticCacheName = 'site-static';
const assets = [
    './index.html',
    './',
    './main.js',
    './style.css',
    './images/trainworld-logo.jpg',
    './images/TrainWorld_512.png',
    './images/home_images/affiche.jpg',
    './images/home_images/floor_plan.jpg',
    './images/home_images/phoneexample.png',
    './images/home_images/uniform.jpg',
    'https://use.typekit.net/ftc8abr.css',
    './videos/Guido.mp4'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(staticCacheName)
        .then(cache => {
            for (let asset of assets) {
                cache.add(asset);
            }
        })
    );
});

self.addEventListener('activate', e => {});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
        .then(cacheRes => {
            return cacheRes || fetch(e.request);
        })
    )
})