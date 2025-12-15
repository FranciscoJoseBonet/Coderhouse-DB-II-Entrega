/**
 * Middleware de Autorización basado en roles
 * @param {string[]} roles
 */
export const authorization = (roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).send({
				status: "error",
				message: "No Autorizado: Se requiere autenticación.",
			});
		}

		if (!roles.includes(req.user.role)) {
			return res.status(403).send({
				status: "error",
				message: "Acceso Denegado: Su rol no tiene permisos para esta operación.",
			});
		}
		next();
	};
};
