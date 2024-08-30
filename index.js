import express from 'express';
import cors from 'cors';
import { json } from 'express';
import userRouter from "./routes/user.route.js";
import gruposRouter from "./routes/grupos.route.js"

const app = express();
const port = process.env.PORT || 8080;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(json());


app.use(cors(
    // {
    // // origin: 'https://movie-tracker-kappa.vercel.app',
    // origin: 'https://sipi-back-anbc.onrender.com',
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],}
));

// Rutas
app.use("/user", userRouter);
app.use("/grupos", gruposRouter);

app.post('/user/login', (req, res) => {
    res.send('CORS disabled');
  });

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en ${port}`);
});
