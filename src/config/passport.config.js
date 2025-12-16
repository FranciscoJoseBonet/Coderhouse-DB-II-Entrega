import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import userModel from "../models/user.model.js";
import { isValidPassword } from "../utils/bcrypt.utils.js";
import UserService from "../services/user.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-coder";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies["coderCookie"];
	}
	return token;
};

const initializePassport = () => {
	passport.use(
		"register",
		new LocalStrategy(
			{
				passReqToCallback: true,
				usernameField: "email",
			},
			async (req, email, password, done) => {
				const { first_name, last_name, age, role } = req.body;

				try {
					const newUser = await UserService.registerUser({
						first_name,
						last_name,
						email,
						age,
						password,
						role,
					});

					return done(null, newUser);
				} catch (error) {
					return done(null, false, { message: error.message });
				}
			}
		)
	);

	passport.use(
		"login",
		new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
			try {
				const user = await userModel.findOne({ email });
				if (!user) {
					return done(null, false, { message: "Usuario no encontrado" });
				}

				if (!isValidPassword(user, password)) {
					return done(null, false, { message: "Contraseña incorrecta" });
				}

				return done(null, user);
			} catch (error) {
				return done("Error al iniciar sesión: " + error.message);
			}
		})
	);

	passport.use(
		"jwt",
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
				secretOrKey: JWT_SECRET,
			},
			async (jwt_payload, done) => {
				try {
					const user = await userModel.findById(jwt_payload.id);
					if (!user) {
						return done(null, false, { message: "Usuario no encontrado" });
					}
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
};

export default initializePassport;
