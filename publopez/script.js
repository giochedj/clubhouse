const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');   

const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtOWkLEESy9rvfkcPsFcKC15pZyHx6rmRd6q-YJ-9oXc6knAiyEscDnGCpPtShCDZV8SdTgozPdG-m/pub?gid=1222080994&single=true&output=csv'; // Incolla qui l'URL del tuo foglio

// Funzione per ottenere i dati dal foglio Google Sheets
async function getMenuData() {
  try {
    const response = await fetch(sheetUrl);
    const csvData = await response.text();
    const rows = csvData.split('\n');
    const menuData = [];

    // Estrai i dati da ogni riga del CSV, saltando l'intestazione
    for (let i = 1; i < rows.length; i++) { 
      const cols = rows[i].split(',');
      // Controlla se la riga ha almeno 4 colonne (categoria, nome, prezzo, ingredienti)
      if (cols.length >= 4) { 
        menuData.push({
          categoria: cols[0].trim(), // Rimuovi eventuali spazi bianchi
          nome: cols[1].trim(),
          prezzo: cols[2].trim(),
          ingredienti: cols[3].trim(),
          immagine: cols[4] ? cols[4].trim() : '' // Gestisci l'immagine (opzionale)
        });
      }
    }

    return menuData;
  } catch (error) {
    console.error('Errore nel caricamento dei dati:', error);
    return []; // Restituisci un array vuoto in caso di errore
  }
}

// Funzione per creare gli elementi HTML del menu
function createMenuItem(item) {
  const menuItem = document.createElement('div');
  menuItem.classList.add('menu-item');

  // Crea il contenuto HTML dell'elemento del menu
  let html = `
    <h2>${item.nome}</h2>
    <p class="price">${item.prezzo}</p>
  `;
  if (item.ingredienti) {
    html += `<p class="ingredients">${item.ingredienti}</p>`;
  }
  if (item.immagine) {
    html += `<img src="${item.immagine}" alt="${item.nome}">`;
  }
  menuItem.innerHTML = html;

  return menuItem;
}

// Funzione per popolare le schede con i dati del menu
async function populateTabs() {
  const menuData = await getMenuData();

  tabContents.forEach(tabContent => {
    const tabId = tabContent.id;

    if (tabId === 'ristorante' || tabId === 'drink') {
      const subTabButtons = tabContent.querySelectorAll('.sub-tab-button');
      const subTabContents = tabContent.querySelectorAll('.sub-tab-content');

      // Aggiungi event listener ai pulsanti delle sotto-schede
      subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Disattiva tutti i pulsanti e i contenuti delle sotto-schede
          subTabButtons.forEach(btn => btn.classList.remove('active'));
          subTabContents.forEach(content => content.classList.remove('active'));

          // Attiva il pulsante e il contenuto cliccato
          button.classList.add('active');
          const subTabId = button.dataset.subTab;
          tabContent.querySelector(`#${subTabId}`).classList.add('active');
        });
      });

      // Popola le sotto-schede con i dati del menu
      subTabContents.forEach(subTabContent => {
        const subTabId = subTabContent.id;
        const subTabItems = menuData.filter(item => item.categoria === subTabId);
        subTabItems.forEach(item => {
          const menuItem = createMenuItem(item);
          subTabContent.appendChild(menuItem);
        });
      });
    } else { // Se la scheda NON ha sotto-schede (es. Caffetteria)
      const tabItems = menuData.filter(item => item.categoria === tabId);
      tabItems.forEach(item => {
        const menuItem = createMenuItem(item);
        tabContent.appendChild(menuItem);
      });
    }
  });
}

// Aggiungi event listener ai pulsanti delle schede principali
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Disattiva tutti i pulsanti e i contenuti
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Attiva il pulsante e il contenuto cliccato
    button.classList.add('active');
    const tabId = button.dataset.tab;
    document.getElementById(tabId).classList.add('active');
  });
});

// Carica i dati del menu e popola le schede
populateTabs();