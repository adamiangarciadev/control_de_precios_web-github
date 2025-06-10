
const sheetID = "1id74cUVaB0GN6ROPrxwBj8K-FZWkl6dD7kMgWze_X6U";
// Se cargan todas las hojas, incluida "PROMOCIONES"
const sheetNames = ["PB", "BEAUTY", "BAZAR", "PROMOCIONES"];
const urls = sheetNames.map(name => `https://opensheet.elk.sh/${sheetID}/${name}`);

const tableBody = document.getElementById("data-body");
const searchInput = document.getElementById("search");
const marcaFilter = document.getElementById("marcaFilter");
const pisoFilter = document.getElementById("pisoFilter");
const loader = document.getElementById("loader");

let data = [];

// Muestra el loader mientras se cargan los productos
function showLoader() { loader.style.display = "block"; }
function hideLoader() { loader.style.display = "none"; }

// Carga todos los datos de las hojas y muestra el loader hasta finalizar
showLoader();
Promise.all(urls.map(url => fetch(url).then(res => res.json())))
  .then(results => {
    hideLoader();
    data = results.flat();
    populateFilters(data); // Carga filtros de marca y piso
    applyDefaultFilters(); // Por defecto, muestra Promociones
    renderTable(data); // Renderiza la tabla inicial
  });

// Selecciona todo el texto del input de búsqueda al hacer foco
searchInput.addEventListener("focus", function() {
  searchInput.select();
});

// Búsqueda sólo activa si hay 3 letras o más, si no, deja la tabla igual
searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();
  if (value.length >= 3) {
    marcaFilter.value = "";
    pisoFilter.value = "";
    renderTable(data);
  }
  // Si tiene menos de 3 letras, no se modifica la tabla
});

// Cuando se cambia la marca o el piso, se aplica el filtro normalmente
marcaFilter.addEventListener("change", () => renderTable(data));
pisoFilter.addEventListener("change", () => renderTable(data));

// Crea opciones únicas para los filtros de marca y piso
function populateFilters(data) {
  const marcas = [...new Set(data.map(item => item.MARCA).filter(Boolean))].sort();
  const pisos = [...new Set(data.map(item => item.PISO).filter(Boolean))].sort();

  // Opción "todas" para ambos filtros
  const defaultOptionMarca = document.createElement("option");
  defaultOptionMarca.value = "";
  defaultOptionMarca.textContent = "Todas";
  marcaFilter.appendChild(defaultOptionMarca);

  const defaultOptionPiso = document.createElement("option");
  defaultOptionPiso.value = "";
  defaultOptionPiso.textContent = "Todos";
  pisoFilter.appendChild(defaultOptionPiso);

  // Agrega marcas únicas
  marcas.forEach(marca => {
    const option = document.createElement("option");
    option.value = marca;
    option.textContent = marca;
    marcaFilter.appendChild(option);
  });

  // Agrega pisos únicos
  pisos.forEach(piso => {
    const option = document.createElement("option");
    option.value = piso;
    option.textContent = piso;
    pisoFilter.appendChild(option);
  });
}

// Por defecto, el filtro de piso selecciona PROMOCION (ajustar según hoja)
function applyDefaultFilters() {
  pisoFilter.value = "PROMOCION"; // Cambiar por "PROMOCIONES" si así figura en tu sheet
}

// Renderiza la tabla según filtros y búsqueda
function renderTable(data) {
  const search = searchInput.value.trim().toLowerCase();
  const marca = marcaFilter.value;
  const piso = pisoFilter.value;

  // Si hay búsqueda de entre 1 y 2 letras, muestra mensaje aclaratorio
  if (search.length > 0 && search.length < 3) {
    tableBody.innerHTML = "";
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "Ingresá al menos 3 letras para buscar.";
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  // Si hay 3 letras o más, busca sólo por texto y limpia filtros
  const filtered = data.filter(item => {
    if (search.length >= 3) {
      return (
        (item.DESCRIPCION?.toLowerCase().includes(search) ||
         item["CÓDIGO DE BARRAS"]?.toLowerCase().includes(search) ||
         item.MARCA?.toLowerCase().includes(search) ||
         item.PISO?.toLowerCase().includes(search))
      );
    } else {
      // Si no hay búsqueda, filtra por marca y piso normalmente
      const matchesMarca = !marca || item.MARCA === marca;
      const matchesPiso = !piso || item.PISO === piso;
      return matchesMarca && matchesPiso;
    }
  });

  tableBody.innerHTML = "";

  // Si no hay resultados, muestra mensaje amigable
  if (filtered.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "No se encontraron resultados.";
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  // Por cada producto filtrado, crea una fila con sus datos
  filtered.forEach(item => {
    const row = document.createElement("tr");

    // Imagen del producto
    const imgCell = document.createElement("td");
    if (item.IMAGEN) {
      const img = document.createElement("img");
      img.src = item.IMAGEN;
      img.alt = item.DESCRIPCION || "";
      imgCell.appendChild(img);
    }
    row.appendChild(imgCell);

    // Precio del producto
    const precioCell = document.createElement("td");
    precioCell.textContent = item.PRECIO || "";
    row.appendChild(precioCell);

    // Código de barras (en monoespaciado)
    const codigoCell = document.createElement("td");
    codigoCell.textContent = item["CÓDIGO DE BARRAS"] || "";
    codigoCell.classList.add("codigo");
    row.appendChild(codigoCell);

    // Descripción del producto
    const descCell = document.createElement("td");
    descCell.textContent = item.DESCRIPCION || "";
    descCell.classList.add("descripcion");
    row.appendChild(descCell);

    // Marca (oculta en móvil)
    const marcaCell = document.createElement("td");
    marcaCell.textContent = item.MARCA || "";
    marcaCell.classList.add("ocultar-en-movil");
    row.appendChild(marcaCell);

    // Piso (oculta en móvil)
    const pisoCell = document.createElement("td");
    pisoCell.textContent = item.PISO || "";
    pisoCell.classList.add("ocultar-en-movil");
    row.appendChild(pisoCell);

    tableBody.appendChild(row);
  });
}
