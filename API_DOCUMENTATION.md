# 📚 Documentación Técnica de la API
## Módulo de Transporte, Logística y Seguimiento

**Universidad Tecnológica Nacional – FRRe (Resistencia, Chaco)**  
**Desarrollo de Software 2025 - Grupo N°9 - TPI**

---

## 📋 Tabla de Contenidos

- [Información General](#-información-general)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Modelos de Datos](#-modelos-de-datos)
- [Autenticación y Seguridad](#-autenticación-y-seguridad)
- [Endpoints de Autenticación](#-endpoints-de-autenticación)
- [Endpoints de Logística](#-endpoints-de-logística)
- [Códigos de Estado HTTP](#-códigos-de-estado-http)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Integración con Otros Módulos](#-integración-con-otros-módulos)
- [Manejo de Errores](#-manejo-de-errores)
- [Glosario](#-glosario)

---

## 🌐 Información General

### Base URL

**Desarrollo Local:**
```
http://localhost:4000
```

**Producción (Render):**
```
https://api-logisticautn-1.onrender.com
```

### Rutas Base por Módulo
```
/api/auth          → Autenticación y usuarios
/api/logistics     → Logística y envíos
```

### Formato de Respuestas
Todas las respuestas de la API están en formato **JSON**.

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

**Respuesta de Error:**
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalle técnico del error"
}
```

### Versión de la API
**v1.0** - Diciembre 2025

---

## 🏗 Arquitectura del Sistema

### Stack Tecnológico

**Backend:**
- Node.js v18+
- TypeScript v5.9.3
- Express.js v5.1.0
- Sequelize ORM v6.37.7
- PostgreSQL v16

**Autenticación:**
- JWT (JSON Web Tokens)
- bcryptjs (hash de contraseñas)

**Validación:**
- express-validator v7.2.1

### Capas de la Aplicación

```
┌─────────────────────────────────────┐
│         CLIENTE (Frontend)          │
└──────────────┬──────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────┐
│         RUTAS (Routes)              │
│  - shippingRoutes.ts                │
│  - authRouter.ts                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      MIDDLEWARES                    │
│  - authMiddleware (JWT)             │
│  - validateShippingInput            │
│  - validator                        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      CONTROLADORES                  │
│  - shippingController.ts            │
│  - userController.ts                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      SERVICIOS Y UTILIDADES         │
│  - calculateShippingCost.ts         │
│  - shippingHelpers.ts               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         MODELOS (ORM)               │
│  - Shipping                         │
│  - ShippingLog                      │
│  - User                             │
│  - ProductItem                      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      BASE DE DATOS (PostgreSQL)     │
└─────────────────────────────────────┘
```

---

## 📊 Modelos de Datos

### 1. Usuario (User)

```typescript
interface User {
  id: number;                    // PK, autoincrement
  name: string;                  // Nombre completo
  email: string;                 // Email único
  password: string;              // Hash bcrypt
  createdAt: Date;               // Timestamp de creación
  updatedAt: Date;               // Timestamp de actualización
}
```

**Validaciones:**
- `email`: Debe ser un email válido y único
- `password`: Mínimo 6 caracteres (se hashea con bcrypt)
- `name`: Mínimo 3 caracteres

---

### 2. Envío (Shipping)

```typescript
interface Shipping {
  id: number;                              // PK, autoincrement
  user_id: number;                         // FK → User.id
  order_id: string;                        // ID de la orden de compra
  status: ShippingStatus;                  // Estado del envío
  shipping_cost: number;                   // Costo decimal (PESOS)
  products: ProductDetail[];               // Array JSON de productos
  delivery_address_json: DeliveryAddress;  // Dirección JSON
  transport_type: TransportType;           // Tipo de transporte
  departure_postal_code: string;           // Código postal de origen
  estimated_delivery_at: Date;             // Fecha estimada de entrega
  createdAt: Date;                         // Timestamp de creación
  updatedAt: Date;                         // Timestamp de actualización
  
  // Relaciones
  logs?: ShippingLog[];                    // Logs de seguimiento
}
```

**Estados Válidos (ShippingStatus):**
```typescript
type ShippingStatus = 
  | 'created'           // Envío creado
  | 'reserved'          // Stock reservado
  | 'in_transit'        // En tránsito
  | 'in_distribution'   // En distribución
  | 'arrived'           // Llegó al destino
  | 'delivered'         // Entregado
  | 'cancelled';        // Cancelado
```

**Tipos de Transporte (TransportType):**
```typescript
type TransportType = 
  | 'air'      // Aéreo - 3 días - $70 base
  | 'road'     // Terrestre - 4 días - $60 base
  | 'rail'     // Ferroviario - 10 días - $40 base
  | 'express'  // Express - 2 días - $80 base
  | 'sea';     // Marítimo - 15 días - $50 base
```

---

### 3. Log de Seguimiento (ShippingLog)

```typescript
interface ShippingLog {
  id: number;                    // PK, autoincrement
  shipping_id: number;           // FK → Shipping.id
  status: string;                // Estado del envío en este punto
  message: string;               // Mensaje descriptivo
  timestamp: Date;               // Momento del cambio
  createdAt: Date;               // Timestamp de creación
  updatedAt: Date;               // Timestamp de actualización
}
```

**Ejemplo de Log:**
```json
{
  "id": 1,
  "shipping_id": 42,
  "status": "in_transit",
  "message": "El paquete salió del centro de distribución.",
  "timestamp": "2025-12-04T14:30:00Z"
}
```

---

### 4. Detalle de Producto (ProductDetail)

```typescript
interface ProductDetail {
  id: string;                    // ID del producto
  quantity: number;              // Cantidad
  weight_kg: number;             // Peso en kilogramos
  dimensions_cm: {               // Dimensiones en cm
    width: number;               // Ancho
    height: number;              // Alto
    length: number;              // Largo
  };
}
```

**Ejemplo:**
```json
{
  "id": "PROD-12345",
  "quantity": 2,
  "weight_kg": 5.5,
  "dimensions_cm": {
    "width": 30,
    "height": 20,
    "length": 40
  }
}
```

---

### 5. Dirección de Entrega (DeliveryAddress)

```typescript
interface DeliveryAddress {
  street: string;       // Calle y número
  city: string;         // Ciudad
  state?: string;       // Provincia/Estado (opcional)
  postal_code: string;  // Código postal
  country: string;      // País
  notes?: string;       // Notas adicionales (opcional)
}
```

**Ejemplo:**
```json
{
  "street": "Av. 25 de Mayo 1234",
  "city": "Resistencia",
  "state": "Chaco",
  "postal_code": "H3500",
  "country": "Argentina",
  "notes": "Casa con rejas blancas"
}
```

---

## 🔐 Autenticación y Seguridad

### JWT (JSON Web Tokens)

La API utiliza JWT para autenticar peticiones protegidas.

**Flujo de Autenticación:**

1. Usuario inicia sesión con email y contraseña
2. El servidor valida las credenciales
3. Si son correctas, genera un JWT firmado
4. El cliente incluye el JWT en el header de las peticiones protegidas
5. El servidor valida el JWT en cada petición

### Formato del Token JWT

**Header de Autorización:**
```
Authorization: Bearer <token_jwt>
```

**Ejemplo:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Contenido del Token (Payload)

```json
{
  "id": 1,
  "email": "user@example.com",
  "iat": 1616239022,        // Issued at
  "exp": 1616325422         // Expiration (24 horas)
}
```

### Rutas Protegidas vs Públicas

**🔒 Protegidas (requieren JWT):**
- Crear envío (`POST /tracking`)
- Actualizar estado (`PATCH /:id/status`)
- Listar envíos por usuario (`GET /users/:id`)

**🌐 Públicas (no requieren autenticación):**
- Login (`POST /auth/login`)
- Registro (`POST /auth/register`)
- Consultar envío (`GET /tracking/:id`)
- Obtener métodos de transporte (`GET /transport-methods`)
- Calcular costo (`POST /cost`)
- Listar estados (`GET /statuses`)

---

## 🔑 Endpoints de Autenticación

### 1. Registro de Usuario

Crea una nueva cuenta de usuario.

```
POST /api/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "password": "MiPassword123!"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 5,
    "name": "Juan Pérez",
    "email": "juan.perez@example.com"
  }
}
```

**Errores Posibles:**

| Código | Mensaje | Causa |
|--------|---------|-------|
| 400 | Email ya registrado | El email ya existe en la BD |
| 400 | Validación fallida | Campos inválidos o faltantes |
| 500 | Error interno | Error del servidor |

---

### 2. Iniciar Sesión

Autentica un usuario y devuelve un JWT.

```
POST /api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "juan.perez@example.com",
  "password": "MiPassword123!"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "name": "Juan Pérez",
    "email": "juan.perez@example.com"
  }
}
```

**Errores Posibles:**

| Código | Mensaje | Causa |
|--------|---------|-------|
| 401 | Credenciales inválidas | Email o password incorrectos |
| 400 | Campos requeridos | Falta email o password |
| 500 | Error interno | Error del servidor |

---

## 🚚 Endpoints de Logística

### 1. Crear Envío 🔒

Crea un nuevo registro de envío. **Requiere autenticación JWT.**

```
POST /api/logistics/tracking
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "order_id": "ORD-2025-001234",
  "user_id": 5,
  "delivery_address": {
    "street": "Av. Alberdi 1250",
    "city": "Resistencia",
    "state": "Chaco",
    "postal_code": "H3500",
    "country": "Argentina",
    "notes": "Tocar timbre, portón verde"
  },
  "transport_type": "road",
  "products": [
    {
      "id": "PROD-001",
      "quantity": 2,
      "weight_kg": 5.5,
      "dimensions_cm": {
        "width": 30,
        "height": 20,
        "length": 40
      }
    },
    {
      "id": "PROD-002",
      "quantity": 1,
      "weight_kg": 2.0,
      "dimensions_cm": {
        "width": 15,
        "height": 15,
        "length": 20
      }
    }
  ]
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Envío registrado exitosamente.",
  "data": {
    "shipping_id": 42
  }
}
```

**Errores Posibles:**

| Código | Mensaje | Causa |
|--------|---------|-------|
| 400 | Campos requeridos faltantes | Faltan datos obligatorios |
| 403 | ID de usuario no coincide | user_id ≠ usuario autenticado |
| 401 | Token inválido | JWT no válido o expirado |
| 500 | Error al crear envío | Error de BD o lógica |

**Validaciones:**
- `order_id`: string, obligatorio
- `user_id`: number, debe coincidir con el usuario autenticado
- `delivery_address`: objeto completo con todos los campos
- `transport_type`: uno de ['air', 'road', 'rail', 'express', 'sea']
- `products`: array no vacío con productos válidos

---

### 2. Obtener Envío por ID 🌐

Consulta el detalle completo de un envío incluyendo sus logs. **Endpoint público.**

```
GET /api/logistics/tracking/:id
```

**Parámetros de URL:**
- `id`: ID del envío (número)

**Ejemplo:**
```
GET /api/logistics/tracking/42
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "user_id": 5,
    "order_id": "ORD-2025-001234",
    "status": "in_transit",
    "shipping_cost": 280.50,
    "products": [
      {
        "id": "PROD-001",
        "quantity": 2,
        "weight_kg": 5.5,
        "dimensions_cm": {
          "width": 30,
          "height": 20,
          "length": 40
        }
      }
    ],
    "delivery_address_json": {
      "street": "Av. Alberdi 1250",
      "city": "Resistencia",
      "state": "Chaco",
      "postal_code": "H3500",
      "country": "Argentina"
    },
    "transport_type": "road",
    "departure_postal_code": "C1000AAA",
    "estimated_delivery_at": "2025-12-08T00:00:00Z",
    "createdAt": "2025-12-04T10:00:00Z",
    "updatedAt": "2025-12-04T14:30:00Z",
    "logs": [
      {
        "id": 1,
        "shipping_id": 42,
        "status": "created",
        "message": "Envío creado y pendiente de recolección.",
        "timestamp": "2025-12-04T10:00:00Z"
      },
      {
        "id": 2,
        "shipping_id": 42,
        "status": "in_transit",
        "message": "El paquete salió del centro de distribución.",
        "timestamp": "2025-12-04T14:30:00Z"
      }
    ]
  }
}
```

**Errores Posibles:**

| Código | Mensaje | Causa |
|--------|---------|-------|
| 404 | Envío no encontrado | ID no existe en BD |
| 500 | Error interno | Error del servidor |

---

### 3. Actualizar Estado de Envío 🌐

Actualiza el estado de un envío y registra un nuevo log. **Endpoint público** (para que otros módulos puedan actualizar).

```
PATCH /api/logistics/:id/status
```

**Headers:**
```
Content-Type: application/json
```

**Parámetros de URL:**
- `id`: ID del envío (número)

**Body:**
```json
{
  "status": "delivered",
  "message": "Paquete entregado exitosamente. Recibido por Juan Pérez."
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Estado de envío 42 actualizado a delivered.",
  "new_status": "delivered"
}
```

**Estados Válidos:**
- `created`
- `reserved`
- `in_transit`
- `in_distribution`
- `arrived`
- `delivered`
- `cancelled`

**Errores Posibles:**

| Código | Mensaje | Causa |
|--------|---------|-------|
| 400 | Campos requeridos | Falta status o message |
| 404 | Envío no encontrado | ID no existe |
| 500 | Error al actualizar | Error de BD |

---

### 4. Listar Envíos de un Usuario 🌐

Obtiene todos los envíos de un usuario específico. **Endpoint público.**

```
GET /api/logistics/users/:id
```

**Parámetros de URL:**
- `id`: ID del usuario (número)

**Ejemplo:**
```
GET /api/logistics/users/5
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "order_id": "ORD-2025-001234",
      "status": "delivered",
      "shipping_cost": 280.50,
      "transport_type": "road",
      "estimated_delivery_at": "2025-12-08T00:00:00Z",
      "createdAt": "2025-12-04T10:00:00Z",
      "logs": [...]
    },
    {
      "id": 41,
      "order_id": "ORD-2025-001233",
      "status": "in_transit",
      "shipping_cost": 350.00,
      "transport_type": "express",
      "estimated_delivery_at": "2025-12-06T00:00:00Z",
      "createdAt": "2025-12-03T15:00:00Z",
      "logs": [...]
    }
  ]
}
```

**Respuesta sin Datos (200):**
```json
{
  "success": true,
  "message": "No se encontraron envíos para este usuario.",
  "data": []
}
```

**Errores Posibles:**

| Código | Mensaje | Causa |
|--------|---------|-------|
| 500 | Error interno | Error del servidor |

---

### 5. Obtener Métodos de Transporte 🌐

Devuelve la lista de métodos de transporte disponibles. **Endpoint público.**

```
GET /api/logistics/transport-methods
```

**Respuesta Exitosa (200):**
```json
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
    {
      "id": "road",
      "nombre": "Terrestre",
      "descripcion": "Envio por ruta",
      "dias_entrega": 4,
      "costo_base": 60
    },
    {
      "id": "rail",
      "nombre": "Ferroviario",
      "descripcion": "Envio por tren",
      "dias_entrega": 10,
      "costo_base": 40
    },
    {
      "id": "express",
      "nombre": "Express",
      "descripcion": "Envio con prioridad de entrega",
      "dias_entrega": 2,
      "costo_base": 80
    },
    {
      "id": "sea",
      "nombre": "Maritimo",
      "descripcion": "Envio por mar/rio",
      "dias_entrega": 15,
      "costo_base": 50
    }
  ]
}
```

**⚠️ IMPORTANTE:** Este endpoint cumple con la especificación del módulo de Compras que espera:
- Array directo de métodos (con wrapper `{success, data}`)
- Campos: `id`, `nombre`, `descripcion`, `dias_entrega`, `costo_base`

**Uso:** Este endpoint es consumido por el módulo de Compras para mostrar opciones de transporte al usuario.

---

### 6. Calcular Costo de Envío 🌐

Calcula el costo estimado de un envío. **Endpoint público.**

```
POST /api/logistics/cost
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "transportMethod": "express",
  "products": [
    {
      "id": "PROD-001",
      "quantity": 2,
      "weight_kg": 5.5,
      "dimensions_cm": {
        "width": 30,
        "height": 20,
        "length": 40
      }
    }
  ]
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "cost": 320.50,
  "currency": "PESOS",
  "estimated_days": 2
}
```

**Cálculo del Costo:**

El costo se calcula considerando:
1. **Costo base** del método de transporte
2. **Peso total** de todos los productos
3. **Volumen total** (ancho × alto × largo)
4. **Cantidad** de productos

**Fórmula aproximada:**
```
costo = costo_base + (peso_total * factor_peso) + (volumen_total * factor_volumen)
```

**Errores Posibles:**

| Código | Mensaje | Causa |
|--------|---------|-------|
| 400 | Datos inválidos | Productos vacíos o mal formados |
| 500 | Error al calcular | Error en la lógica de cálculo |

---

### 7. Obtener Estados Válidos 🌐

Lista todos los estados posibles de un envío. **Endpoint público.**

```
GET /api/logistics/statuses
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    "created",
    "reserved",
    "in_transit",
    "in_distribution",
    "arrived",
    "delivered",
    "cancelled"
  ]
}
```

**Uso:** Para validación en frontend y documentación.

---

## 📡 Códigos de Estado HTTP

### Códigos de Éxito

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Petición exitosa (GET, PATCH) |
| 201 | Created | Recurso creado exitosamente (POST) |

### Códigos de Error del Cliente

| Código | Significado | Uso |
|--------|-------------|-----|
| 400 | Bad Request | Datos inválidos o faltantes |
| 401 | Unauthorized | Token faltante o inválido |
| 403 | Forbidden | Sin permisos para el recurso |
| 404 | Not Found | Recurso no encontrado |

### Códigos de Error del Servidor

| Código | Significado | Uso |
|--------|-------------|-----|
| 500 | Internal Server Error | Error no manejado del servidor |

---

## 💡 Ejemplos de Uso

### Flujo Completo: Crear y Seguir un Envío

#### Paso 1: Registro
```bash
curl -X POST https://api-logisticautn-1.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María González",
    "email": "maria@example.com",
    "password": "MiPass123!"
  }'
