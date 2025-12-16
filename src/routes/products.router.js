/**
 * @schema Product
 * @desc Esquema de un producto en el sistema.
 * @prop {string} _id ID único autogenerado por MongoDB
 * @prop {string} title Título del producto
 * @prop {string} description Descripción detallada
 * @prop {number} price Precio unitario
 * @prop {number} stock Cantidad disponible en inventario
 * @prop {string} category Categoría a la que pertenece
 * @prop {string} code Código único del producto
 * @prop {boolean} status Estado de disponibilidad (activo/inactivo)
 */
import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.middleware.js";
import ProductService from "../services/product.service.js";

const router = Router();
const authenticate = passport.authenticate("jwt", { session: false });

/**
 * @endpoint /api/products
 * @method GET
 * @group Productos
 * @desc Obtiene un listado paginado de productos.
 * @param {int} limit Límite de resultados por página
 * @param {int} page Número de página
 * @return {Array<Product>} Array de productos
 * @status {200} Listado obtenido
 * @status {500} Error interno del servidor
 * @example
 * [
 * { "_id": "65b5d...", "title": "Laptop Gamer", "price": 1200, "stock": 5, "code": "LG001" },
 * { "_id": "65b5d...", "title": "Mouse Inalámbrico", "price": 25, "stock": 50, "code": "MI002" }
 * ]
 */
router.get("/", async (req, res) => {
	try {
		const products = await ProductService.getProducts(req.query);
		res.status(200).send({ status: "success", payload: products });
	} catch (error) {
		res.status(500).send({ status: "error", message: error.message });
	}
});

/**
 * @endpoint /api/products
 * @method POST
 * @group Productos
 * @desc Crea un nuevo producto. Requiere autenticación y rol 'admin'.
 * @header {string} Authorization Token Bearer JWT
 * @body {string} title Título del producto
 * @body {string} description Descripción
 * @body {number} price Precio
 * @body {number} stock Stock inicial
 * @body {string} category Categoría
 * @body {string} code Código único
 * @return {Product} Objeto Producto creado
 * @status {201} Producto creado exitosamente
 * @status {400} Error de validación o código duplicado
 * @status {401} No autorizado (sin token)
 * @status {403} Acceso Denegado (rol no admin)
 */
router.post("/", authenticate, authorization(["admin"]), async (req, res) => {
	try {
		const newProduct = await ProductService.createProduct(req.body);
		res.status(201).send({ status: "success", payload: newProduct });
	} catch (error) {
		res.status(400).send({ status: "error", message: error.message });
	}
});

/**
 * @endpoint /api/products/:pid
 * @method PUT
 * @group Productos
 * @desc Actualiza un producto por su ID. Requiere autenticación y rol 'admin'.
 * @header {string} Authorization Token Bearer JWT
 * @param {string} pid ID del producto a actualizar
 * @body {string} [title] Nuevo título (Opcional)
 * @body {number} [price] Nuevo precio (Opcional)
 * @body {number} [stock] Nuevo stock (Opcional)
 * @return {Product} Producto actualizado
 * @status {200} Producto actualizado
 * @status {400} Error de validación o producto no encontrado
 * @status {403} Acceso Denegado (rol no admin)
 */
router.put("/:pid", authenticate, authorization(["admin"]), async (req, res) => {
	try {
		const updatedProduct = await ProductService.updateProduct(req.params.pid, req.body);
		res.status(200).send({ status: "success", payload: updatedProduct });
	} catch (error) {
		res.status(400).send({ status: "error", message: error.message });
	}
});

/**
 * @endpoint /api/products/:pid
 * @method DELETE
 * @group Productos
 * @desc Elimina un producto por su ID. Requiere autenticación y rol 'admin'.
 * @header {string} Authorization Token Bearer JWT
 * @param {string} pid ID del producto a eliminar
 * @return {object} Mensaje de éxito
 * @status {200} Producto eliminado
 * @status {400} Producto no encontrado
 * @status {403} Acceso Denegado (rol no admin)
 */
router.delete("/:pid", authenticate, authorization(["admin"]), async (req, res) => {
	try {
		await ProductService.deleteProduct(req.params.pid);
		res.status(200).send({ status: "success", message: "Producto eliminado." });
	} catch (error) {
		res.status(400).send({ status: "error", message: error.message });
	}
});

export default router;
