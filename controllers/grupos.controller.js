import pool from '../db.js';

export const crearGrupo = async (req, res) => {
  const { nom_usuario, nombre_grupo } = req.params;

  try {
    // Verificar si ya existe un grupo con el mismo nombre
    const [rows] = await pool.promise().query('SELECT * FROM grupos WHERE nombre = ?', [nombre_grupo]);

    if (rows.length > 0) {
      return res.status(400).json({ message: 'El nombre del grupo ya existe' });
    }

    // Si no existe, crear el nuevo grupo en la tabla 'grupos'
    await pool.promise().query('INSERT INTO grupos (nombre) VALUES (?)', [nombre_grupo]);

    // Insertar en la tabla 'usuario_grupos'
    await pool.promise().query('INSERT INTO usuario_grupos (nombre_grupo, nombre_usuario) VALUES (?, ?)', [nombre_grupo, nom_usuario]);

    return res.status(201).json({ message: 'Grupo creado con éxito' });
  } catch (error) {
    console.error('Error al crear el grupo:', error);
    return res.status(500).json({ message: 'Hubo un problema al crear el grupo' });
  }
};

export const unirseAGrupo = async (req, res) => {
    const { nom_usuario, nombre_grupo } = req.params;

    try {
        // Verificar si existe el grupo con el nombre_grupo dado
        const [rows] = await pool.promise().query('SELECT * FROM grupos WHERE nombre = ?', [nombre_grupo]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Grupo no existe' });
        }

        // Verificar si el usuario ya está en el grupo
        const [existingUser] = await pool.promise().query('SELECT * FROM usuario_grupos WHERE nombre_grupo = ? AND nombre_usuario = ?', [nombre_grupo, nom_usuario]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Ya te encuentras en el grupo' });
        }

        // Si no está en el grupo, agregarlo a usuario_grupos
        await pool.promise().query('INSERT INTO usuario_grupos (nombre_grupo, nombre_usuario) VALUES (?, ?)', [nombre_grupo, nom_usuario]);

        return res.status(200).json({ message: 'Te has unido al grupo exitosamente' });
    } catch (error) {
        console.error('Error al unirse al grupo:', error);
        return res.status(500).json({ message: 'Hubo un problema al unirse al grupo' });
    }
};

export const obtenerGruposUsuario = async (req, res) => {
    const { nom_usuario } = req.params;

    try {
        // Obtener los grupos del usuario desde usuario_grupos
        const [rows] = await pool.promise().query('SELECT nombre_grupo FROM usuario_grupos WHERE nombre_usuario = ?', [nom_usuario]);

        // Extraer los nombres de grupo de los resultados
        const grupos = rows.map(row => row.nombre_grupo);

        return res.status(200).json({ grupos });
    } catch (error) {
        console.error('Error al obtener los grupos del usuario:', error);
        return res.status(500).json({ message: 'Hubo un problema al obtener los grupos del usuario' });
    }
};

export const obtenerUsuariosGrupo = async (req, res) => {
    const { nombre_grupo } = req.params;

    try {
        // Consultar los usuarios que pertenecen al grupo especificado
        const [rows] = await pool.promise().query('SELECT nombre_usuario FROM usuario_grupos WHERE nombre_grupo = ?', [nombre_grupo]);

        // Extraer los nombres de usuario de los resultados
        const usuarios = rows.map(row => row.nombre_usuario);

        return res.status(200).json({ usuarios });
    } catch (error) {
        console.error('Error al obtener los usuarios del grupo:', error);
        return res.status(500).json({ message: 'Hubo un problema al obtener los usuarios del grupo' });
    }
};