// app.js

document.addEventListener('DOMContentLoaded', () => {

  configurarWhatsAppFlotante();
  renderizarInicio();
  renderizarNosotros();
  renderizarProductos();
  configurarModal();
  configurarFormularioContacto();
  configurarMenuMobile();

});

// Configurar menú móvil
function configurarMenuMobile() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('activo');
      navMenu.classList.toggle('activo');
    });

    // Cerrar menú al hacer click en un link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('activo');
        navMenu.classList.remove('activo');
      });
    });
  }
}

// Configurar botón general 
function configurarWhatsAppFlotante() {
  const btn = document.getElementById('whatsapp-flotante');
  if (btn) {
    const waNum = datosWeb.empresa.whatsapp.replace(/\D/g, '');
    btn.href = `https://wa.me/${waNum}?text=Hola,%20quisiera%20hacer%20una%20consulta.`;
  }
}

// Configurar formulario de contacto
function configurarFormularioContacto() {
  const form = document.getElementById('form-contacto');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('contacto-nombre').value.trim();
      const mensaje = document.getElementById('contacto-mensaje').value.trim();
      if (!nombre || !mensaje) return;

      const emailDestino = datosWeb.empresa.email;
      const paramSubject = encodeURIComponent(`Consulta Web - ${nombre}`);
      const paramBody = encodeURIComponent(`Hola, mi nombre es ${nombre}.\n\nConsulta:\n${mensaje}`);
      
      const mailtoLink = `mailto:${emailDestino}?subject=${paramSubject}&body=${paramBody}`;
      window.location.href = mailtoLink;
    });
  }
}

// Genera un tag IMG o VIDEO dependiendo de la URL (si termina en .mp4 / .webm asume video)
function crearMediaTag(url, altText) {
  const extension = url.split('.').pop().toLowerCase();
  // Validación básica por extensión
  if (extension.includes('mp4') || extension.includes('webm')) {
    return `<video src="${url}" autoplay loop muted playsinline></video>`;
  } else {
    return `<img src="${url}" alt="${altText}">`;
  }
}

function renderizarInicio() {
  const inicio = datosWeb.empresa.mediaInicio || [];
  const sliderWrapper = document.getElementById('inicio-wrapper');

  if (sliderWrapper && inicio.length > 0) {
    let html = '';
    inicio.forEach(mediaUrl => {
      html += `
        <div class="swiper-slide">
          ${crearMediaTag(mediaUrl, 'Inicio Metro Imagen')}
        </div>
      `;
    });
    sliderWrapper.innerHTML = html;

    new Swiper('.swiper-inicio', {
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-inicio .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-inicio .swiper-button-next',
        prevEl: '.swiper-inicio .swiper-button-prev',
      },
    });
  }
}

function renderizarNosotros() {
  const nosotros = datosWeb.empresa.mediaNosotros || [];
  const textContainer = document.getElementById('nosotros-texto');
  const sliderWrapper = document.getElementById('nosotros-wrapper');

  // Insertar texto
  if (textContainer) {
    textContainer.innerText = datosWeb.empresa.descripcionNosotros;
  }

  // Insertar diapositivas en Hero
  if (sliderWrapper && nosotros.length > 0) {
    let html = '';
    nosotros.forEach(mediaUrl => {
      html += `
        <div class="swiper-slide">
          ${crearMediaTag(mediaUrl, 'Metro Imagen Nosotros')}
        </div>
      `;
    });
    sliderWrapper.innerHTML = html;

    // Iniciar Swiper Nosotros
    new Swiper('.swiper-nosotros', {
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-nosotros .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-nosotros .swiper-button-next',
        prevEl: '.swiper-nosotros .swiper-button-prev',
      },
    });
  }
}

function renderizarProductos() {
  const wrapper = document.getElementById('contenedor-secciones-productos');
  if(!wrapper) return;

  const chunkSize = 4;
  const chunks = [];
  for (let i = 0; i < datosWeb.productos.length; i += chunkSize) {
    chunks.push(datosWeb.productos.slice(i, i + chunkSize));
  }

  let htmlLocal = '';

  chunks.forEach((chunk, index) => {
    // El cliente solicitó que el título de productos sea visible en TODAS las secciones
    const headerHtml = `
      <div class="header-productos">
        <h2>PRODUCTOS</h2>
        <span>RENOVÁ TU IMAGEN</span>
      </div>
    `;

    const secId = index === 0 ? 'id="productos"' : '';

    let itemsHtml = '';
    chunk.forEach(prod => {
      itemsHtml += `
        <div class="item-producto" onclick="abrirModal('${prod.id}')">
          <img src="${prod.portada}" alt="${prod.titulo}">
          <h3>${prod.titulo}</h3>
        </div>
      `;
    });

    htmlLocal += `
      <section ${secId} class="seccion-productos">
        ${headerHtml}
        <div class="grid-productos">
          ${itemsHtml}
        </div>
      </section>
    `;
  });

  wrapper.innerHTML = htmlLocal;
}

// Variables globales para el modal
let modalSwiperInstance = null;

function configurarModal() {
  const btnCerrar = document.getElementById('btn-cerrar-modal');
  const modal = document.getElementById('modal-producto');

  // Cerrar onClick del botón
  if (btnCerrar) {
    btnCerrar.addEventListener('click', cerrarModal);
  }

  // Cerrar si se hace click fuera del contenido (en el overlay)
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrarModal();
      }
    });
  }
}

// Esta función se expone al window porque la usamos en el onclick="abrirModal(...)" en HTML
window.abrirModal = function(id) {
  const producto = datosWeb.productos.find(p => p.id === id);
  if (!producto) return;

  const modal = document.getElementById('modal-producto');
  const titulo = document.getElementById('modal-titulo');
  const desc = document.getElementById('modal-desc');
  const btnWhatsapp = document.getElementById('modal-whatsapp');
  const sliderWrapper = document.getElementById('modal-wrapper');

  // Llenar info
  titulo.innerText = producto.titulo;
  desc.innerText = producto.descripcion;
  const waNum = datosWeb.empresa.whatsapp.replace(/\D/g, '');
  btnWhatsapp.href = `https://wa.me/${waNum}?text=Hola,%20me%20interesa%20presupuesto%20para%20la%20secci%C3%B3n%20${encodeURIComponent(producto.titulo)}.`;

  // Llenar Slider
  let html = '';
  (producto.media || []).forEach((mediaUrl, index) => {
    html += `
      <div class="swiper-slide">
        ${crearMediaTag(mediaUrl, producto.titulo + ' ' + index)}
      </div>
    `;
  });
  sliderWrapper.innerHTML = html;

  // Limpiar slider anterior si existía
  if (modalSwiperInstance) {
    modalSwiperInstance.destroy(true, true);
  }

  // Mostrar modal
  modal.classList.add('activo');
  document.body.classList.add('no-scroll');
  document.documentElement.classList.add('no-scroll');

  // Iniciar nuevo slider
  modalSwiperInstance = new Swiper('.swiper-modal', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    grabCursor: true
  });
};

function cerrarModal() {
  const modal = document.getElementById('modal-producto');
  if (modal) {
    modal.classList.remove('activo');
  }
  
  document.body.classList.remove('no-scroll');
  document.documentElement.classList.remove('no-scroll');

  // Pausar cualquier video que haya quedado reproduciendo adentro
  const videos = modal.querySelectorAll('video');
  videos.forEach(v => v.pause());
}
