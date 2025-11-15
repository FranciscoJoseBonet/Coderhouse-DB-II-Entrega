import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

//Routers de la app
import sessionsRouter from "./routes/sessions.router.js";
import userRouter from "./routes/users.router.js";

//Variables de entorno del sistema
import "dotenv/config.js";

const app = express();

const uri =
	"mongodb+srv://francisco:contrasenia123@cluster0.kzbq1pi.mongodb.net/coderhouse-dbii";

async function startServer() {
	try {
		await mongoose.connect(uri);

		// Middlewares
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));
		app.use(cookieParser());

		//Inicializacion del passport
		initializePassport();
		app.use(passport.initialize());

		// Rutas
		app.use("/api/sessions", sessionsRouter);
		app.use("/api/users", userRouter);

		const PORT = 8080;
		app.listen(PORT, () => {
			console.log(`Servidor iniciado en url: http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Error al conectar con MongoDB:", error);
	}
}

startServer();