```

#### Paso 2: Login
```bash
curl -X POST https://api-logisticautn-1.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "MiPass123!"
  }'
```

**Guardar el token de la respuesta.**

#### Paso 3: Consultar Métodos de Transporte (público)
```bash
curl -X GET https://api-logisticautn-1.onrender.com/api/logistics/transport-methods
```

#### Paso 4: Calcular Costo (público)
```bash
curl -X POST https://api-logisticautn-1.onrender.com/api/logistics/cost \
  -H "Content-Type: application/json" \
  -d '{
    "transportMethod": "express",
    "products": [
      {
        "id": "PROD-001",
        "quantity": 1,
        "weight_kg": 2.5,
        "dimensions_cm": {
          "width": 20,
          "height": 15,
          "length": 30
        }
      }
    ]
  }'
```

#### Paso 5: Crear Envío (protegido)
```bash
curl -X POST https://api-logisticautn-1.onrender.com/api/logistics/tracking \
  -H "Authorization: Bearer <TOKEN_AQUI>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "ORD-2025-999",
    "user_id": 5,
    "delivery_address": {
      "street": "Calle Falsa 123",
      "city": "Resistencia",
      "postal_code": "H3500",
      "country": "Argentina"
    },
    "transport_type": "express",
    "products": [
      {
        "id": "PROD-001",
        "quantity": 1,
        "weight_kg": 2.5,
        "dimensions_cm": {
          "width": 20,
          "height": 15,
          "length": 30
        }
      }
    ]
  }'
