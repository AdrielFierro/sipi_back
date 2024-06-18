import pool from '../db.js';

export const crearUsuario = async (req, res) => {
    try {
        const { nom_usuario, contraseña, preguntaSeg, respuestaSeg, plataformas_usuario } = req.body;

        // Verificar que todos los datos necesarios estén presentes
        if (!nom_usuario || !contraseña || !preguntaSeg || !respuestaSeg || !plataformas_usuario || !Array.isArray(plataformas_usuario)) {
            return res.status(400).json({ error: 'Faltan datos necesarios o formato incorrecto' });
        }

        // Obtener una conexión de la pool
        const connection = await pool.promise().getConnection();
        await connection.beginTransaction();

        try {
            // Insertar el nuevo usuario en la tabla usuarios
            const insertUsuarioQuery = 'INSERT INTO usuarios (nom_usuario, contraseña, preguntaSeg, respuestaSeg) VALUES (?, ?, ?, ?)';
            const usuarioInsertResult = await connection.execute(insertUsuarioQuery, [nom_usuario, contraseña, preguntaSeg, respuestaSeg]);

            // Insertar las plataformas asociadas en usuario_plataformas
            const insertPlataformasQuery = 'INSERT INTO usuario_plataformas (nom_usuario, plataforma_id) VALUES (?, ?)';
            for (const plataforma_id of plataformas_usuario) {
                await connection.execute(insertPlataformasQuery, [nom_usuario, plataforma_id]);
            }

            // Confirmar la transacción si todo ha ido bien
            await connection.commit();
            connection.release();

            res.status(201).json({ message: 'Usuario creado exitosamente'});
        } catch (error) {
            // Revertir la transacción si ocurre algún error
            await connection.rollback();
            connection.release();

            console.error('Error creando usuario:', error);
            res.status(500).json({ error: 'Error creando usuario' });
        }
    } catch (error) {
        console.error('Error de base de datos:', error);
        res.status(500).json({ error: 'Error de base de datos' });
    }
};


export const iniciarSesion = async (req, res) => {
    const { nom_usuario, contraseña } = req.body;

    if (!nom_usuario || !contraseña) {
        return res.status(400).json({ error: 'Faltan nombre de usuario o contraseña en el cuerpo de la solicitud' });
    }

    try {
        const connection = await pool.promise().getConnection();
        
        // Consulta para verificar si existe el usuario y la contraseña en la tabla usuarios
        const query = 'SELECT * FROM usuarios WHERE nom_usuario = ? AND contraseña = ?';
        const [rows] = await connection.execute(query, [nom_usuario, contraseña]);

        connection.release(); // Liberar la conexión de la pool

        if (rows.length === 1) {
            // Usuario encontrado, iniciar sesión exitosa
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        } else {
            // Usuario no encontrado o contraseña incorrecta
            res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

export const plataformasUsuario = async (req, res) => {
    const { nom_usuario } = req.params;
  
    if (!nom_usuario) {
      return res.status(400).json({ error: 'El nombre de usuario es requerido' });
    }
  
    try {
      const connection = await pool.promise().getConnection();
  
      const query = 'SELECT plataforma_id FROM usuario_plataformas WHERE nom_usuario = ?';
      const [rows] = await connection.execute(query, [nom_usuario]);
  
      connection.release();
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron plataformas para este usuario' });
      }
  
      const plataformaIds = rows.map(row => row.plataforma_id);
      res.status(200).json({ plataformas: plataformaIds });
    } catch (error) {
      console.error('Error obteniendo plataformas del usuario:', error);
      res.status(500).json({ error: 'Error al obtener las plataformas del usuario' });
    }
  };