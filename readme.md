# 🎓 Coderhouse - Backend II Proyecto Final

> Servidor de E-Commerce backend con Arquitectura Profesional, Seguridad Avanzada y Gestión Transaccional.

---

## 📋 Descripción del Proyecto

Este proyecto representa la entrega final del curso **Backend II** de Coderhouse. Se ha evolucionado el servidor inicial hacia una **arquitectura por capas profesional**, implementando patrones de diseño avanzados, seguridad robusta y lógica de negocio compleja para un e-commerce.

### ✨ Características Principales

- **Arquitectura Limpia:** Separación de responsabilidades mediante el patrón **DAO** (Data Access Object), **Repository** y **Service**.
- **Seguridad y DTOs:** Uso de _Data Transfer Objects_ para filtrar datos sensibles en las respuestas y manejo seguro de información del usuario `current`.
- **Autenticación y Autorización:**
  - Estrategia **JWT** con Cookies seguras (`httpOnly`).
  - Middleware de autorización basado en roles (`admin`, `user`, `premium`).
- **Sistema de Tickets y Compras:**
  - Lógica de validación de stock en tiempo real.
  - Generación automática de Tickets de compra con código único (UUID).
  - Manejo de productos no procesados (retorno al carrito).
- **Recuperación de Contraseña:** Flujo completo de restablecimiento de contraseña vía email con tokens de expiración (1 hora) y validaciones de seguridad.
- **Documentación API:** Documentación automática generada y disponible en `/api/docs`.

---

## 🚀 Tecnologías Utilizadas

| Tecnología             | Descripción                                |
| :--------------------- | :----------------------------------------- |
| **Node.js & Express**  | Entorno de ejecución y Framework backend.  |
| **MongoDB & Mongoose** | Persistencia de datos (Atlas) y ODM.       |
| **Passport.js & JWT**  | Gestión de sesiones y seguridad.           |
| **Bcrypt**             | Hashing de contraseñas.                    |
| **Nodemailer**         | Servicio de envío de correos electrónicos. |
| **Dotenv**             | Gestión de variables de entorno.           |
| **Route-API-Docs**     | Generación de documentación de API.        |
| **CORS**               | Gestión de acceso de recursos cruzados.    |

---

## 📦 Instalación y Configuración

1.  **Clonar el repositorio e instalar dependencias:**

    ```bash
    git clone <url-del-repo>
    cd <nombre-del-repo>
    npm install
    ```

2.  **Configurar Variables de Entorno:**
    Renombrar o crear un archivo `.env` en la raíz con las siguientes claves:

    ```env
    PORT=8080
    MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db_name>
    JWT_SECRET=tu_clave_secreta_jwt
    COOKIE_SECRET=tu_clave_secreta_cookies

    # Configuración de Mailing (Gmail)
    EMAIL_USER=tu_email@gmail.com
    EMAIL_PASS=tu_app_password_google

    # Configuración de Entorno
    NODE_ENV=development
    HOST=http://localhost:8080
    FRONTEND_URL=http://localhost:3000
    ```

---

## 🏃 Ejecución

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```
