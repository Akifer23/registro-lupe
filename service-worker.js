const nombreCache = "Sarita-v4";
const archivosCache = [
  "JS/app.js"
];

self.addEventListener('install', e => {
    console.log("El SW se instaló", e);
    e.waitUntil(
        caches.open(nombreCache)
        .then((cache) => {
            console.log("Cacheando archivos estáticos");
            return cache.addAll(archivosCache);
        })
        .catch(error => {
            console.error('Error durante la instalación del caché:', error);
        })
    );
});

self.addEventListener('fetch', e => {
    console.log("Fetch...", e);
    const url = new URL(e.request.url);

    // Excluir CSS y JS del caché
    if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')|| url.pathname.endsWith('html')) {
        // Siempre cargar desde la red y no almacenar en caché
        e.respondWith(fetch(e.request));
    } else {
        // Para otros recursos, usar la estrategia de caché primero
        e.respondWith(
            caches.match(e.request)
            .then(respuestaCache => {
                return respuestaCache || fetch(e.request)
                    .then(respuestaRed => {
                        return caches.open(nombreCache)
                            .then(cache => {
                                cache.put(e.request, respuestaRed.clone());
                                return respuestaRed;
                            });
                    })
                    .catch(error => {
                        console.error('Error al intentar recuperar el recurso:', error);
                    });
            })
        );
    }
});

self.addEventListener('activate', e => {
    console.log("El SW está activo", e);
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.map(key => {
                if (key !== nombreCache) {
                    return caches.delete(key);
                }
            }));
        })
    );
});