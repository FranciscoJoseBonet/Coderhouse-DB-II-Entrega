/**
 * @schema User
 * @desc Objeto completo del usuario (para uso interno/admin).
 * @prop {string} _id ID de MongoDB
 * @prop {string} first_name Nombre
 * @prop {string} last_name Apellido
 * @prop {string} email Correo (único)
 * @prop {number} age Edad
 * @prop {string} password Contraseña hasheada
 * @prop {string} cart ID del carrito
 * @prop {string} role Rol ('user', 'admin', 'premium')
 */
import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.middleware.js";
import UserService from "../services/user.service.js";

const router = Router();

const authenticate = passport.authenticate("jwt", { session: false });

/**
 * @endpoint /api/users
 * @method GET
 * @group Usuarios
 * @desc Obtiene todos los usuarios. Requiere autenticación y rol 'admin'.
 * @header {string} Authorization Token Bearer JWT
 * @return {Array<User>} Lista de objetos de usuario
 * @status {200} Lista de usuarios obtenida
 * @status {403} Acceso Denegado (rol no admin)
 */
router.get("/", authenticate, authorization(["admin"]), async (req, res) => {
	try {
		const result = await UserService.getAllUsers();
		res.send({
			status: "success",
			payload: result,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: error.message,
		});
	}
});

/**
 * @endpoint /api/users
 * @method POST
 * @group Usuarios
 * @desc Crea un nuevo usuario. Requiere rol 'admin'.
 * @header {string} Authorization Token Bearer JWT
 * @body {string} first_name Nombre
 * @body {string} last_name Apellido
 * @body {string} email Correo (único)
 * @body {string} password Contraseña
 * @body {string} [role] Rol (Opcional)
 * @return {User} Usuario creado
 * @status {200} Usuario creado
 * @status {400} Error de validación o email duplicado
 * @status {403} Acceso Denegado (rol no admin)
 */
router.post("/", authenticate, authorization(["admin"]), async (req, res) => {
	const userData = req.body;
	try {
		const result = await UserService.registerUser(userData);
		res.send({
			status: "success",
			payload: result,
		});
	} catch (error) {
		res.status(400).send({
			status: "error",
			message: error.message,
		});
	}
});

/**
 * @endpoint /api/users/:uid
 * @method PUT
 * @group Usuarios
 * @desc Actualiza la información de un usuario por ID. Requiere rol 'admin'.
 * @header {string} Authorization Token Bearer JWT
 * @param {string} uid ID del usuario a actualizar
 * @body {string} [role] Nuevo rol (e.g., 'premium', 'admin')
 * @body {number} [age] Nueva edad
 * @return {User} Usuario actualizado
 * @status {200} Usuario actualizado
 * @status {400} Usuario no encontrado o error de validación
 * @status {403} Acceso Denegado (rol no admin)
 */
router.put("/:uid", authenticate, authorization(["admin"]), async (req, res) => {
	const uid = req.params.uid;
	const data = req.body;
	try {
		const updatedUser = await UserService.updateUser(uid, data);
		res.send({
			status: "success",
			payload: updatedUser,
		});
	} catch (error) {
		res.status(400).send({
			status: "error",
			message: error.message,
		});
	}
});

/**
 * @endpoint /api/users/:uid
 * @method DELETE
 * @group Usuarios
 * @desc Elimina un usuario por ID. Requiere rol 'admin'.
 * @header {string} Authorization Token Bearer JWT
 * @param {string} uid ID del usuario a eliminar
 * @return {object} Mensaje de éxito
 * @status {200} Usuario eliminado
 * @status {400} Usuario no encontrado
 * @status {403} Acceso Denegado (rol no admin)
 */
router.delete("/:uid", authenticate, authorization(["admin"]), async (req, res) => {
	const uid = req.params.uid;
	try {
		const result = await UserService.deleteUser(uid);
		res.status(200).send({
			status: "success",
			payload: result,
		});
	} catch (error) {
		res.status(400).send({
			status: "error",
			message: error.message,
		});
	}
});

export default router;
