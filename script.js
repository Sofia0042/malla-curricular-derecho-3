let creditosTotales = 0;

function contarFOFUs() {
  return Array.from(document.querySelectorAll('.ramo.fundamental'))
    .filter(r => r.classList.contains('aprobado')).length;
}

function contarOptativos() {
  return Array.from(document.querySelectorAll('.ramo.optativo'))
    .filter(r => r.classList.contains('aprobado')).length;
}

function prerrequisitosCumplidos(prerrequisitos) {
  return prerrequisitos.every(id => {
    const ramo = document.getElementById(id);
    return ramo && ramo.classList.contains('aprobado');
  });
}

function tieneCreditosMinimos(ramo) {
  const creditosMin = ramo.dataset.requiereCreditos || ramo.dataset.requiere_creditos || ramo.dataset.requierecreditos;
  if (!creditosMin) return true;
  return creditosTotales >= parseInt(creditosMin);
}

function actualizarEstadoRamos() {
  document.querySelectorAll('.ramo').forEach(boton => {
    const datos = boton.dataset.prerrequisitos;
    const creditosMin = boton.dataset.requiereCreditos || boton.dataset.requiere_creditos || boton.dataset.requierecreditos;
    const fofusMin = boton.dataset.requiereFofus || boton.dataset.requiere_fofus;
    const optativosMin = boton.dataset.requiereOptativos || boton.dataset.requiere_optativos;

    let habilitado = true;

    // Revisa prerrequisitos normales (ramos)
    if (datos) {
      const prereqs = datos.split(',').map(p => p.trim());
      if (!prerrequisitosCumplidos(prereqs)) habilitado = false;
    }

    // Revisar créditos mínimos para ramos que los tienen (incluyendo los 3 desbloqueados con prerequisito de créditos)
    if (!tieneCreditosMinimos(boton)) habilitado = false;

    // Revisar FOFUs mínimos aprobados
    if (fofusMin && contarFOFUs() < parseInt(fofusMin)) habilitado = false;

    // Revisar optativos mínimos aprobados
    if (optativosMin && contarOptativos() < parseInt(optativosMin)) habilitado = false;

    // Control especial para Licenciatura: requiere prerrequisitos, FOFUs y optativos todos juntos
    if (boton.id === 'DER1100') {
      const prerreqs = boton.dataset.prerrequisitos ? boton.dataset.prerrequisitos.split(',').map(p => p.trim()) : [];
      const cumplePrerreqs = prerrequisitosCumplidos(prerreqs);
      const cumpleFofus = contarFOFUs() >= (parseInt(fofusMin) || 0);
      const cumpleOptativos = contarOptativos() >= (parseInt(optativosMin) || 0);
      if (!(cumplePrerreqs && cumpleFofus && cumpleOptativos)) habilitado = false;
    }

    boton.disabled = !habilitado;
    boton.setAttribute('data-bloqueado', (!habilitado).toString());
  });
}

function lanzarFuegosArtificiales() {
  for (let i = 0; i < 25; i++) {
    const estallido = document.createElement('div');
    estallido.classList.add('fuego-artificial');

    const size = Math.random() * 12 + 8;
    const left = Math.random() * window.innerWidth;
    const top = Math.random() * window.innerHeight;

    estallido.style.width = `${size}px`;
    estallido.style.height = `${size}px`;
    estallido.style.left = `${left}px`;
    estallido.style.top = `${top}px`;

    document.body.appendChild(estallido);
    setTimeout(() => estallido.remove(), 900);
  }
}

function aprobarRamo(boton) {
  if (!boton.classList.contains('aprobado')) {
    boton.classList.add('aprobado', 'destacado');
    const creditos = parseInt(boton.dataset.creditos) || 0;
    creditosTotales += creditos;

    setTimeout(() => {
      boton.classList.remove('destacado');
    }, 1000);

    lanzarFuegosArtificiales();
    actualizarEstadoRamos();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarEstadoRamos();
  document.querySelectorAll('.ramo').forEach(boton => {
    boton.addEventListener('click', () => {
      if (boton.getAttribute('data-bloqueado') !== 'true') {
        aprobarRamo(boton);
      }
    });
  });
});
