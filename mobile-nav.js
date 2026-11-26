(() => {
  'use strict';
  const sidebar = document.getElementById('sidebar');
  const main = document.querySelector('.main-area');
  const toggle = document.getElementById('menuToggle');
  if (!sidebar || !main || !toggle) return;

  const mobile = window.matchMedia('(max-width: 760px)');
  const setOpen = (open, focusMenu = false) => {
    sidebar.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open && mobile.matches);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (open && focusMenu) sidebar.querySelector('.nav-item')?.focus();
    if (!open && focusMenu) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(!sidebar.classList.contains('open'), true));
  main.addEventListener('click', event => {
    // The mobile backdrop is the main area's ::before pseudo-element.
    if (mobile.matches && sidebar.classList.contains('open') && event.target === main) setOpen(false);
  });
  sidebar.addEventListener('click', event => {
    if (mobile.matches && event.target.closest('.nav-item, [data-quote-nav]')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sidebar.classList.contains('open')) setOpen(false, true);
  });
  mobile.addEventListener('change', event => {
    if (!event.matches) setOpen(false);
  });
})();
