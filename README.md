# Stage Plot 3D

## 1. Descripción del proyecto

Stage Plot 3D es un prototipo interactivo que permite diseñar y visualizar la distribución de los elementos de un escenario musical en un entorno tridimensional.

El sistema busca facilitar la planificación previa al montaje de una presentación musical mediante la configuración de las dimensiones del espacio, la selección de instrumentos y equipos, y la organización de sus posiciones dentro del escenario.

La aplicación permite visualizar la distribución propuesta y exportar el proyecto para compartirlo o consultarlo posteriormente.

## 2. Objetivo

Desarrollar una herramienta visual e interactiva que facilite la planificación de escenarios musicales, permitiendo representar sus dimensiones y organizar los instrumentos y equipos antes del montaje físico.

## 3. Funcionalidades implementadas

- **Configuración del escenario:** definición del ancho y el fondo del espacio en metros.
- **Configuración inicial:** selección de integrantes, género musical e instrumentos o roles, según las opciones disponibles.
- **Generación del Stage Plot:** creación de una distribución inicial de los elementos.
- **Visualización 3D:** representación tridimensional del escenario y de sus componentes.
- **Biblioteca de elementos:** incorporación de instrumentos y equipos al escenario.
- **Editor interactivo:** selección de elementos y ajuste de su posición y rotación.
- **Propiedades del proyecto:** consulta y modificación de las dimensiones del escenario.
- **Indicador de público:** identificación del frente del escenario mediante una línea amarilla y la etiqueta «PÚBLICO».
- **Exportación HTML:** generación de un archivo HTML independiente para consultar la distribución.
- **Exportación a PDF:** impresión o guardado de la vista del escenario y del inventario técnico en PDF.
- **Inventario técnico:** consulta de los elementos incluidos, sus dimensiones, posiciones y rotaciones.

## 4. Tecnologías utilizadas

- **React:** construcción de la interfaz de usuario.
- **JavaScript:** implementación de la lógica de interacción y gestión del proyecto.
- **CSS:** diseño visual y distribución de los componentes de la interfaz.
- **Three.js:** representación y visualización tridimensional del escenario.
- **OrbitControls:** interacción con la cámara 3D para girar la vista y acercar o alejar el escenario.
- **Vite:** entorno de desarrollo y ejecución de la aplicación.

## 5. Estructura del proyecto

- `public/`: recursos públicos, como imágenes y otros archivos estáticos.
- `src/`: código fuente de la aplicación, componentes, lógica y estilos.
- `node_modules/`: dependencias instaladas mediante npm.
- `index.html`: documento HTML de entrada de la aplicación.
- `package.json`: configuración del proyecto, dependencias y comandos disponibles.
- `package-lock.json`: registro de las versiones de las dependencias instaladas.
- `README.md`: documentación principal del proyecto.

## 6. Requisitos previos

Para ejecutar el proyecto localmente se necesita:

- Node.js instalado.
- npm, incluido normalmente con Node.js.
- Visual Studio Code u otro editor de código.
- Un navegador web moderno.

## 7. Instalación y ejecución

### Paso 1. Abrir el proyecto

Abre la carpeta del proyecto en Visual Studio Code.

### Paso 2. Abrir la terminal

Desde Visual Studio Code, selecciona **Terminal → Nueva terminal**.

### Paso 3. Instalar las dependencias

Ejecuta el siguiente comando desde la carpeta principal del proyecto:

```bash
npm install
```

### Paso 4. Iniciar el servidor de desarrollo

Ejecuta:

```bash
npm run dev
```

### Paso 5. Abrir la aplicación

Abre en el navegador la dirección local que indique la terminal de Vite, normalmente `http://localhost:5173`.

## 8. Uso de la interfaz

1. Configurar las dimensiones del escenario.
2. Completar las opciones iniciales del Stage Plot.
3. Generar la distribución propuesta.
4. Añadir los instrumentos y equipos necesarios desde la biblioteca.
5. Seleccionar cada elemento para ajustar su posición y rotación.
6. Revisar la distribución en la vista tridimensional.
7. Consultar el inventario técnico.
8. Exportar el proyecto a HTML o guardar una versión en PDF.

### Controles de la vista 3D

- **Clic derecho + arrastrar:** girar la vista, según la configuración de los controles.
- **Rueda del ratón:** acercar o alejar la vista.
- **Desplazamiento de la vista:** utilizar el gesto o control de desplazamiento habilitado en el editor.
- **Seleccionar un elemento:** modificar sus propiedades desde el panel correspondiente.

## 9. Exportación de archivos

### HTML

La aplicación genera un archivo HTML que permite consultar la representación tridimensional y el inventario técnico del proyecto. El archivo incluye los datos exportados y las imágenes que se hayan podido incrustar correctamente.

La visualización 3D utiliza Three.js, por lo que necesita conexión a internet para cargar las bibliotecas externas utilizadas.

### PDF

La opción de impresión permite guardar una versión en PDF con la vista del escenario, los datos generales y el inventario técnico. Se recomienda utilizar orientación horizontal para aprovechar mejor el espacio de la página.

## 10. Consideraciones y limitaciones

- El prototipo tiene como finalidad apoyar la planificación visual de un montaje musical.
- La representación tridimensional es una referencia de distribución y no sustituye la verificación técnica del espacio real.
- Las dimensiones y posiciones deben revisarse antes de realizar el montaje físico.
- La carga de bibliotecas externas y de algunos recursos puede requerir conexión a internet.
- La disponibilidad de imágenes depende de que los recursos correspondientes se carguen correctamente.

## 11. Estado del proyecto

El proyecto cuenta con una interfaz de configuración, un editor tridimensional, una biblioteca de elementos, edición de propiedades y opciones de exportación a HTML y PDF.

La aplicación continúa en etapa de prototipo y puede evolucionar mediante mejoras de usabilidad, precisión de la representación y gestión de los proyectos.

## 12. Autoría

Proyecto académico: Stage Plot 3D.

Version actual 2.0.2
