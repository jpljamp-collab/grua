const CACHE='innovare-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});

self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // Recibe imagenes compartidas desde WhatsApp (solo Android)
  if(e.request.method==='POST' && url.pathname.endsWith('/share-handler')){
    e.respondWith((async()=>{
      try{
        const form=await e.request.formData();
        const files=form.getAll('image');
        const cache=await caches.open(CACHE);
        let i=0;
        for(const f of files){
          await cache.put('shared-'+i, new Response(f,{headers:{'Content-Type':f.type||'image/jpeg'}}));
          i++;
        }
        await cache.put('shared-count', new Response(String(i)));
      }catch(err){}
      return Response.redirect('./index.html?shared=1',303);
    })());
  }
});
