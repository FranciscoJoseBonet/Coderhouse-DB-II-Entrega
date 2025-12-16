import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cors from "cors";

import "dotenv/config.js";

//Routers de la app
import sessionsRouter from "./routes/sessions.router.js";
import userRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const PORT = process.env.PORT || 8080;
const app = express();

const uri = process.env.MONGO_URI;
const cookieSecret = process.env.COOKIE_SECRET;

const corsOptions = {
	origin:
		process.env.NODE_ENV === "production"
			? process.env.FRONTEND_URL
			: "http://localhost:3000",

	credentials: true,

	methods: ["GET", "POST", "PUT", "DELETE"],

	allowedHeaders: ["Content-Type", "Authorization"],
};

async function startServer() {
	try {
		await mongoose.connect(uri);
		console.log("Conexión exitosa a Mongo Atlas");

		// Middlewares
		app.use(cors(corsOptions));

		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));

		if (!cookieSecret) {
			console.error("COOKIE_SECRET no definida. Se requiere para seguridad.");
		}
		app.use(cookieParser(cookieSecret));

		initializePassport();
		app.use(passport.initialize());

		// Rutas
		app.use("/api/sessions", sessionsRouter);
		app.use("/api/users", userRouter);
		app.use("/api/products", productsRouter);
		app.use("/api/carts", cartsRouter);

		app.listen(PORT, () => {
			console.log(`Servidor iniciado en url: http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Error al conectar con MongoDB:", error);
		process.exit(1);
	}
}

startServer();
