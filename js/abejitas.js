/**
 * Abejitas volando alrededor del álbum — sprites pequeños con movimiento aleatorio.
 */
(function () {
  const CANTIDAD = 15;
  const TAMANO = 28;
  const MARGEN = TAMANO;
  const DPR_MAX = 2;

  const canvas = document.getElementById('abejitas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const imgDerecha = new Image();
  const imgIzquierda = new Image();
  imgDerecha.src = 'img/bee.png';
  imgIzquierda.src = 'img/bee_left.png';

  const reduceMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** @type {Array<{ x: number, y: number, vx: number, vy: number, fase: number }>} */
  let abejitas = [];
  let animando = true;
  let imagenesListas = 0;

  function aleatorio(min, max) {
    return min + Math.random() * (max - min);
  }

  function envolver(c, limite) {
    if (c < -MARGEN) return limite + MARGEN;
    if (c > limite + MARGEN) return -MARGEN;
    return c;
  }

  function crearAbejita(ancho, alto) {
    const vx = aleatorio(-0.6, 0.6) || (Math.random() < 0.5 ? -0.35 : 0.35);
    const vy = aleatorio(-0.35, 0.35) || (Math.random() < 0.5 ? -0.2 : 0.2);
    return {
      x: aleatorio(0, ancho),
      y: aleatorio(0, alto),
      vx: reduceMovimiento ? 0 : vx,
      vy: reduceMovimiento ? 0 : vy,
      fase: aleatorio(0, Math.PI * 2),
    };
  }

  function initAbejitas() {
    const w = innerWidth;
    const h = innerHeight;
    abejitas = Array.from({ length: CANTIDAD }, () => crearAbejita(w, h));
  }

  function redimensionar() {
    const dpr = Math.min(devicePixelRatio || 1, DPR_MAX);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initAbejitas();
  }

  function dibujarAbejita(a, t) {
    const bob = reduceMovimiento ? 0 : Math.sin(t * 2.2 + a.fase) * 3;
    const img = a.vx >= 0 ? imgDerecha : imgIzquierda;
    const y = a.y + bob;
    ctx.drawImage(img, a.x - TAMANO / 2, y - TAMANO / 2, TAMANO, TAMANO);
  }

  function actualizar(marca) {
    if (!animando || imagenesListas < 2) return;

    const w = innerWidth;
    const h = innerHeight;
    const t = marca * 0.001;

    ctx.clearRect(0, 0, w, h);

    for (const a of abejitas) {
      if (!reduceMovimiento) {
        a.x = envolver(a.x + a.vx, w);
        a.y = envolver(a.y + a.vy, h);

        if (Math.random() < 0.004) a.vx += aleatorio(-0.15, 0.15);
        if (Math.random() < 0.004) a.vy += aleatorio(-0.1, 0.1);
        a.vx = Math.max(-0.9, Math.min(0.9, a.vx));
        a.vy = Math.max(-0.55, Math.min(0.55, a.vy));
      }

      dibujarAbejita(a, t);
    }

    requestAnimationFrame(actualizar);
  }

  function alCargarImagen() {
    imagenesListas += 1;
    if (imagenesListas === 2) requestAnimationFrame(actualizar);
  }

  imgDerecha.onload = alCargarImagen;
  imgIzquierda.onload = alCargarImagen;

  addEventListener('resize', redimensionar);
  redimensionar();

  document.addEventListener('visibilitychange', () => {
    animando = !document.hidden;
    if (animando && imagenesListas === 2) requestAnimationFrame(actualizar);
  });
})();
