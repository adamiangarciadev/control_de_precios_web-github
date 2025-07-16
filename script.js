const sheetID = "1id74cUVaB0GN6ROPrxwBj8K-FZWkl6dD7kMgWze_X6U";
const sheetNames = ["PB", "BEAUTY", "BAZAR", "PROMOCIONES"];
const urls = sheetNames.map(name => `https://opensheet.elk.sh/${sheetID}/${name}`);

const tableBody = document.getElementById("data-body");
const cardList = document.getElementById("card-list");
const searchInput = document.getElementById("search");
const marcaFilter = document.getElementById("marcaFilter");
const pisoFilter = document.getElementById("pisoFilter");
const loader = document.getElementById("loader");

let data = [];

function showLoader() {
  loader.style.display = "block";
}
function hideLoader() {
  loader.style.display = "none";
}

showLoader();
Promise.all(urls.map((url) => fetch(url).then((res) => res.json()))).then((results) => {
  hideLoader();
  data = results.flat();
  populateFilters(data);
  applyDefaultFilters();
  renderTable(data);
});

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();
  if (value.length >= 3) {
    marcaFilter.value = "";
    pisoFilter.value = "";
    renderTable(data);
  }
});

marcaFilter.addEventListener("change", () => renderTable(data));
pisoFilter.addEventListener("change", () => renderTable(data));

function populateFilters(data) {
  const marcas = [...new Set(data.map((item) => item.MARCA).filter(Boolean))].sort();
  const pisos = [...new Set(data.map((item) => item.PISO).filter(Boolean))].sort();

  marcaFilter.innerHTML = '<option value="">Todas</option>';
  pisoFilter.innerHTML = '<option value="">Todos</option>';

  marcas.forEach((m) => {
    const o = document.createElement("option");
    o.value = m;
    o.textContent = m;
    marcaFilter.appendChild(o);
  });

  pisos.forEach((p) => {
    const o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    pisoFilter.appendChild(o);
  });
}

function applyDefaultFilters() {
  pisoFilter.value = "PROMOCION";
}

function renderTable(data) {
  const search = searchInput.value.trim().toLowerCase();
  const marca = marcaFilter.value;
  const piso = pisoFilter.value;

  const filtered = data.filter((item) => {
    if (search.length >= 3) {
      return (
        item.DESCRIPCION?.toLowerCase().includes(search) ||
        item["CÓDIGO DE BARRAS"]?.toLowerCase().includes(search) ||
        item.MARCA?.toLowerCase().includes(search) ||
        item.PISO?.toLowerCase().includes(search)
      );
    } else {
      return (!marca || item.MARCA === marca) && (!piso || item.PISO === piso);
    }
  });

  tableBody.innerHTML = "";
  cardList.innerHTML = "";

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "🙁 No se encontraron resultados.";
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  filtered.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.IMAGEN ? `<img src="${item.IMAGEN}" alt="" />` : ""}</td>
      <td>${item.PRECIO || ""}</td>
      <td class="codigo">${item["CÓDIGO DE BARRAS"] || ""}</td>
      <td class="descripcion">${item.DESCRIPCION || ""}</td>
      <td class="ocultar-en-movil">${item.MARCA || ""}</td>
      <td class="ocultar-en-movil">${item.PISO || ""}</td>
    `;
    tableBody.appendChild(row);

    // Mobile Card
    const card = document.createElement("div");
    card.className = "mobile-card";
    card.innerHTML = `
      ${item.IMAGEN ? `<img src="${item.IMAGEN}" alt=""/>` : ""}
      <div><span class="label">💲 Precio:</span> <span class="value">${item.PRECIO || ""}</span></div>
      <div><span class="label">📦 Código:</span> <span class="value">${item["CÓDIGO DE BARRAS"] || ""}</span></div>
      <div><span class="label">📝 Descripción:</span> <span class="value">${item.DESCRIPCION || ""}</span></div>
      <div><span class="label">🏷 Marca:</span> <span class="value">${item.MARCA || ""}</span></div>
      <div><span class="label">📍 Piso:</span> <span class="value">${item.PISO || ""}</span></div>
    `;
    cardList.appendChild(card);
  });
}

// Modo oscuro persistente
const toggleBtn = document.getElementById("toggle-mode");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Aplicar modo oscuro guardado
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}
