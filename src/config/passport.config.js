import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.utils.js";

/* Clave secreta para JWT (por recomendacion de seguridad lo ponemos en el .env :D )
 *  Pero para motivos de la correccion no saco la carpeta .env con .gitignore
 */
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-coder";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

// Extraer token desde la cookie
const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies["coderCookie"];
	}
	return token;
};

const initializePassport = () => {
	//Para registrar y loguear los usrs
	passport.use(
		"register",
		new LocalStrategy(
			{
				passReqToCallback: true,
				usernameField: "email",
			},
			async (req, email, password, done) => {
				const { first_name, last_name, age } = req.body;

				try {
					const user = await userModel.findOne({ email });
					if (user) {
						return done(null, false, { message: "El usuario ya existe" });
					}

					const newUser = {
						first_name,
						last_name,
						email,
						age,
						password: createHash(password),
					};

					const result = await userModel.create(newUser);
					return done(null, result);
				} catch (error) {
					return done("Error al registrar el usuario: " + error.message);
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

	//para proteger las rutas con jwt
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
