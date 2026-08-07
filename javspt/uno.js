document.getElementById("he1").textContent = 'Shiro Kusu';
document.getElementById("p1").textContent ='Denji sumimasen' ;

let deferredPrompt = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('SW registered:', registration.scope);
      },
      (err) => {
        console.log('SW registration failed:', err);
      }
    );
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('install-banner');
  if (banner) banner.style.display = 'block';
});

const dismissBtn = document.getElementById('install-dismiss');
const acceptBtn = document.getElementById('install-accept');
const banner = document.getElementById('install-banner');

if (dismissBtn) {
  dismissBtn.addEventListener('click', () => {
    if (banner) banner.style.display = 'none';
    deferredPrompt = null;
  });
}

if (acceptBtn) {
  acceptBtn.addEventListener('click', async () => {
    if (banner) banner.style.display = 'none';
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('Install prompt outcome:', outcome);
      deferredPrompt = null;
    }
  });
}

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  console.log('App was installed');
});