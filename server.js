// 📦 Importamos módulos
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// 🚀 Creamos la app
const app = express();
const PORT = process.env.PORT || 5500; // compatible con Render/Vercel

// 🔓 CORS
app.use(cors());

// 🧠 JSON middleware
app.use(express.json());

// 📁 Archivos estáticos
app.use(express.static(__dirname));

// 🗂️ Cargar la base JSON
function cargarDatos() {
  const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8');
  return JSON.parse(data);
}

// 🏠 HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🧪 Ver estructura → devuelve las claves del JSON
app.get('/ver-estructura', (req, res) => {
  const datos = cargarDatos();
  if (datos.length === 0) return res.json([]);

  res.json(Object.keys(datos[0]));
});

// 📥 Consulta entre fechas/horas
app.post('/consulta-rango', (req, res) => {
  const { fecha_inicio, hora_inicio, fecha_fin, hora_fin } = req.body;

  const datos = cargarDatos();

  const inicio = new Date(`${fecha_inicio} ${hora_inicio}`);
  const fin = new Date(`${fecha_fin} ${hora_fin}`);

  const filtrados = datos.filter(item => {
    const fechaItem = new Date(`${item.fecha_db} ${item.hora_db}`);
    return fechaItem >= inicio && fechaItem <= fin;
  });

  res.json(filtrados);
});

// 📅 Limites: primer y último registro
app.get('/limites', (req, res) => {
  const datos = cargarDatos();

  if (datos.length === 0) {
    return res.json({ inicio: null, fin: null });
  }

  const fechas = datos.map(item => new Date(`${item.fecha_db} ${item.hora_db}`));

  const inicio = new Date(Math.min(...fechas));
  const fin = new Date(Math.max(...fechas));

  res.json({
    inicio: inicio.toISOString(),
    fin: fin.toISOString()
  });
});

// 🟢 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

