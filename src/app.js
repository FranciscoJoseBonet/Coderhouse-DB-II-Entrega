import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";

const app = express();

const uri =
	"mongodb+srv://francisco:contrasenia123@cluster0.kzbq1pi.mongodb.net/coderhouse-dbii";

async function startServer() {
	try {
		await mongoose.connect(uri);

		// Middlewares
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));

		// Rutas
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
