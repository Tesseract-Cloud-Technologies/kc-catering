/* main.js */
(function() {
  'use strict';

  // --- Demo bar dismiss ---
  const demoBar = document.getElementById('demoBar');
  const dismissBtn = document.getElementById('dismissDemoBar');
  if (dismissBtn && demoBar) {
    if (localStorage.getItem('kcDemoDismissed') === 'true') demoBar.style.display = 'none';
    dismissBtn.addEventListener('click', () => {
      demoBar.style.display = 'none';
      localStorage.setItem('kcDemoDismissed', 'true');
    });
  }

  // --- Menu data ---
  const dishes = [
    { id: 1, name: 'Mini beef empanadas', cat: 'canapes', desc: 'Flaky pastry, spiced beef filling.', diet: [], price: 8 },
    { id: 2, name: 'Coconut prawn skewers', cat: 'canapes', desc: 'Grilled prawns with coconut glaze.', diet: ['contains nuts'], price: 12 },
    { id: 3, name: 'Veggie spring rolls', cat: 'canapes', desc: 'Crispy rolls with sweet chilli dip.', diet: ['vegetarian'], price: 7 },
    { id: 4, name: 'Grilled chicken', cat: 'mains', desc: 'Charred chicken with island spices.', diet: ['halal-friendly'], price: 32 },
    { id: 5, name: 'Slow-cooked beef', cat: 'mains', desc: 'Tender beef in rich gravy.', diet: ['halal-friendly'], price: 38 },
    { id: 6, name: 'Vegetarian curry', cat: 'mains', desc: 'Coconut curry with seasonal vegetables.', diet: ['vegetarian'], price: 26 },
    { id: 7, name: 'Island mumu platter', cat: 'mumu', desc: 'Earth oven pork, sweet potato, greens.', diet: ['halal-friendly'], price: 45 },
    { id: 8, name: 'Family mumu', cat: 'mumu', desc: 'Large shared platter for 4–6 guests.', diet: ['halal-friendly'], price: 65 },
    { id: 9, name: 'Garden salad', cat: 'salads', desc: 'Fresh greens with citrus dressing.', diet: ['vegetarian'], price: 18 },
    { id: 10, name: 'Potato salad', cat: 'salads', desc: 'Creamy potato salad with herbs.', diet: ['vegetarian'], price: 15 },
    { id: 11, name: 'Coconut cake', cat: 'desserts', desc: 'Light sponge with coconut cream.', diet: ['contains nuts'], price: 12 },
    { id: 12, name: 'Fresh fruit platter', cat: 'desserts', desc: 'Seasonal tropical fruit.', diet: ['vegetarian'], price: 14 },
    { id: 13, name: 'Tropical juice', cat: 'drinks', desc: 'Passionfruit and mango blend.', diet: ['vegetarian'], price: 6 },
    { id: 14, name: 'Coffee & tea station', cat: 'drinks', desc: 'PNG highlands coffee and tea.', diet: ['vegetarian'], price: 8 }
  ];

  const menuGrid = document.getElementById('menuGrid');
  const catChips = document.querySelectorAll('.cat-chip');
  const trayCount = document.getElementById('trayCount');
  const trayItems = document.getElementById('trayItems');
  const trayTotal = document.getElementById('trayTotal');
  const trayGuests = document.getElementById('trayGuests');
  const openTrayBtn = document.getElementById('openTrayBtn');
  const trayOffcanvasEl = document.getElementById('trayOffcanvas');
  const trayOffcanvas = trayOffcanvasEl ? new bootstrap.Offcanvas(trayOffcanvasEl) : null;
  let tray = [];

  function renderMenu(filter) {
    if (!menuGrid) return;
    const filtered = filter === 'all' ? dishes : dishes.filter(d => d.cat === filter);
    menuGrid.innerHTML = filtered.map(d => {
      const dietBadges = d.diet.map(b => `<span class="diet-badge">${b}</span>`).join(' ');
      return `<div class="col-md-6 col-lg-4">
        <div class="dish-card p-4 h-100 d-flex flex-column">
          <div class="dish-icon mb-3"><i class="fa-solid fa-utensils"></i></div>
          <h3 class="h6">${d.name}</h3>
          <p class="text-muted-soft small mb-2 flex-grow-1">${d.desc}</p>
          <div class="d-flex flex-wrap gap-1 mb-2">${dietBadges}</div>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="price-tag">K${d.price}/head</span>
            <button class="btn btn-rose btn-sm rounded-pill add-to-tray" data-id="${d.id}">Add to tray</button>
          </div>
        </div>
      </div>`;
    }).join('');
    menuGrid.querySelectorAll('.add-to-tray').forEach(btn => {
      btn.addEventListener('click', () => addToTray(parseInt(btn.dataset.id, 10)));
    });
  }

  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      catChips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-selected', 'false'); });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');
      renderMenu(chip.dataset.cat);
    });
  });
  if (menuGrid) renderMenu('all');

  function addToTray(id) {
    const dish = dishes.find(d => d.id === id);
    if (!dish) return;
    const existing = tray.find(t => t.id === id);
    if (existing) existing.qty += 1;
    else tray.push({ ...dish, qty: 1 });
    updateTray();
    if (trayOffcanvas) trayOffcanvas.show();
  }

  function updateTray() {
    const totalQty = tray.reduce((sum, t) => sum + t.qty, 0);
    if (trayCount) trayCount.textContent = totalQty;
    if (trayItems) {
      if (tray.length === 0) {
        trayItems.innerHTML = '<p class="text-muted small">Your tray is empty. Add dishes from the menu.</p>';
      } else {
        trayItems.innerHTML = tray.map(t => `
          <div class="tray-line">
            <span>${t.name} × ${t.qty}</span>
            <span>K${t.price * t.qty}</span>
            <button class="remove-btn" data-id="${t.id}" aria-label="Remove ${t.name}"><i class="fa-solid fa-xmark"></i></button>
          </div>
        `).join('');
        trayItems.querySelectorAll('.remove-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            tray = tray.filter(t => t.id !== parseInt(btn.dataset.id, 10));
            updateTray();
          });
        });
      }
    }
    updateTrayTotal();
  }

  function updateTrayTotal() {
    if (!trayTotal) return;
    const guests = parseInt(trayGuests?.value, 10) || 1;
    const perHead = tray.reduce((sum, t) => sum + t.price * t.qty, 0);
    const total = perHead * guests;
    trayTotal.textContent = 'K' + total;
    // Store for quote page
    try {
      sessionStorage.setItem('kcTray', JSON.stringify(tray));
      sessionStorage.setItem('kcGuests', String(guests));
      sessionStorage.setItem('kcTotal', String(total));
    } catch (e) { /* ignore */ }
  }

  if (trayGuests) trayGuests.addEventListener('input', updateTrayTotal);

  if (openTrayBtn) openTrayBtn.addEventListener('click', () => { if (trayOffcanvas) trayOffcanvas.show(); });

  // --- Quote form pre-fill ---
  const quoteTrayPreview = document.getElementById('quoteTrayPreview');
  const guestCount = document.getElementById('guestCount');
  if (quoteTrayPreview) {
    try {
      const saved = JSON.parse(sessionStorage.getItem('kcTray') || '[]');
      const savedGuests = sessionStorage.getItem('kcGuests');
      if (saved && saved.length > 0) {
        quoteTrayPreview.innerHTML = saved.map(t =>
          `<div class="d-flex justify-content-between"><span>${t.name} × ${t.qty}</span><span>K${t.price * t.qty}/head</span></div>`
        ).join('') + `<p class="mt-2 mb-0"><strong>Per head total:</strong> K${saved.reduce((s, t) => s + t.price * t.qty, 0)}</p>`;
        if (savedGuests && guestCount) guestCount.value = savedGuests;
      }
    } catch (e) { /* ignore */ }
  }

  // --- Quote form submission ---
  const quoteForm = document.getElementById('quoteForm');
  const quoteSuccess = document.getElementById('quoteSuccess');
  const quoteWhatsapp = document.getElementById('quoteWhatsapp');
  const quoteRef = document.getElementById('quoteRef');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!quoteForm.checkValidity()) {
        quoteForm.classList.add('was-validated');
        return;
      }
      const ref = 'KC-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const eventType = document.getElementById('eventType')?.value || '';
      const date = document.getElementById('eventDate')?.value || '';
      const guests = document.getElementById('guestCount')?.value || '';
      const venue = document.getElementById('venue')?.value || '';
      const budget = document.getElementById('budget')?.value || '';
      const notes = document.getElementById('quoteNotes')?.value || '';
      const name = document.getElementById('quoteName')?.value || 'Friend';
      const email = document.getElementById('quoteEmail')?.value || '';
      const trayData = JSON.parse(sessionStorage.getItem('kcTray') || '[]');
      const trayDesc = trayData.map(t => `${t.name} × ${t.qty}`).join(', ') || 'No tray items';
      const text = `Hello KC Catering! Quote request. Ref: ${ref}. Name: ${name}. Email: ${email}. Event: ${eventType}. Date: ${date}. Guests: ${guests}. Venue: ${venue}. Budget: ${budget}. Tray: ${trayDesc}. Notes: ${notes} (Demo)`;
      const url = `https://wa.me/67512345678?text=${encodeURIComponent(text)}`;
      if (quoteWhatsapp) quoteWhatsapp.href = url;
      if (quoteRef) quoteRef.textContent = ref;
      quoteForm.classList.add('d-none');
      if (quoteSuccess) quoteSuccess.classList.remove('d-none');
    });
  }

  // --- Contact form ---
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const contactWhatsapp = document.getElementById('contactWhatsapp');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }
      const name = document.getElementById('contactName')?.value || 'Friend';
      const email = document.getElementById('contactEmail')?.value || '';
      const message = document.getElementById('contactMessage')?.value || '';
      const text = `Hello KC Catering! My name is ${name}. Email: ${email}. Message: ${message} (Demo)`;
      const url = `https://wa.me/67512345678?text=${encodeURIComponent(text)}`;
      if (contactWhatsapp) contactWhatsapp.href = url;
      contactForm.classList.add('d-none');
      if (contactSuccess) contactSuccess.classList.remove('d-none');
    });
  }

})();