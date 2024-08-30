import { createPool } from 'mysql2';

// Crear la pool de conexiones a la base de datos
const pool = createPool({
    host: 'junction.proxy.rlwy.net',
    user: 'root',
    password: 'LwYsqpoMCffQwcpZTOHfTwUYLdfJUaJW',
    port: 19393,
    database: 'railway',
    waitForConnections: true,
    connectionLimit: 10, // número máximo de conexiones en la pool
    queueLimit: 0 // ilimitado número de conexiones en la cola
});

// Conectar a la base de datos y manejar errores de conexión
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Se cerró la conexión con la base de datos');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos tiene demasiadas conexiones');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexión con la base de datos fue rechazada');
        }
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    if (connection) {
        connection.release(); // liberar la conexión
        console.log('Conectado a la base de datos usando pool de conexiones');
    }
});

export default pool;