```

#### Paso 6: Consultar Estado (público)
```bash
curl -X GET https://api-logisticautn-1.onrender.com/api/logistics/tracking/42
```

#### Paso 7: Actualizar Estado (público)
```bash
curl -X PATCH https://api-logisticautn-1.onrender.com/api/logistics/42/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_transit",
    "message": "El paquete está en camino al centro de distribución."
  }'
```

---

## 🔗 Integración con Otros Módulos

### Integración con Módulo de Compras

El módulo de **Compras** consume estos endpoints:

1. **Obtener métodos de transporte** (para mostrar opciones al usuario)
   ```
   GET /api/logistics/transport-methods
   ```
   
   Respuesta esperada por Compras:
   ```json
   {
     "success": true,
     "data": [
       {
         "id": "air",
         "nombre": "Aéreo",
         "descripcion": "Envío por aire",
         "dias_entrega": 2,
         "costo_base": 50
       }
     ]
   }
   ```

2. **Calcular costo de envío** (antes de confirmar la compra)
   ```
   POST /api/logistics/cost
   ```

3. **Crear envío** (después de confirmar la orden)
   ```
   POST /api/logistics/tracking
   ```

### Integración con Módulo de Stock

**Logística** consulta al módulo de **Stock**:

1. **Verificar disponibilidad** de productos
2. **Obtener detalles** (peso, dimensiones)
3. **Reservar stock** al crear envío

**Flujo de Integración:**
```
Compras → Stock (reservar) → Logística (crear envío) → Stock (confirmar)
```

---

## ⚠️ Manejo de Errores

### Estructura de Error Estándar

```json
{
  "success": false,
  "message": "Mensaje amigable para el usuario",
  "error": "Detalle técnico del error (solo en desarrollo)"
}
```

### Tipos de Errores

#### 1. Error de Validación (400)
```json
{
  "success": false,
  "message": "Validación fallida",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "password",
      "message": "La contraseña debe tener al menos 6 caracteres"
    }
  ]
}
```

#### 2. Error de Autenticación (401)
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

#### 3. Error de Autorización (403)
```json
{
  "success": false,
  "message": "No tienes permisos para acceder a este recurso"
}
```

#### 4. Error de Recurso No Encontrado (404)
```json
{
  "success": false,
  "message": "Envío no encontrado"
}
```

#### 5. Error del Servidor (500)
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": "Database connection timeout"
}
```

