// Hamburger menu (menu mobilne)
// Pobranie referencji do przycisku hamburgera i środkowej części nawigacji
const hamburger = document.getElementById('hamburger-menu');
const navbarCenter = document.querySelector('.navbar-center');
// Obsługa otwierania i zamykania menu mobilnego
if (hamburger && navbarCenter) {
  hamburger.addEventListener('click', () => {
    navbarCenter.classList.toggle('active');
    document.body.style.overflow = navbarCenter.classList.contains('active') ? 'hidden' : '';
  });
  // Zamknięcie menu po kliknięciu w link
  navbarCenter.querySelectorAll('li a').forEach(link => {
    link.addEventListener('click', () => {
      navbarCenter.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  // Zamknięcie menu po kliknięciu poza menu (overlay)
  document.addEventListener('click', (e) => {
    if (
      navbarCenter.classList.contains('active') &&
      !navbarCenter.contains(e.target) &&
      e.target !== hamburger
    ) {
      navbarCenter.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Popup window na zdjęcie (powiększanie zdjęcia po kliknięciu)
// Referencje do elementów popupu
const popupOverlay = document.getElementById('popup-overlay');
const popupImg = document.getElementById('popup-img');
const popupClose = document.getElementById('popup-close');
// Funkcje otwierania i zamykania popupu
function openPopup(imgSrc) {
  if (popupImg && popupOverlay) {
    popupImg.src = imgSrc;
    popupOverlay.style.display = 'flex';
  }
}
function closePopup() {
  if (popupOverlay) popupOverlay.style.display = 'none';
  if (popupImg) popupImg.src = '';
}
// Obsługa zamykania popupu
if (popupClose && popupOverlay) {
  popupClose.addEventListener('click', closePopup);
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) closePopup();
  });
}


// Funkcja renderująca zdjęcia do podanego kontenera (featured/picker)
function renderImages(images, container, showArrow = false, showFav = true, showDesc = true, showId = false) {
  container.innerHTML = '';
  if (!images || images.length === 0) {
    const info = document.createElement('p');
    info.textContent = 'Brak zdjęć do wyświetlenia.';
    info.style.fontSize = '18px';
    info.style.color = '#888';
    container.appendChild(info);
    return;
  }
  images.forEach((item, idx) => {
    if (item.image) {
      const outer = document.createElement('div');
      outer.className = 'featured-outer';
      const wrapper = document.createElement('div');
      wrapper.className = 'featured-wrapper';
      if (showFav) {
        const fav = document.createElement('img');
        fav.src = './assets/fav.svg';
        fav.alt = 'fav';
        fav.className = 'featured-fav';
        fav.addEventListener('mouseenter', () => {
          fav.src = './assets/favfill.svg';
        });
        fav.addEventListener('mouseleave', () => {
          fav.src = './assets/fav.svg';
        });
        wrapper.appendChild(fav);
      }
      if (showId && item.id !== undefined) {
        const idLabel = document.createElement('div');
        idLabel.className = 'featured-id';
        idLabel.textContent = item.id;
        wrapper.appendChild(idLabel);
      }
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = 'Featured';
      img.className = 'featured-img';
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openPopup(item.image));
      wrapper.appendChild(img);

      outer.appendChild(wrapper);
      if (showDesc) {
        const desc = document.createElement('div');
        desc.className = 'featured-desc';
        desc.textContent = item.text || item.description || item.name || '';
        outer.appendChild(desc);
      }
      container.appendChild(outer);
    }
  });
}

// Sekcja featured (zawsze 4)
fetch('https://brandstestowy.smallhost.pl/api/random?pageNumber=1&pageSize=4')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('featured-images');
    let images = [];
    if (data && Array.isArray(data.data)) {
      images = data.data;
    }
    renderImages(images.slice(0, 4), container, true, true, true, false);
  })
  .catch(error => {
    console.error('Błąd podczas pobierania zdjęć:', error);
    const container = document.getElementById('featured-images');
    container.innerHTML = '<p style="color:red">Błąd podczas pobierania zdjęć.</p>';
  });

// Sekcja picker
const picker = document.getElementById('productsPerPage');
const pickerImages = document.getElementById('picker-images');
function fetchAndRenderPickerImages(pageSize) {
  fetch(`https://brandstestowy.smallhost.pl/api/random?pageNumber=1&pageSize=${pageSize}`)
    .then(response => response.json())
    .then(data => {
      let images = [];
      if (data && Array.isArray(data.data)) {
        images = data.data;
      }
      renderImages(images.slice(0, pageSize), pickerImages, false, false, false, true);
    })
    .catch(error => {
      console.error('Błąd podczas pobierania zdjęć:', error);
      pickerImages.innerHTML = '<p style="color:red">Błąd podczas pobierania zdjęć.</p>';
    });
}
if (picker && pickerImages) {
  fetchAndRenderPickerImages(picker.value);
  picker.addEventListener('change', (e) => {
    fetchAndRenderPickerImages(e.target.value);
  });
}
