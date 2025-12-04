# 🚚 Sistema de Transporte, Logística y Seguimiento

**Universidad Tecnológica Nacional – FRRe (Resistencia, Chaco)**  
**Desarrollo de Software 2025 - Trabajo Práctico Integrador**  
**Grupo N°9**

---

## 📝 Descripción del Proyecto

Sistema backend completo desarrollado en **Node.js + TypeScript + Express + PostgreSQL** para la gestión integral de envíos, logística y seguimiento de paquetes.

Este módulo forma parte de un **Trabajo Práctico Integrador** compuesto por 3 módulos independientes que se comunican entre sí:

1. **Portal de Compras** 🛒 - Gestión de órdenes y pedidos
2. **Stock de Bienes y Servicios** 📦 - Control de inventario
3. **Transporte, Logística y Seguimiento** 🚛 - **Nuestro Módulo**

---

## 🌐 URL Base de la API

### Producción (Render)
```
https://api-logisticautn-1.onrender.com
```

### Desarrollo Local
```
http://localhost:4000
```

---

## 🚀 Inicio Rápido

### Para Usuarios Externos (Primera vez)

Si es la primera vez que trabajas con este proyecto, sigue la guía completa de instalación:

📖 **[GUÍA DE INSTALACIÓN COMPLETA →](./INSTALACION.md)**

Esta guía incluye:
- ✅ Requisitos previos y su instalación
- ✅ Instalación paso a paso del backend y frontend
- ✅ Configuración de base de datos
- ✅ Variables de entorno
- ✅ Verificación de instalación
- ✅ Solución de problemas comunes

### Para Desarrolladores (Inicio Rápido)

```bash
# 1. Clonar el repositorio
git clone https://github.com/FRRe-DS/2025-09-TPI.git
cd 2025-09-TPI

# 2. Backend
cd backend
npm install
npm run dev

# 3. Frontend (en otra terminal)
cd Frontend
npm install
npm run dev
```

**URLs:**
- Backend API: http://localhost:4000
- Frontend: http://localhost:5173

---

## 📚 Documentación

### 📖 Documentación Completa Disponible

| Documento | Descripción | Para Quién | Enlace |
|-----------|-------------|------------|--------|
| **Guía de Instalación** | Instrucciones completas para correr el proyecto localmente | Usuarios externos, nuevos desarrolladores | **[INSTALACION.md](./INSTALACION.md)** |
| **Documentación de API** | Endpoints, modelos, ejemplos y funcionalidades técnicas | Desarrolladores, integradores de otros módulos | **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** |

### 🔍 ¿Qué Necesitas?

- **¿Primera vez con el proyecto?** → Lee **[INSTALACION.md](./INSTALACION.md)**
- **¿Necesitas consumir la API desde otro módulo?** → Lee **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**
- **¿Quieres integrar con Compras o Stock?** → Revisa la sección "Integración con Otros Módulos" en **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**
- **¿Tienes problemas?** → Consulta "Solución de Problemas Comunes" en **[INSTALACION.md](./INSTALACION.md)**

---

## 💻 Tecnologías Utilizadas

### Backend
- **Node.js** v18+
- **TypeScript** v5.9.3
- **Express.js** v5.1.0
- **Sequelize ORM** v6.37.7
- **PostgreSQL** v16
- **JWT** (JSON Web Tokens)
- **bcryptjs** (Encriptación)

### Frontend
- **React** v19.2.0
- **Vite** v7.2.2
- **React Router** v7.9.6
- **Axios** v1.13.2
- **Tailwind CSS** v4.1.17
- **TanStack Query** v5.90.10

### Infraestructura
- **Render** (Deployment)
- **PostgreSQL en la nube** (Base de datos)

---

## 🎯 Funcionalidades Principales

### ✨ Características del Sistema

- 🔐 **Autenticación JWT** - Registro e inicio de sesión seguro
- 📦 **Gestión de Envíos** - Crear y administrar envíos completos
- 📊 **Seguimiento en Tiempo Real** - Estados y logs detallados con timestamps
- 💰 **Cálculo de Costos** - Cotización automática según peso/volumen
- 🚛 **Múltiples Métodos de Transporte** - Aéreo, terrestre, marítimo, ferroviario, express
- 📱 **API REST Completa** - 7 endpoints documentados
- 🔗 **Integración Multi-Módulo** - Comunicación con Compras y Stock
- 📈 **Historial de Envíos** - Consulta de envíos por usuario
- 🌐 **Endpoints Públicos y Protegidos** - Seguridad granular

