# 🌟 React Star Wars Lab

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?logo=bootstrap&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.13.1-5A29E4?logo=axios&logoColor=white)

Aplicación React moderna que consume la API de Star Wars (SWAPI) con búsqueda en tiempo real, filtros avanzados y diseño temático con efectos visuales profesionales.

[Ver Demo](#) • [Reportar Bug](#) • [Solicitar Feature](#)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Características Principales](#-características-principales)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

- 🔍 **Búsqueda en Tiempo Real**: Filtra personajes mientras escribes
- 🎯 **Filtros Avanzados**: Por género, masa y altura
- 📄 **Paginación Completa**: Carga todos los personajes (no solo los primeros 10)
- 🔤 **Ordenamiento Alfabético**: Resultados ordenados automáticamente
- 🎨 **Diseño Temático**: Efectos visuales inspirados en Star Wars
- ⚡ **Animaciones Sutiles**: Efectos tipo sable láser y partículas espaciales
- 🔊 **Efectos de Sonido**: Sonidos interactivos al hacer clic
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos

## 🛠️ Tecnologías

- **React 19.2.0** - Biblioteca de JavaScript para construir interfaces
- **React Bootstrap** - Componentes Bootstrap para React
- **Axios** - Cliente HTTP para realizar peticiones AJAX
- **Bootstrap 5** - Framework CSS para diseño responsive
- **CSS3** - Animaciones y efectos visuales personalizados

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/danielgonzalesarce/react-star-wars-lab.git
   cd react-star-wars-lab
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Agrega el archivo de sonido** (opcional)
   - Coloca tu archivo `007132146_prev.mp3` en la carpeta `public/`

4. **Inicia el servidor de desarrollo**
   ```bash
   npm start
   ```

5. **Abre tu navegador**
   - La aplicación estará disponible en `http://localhost:3000`

## 🚀 Uso

1. **Cargar Personajes**
   - Haz clic en el botón "Cargar Personajes" para obtener todos los personajes de Star Wars

2. **Buscar Personajes**
   - Escribe en el campo de búsqueda para filtrar en tiempo real
   - La búsqueda es case-insensitive y busca coincidencias parciales

3. **Aplicar Filtros**
   - **Género**: Selecciona un género específico (masculino, femenino, N/A, etc.)
   - **Masa**: Establece un peso mínimo en kilogramos
   - **Altura**: Establece una altura mínima en centímetros

4. **Limpiar Filtros**
   - Usa el botón "Limpiar filtros" para resetear todos los filtros

## 📁 Estructura del Proyecto

```
react-star-wars-lab/
├── public/
│   ├── 007132146_prev.mp3    # Archivo de sonido (opcional)
│   ├── index.html
│   └── ...
├── src/
│   ├── CharacterLoader.js    # Componente principal
│   ├── App.js                 # Componente raíz
│   ├── App.css                # Estilos principales
│   ├── index.js               # Punto de entrada
│   └── ...
├── package.json
├── README.md
└── ...
```

## 🎯 Características Principales

### Búsqueda en Tiempo Real
- Filtrado instantáneo mientras escribes
- Búsqueda por coincidencias parciales y al inicio del nombre
- Resultados ordenados alfabéticamente

### Filtros Avanzados
- **Filtro por Género**: Masculino, Femenino, N/A, Hermafrodita
- **Filtro por Masa**: Masa mínima en kilogramos
- **Filtro por Altura**: Altura mínima en centímetros
- Combinación de múltiples filtros simultáneamente

### Paginación Completa
- Carga automática de todas las páginas de la API
- Muestra todos los personajes disponibles (no solo 10)
- Indicador de cantidad de resultados

### Diseño Profesional
- Efectos visuales tipo sable láser
- Campo de estrellas animado en el fondo
- Glassmorphism y efectos de blur
- Animaciones suaves y profesionales
- Transiciones fluidas

### Efectos de Sonido
- Sonido interactivo al hacer clic en botones
- Volumen ajustable en el código

## 🖼️ Capturas de Pantalla

_Próximamente: Agregar capturas de pantalla del proyecto_

## 🤝 Contribuir

Las contribuciones son bienvenidas! Si tienes ideas para mejorar este proyecto:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Crea una build de producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración (irreversible)

## 🔧 Configuración Adicional

### Ajustar Volumen del Sonido

Edita el archivo `src/CharacterLoader.js`:

```javascript
audioRef.current.volume = 0.5; // Cambia este valor (0.0 a 1.0)
```

### Personalizar Colores

Los colores principales se pueden ajustar en `src/App.css`:
- Color primario: `#0d6efd`
- Color de acento: `rgba(0, 204, 255, 0.6)`

## 🌐 API Utilizada

Este proyecto utiliza la [Star Wars API (SWAPI)](https://swapi.dev/):
- Endpoint: `https://swapi.dev/api/people/`
- Método: GET
- Formato: JSON

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Daniel Gonzales Arce**

- GitHub: [@danielgonzalesarce](https://github.com/danielgonzalesarce)
- LinkedIn: [Daniel Alexander Gonzales Arce](https://www.linkedin.com/in/daniel-alexander-gonzales-arce-537576383/)

## 🙏 Agradecimientos

- [SWAPI](https://swapi.dev/) por proporcionar la API gratuita
- React Team por el framework increíble
- Bootstrap Team por los componentes
- Comunidad de Star Wars por la inspiración

---

<div align="center">

⭐ Si te gustó este proyecto, considera darle una estrella en GitHub

Hecho con ❤️ y la Fuerza ⚡

</div>
