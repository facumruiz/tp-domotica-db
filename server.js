// 📦 Importamos los módulos necesarios
const express = require('express');           // Framework para crear el servidor web
const sqlite3 = require('sqlite3').verbose(); // Módulo para manejar bases de datos SQLite
const path = require('path');                 // Módulo para manejar rutas de archivos
const cors = require('cors');                 // Middleware para permitir peticiones desde otros orígenes

// 🚀 Creamos una instancia de la aplicación Express
const app = express();

// 🔌 Definimos el puerto en el que se ejecutará el servidor
const PORT = 5500;

// 🔓 Activamos CORS para permitir peticiones desde el navegador
app.use(cors());

// 🧠 Middleware para interpretar datos JSON enviados desde el frontend
app.use(express.json());

// 📁 Servimos archivos estáticos (HTML, CSS, JS) desde la carpeta actual
app.use(express.static(__dirname));

// 🏠 Ruta principal: sirve el archivo HTML cuando se accede a la raíz del servidor
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Enviamos el archivo index.html
});

// 🧪 Ruta auxiliar para verificar los nombres reales de las columnas de la tabla
app.get('/ver-estructura', (req, res) => {
  const db = new sqlite3.Database('domotica_db.db'); // Abrimos la base de datos
  db.all('PRAGMA table_info(tabladomotica_db)', (err, rows) => { // Consultamos la estructura de la tabla
    if (err) {
      res.status(500).json({ error: err.message }); // Si hay error, lo devolvemos
    } else {
      res.json(rows.map(col => col.name)); // Devolvemos solo los nombres de las columnas
    }
  });
  db.close(); // Cerramos la base de datos
});

// 📥 Ruta para consultar registros entre dos fechas y horas
app.post('/consulta-rango', (req, res) => {
  // Extraemos los datos enviados desde el formulario del frontend
  const { fecha_inicio, hora_inicio, fecha_fin, hora_fin } = req.body;

  // Abrimos la base de datos SQLite
  const db = new sqlite3.Database('domotica_db.db');

  // Consulta SQL para obtener los registros dentro del rango de fecha y hora
  const query = `
    SELECT 
      fecha_db, hora_db,
      temperatura_db_C,
      humedad_db_porciento,
      presencia_db,
      nivel_luz_Lux,
      tension_db_V,
      corriente_db_A,
      energia_db_kWh,
      energia_acumulada_db_kWh
    FROM tabladomotica_db
    WHERE datetime(fecha_db || ' ' || hora_db) BETWEEN datetime(?) AND datetime(?)
  `;

  // Armamos los parámetros con fecha y hora concatenadas
  const parametros = [`${fecha_inicio} ${hora_inicio}`, `${fecha_fin} ${hora_fin}`];

  // Ejecutamos la consulta SQL
  db.all(query, parametros, (err, rows) => {
    if (err) {
      console.error('Error en /consulta-rango:', err.message); // Mostramos el error en consola
      res.status(500).json({ error: err.message });             // Enviamos el error al frontend
    } else {
      res.json(rows); // Enviamos los resultados como JSON
    }
  });

  db.close(); // Cerramos la base de datos
});

// 📅 Ruta para obtener la fecha y hora del primer y último registro disponible
app.get('/limites', (req, res) => {
  const db = new sqlite3.Database('domotica_db.db'); // Abrimos la base de datos

  // Consulta SQL para obtener los extremos del rango de datos
  const query = `
    SELECT
      MIN(datetime(fecha_db || ' ' || hora_db)) AS inicio,
      MAX(datetime(fecha_db || ' ' || hora_db)) AS fin
    FROM tabladomotica_db
  `;

  // Ejecutamos la consulta
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error en /limites:', err.message); // Mostramos el error en consola
      res.status(500).json({ error: err.message });      // Enviamos el error al frontend
    } else {
      res.json(rows[0]); // Enviamos el resultado como JSON
    }
  });

  db.close(); // Cerramos la base de datos
});

// 🟢 Iniciamos el servidor y lo dejamos escuchando en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mensaje en consola
});
