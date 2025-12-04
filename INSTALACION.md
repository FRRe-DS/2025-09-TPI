# 📦 Guía de Instalación y Ejecución Local
## Módulo de Transporte, Logística y Seguimiento

**Universidad Tecnológica Nacional – FRRe (Resistencia, Chaco)**  
**Desarrollo de Software - Grupo N°9**

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Instalación del Backend](#-instalación-del-backend)
- [Instalación del Frontend](#-instalación-del-frontend)
- [Configuración de Variables de Entorno](#-configuración-de-variables-de-entorno)
- [Ejecución del Proyecto](#-ejecución-del-proyecto)
- [Verificación de la Instalación](#-verificación-de-la-instalación)
- [Solución de Problemas Comunes](#-solución-de-problemas-comunes)
- [Scripts Disponibles](#-scripts-disponibles)
- [Deployment en Producción](#-deployment-en-producción)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

### Software Requerido

| Software | Versión Mínima | Verificar Instalación |
|----------|----------------|----------------------|
| **Node.js** | 18.0.0 o superior | `node --version` |
| **npm** | 9.0.0 o superior | `npm --version` |
| **PostgreSQL** | 14.0 o superior | `psql --version` |
| **Git** | 2.0 o superior | `git --version` |

### Instalación de Requisitos

#### Windows

1. **Node.js y npm:**
   - Descargar desde [nodejs.org](https://nodejs.org/)
   - Instalar la versión LTS (Long Term Support)
   - Verificar: `node --version` y `npm --version`

2. **PostgreSQL:**
   - Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)
   - Durante la instalación, recordar la contraseña del usuario `postgres`
   - Agregar PostgreSQL al PATH del sistema

3. **Git:**
   - Descargar desde [git-scm.com](https://git-scm.com/)
   - Instalar con las opciones por defecto

#### Linux (Ubuntu/Debian)

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar Git
sudo apt install -y git

# Verificar instalaciones
node --version
npm --version
psql --version
git --version
```

#### macOS

```bash
# Instalar Homebrew si no lo tienes
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node@18

# Instalar PostgreSQL
brew install postgresql@16

# Instalar Git
brew install git

# Iniciar PostgreSQL
brew services start postgresql@16
```

---

## 🚀 Instalación del Backend

### Paso 1: Clonar el Repositorio

```bash
# Clonar el proyecto
git clone https://github.com/FRRe-DS/2025-09-TPI.git

# Navegar al directorio del proyecto
cd 2025-09-TPI
```

### Paso 2: Instalar Dependencias del Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar todas las dependencias
npm install
```

**Nota:** Este proceso puede tomar varios minutos dependiendo de tu conexión a internet.

### Paso 3: Configurar la Base de Datos PostgreSQL

#### Opción A: Usando PostgreSQL Local

1. **Iniciar PostgreSQL:**

```bash
# Windows (si está como servicio)
# Buscar "Servicios" y asegurarse que PostgreSQL esté corriendo

# Linux
sudo systemctl start postgresql
sudo systemctl enable postgresql

# macOS
brew services start postgresql@16
```

2. **Crear la Base de Datos:**

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Dentro de psql, ejecutar:
CREATE DATABASE logistica_db;
CREATE USER logistica_user WITH PASSWORD 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE logistica_db TO logistica_user;

# Salir de psql
\q
```

#### Opción B: Usando Base de Datos en la Nube (Render - Ya Configurado)

El proyecto ya tiene configurada una base de datos en Render:
- No necesitas instalar PostgreSQL localmente
- La URL ya está en el archivo `.env`
- Salta al siguiente paso

### Paso 4: Configurar Variables de Entorno

El proyecto ya incluye un archivo `.env` en la carpeta `backend`. Verifica su contenido:

```env
# ===== BASE DE DATOS =====
# Base de datos en la nube (Render)
DATABASE_URL=postgresql://logisticautn_user:RE4cPVMgfWGPh6JRb8nMmNFLfXJa3OKg@dpg-d4f4dmali9vc739c3uk0-a.oregon-postgres.render.com/logisticautn

# ===== SEGURIDAD =====
JWT_SECRET=Wifigratis
```

**Si quieres usar una base de datos local**, modifica el archivo `.env`:

```env
# Base de datos local
DATABASE_URL=postgresql://logistica_user:tu_contraseña@localhost:5432/logistica_db

# Seguridad (cambiar por una clave más segura)
JWT_SECRET=tu_clave_secreta_super_segura
```

**⚠️ IMPORTANTE para Producción:** 
- Cambiar `JWT_SECRET` por una clave aleatoria fuerte
- No compartir el archivo `.env` en repositorios públicos

---

## 🎨 Instalación del Frontend

### Paso 1: Navegar a la Carpeta Frontend

```bash
# Desde la raíz del proyecto
cd Frontend
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno del Frontend (Opcional)

Crear archivo `.env` en la carpeta `Frontend` si necesitas personalizar la URL de la API:

```env
# Para desarrollo local
VITE_API_URL=http://localhost:4000/api

# Para usar la API en producción
# VITE_API_URL=https://api-logisticautn-1.onrender.com/api
```

---

## ⚙️ Configuración de Variables de Entorno

### Variables del Backend

| Variable | Descripción | Valor Actual | Obligatorio |
|----------|-------------|--------------|-------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | Render (cloud) | ✅ Sí |
| `JWT_SECRET` | Clave secreta para tokens JWT | Wifigratis | ✅ Sí |
| `PORT` | Puerto del servidor | `4000` (default) | ❌ No |
| `NODE_ENV` | Entorno de ejecución | `development` | ❌ No |

### Generar una Clave Secreta Segura

```bash
# Opción 1: Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opción 2: Usando OpenSSL
openssl rand -hex 32

# Opción 3: Generador online
# Visitar: https://randomkeygen.com/
```

---

## 🎯 Ejecución del Proyecto

### Ejecutar Backend y Frontend Simultáneamente

#### Opción 1: En Terminales Separadas (Recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Deberías ver:
```
REST API en el puerto 4000
Conexión exitosa a la BD
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

Deberías ver:
```
  VITE v7.2.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### Opción 2: Modo Producción del Backend

```bash
cd backend
npm run build
npm start
```

### URLs del Proyecto

**Desarrollo Local:**
- Backend API: http://localhost:4000
- Frontend: http://localhost:5173

**Producción (Render):**
- Backend API: https://api-logisticautn-1.onrender.com

---

## ✅ Verificación de la Instalación

### 1. Verificar Backend

Abrir el navegador y visitar:
```
http://localhost:4000/
```

Deberías ver una respuesta JSON:
```json
{
  "message": "Bienvenido al Backend de Logística UTN (API REST)",
  "status": "Operacional",
  "version": "v1",
  "contexto": {
    "grupo": "N9",
    "materia": "Desarrollo de Software 2025 - TPI",
    "institucion": "UTN FRRe - Resistencia, Chaco, Argentina"
  }
}
```

### 2. Verificar Frontend

Abrir el navegador y visitar:
```
http://localhost:5173/
```

Deberías ver la interfaz de usuario del sistema de logística.

### 3. Probar Endpoint de Prueba

Usar herramientas como **Postman**, **Thunder Client** o **curl**:

```bash
# Obtener estados de envío (endpoint público)
curl http://localhost:4000/api/logistics/statuses

# Respuesta esperada:
{
  "success": true,
  "data": ["created", "reserved", "in_transit", ...]
}
```

```bash
# Obtener métodos de transporte (endpoint público)
curl http://localhost:4000/api/logistics/transport-methods

# Respuesta esperada:
{
  "success": true,
  "data": [
    {
      "id": "air",
      "nombre": "Aire",
      "descripcion": "Envio por aire",
      "dias_entrega": 3,
      "costo_base": 70
    },
    ...
  ]
}
```

### 4. Verificar Base de Datos

Si usas PostgreSQL local:

```bash
# Conectarse a PostgreSQL
psql -U logistica_user -d logistica_db

# Listar tablas
\dt

# Deberías ver:
# Shippings, ShippingLogs, Users, ProductItems
```

---

## 🐛 Solución de Problemas Comunes

### Problema 1: Error de Conexión a la Base de Datos

**Error:**
```
Fallo en conexión a la BD
```

**Soluciones:**

1. Verificar que PostgreSQL esté corriendo:
   ```bash
   # Linux
   sudo systemctl status postgresql
   
   # Windows
   # Servicios → PostgreSQL
   
   # macOS
   brew services list
   ```

2. Verificar credenciales en `.env`:
   ```env
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_db
   ```

3. Si usas la base de datos de Render (cloud), verifica tu conexión a internet.

### Problema 2: Puerto en Uso

**Error:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Soluciones:**

1. Cambiar el puerto en el código o usar variable de entorno:
   ```bash
   PORT=4001 npm run dev
   ```

2. O matar el proceso que usa el puerto:
   ```bash
   # Windows
   netstat -ano | findstr :4000
   taskkill /PID <PID> /F
   
   # Linux/macOS
   lsof -i :4000
   kill -9 <PID>
   ```

### Problema 3: Módulos no Encontrados

**Error:**
```
Error: Cannot find module 'express'
```

**Solución:**
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Problema 4: Error de TypeScript

**Error:**
```
TSError: ⨯ Unable to compile TypeScript
```

**Solución:**
```bash
# Limpiar caché y recompilar
npm run build
npm run dev
```

### Problema 5: CORS Error en Frontend

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solución:**

El backend ya tiene configurado CORS. Verifica que el frontend esté haciendo peticiones a la URL correcta:
- Desarrollo: `http://localhost:4000/api`
- Producción: `https://api-logisticautn-1.onrender.com/api`

### Problema 6: JWT Secret No Definido

**Error:**
```
JWT_SECRET must be defined
```

**Solución:**

Asegurarse de que `.env` tenga:
```env
JWT_SECRET=tu_clave_secreta_aqui
```

---

## 📜 Scripts Disponibles

### Backend

```bash
# Desarrollo (con hot-reload usando nodemon)
npm run dev

# Compilar TypeScript a JavaScript
npm run build

# Producción (código compilado)
npm start

# Tests (si están configurados)
npm test
```

### Frontend

```bash
# Desarrollo con Vite
npm run dev

# Compilar para producción
npm run build

# Preview de producción local
npm run preview

# Linter
npm run lint
```

---

## 🔑 Credenciales de Prueba

Para probar el sistema, puedes crear un usuario mediante el endpoint de registro.

### Crear Usuario Nuevo

**Usando curl:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Prueba",
    "email": "prueba@utn.edu.ar",
    "password": "password123"
  }'
```

**Usando Postman:**
```
POST http://localhost:4000/api/auth/register

Body (JSON):
{
  "name": "Usuario Prueba",
  "email": "prueba@utn.edu.ar",
  "password": "password123"
}
```

### Iniciar Sesión

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prueba@utn.edu.ar",
    "password": "password123"
  }'
```

**Guardar el token JWT de la respuesta para usarlo en las peticiones protegidas.**

---

## 📊 Estructura de Directorios

```
2025-09-TPI/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración DB (db.ts)
│   │   ├── controllers/     # Lógica de negocio
│   │   │   ├── shippingController.ts
│   │   │   └── userController.ts
│   │   ├── models/          # Modelos Sequelize
│   │   │   ├── shippings.ts
│   │   │   ├── ShippingLog.ts
│   │   │   ├── ProductItem.ts
│   │   │   └── User.ts
│   │   ├── routes/          # Rutas Express
│   │   │   ├── shippingRoutes.ts
│   │   │   └── authRouter.ts
│   │   ├── middlewares/     # Middlewares
│   │   │   ├── authMiddleware.ts
│   │   │   ├── validateShippingInput.ts
│   │   │   └── validator.ts
│   │   ├── utils/           # Utilidades
│   │   │   ├── calculateShippingCost.ts
│   │   │   └── shippingHelpers.ts
│   │   ├── index.ts         # Entrada principal
│   │   └── server.ts        # Configuración Express
│   ├── dist/                # Código compilado (TypeScript → JavaScript)
│   ├── .env                 # Variables de entorno
│   ├── package.json
│   └── tsconfig.json
├── Frontend/
│   ├── src/
│   │   ├── Components/      # Componentes React
│   │   │   └── OrderTracking.jsx
│   │   ├── views/           # Vistas/Páginas
│   │   │   ├── ShippingCostView.jsx
│   │   │   ├── ShippingTable.jsx
│   │   │   └── auth/
│   │   │       └── LoginView.jsx
│   │   ├── assets/          # Recursos estáticos
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── INSTALACION.md           # Este archivo
├── API_DOCUMENTATION.md     # Documentación de la API
└── README.md
```

---

## 🌐 URLs Importantes

| Servicio | URL Local | URL Producción | Descripción |
|----------|-----------|----------------|-------------|
| Backend API | http://localhost:4000 | https://api-logisticautn-1.onrender.com | API REST principal |
| Frontend | http://localhost:5173 | - | Interfaz de usuario |
| Documentación API | http://localhost:4000/ | https://api-logisticautn-1.onrender.com/ | Info del sistema |
| Base de Datos | localhost:5432 | Render (cloud) | PostgreSQL |

---

## 🚀 Deployment en Producción

### Backend en Render

El proyecto ya está deployado en Render:
- URL: https://api-logisticautn-1.onrender.com
- Base de datos PostgreSQL incluida
- Auto-deploy desde GitHub

### Pasos para Deploy en Render (si necesitas replicarlo):

1. **Crear cuenta en Render**: https://render.com
2. **Conectar repositorio de GitHub**
3. **Crear Web Service:**
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment: Node
4. **Crear PostgreSQL Database**
5. **Configurar variables de entorno:**
   - `DATABASE_URL` (automático desde la BD)
   - `JWT_SECRET`
6. **Deploy automático**


## 🎓 Equipo de Desarrollo

**Grupo N°9 – UTN FRRe (Resistencia, Chaco, Argentina)**

### Integrantes
- Franco, Rodrigo Roman
- Miño, Alberto Ramón
- Ramirez, Juan Ángel
- Romero, Sebastián Pablo
- Seeleff, Mauricio Javier
- Solari, Xiomara Oriana

### Información Académica
- **Materia:** Desarrollo de Software
- **Año:** 2025
- **Institución:** Universidad Tecnológica Nacional - Facultad Regional Resistencia
- **Tipo de Trabajo:** Trabajo Práctico Integrador (TPI)
- **Módulo Asignado:** Transporte, Logística y Seguimiento

---

## 📝 Notas Finales

- ✅ **Siempre ejecutar `npm install`** después de clonar o actualizar el repositorio
- ✅ **El archivo `.env` ya está incluido** con configuración de producción
- ✅ **Usar Node.js 18 o superior** para evitar problemas de compatibilidad
- ✅ **La base de datos en Render está siempre disponible**
- ✅ **Leer la documentación de API** en `API_DOCUMENTATION.md`

---

## 🔗 Enlaces Útiles

- **Repositorio:** https://github.com/FRRe-DS/2025-09-TPI
- **API Producción:** https://api-logisticautn-1.onrender.com
- **Node.js:** https://nodejs.org/
- **PostgreSQL:** https://www.postgresql.org/
- **Render:** https://render.com/

---

**¡Listo! Tu proyecto debería estar corriendo correctamente. 🚀**

Si todo funciona, deberías poder:
- ✅ Acceder al backend en http://localhost:4000
- ✅ Acceder al frontend en http://localhost:5173
- ✅ Realizar peticiones a la API
- ✅ Ver logs en las consolas
- ✅ Crear usuarios y hacer login
- ✅ Gestionar envíos


