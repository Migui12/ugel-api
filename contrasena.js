const bcrypt = require('bcryptjs');
const { Usuario } = require('./models'); // Ajusta la ruta a tu modelo

const actualizarPassword = async () => {
  try {
    const email = 'admin@ugel.gob.pe'; // usuario al que quieres actualizar la contraseña
    const nuevaPassword = 'Admin2026';    // la nueva contraseña en texto plano

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { email: email.toLowerCase().trim() } });

    if (!usuario) {
      console.log('Usuario no encontrado');
      return;
    }

    // Hashear nueva contraseña
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(nuevaPassword, rounds);

    // Actualizar en la DB
    await usuario.update({ password: hashedPassword });

    console.log('Contraseña actualizada correctamente ✅');

  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
  } finally {
    process.exit();
  }
};

actualizarPassword();
