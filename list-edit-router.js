const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Tareas = require('./modelos/tareas');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Ruta del archivo data.json dentro de la carpeta 'db'
const dataFilePath = path.join(__dirname, 'db', 'data.json');

// Función para leer las tareas desde el archivo data.json
const leerTareasDesdeArchivo = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Función para guardar las tareas en el archivo data.json
const guardarTareasEnArchivo = (tareas) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(tareas, null, 2), 'utf-8');
};

const tareas = new Tareas();
tareas.cargarTareasFromArray(leerTareasDesdeArchivo());

// Obtener todas las tareas
app.get('/tareas', (req, res) => {
  res.json(tareas.listadoArr);
});

// Obtener una sola tarea por su ID
app.get('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const tarea = tareas.obtenerTarea(id);

  if (tarea) {
    res.json(tarea);
  } else {
    res.status(404).json({ error: 'Tarea no encontrada.' });
  }
});

// Crear una nueva tarea
app.post('/tareas', (req, res) => {
  const { desc } = req.body;

  if (!desc) {
    return res.status(400).json({ error: 'La descripción de la tarea es obligatoria.' });
  }

  const nuevaTarea = tareas.crearTarea(desc);
  guardarTareasEnArchivo(tareas.listadoArr);
  res.status(201).json(nuevaTarea);
});

// Actualizar una tarea por su ID
app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { desc, completado } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Se requiere el ID de la tarea para actualizarla.' });
  }

  const tareaActualizada = tareas.actualizarTarea(id, desc, completado);
  guardarTareasEnArchivo(tareas.listadoArr);

  if (tareaActualizada) {
    res.json({ mensaje: 'Tarea actualizada correctamente.' });
  } else {
    res.status(404).json({ error: 'Tarea no encontrada.' });
  }
});

// Eliminar una tarea por su ID
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Se requiere el ID de la tarea para eliminarla.' });
  }

  const tareaEliminada = tareas.borrarTarea(id);
  guardarTareasEnArchivo(tareas.listadoArr);

  if (tareaEliminada) {
    res.json({ mensaje: 'Tarea eliminada correctamente.' });
  } else {
    res.status(404).json({ error: 'Tarea no encontrada.' });
  }
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

