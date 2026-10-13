(() => {
  const canvas = document.querySelector('.study-canvas');
  const image = canvas.querySelector('.study-image');
  const description = document.querySelector('.study-description');
  const views = {
    overview: 'Aberta e fechada, a mesma procura de proporção e equilíbrio.',
    handle: 'A curva do cabo procura o lugar da mão. O desenho começa no gesto.',
    blade: 'Na linha da lâmina, cada desbaste há de aproximar a forma do seu propósito.'
  };
  document.querySelectorAll('[data-study-view]').forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.studyView;
      canvas.dataset.view = view;
      if (view !== 'overview') {
        image.removeAttribute('srcset');
        image.src = '/assets/illustrations/cnvt-0-estudo.jpg';
      }
      document.querySelectorAll('[data-study-view]').forEach(item => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      description.textContent = views[view];
    });
  });

  const dialog = document.querySelector('.study-dialog');
  const trigger = document.querySelector('.study-open');
  const imageWrap = dialog.querySelector('.dialog-image-wrap');
  const fullImage = imageWrap.querySelector('img');
  const zoom = dialog.querySelector('.dialog-zoom');
  let previousOverflow;

  trigger.addEventListener('click', () => {
    previousOverflow = document.body.style.overflow;
    fullImage.src = fullImage.dataset.fullSrc;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    imageWrap.classList.remove('is-zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.innerHTML = 'Ver à escala original <span aria-hidden="true">＋</span>';
    imageWrap.scrollTo(0, 0);
    trigger.focus({ preventScroll: true });
  });
  zoom.addEventListener('click', () => {
    const zoomed = imageWrap.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(zoomed));
    zoom.innerHTML = zoomed ? 'Ajustar à janela <span aria-hidden="true">−</span>' : 'Ver à escala original <span aria-hidden="true">＋</span>';
    imageWrap.scrollTo(0, 0);
  });
})();
