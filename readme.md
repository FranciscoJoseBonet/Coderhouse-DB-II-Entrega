# 🎓 Coderhouse - Backend II Entrega #1

> Sistema de autenticación y gestión de usuarios con Express.js, MongoDB y Passport.js

---

## 📋 Descripción del Proyecto

Esta es la **primera preentrega** del curso **Backend II** de Coderhouse. El proyecto implementa un servidor Express.js completamente funcional con:

- ✅ Autenticación de usuarios con **Passport.js** (Local y JWT)
- ✅ Gestión de usuarios con **MongoDB** mediante **Mongoose**
- ✅ Sistema de cookies seguras para JWT
- ✅ Endpoints CRUD completos para usuarios
- ✅ Rutas protegidas con autenticación

---

## 🚀 Tecnologías Utilizadas

| Tecnología      | Versión | Descripción                   |
| --------------- | ------- | ----------------------------- |
| **Node.js**     | -       | Runtime de JavaScript         |
| **Express.js**  | 4.21.2  | Framework web para Node.js    |
| **MongoDB**     | -       | Base de datos NoSQL           |
| **Mongoose**    | 7.8.7   | ODM para MongoDB              |
| **Passport.js** | 0.7.0   | Middleware de autenticación   |
| **JWT**         | 9.0.2   | JSON Web Tokens para sesiones |
| **bcrypt**      | 6.0.0   | Encriptación de contraseñas   |
| **Nodemon**     | 3.1.11  | Herramienta de desarrollo     |

---

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (.env)
# MONGO_URI=mongodb://...
# JWT_SECRET=tu_secret_key
# PORT=8080
```

---

## 🏃 Ejecución

```bash
# Modo desarrollo (con nodemon)
npm run dev

# O
npm start

# El servidor se iniciará en http://localhost:8080
```

---

## 📡 Rutas de la Aplicación

### 🔐 **Sessions** (`/api/sessions`)

| Método | Ruta            | Descripción                        | Autenticación |
| ------ | --------------- | ---------------------------------- | ------------- |
| `POST` | `/register`     | Registrar un nuevo usuario         | ❌ No         |
| `GET`  | `/failregister` | Respuesta de error en registro     | ❌ No         |
| `POST` | `/login`        | Iniciar sesión y generar JWT       | ❌ No         |
| `GET`  | `/faillogin`    | Respuesta de error en login        | ❌ No         |
| `GET`  | `/current`      | Obtener usuario actual autenticado | ✅ JWT        |

### 👥 **Users** (`/api/users`)

| Método   | Ruta    | Descripción                  | Autenticación |
| -------- | ------- | ---------------------------- | ------------- |
| `GET`    | `/`     | Obtener todos los usuarios   | ❌ No         |
| `POST`   | `/`     | Crear un nuevo usuario       | ❌ No         |
| `PUT`    | `/:uid` | Actualizar un usuario por ID | ❌ No         |
| `DELETE` | `/:uid` | Eliminar un usuario por ID   | ❌ No         |

---

## 📝 Estructura del Proyecto

```
src/
├── app.js                    # Punto de entrada de la aplicación
├── config/
│   └── passport.config.js    # Configuración de estrategias Passport
├── models/
│   └── user.model.js         # Esquema y modelo de usuarios
├── routes/
│   ├── sessions.router.js    # Rutas de autenticación
│   └── users.router.js       # Rutas CRUD de usuarios
└── utils/
    └── bcrypt.utils.js       # Utilidades de encriptación
```

---

## 🔑 Esquema de Usuario

```javascript
{
  first_name: String (required),
  last_name: String (required),
  email: String (required, unique),
  password: String (required, encrypted with bcrypt),
  role: String (default: "user")
}
```

---

## 🛡️ Autenticación

### Login

1. POST a `/api/sessions/login` con `email` y `password`
2. Servidor valida credenciales contra la base de datos
3. Si es válido, genera un **JWT** con expiración de 1 hora
4. JWT se envía en cookie `coderCookie` (httpOnly y segura)

### Acceso a rutas protegidas

- Incluir la cookie `coderCookie` en las requests
- La estrategia JWT de Passport valida automáticamente

---

## 👨‍💻 Autor

**Francisco Bonet**  
_Estudiante de Backend II - Coderhouse_

---

## 📄 Licencia

ISC