### 🚛 Métodos de Transporte Disponibles

| ID | Nombre | Días de Entrega | Costo Base |
|----|--------|-----------------|------------|
| `air` | Aéreo | 3 días | $70 |
| `road` | Terrestre | 4 días | $60 |
| `rail` | Ferroviario | 10 días | $40 |
| `express` | Express | 2 días | $80 |
| `sea` | Marítimo | 15 días | $50 |

---

## 🔌 API Endpoints Principales

### 🔑 Autenticación
```
POST   /api/auth/register    - Registrar usuario
POST   /api/auth/login       - Iniciar sesión (devuelve JWT)
```

### 🚚 Logística

#### Protegidos (requieren JWT)
```
POST   /api/logistics/tracking           - Crear envío
```

#### Públicos (sin autenticación)
```
GET    /api/logistics/tracking/:id       - Obtener envío por ID
PATCH  /api/logistics/:id/status         - Actualizar estado de envío
GET    /api/logistics/users/:id          - Listar envíos de un usuario
GET    /api/logistics/transport-methods  - Obtener métodos de transporte
POST   /api/logistics/cost               - Calcular costo de envío
GET    /api/logistics/statuses           - Obtener estados válidos
```

**📚 Para detalles completos de cada endpoint con ejemplos:** Ver **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

---

## 🏗️ Estructura del Proyecto

```
2025-09-TPI/
├── backend/                      # Backend Node.js + TypeScript
│   ├── src/
│   │   ├── config/              # Configuración de BD
│   │   ├── controllers/         # Lógica de negocio
│   │   │   ├── shippingController.ts    # 7 métodos de logística
│   │   │   └── userController.ts         # Autenticación
│   │   ├── models/              # Modelos Sequelize
│   │   │   ├── shippings.ts
│   │   │   ├── ShippingLog.ts
│   │   │   ├── ProductItem.ts
│   │   │   └── User.ts
│   │   ├── routes/              # Rutas Express
│   │   │   ├── shippingRoutes.ts
│   │   │   └── authRouter.ts
│   │   ├── middlewares/         # Middlewares (auth, validación)
│   │   ├── utils/               # Utilidades (cálculos, helpers)
│   │   ├── index.ts             # Entrada principal
│   │   └── server.ts            # Configuración Express
│   ├── dist/                    # Código compilado
│   ├── .env                     # Variables de entorno
│   ├── package.json
│   └── tsconfig.json
├── Frontend/                     # Frontend React + Vite
│   ├── src/
│   │   ├── Components/          # Componentes React
│   │   ├── views/               # Vistas/Páginas
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── INSTALACION.md               # 📖 Guía de instalación
├── API_DOCUMENTATION.md         # 📚 Documentación de API
└── README.md                    # 👋 Este archivo
```

---

## 🔒 Seguridad

- ✅ Autenticación mediante **JWT**
- ✅ Contraseñas hasheadas con **bcryptjs**
- ✅ Validación de entrada con **express-validator**
- ✅ Protección de rutas sensibles con middleware
- ✅ Variables de entorno para credenciales
- ✅ CORS configurado
- ✅ Transacciones de base de datos para consistencia

---

## 🔗 Integración con Otros Módulos

### Comunicación entre Módulos

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Compras   │◄─────►│    Stock    │◄─────►│  Logística  │
│  (Módulo 1) │       │  (Módulo 2) │       │  (Módulo 3) │
└─────────────┘       └─────────────┘       └─────────────┘
      │                     │                       │
      └─────────────────────┴───────────────────────┘
                    API REST / HTTP
```

### Nuestro módulo se integra con:

**📦 Módulo de Stock:**
- Verifica disponibilidad de productos
- Obtiene detalles (peso, dimensiones)
- Reserva productos al crear envío

**🛒 Módulo de Compras:**
- Recibe órdenes de compra
- Provee métodos de transporte disponibles
- Calcula costos de envío
- Crea y gestiona envíos

**Ver detalles de integración en:** **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** → Sección "Integración con Otros Módulos"

---

## 📊 Base de Datos

### Modelos Principales

1. **User** - Usuarios del sistema (autenticación)
2. **Shipping** - Envíos registrados (estado, costo, productos)
3. **ShippingLog** - Historial de estados (timestamps, mensajes)
4. **ProductItem** - Productos en envíos (peso, dimensiones)

### Diagrama ER (Simplificado)

```
┌──────────┐        ┌──────────────┐        ┌──────────────┐
│   User   │───1:N──│   Shipping   │───1:N──│ ShippingLog  │
└──────────┘        └──────────────┘        └──────────────┘
     id                    id                     id
     name                  user_id                shipping_id
     email                 order_id               status
     password              status                 message
                           shipping_cost          timestamp
                           transport_type
                           products (JSON)
                           delivery_address (JSON)
