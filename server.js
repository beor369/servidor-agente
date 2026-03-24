// 1. Importamos la librería Express
const express = require('express');
const path = require('path');

// 2. Creamos la "aplicación" (nuestro servidor)
const app = express();

// 3. Definimos el puerto donde va a escuchar (el 3000 es el estándar para pruebas)
const puerto = 3000;

// 4. Le decimos al servidor que sirva los archivos estáticos (como tu HTML) 
// que encuentre dentro de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 5. Encendemos el servidor
app.listen(puerto, () => {
    console.log(`¡El servidor está vivo! 🚀`);
    console.log(`Abre tu navegador y entra a: http://localhost:${puerto}`);
});