
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Tareas = require('./modelos/tareas'); // Importar la clase Tareas desde el archivo tareas.js

// Configuración de Express
const app = express();
const port = 3000; //Numero de Puerto

// Middleware para manejar JSON en el cuerpo de la solicitud
app.use(bodyParser.json());

// Ruta del archivo data.json
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

// Crear una instancia de la clase Tareas
const tareas = new Tareas();

// Cargar las tareas desde el archivo al iniciar el servidor
tareas.cargarTareasFromArray(leerTareasDesdeArchivo());

// Ruta para obtener la lista de tareas completas
app.get('/tareas/completas', (req, res) => {
  const tareasCompletas = tareas.listadoArr.filter(tarea => tarea.completadoEn !== null);
  res.json(tareasCompletas);
});

// Ruta para obtener la lista de tareas incompletas
app.get('/tareas/incompletas', (req, res) => {
  const tareasIncompletas = tareas.listadoArr.filter(tarea => tarea.completadoEn === null);
  res.json(tareasIncompletas);
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


//Comando para poder ver tanto la lista de tareas completas como las incompletas
//en Postman o directamente con el navegador

// Tareas completas:  http://localhost:3000/tareas/completas
// Tareas Incompletas: http://localhost:3000/tareas/incompletas