```

---

## 🧪 Testing y Verificación

### Probar la API en Producción

```bash
# Obtener estados válidos (público)
curl https://api-logisticautn-1.onrender.com/api/logistics/statuses

# Obtener métodos de transporte (público)
curl https://api-logisticautn-1.onrender.com/api/logistics/transport-methods
```

### Herramientas Recomendadas

- **Postman** - Cliente API completo
- **Thunder Client** - Extensión de VS Code
- **curl** - Línea de comandos
- **Insomnia** - Cliente API alternativo

---

## 👥 Equipo de Desarrollo

**Grupo N°9 – UTN FRRe (Resistencia, Chaco, Argentina)**

### Integrantes
- 👤 **Ruiz Diaz Javier A.**
- 👤 **Jorge Eduardo Villaverde**
- 👤 **Romero Sebastian**

### Información Académica
- **Materia:** Desarrollo de Software
- **Año:** 2025
- **Institución:** Universidad Tecnológica Nacional - Facultad Regional Resistencia
- **Tipo de Trabajo:** Trabajo Práctico Integrador (TPI)
- **Módulo Asignado:** Transporte, Logística y Seguimiento (Módulo 3)

---

## 📞 Soporte

### ¿Necesitas Ayuda?

1. **Instalación:** Consulta **[INSTALACION.md](./INSTALACION.md)**
2. **Uso de la API:** Revisa **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**
3. **Problemas técnicos:** Crea un issue en el repositorio
4. **Integración con otros módulos:** Contacta al equipo

---

## 📄 Licencia

Proyecto académico desarrollado para la **Universidad Tecnológica Nacional - FRRe**.  
Todos los derechos reservados - Grupo N°9 - 2025

---

## 🌟 Estado del Proyecto

✅ **Versión 1.0 - En Producción**

### Completado
- [x] Backend con TypeScript + Express
- [x] Base de datos PostgreSQL en la nube
- [x] Autenticación JWT completa
- [x] CRUD completo de envíos
- [x] Sistema de seguimiento con logs
- [x] Cálculo de costos automático
- [x] Frontend React funcional
- [x] Integración con otros módulos (Compras y Stock)
- [x] Documentación completa (2 archivos .md)
- [x] Deployment en Render (producción)
- [x] API pública accesible 24/7

### En Desarrollo
- [ ] Tests unitarios y de integración
- [ ] Panel de administración
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Swagger/OpenAPI documentation

---

## 🔗 Enlaces Importantes

| Recurso | URL |
|---------|-----|
| **Repositorio GitHub** | https://github.com/FRRe-DS/2025-09-TPI |
| **API en Producción** | https://api-logisticautn-1.onrender.com |
| **Guía de Instalación** | [INSTALACION.md](./INSTALACION.md) |
| **Documentación API** | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |

---

## 📝 Convenciones del Proyecto

### Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
refactor: refactorización de código
test: agregar o modificar tests
```

### Branches
```
main           - Producción
develop        - Desarrollo
feature/nombre - Nuevas funcionalidades
fix/nombre     - Correcciones
```

---

## 🚀 Próximos Pasos para Nuevos Desarrolladores

1. **Lee la documentación completa:**
   - Comienza con **[INSTALACION.md](./INSTALACION.md)**
   - Luego revisa **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

2. **Configura tu entorno local:**
   - Sigue los pasos de instalación
   - Verifica que todo funcione

3. **Explora el código:**
   - Revisa los controladores en `backend/src/controllers/`
   - Entiende los modelos en `backend/src/models/`
   - Analiza las rutas en `backend/src/routes/`

4. **Prueba la API:**
   - Usa Postman o Thunder Client
   - Prueba todos los endpoints
   - Verifica las respuestas

5. **Contribuye:**
   - Crea una rama para tus cambios
   - Sigue las convenciones del proyecto
   - Documenta tus cambios

---

**Desarrollado con ❤️ por el Grupo N°9 - UTN FRRe**

*Para más información, consulta la documentación detallada en los archivos .md*

---

**¿Primera vez aquí? → Comienza por [INSTALACION.md](./INSTALACION.md) 📖**