---

## 📖 Glosario

| Término | Definición |
|---------|------------|
| **JWT** | JSON Web Token - Método de autenticación basado en tokens |
| **Shipping** | Envío - Registro de un envío en el sistema |
| **ShippingLog** | Log de seguimiento - Historial de cambios de estado |
| **Transport Type** | Tipo de transporte - Método de envío (aéreo, terrestre, etc.) |
| **Endpoint** | Punto final - URL específica de la API |
| **Payload** | Carga útil - Datos enviados en el body de una petición |
| **Bearer Token** | Token de portador - Formato de autenticación JWT |
| **CORS** | Cross-Origin Resource Sharing - Política de seguridad web |
| **ORM** | Object-Relational Mapping - Mapeo objeto-relacional |
| **Middleware** | Función intermedia - Procesa peticiones antes del controlador |

---

## 📊 Límites y Restricciones

| Límite | Valor |
|--------|-------|
| Tamaño máximo de petición | 10 MB |
| Productos por envío | Ilimitado (recomendado < 100) |
| Duración del token JWT | 24 horas |
| Rate limiting | No implementado (por ahora) |
| Timeout de petición | 30 segundos |

---

## 🔄 Versionado de API

**Versión Actual:** v1.0

El versionado se maneja mediante:
- **Prefix de URL:** `/api/...`
- Futuros cambios: `/api/v2/...`

---

## 🌟 Características Especiales

### Transacciones

Todas las operaciones críticas (crear envío, actualizar estado) usan **transacciones de base de datos** para garantizar consistencia.

### Logs Automáticos

Cada cambio de estado genera automáticamente un registro en `ShippingLog` con timestamp.

### Integración Modular

La API está diseñada para integrarse fácilmente con los módulos de Compras y Stock mediante endpoints públicos y protegidos según la necesidad.

---

## 👥 Equipo de Desarrollo

**Grupo N°9 – UTN FRRe (Resistencia, Chaco, Argentina)**

**Integrantes:**
- Franco, Rodrigo Roman
- Miño, Alberto Ramón
- Ramirez, Juan Ángel
- Romero, Sebastián Pablo
- Seeleff, Mauricio Javier
- Solari, Xiomara Oriana


**Materia:** Desarrollo de Software 
**Institución:** Universidad Tecnológica Nacional - Facultad Regional Resistencia  
**Módulo:** Transporte, Logística y Seguimiento


Proyecto académico - UTN FRRe 2025

---

**Última Actualización:** Diciembre 2025  
**Versión del Documento:** 1.0  
**Versión de la API:** v1.0

