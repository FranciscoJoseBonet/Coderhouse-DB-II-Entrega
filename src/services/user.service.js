import UserRepository from "../repositories/user.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import UserDTO from "../dtos/user.dto.js";

import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";
import bcrypt from "bcryptjs";

const userRepository = new UserRepository();
const cartRepository = new CartRepository();

const transporter = createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

class UserService {
	async registerUser(userData) {
		const exists = await userRepository.findUserByEmail(userData.email);
		if (exists) {
			throw new Error("El usuario ya se encuentra registrado.");
		}

		const newCart = await cartRepository.createNewCart();

		const userToSave = {
			...userData,
			cart: newCart._id,
		};

		const newUser = await userRepository.saveUser(userToSave);
		return newUser;
	}

	async getUserByEmail(email) {
		return userRepository.findUserByEmail(email);
	}

	async getUserCurrent(user) {
		return new UserDTO(user);
	}

	async sendRecoveryEmail(email) {
		const user = await userRepository.findUserByEmail(email);
		if (!user) {
			throw new Error("No existe un usuario con ese correo.");
		}

		const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		const recoveryLink = `http://${process.env.HOST}/api/sessions/resetpassword/${token}`;

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Recuperación de Contraseña",
			html: `Haz click en el siguiente enlace para restablecer tu contraseña. Expira en 1 hora: <a href="${recoveryLink}">Restablecer Contraseña</a>`,
		};

		await transporter.sendMail(mailOptions);
		return "Correo de recuperación enviado con éxito.";
	}

	async resetPassword(token, newPassword) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await userRepository.findUserById(decoded.uid);
			if (!user) {
				throw new Error("Usuario no encontrado.");
			}

			const isSamePassword = await bcrypt.compare(newPassword, user.password);
			if (isSamePassword) {
				throw new Error("La nueva contraseña no puede ser idéntica a la anterior.");
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);

			await userRepository.updateUser(user._id, { password: hashedPassword });

			return "Contraseña actualizada con éxito.";
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				throw new Error("El enlace de recuperación ha expirado (más de 1 hora).");
			}
			throw error;
		}
	}
}

export default new UserService();
