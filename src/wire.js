export function wireCarousel(document, carousel) {
  document.getElementById('btnPrev').onclick = () => carousel.changeStep(-1);
  document.getElementById('btnNext').onclick = () => carousel.changeStep(1);
}

export function wireRemote(globalObj, remote) {
  Object.assign(globalObj, remote);
}
