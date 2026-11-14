/* Progressive Erweiterung: Installationsangebot und Offline-Service-Worker. */
(function (global) {
  'use strict';
  const PSE = global.PSE;
  let installPrompt = null;

  PSE.PWA = {
    init() {
      const installButton = document.getElementById('install-app');
      global.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        installPrompt = event;
        installButton.hidden = false;
      });
      installButton.addEventListener('click', async () => {
        if (!installPrompt) return;
        const prompt = installPrompt;
        installPrompt = null;
        installButton.hidden = true;
        await prompt.prompt();
      });
      global.addEventListener('appinstalled', () => {
        installPrompt = null;
        installButton.hidden = true;
      });
      // file:// bleibt ohne Server lauffähig, ist aber kein Service-Worker-Ursprung.
      if ('serviceWorker' in navigator && /^(https?:)$/.test(global.location.protocol)) {
        global.addEventListener('load', () => {
          navigator.serviceWorker.register('./service-worker.js').catch(error => {
            console.warn('Offline-Installation nicht verfügbar:', error);
          });
        });
      }
    }
  };
})(window);
