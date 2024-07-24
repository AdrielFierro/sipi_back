import express from 'express';
import cors from 'cors';
import { json } from 'express';
import userRouter from "./routes/user.route.js";
import gruposRouter from "./routes/grupos.route.js"

const app = express();
const port = process.env.PORT || 8080;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(json());

// Configurar CORS para permitir todas las solicitudes desde http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rutas
app.use("/user", userRouter);
app.use("/grupos", gruposRouter);

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
