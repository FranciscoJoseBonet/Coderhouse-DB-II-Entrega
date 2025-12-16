/**
 * @schema UserRegister
 * @desc Objeto requerido para el registro de un nuevo usuario.
 * @prop {string} first_name Nombre del usuario
 * @prop {string} last_name Apellido del usuario
 * @prop {string} email Correo electrónico (debe ser único)
 * @prop {number} age Edad
 * @prop {string} password Contraseña (sin hashear)
 * @prop {string} [role] Rol del usuario (default: 'user')
 */
/**
 * @schema UserDTO
 * @desc Objeto DTO (Data Transfer Object) de usuario para la ruta /current
 * @prop {string} first_name Nombre del usuario
 * @prop {string} last_name Apellido del usuario
 * @prop {string} email Correo electrónico
 * @prop {string} role Rol del usuario ('user', 'admin', 'premium')
 * @prop {string} cart ID del carrito asociado
 */
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserService from "../services/user.service.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @endpoint /api/sessions/register
 * @method POST
 * @group Autenticación
 * @desc Registra un nuevo usuario en el sistema, crea un carrito asociado.
 * @body {UserRegister} user Datos de registro
 * @return {object} ID del usuario y mensaje de éxito
 * @status {201} Usuario registrado exitosamente
 * @status {400} Error de registro o email ya en uso
 */
router.post(
	"/register",
	passport.authenticate("register", {
		failureRedirect: "/api/sessions/failregister",
		session: false,
	}),
	async (req, res) => {
		try {
			await UserService.registerUser(req.user);

			res.status(201).send({
				status: "success",
				message: "Usuario registrado y carrito creado exitosamente.",
				payload: { userId: req.user._id },
			});
		} catch (error) {
			res.status(400).send({
				status: "error",
				message: error.message,
			});
		}
	}
);

/**
 * @endpoint /api/sessions/failregister
 * @method GET
 * @group Autenticación
 * @desc Endpoint de falla de registro.
 * @return {object} Mensaje de error
 * @status {400} Error al registrar
 */
router.get("/failregister", (req, res) => {
	res.status(400).send({
		status: "error",
		message: "Error al registrar el usuario.",
	});
});

/**
 * @endpoint /api/sessions/login
 * @method POST
 * @group Autenticación
 * @desc Inicia sesión, genera un token JWT y lo establece como cookie.
 * @body {string} email Correo electrónico
 * @body {string} password Contraseña
 * @return {object} Payload del JWT (datos del usuario sin password)
 * @status {200} Login exitoso (cookie 'coderCookie' establecida)
 * @status {401} Credenciales inválidas
 */
router.post(
	"/login",
	passport.authenticate("login", {
		failureRedirect: "/api/sessions/faillogin",
		session: false,
	}),
	async (req, res) => {
		const user = req.user;
		// Creamos el payload para el JWT
		const payload = {
			id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			role: user.role,
		};
		// Firmamos el token
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
		// Lo mandamos en la cookie
		res.cookie("coderCookie", token, {
			httpOnly: true,
			secure: false,
			maxAge: 3600000,
		});
		// Respuesta al cliente
		res.status(200).send({
			status: "success",
			message: "Login exitoso",
			payload: payload,
		});
	}
);

/**
 * @endpoint /api/sessions/faillogin
 * @method GET
 * @group Autenticación
 * @desc Endpoint de falla de login.
 * @return {object} Mensaje de error
 * @status {401} Falla de autenticación
 */
router.get("/faillogin", (req, res) => {
	res.status(401).send({
		status: "error",
		message: "Fallo la autenticación de login.",
	});
});

/**
 * @endpoint /api/sessions/logout
 * @method GET
 * @group Autenticación
 * @desc Cierra la sesión eliminando la cookie JWT.
 * @return {object} Mensaje de éxito
 * @status {200} Logout exitoso
 */
router.get("/logout", (req, res) => {
	res.clearCookie("coderCookie");
	res.status(200).send({
		status: "success",
		message: "Logout exitoso, cookie eliminada.",
	});
});

/**
 * @endpoint /api/sessions/current
 * @method GET
 * @group Autenticación
 * @desc Obtiene la información del usuario autenticado (payload del JWT).
 * @header {string} Cookie coderCookie (token JWT)
 * @return {UserDTO} Objeto DTO con información de sesión segura
 * @status {200} Información de sesión obtenida
 * @status {401} No autorizado (token inválido o ausente)
 */
router.get(
	"/current",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const userDTO = await UserService.getUserCurrent(req.user);

		res.status(200).send({
			status: "success",
			message: "Información de sesión actual obtenida de forma segura.",
			payload: userDTO,
		});
	}
);

/**
 * @endpoint /api/sessions/forgotpassword
 * @method POST
 * @group Autenticación / Recuperación
 * @desc Solicita un enlace de recuperación de contraseña y lo envía por email.
 * @body {string} email Correo del usuario
 * @return {object} Mensaje de éxito
 * @status {200} Enlace enviado (si el email existe)
 * @status {500} Error al enviar el email
 */
router.post("/forgotpassword", async (req, res) => {
	const { email } = req.body;
	try {
		await UserService.sendRecoveryEmail(email);
		res.status(200).send({
			status: "success",
			message: "Si el email existe, se ha enviado un enlace de recuperación.",
		});
	} catch (error) {
		console.error("Error sending recovery email:", error);
		res.status(500).send({
			status: "error",
			message: "Error al procesar la solicitud de recuperación. Intente más tarde.",
		});
	}
});

/**
 * @endpoint /api/sessions/resetpassword/:token
 * @method POST
 * @group Autenticación / Recuperación
 * @desc Restablece la contraseña usando el token de recuperación.
 * @param {string} token Token de recuperación (parte de la URL)
 * @body {string} newPassword Nueva contraseña
 * @return {object} Mensaje de éxito
 * @status {200} Contraseña restablecida correctamente
 * @status {400} Token inválido/expirado o contraseña repetida
 */
router.post("/resetpassword/:token", async (req, res) => {
	const { token } = req.params;
	const { newPassword } = req.body;

	try {
		await UserService.resetPassword(token, newPassword);
		res.status(200).send({
			status: "success",
			message: "Contraseña restablecida correctamente.",
		});
	} catch (error) {
		let status = 400;
		if (error.message.includes("expirado")) {
			status = 401;
		}
		res.status(status).send({
			status: "error",
			message: error.message,
		});
	}
});

export default router;
