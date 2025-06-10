# Control de Precios Tina

Webapp para consulta rápida y visual de precios de productos, marcas y promociones, basada en datos de Google Sheets.  
Ideal para uso en kiosco, retail, bazar o negocios de belleza.  
Diseñada para funcionar bien tanto en PC como en celulares.

---

## 🚀 ¿Qué incluye este proyecto?

- Consulta online de productos, precios, marcas y pisos (categorías).
- Filtros dinámicos por marca y piso.
- Búsqueda inteligente (requiere mínimo 3 letras).
- Multiplataforma (diseño responsivo, sin scroll horizontal en móvil).
- Carga en tiempo real desde Google Sheets.
- Loader animado de carga.
- Animaciones suaves y tabla visualmente clara.
- Listo para desplegar en GitHub Pages o cualquier hosting estático.

---

## 📦 Estructura de archivos

```
/
├── index.html       # Página principal
├── styles.css       # Estilos y responsive
├── script.js        # Lógica y conexión con Google Sheets
└── README.md        # Este archivo
```

---

## 🖥️ Cómo usar

1. **Cloná el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/control_de_precios_tina.git
    ```
2. **Subí los archivos a tu hosting estático, GitHub Pages, Netlify o Vercel.**
3. **¡Listo! Abrí `index.html` en tu navegador.**

---

## ⚡ Personalización rápida

- **Google Sheets:**  
  Modificá la variable `sheetID` y los nombres de hojas en `script.js` para vincular con tu propia planilla de Google.

- **Filtros por defecto:**  
  Cambiá el valor en la función `applyDefaultFilters()` del JS para seleccionar la pestaña o piso que prefieras al inicio.

- **Colores y branding:**  
  Modificá `styles.css` según tu identidad de marca.

---

## 📝 Créditos

- Desarrollado por Lisa & ChatGPT (OpenAI)
- Icono de lupa: [Flaticon](https://www.flaticon.com/)
- Inspiración: Necesidad real de gestión eficiente de precios en el punto de venta.

---

## 💡 Captura de pantalla

> _¡Agregá aquí una imagen de la web funcionando!_

---

## Licencia

MIT.  
¡Usalo, modificalo y compartilo!
