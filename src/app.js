import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"; // 👈 Librería
import passport from "passport";
import initializePassport from "./config/passport.config.js";

import "dotenv/config.js";

//Routers de la app
import sessionsRouter from "./routes/sessions.router.js";
import userRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";

const PORT = process.env.PORT || 8080;
const app = express();

const uri = process.env.MONGO_URI;
const cookieSecret = process.env.COOKIE_SECRET;

async function startServer() {
	try {
		await mongoose.connect(uri);
		console.log("Conexión exitosa a Mongo Atlas");

		// Middlewares
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));

		if (!cookieSecret) {
			console.error("COOKIE_SECRET no definida. Se requiere para seguridad.");
		}
		app.use(cookieParser(cookieSecret));

		initializePassport();
		app.use(passport.initialize());

		app.use("/api/sessions", sessionsRouter);
		app.use("/api/users", userRouter);
		app.use("/api/products", productsRouter);

		app.listen(PORT, () => {
			console.log(`Servidor iniciado en url: http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Error al conectar con MongoDB:", error);
		process.exit(1);
	}
}

startServer();
