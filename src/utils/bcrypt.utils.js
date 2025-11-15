import bcrypt from "bcrypt";

/**
 * @param {string} password - La contraseña en plain text
 * @returns {string} - Devuelve el hash de la contraseña
 */

//Hasheador de contraseñas
export const createHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

/**
 * Compara una contraseña con su hash almacenado
 * @param {object} user - El objeto de usuario (que contiene el password hasheado)
 * @param {string} password - La contraseña ingresada por el usuario
 * @returns {boolean} - True si la contraseña es válida, false en caso contrario
 */

//Comparador de contraseñas hasheadas
export const isValidPassword = (user, password) => {
	return bcrypt.compareSync(password, user.password);
};
