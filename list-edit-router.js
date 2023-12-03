require('dotenv').config();  // Cargar las variables de entorno

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
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

// Middleware para validar métodos HTTP
const validarMetodoHTTP = (req, res, next) => {
  const metodosValidos = ['GET', 'POST', 'PUT', 'DELETE'];

  if (!metodosValidos.includes(req.method)) {
    return res.status(405).json({ error: 'Método HTTP no permitido.' });
  }

  next();
};

// Aplicar middleware de validación de métodos HTTP
app.use(validarMetodoHTTP);

// Middleware para manejar errores en solicitudes POST y PUT con el cuerpo vacío
const validateRequestBody = (req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') && Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'El cuerpo de la solicitud no puede estar vacío.' });
  }
  next();
};

// Middleware de validación del cuerpo de la solicitud para las solicitudes POST y PUT
app.use(validateRequestBody);

// Ruta para realizar el proceso de autenticación (login)
app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;

  // Validar las credenciales (esto es solo un ejemplo)
  if (usuario === 'usuario1' && contrasena === 'contrasena1') {
    // Crear el token JWT
    const token = jwt.sign({ usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Devolver el token en la respuesta
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas.' });
  }
});

// Ruta protegida que requiere un token JWT válido en el header de autorización
app.get('/ruta-protegida', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado.' });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido.' });
    }

    // El token es válido, puedes realizar acciones protegidas aquí
    res.json({ mensaje: 'Acceso permitido a la ruta protegida.', usuario: decoded.usuario });
  });
});

// Ruta para crear una nueva tarea
app.post('/tareas', (req, res) => {
  const { desc } = req.body;

  if (!desc) {
    return res.status(400).json({ error: 'La descripción de la tarea es obligatoria.' });
  }

  const nuevaTarea = tareas.crearTarea(desc);
  guardarTareasEnArchivo(tareas.listadoArr);
  res.status(201).json(nuevaTarea);
});

// Ruta para eliminar una tarea por su ID
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


// Ruta para actualizar una tarea por su ID
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


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

//Comando para poder editar las tareas en Postman


// Crear Tareas:  http://localhost:3000/tareas
// Borrar Tarea: http://localhost:3000/tareas/{id}, donde {id} es el ID de la tarea que desea eliminar
// Actulizar Tarea: http://localhost:3000/tareas/{id}, donde {id} es el ID de la tarea que desea actualizar