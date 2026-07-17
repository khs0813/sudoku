(() => {
  const toast = document.querySelector('[data-toast]');
  let toastTimer;
  window.showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }

  let deferredPrompt = null;
  const installButtons = [...document.querySelectorAll('[data-install]')];
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButtons.forEach((button) => button.hidden = false);
  });
  installButtons.forEach((button) => button.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installButtons.forEach((item) => item.hidden = true);
  }));
  window.addEventListener('appinstalled', () => installButtons.forEach((button) => button.hidden = true));
})();
