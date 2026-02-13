# Manual de APIs - Sistema de Gestión Hotelera

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Gestión de Hoteles](#gestión-de-hoteles)
4. [Planes de Suscripción](#planes-de-suscripción)
5. [Catálogo de Módulos](#catálogo-de-módulos)
6. [Usuarios](#usuarios)
7. [Roles](#roles)
8. [Permisos](#permisos)
9. [Roles-Permisos](#roles-permisos)
10. [Usuarios-Roles](#usuarios-roles)
11. [Habitaciones](#habitaciones)
12. [Tipos de Habitación](#tipos-de-habitación)
13. [Precios por Tipo de Habitación](#precios-por-tipo-de-habitación)
14. [Huéspedes](#huéspedes)
15. [Clientes Corporativos](#clientes-corporativos)
16. [Catálogos](#catálogos)
17. [Reservas](#reservas)
18. [Huéspedes de Reserva](#huéspedes-de-reserva)
19. [Check-in](#check-in)
20. [Check-out](#check-out)
21. [Facturas](#facturas)
22. [Métodos de Pago](#métodos-de-pago)
23. [Pagos](#pagos)
24. [Productos](#productos)
25. [Categorías de Productos](#categorías-de-productos)
26. [Ubicaciones de Inventario](#ubicaciones-de-inventario)
27. [Inventario](#inventario)
28. [Ventas](#ventas)
29. [Items de Venta](#items-de-venta)
30. [Servicios Adicionales](#servicios-adicionales)
31. [Reservas de Servicios](#reservas-de-servicios)

## Introducción

Este manual documenta todas las APIs disponibles en el sistema de gestión hotelera. El sistema utiliza una arquitectura multi-tenant donde cada hotel tiene su propia base de datos.

### URL Base
```
http://localhost:3000/api
```

### Headers Requeridos

Para rutas que requieren identificación del hotel (tenant):
```json
{
  "X-Hotel-Id": "uuid-del-hotel"
}
```

Para rutas protegidas (autenticadas):
```json
{
  "Authorization": "Bearer jwt-token-aqui"
}
```

### Formato de Respuesta

Todas las respuestas siguen el siguiente formato:

**Éxito:**
```json
{
  "ok": true,
  "data": { ... },
  "msg": "Mensaje opcional"
}
```

**Error:**
```json
{
  "ok": false,
  "msg": "Descripción del error",
  "errors": [ ... ] // Opcional, para errores de validación
}
```

---

## Autenticación

Base URL: `/api/auth`

### 1. Login

**Endpoint:** `POST /api/auth/login`

**Descripción:** Inicia sesión de un usuario en el sistema.

**Headers:**
```json
{
  "X-Hotel-Id": "uuid-del-hotel"
}
```

**Body:**
```json
{
  "email": "usuario@hotel.com",
  "password": "contraseña123"
}
```

**Validaciones:**
- `email`: Requerido, debe ser un email válido
- `password`: Requerido, mínimo 6 caracteres

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "usuario@hotel.com",
    "rol": "recepcionista"
  }
}
```

**Errores:**
- `400`: Credenciales inválidas
- `404`: Hotel no encontrado
- `403`: Suscripción expirada

---

### 2. Renovar Token

**Endpoint:** `GET /api/auth/renovar`

**Descripción:** Renueva el token JWT del usuario autenticado.

**Headers:**
```json
{
  "x-token": "jwt-token-actual"
}
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "token": "nuevo-jwt-token",
  "usuario": {
    "id": "uuid",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "usuario@hotel.com",
    "rol": "recepcionista"
  }
}
```

---

### 3. Cambiar Contraseña

**Endpoint:** `POST /api/auth/cambiar-password`

**Descripción:** Permite al usuario autenticado cambiar su contraseña.

**Headers:**
```json
{
  "x-token": "jwt-token"
}
```

**Body:**
```json
{
  "passwordActual": "contraseñaActual123",
  "passwordNuevo": "nuevaContraseña456"
}
```

**Validaciones:**
- `passwordActual`: Requerido
- `passwordNuevo`: Requerido, mínimo 6 caracteres, debe ser diferente a la actual

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Contraseña actualizada correctamente"
}
```

---

### 4. Recuperar Contraseña

**Endpoint:** `POST /api/auth/recuperar-password`

**Descripción:** Envía un email con instrucciones para recuperar la contraseña.

**Headers:**
```json
{
  "X-Hotel-Id": "uuid-del-hotel"
}
```

**Body:**
```json
{
  "email": "usuario@hotel.com"
}
```

**Validaciones:**
- `email`: Requerido, debe ser un email válido

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Se ha enviado un correo con las instrucciones para recuperar la contraseña"
}
```

---

### 5. Resetear Contraseña

**Endpoint:** `POST /api/auth/resetear-password`

**Descripción:** Restablece la contraseña usando el token recibido por email.

**Headers:**
```json
{
  "X-Hotel-Id": "uuid-del-hotel"
}
```

**Body:**
```json
{
  "token": "token-de-recuperacion",
  "passwordNuevo": "nuevaContraseña123"
}
```

**Validaciones:**
- `token`: Requerido
- `passwordNuevo`: Requerido, mínimo 6 caracteres

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Contraseña restablecida correctamente"
}
```

---

## Gestión de Hoteles

Base URL: `/api/hoteles`

**Nota:** Estas rutas deberían estar protegidas en producción con autenticación de administrador.

### 1. Obtener Todos los Hoteles

**Endpoint:** `GET /api/hoteles/obtener-hoteles`

**Descripción:** Obtiene lista de hoteles con paginación y filtros.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1, mínimo: 1)
- `limit` (opcional): Elementos por página (default: 10, rango: 1-100)
- `estado` (opcional): Filtrar por estado (`activo`, `suspendido`, `cancelado`)

**Ejemplo:**
```
GET /api/hoteles/obtener-hoteles?page=1&limit=10&estado=activo
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "hoteles": [...],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

---

### 2. Obtener Hotel por ID

**Endpoint:** `GET /api/hoteles/:id`

**Descripción:** Obtiene información detallada de un hotel específico.

**Parámetros URL:**
- `id`: UUID del hotel

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "hotel": {
    "id": "uuid",
    "nombre": "Hotel Paradise",
    "direccion": "Av. Principal 123",
    "telefono": "987654321",
    "email": "contacto@hotelparadise.com",
    "ruc": "20123456789",
    "plan_id": "uuid-plan",
    "estado": "activo",
    "fecha_inicio_suscripcion": "2024-01-01",
    "fecha_fin_suscripcion": "2024-12-31"
  }
}
```

---

### 3. Crear Hotel

**Endpoint:** `POST /api/hoteles/crear`

**Descripción:** Crea un nuevo hotel en el sistema.

**Body:**
```json
{
  "nombre": "Hotel Paradise",
  "direccion": "Av. Principal 123",
  "telefono": "987654321",
  "email": "contacto@hotelparadise.com",
  "ruc": "20123456789",
  "database_name": "hotel_paradise_db",
  "database_host": "localhost",
  "database_port": 5432,
  "database_user": "hotel_user",
  "database_password": "password123",
  "plan_id": "uuid-del-plan",
  "fecha_fin_suscripcion": "2024-12-31",
  "estado": "activo",
  "configuracion": {}
}
```

**Validaciones:**
- `nombre`: Requerido, 2-200 caracteres
- `direccion`: Requerido
- `telefono`: Requerido, 7-20 caracteres
- `email`: Requerido, email válido
- `ruc`: Requerido, 8-20 caracteres
- `database_name`: Requerido, solo letras minúsculas, números y guiones bajos
- `database_host`: Requerido
- `database_port`: Opcional, 1-65535
- `database_user`: Requerido
- `database_password`: Requerido, mínimo 6 caracteres
- `plan_id`: Requerido, UUID válido
- `fecha_fin_suscripcion`: Requerido, fecha ISO8601
- `estado`: Opcional, valores: `activo`, `suspendido`, `cancelado`
- `configuracion`: Opcional, objeto JSON

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "hotel": { ... }
}
```

---

### 4. Actualizar Hotel

**Endpoint:** `PUT /api/hoteles/:id`

**Descripción:** Actualiza información de un hotel existente.

**Parámetros URL:**
- `id`: UUID del hotel

**Body:** (Todos los campos son opcionales)
```json
{
  "nombre": "Hotel Paradise Updated",
  "email": "nuevo@email.com",
  "telefono": "999888777",
  "plan_id": "nuevo-uuid-plan",
  "fecha_fin_suscripcion": "2025-12-31",
  "estado": "activo"
}
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "hotel": { ... }
}
```

---

### 5. Cambiar Estado del Hotel

**Endpoint:** `PATCH /api/hoteles/:id/estado`

**Descripción:** Cambia el estado de un hotel.

**Parámetros URL:**
- `id`: UUID del hotel

**Body:**
```json
{
  "estado": "suspendido"
}
```

**Validaciones:**
- `estado`: Requerido, valores: `activo`, `suspendido`, `cancelado`

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "hotel": { ... }
}
```

---

### 6. Obtener Estadísticas de Hoteles

**Endpoint:** `GET /api/hoteles/estadisticas`

**Descripción:** Obtiene estadísticas generales de hoteles.

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "estadisticas": {
    "total": 50,
    "activos": 45,
    "suspendidos": 3,
    "cancelados": 2
  }
}
```

---

### 7. Obtener Hoteles Próximos a Vencer

**Endpoint:** `GET /api/hoteles/proximos-vencer`

**Descripción:** Obtiene hoteles cuya suscripción está próxima a vencer.

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "hoteles": [...]
}
```

---

### 8. Obtener Hoteles por Estado

**Endpoint:** `GET /api/hoteles/estado/:estado`

**Descripción:** Obtiene hoteles filtrados por estado.

**Parámetros URL:**
- `estado`: Estado del hotel (`activo`, `suspendido`, `cancelado`)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "hoteles": [...]
}
```

---

### 9. Eliminar Hotel

**Endpoint:** `DELETE /api/hoteles/:id`

**Descripción:** Elimina un hotel del sistema.

**Parámetros URL:**
- `id`: UUID del hotel

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Hotel eliminado correctamente"
}
```

---## Planes de Suscripción

Base URL: `/api/planes`

### 1. Obtener Todos los Planes

**Endpoint:** `GET /api/planes`

**Descripción:** Obtiene lista de planes con paginación.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, máx: 100)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "planes": [...],
  "total": 10,
  "page": 1,
  "totalPages": 1
}
```

---

### 2. Obtener Planes Activos

**Endpoint:** `GET /api/planes/activos`

**Descripción:** Obtiene solo los planes activos.

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "planes": [
    {
      "id": "uuid",
      "nombre": "basico",
      "nombre_mostrar": "Plan Básico",
      "precio": "99.00",
      "ciclo_facturacion": "mensual",
      "max_habitaciones": 20,
      "max_usuarios": 5,
      "max_reservas_mes": 100,
      "activo": true
    }
  ]
}
```

---

### 3. Obtener Plan por ID

**Endpoint:** `GET /api/planes/:id`

**Descripción:** Obtiene información detallada de un plan.

**Parámetros URL:**
- `id`: UUID del plan

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "plan": { ... }
}
```

---

### 4. Obtener Módulos de un Plan

**Endpoint:** `GET /api/planes/:planId/modulos`

**Descripción:** Obtiene los módulos asignados a un plan.

**Parámetros URL:**
- `planId`: UUID del plan

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "modulos": [
    {
      "id": "uuid",
      "nombre_modulo": "habitaciones",
      "nombre_mostrar": "Gestión de Habitaciones",
      "categoria": "core",
      "habilitado": true
    }
  ]
}
```

---

### 5. Crear Plan

**Endpoint:** `POST /api/planes`

**Descripción:** Crea un nuevo plan de suscripción.

**Body:**
```json
{
  "nombre": "premium",
  "nombre_mostrar": "Plan Premium",
  "precio": 399.00,
  "ciclo_facturacion": "mensual",
  "max_habitaciones": 100,
  "max_usuarios": 50,
  "max_reservas_mes": 2000,
  "caracteristicas": {
    "soporte": "prioritario",
    "analytics": "avanzado"
  },
  "activo": true
}
```

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "plan": { ... }
}
```

---

### 6. Asignar Módulo a Plan

**Endpoint:** `POST /api/planes/:planId/modulos/:moduloId`

**Descripción:** Asigna un módulo a un plan.

**Parámetros URL:**
- `planId`: UUID del plan
- `moduloId`: UUID del módulo

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "msg": "Módulo asignado correctamente"
}
```

---

### 7. Remover Módulo de Plan

**Endpoint:** `DELETE /api/planes/:planId/modulos/:moduloId`

**Descripción:** Remueve un módulo de un plan.

**Parámetros URL:**
- `planId`: UUID del plan
- `moduloId`: UUID del módulo

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Módulo removido correctamente"
}
```

---

## Catálogo de Módulos

Base URL: `/api/modulos`

### 1. Obtener Todos los Módulos

**Endpoint:** `GET /api/modulos`

**Descripción:** Obtiene lista de módulos con paginación.

**Query Parameters:**
- `page` (opcional): Número de página
- `limit` (opcional): Elementos por página

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "modulos": [...],
  "total": 15,
  "page": 1,
  "totalPages": 2
}
```

---

### 2. Obtener Módulos Activos

**Endpoint:** `GET /api/modulos/activos`

**Descripción:** Obtiene solo módulos activos.

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "modulos": [...]
}
```

---

### 3. Obtener Módulos Agrupados por Categoría

**Endpoint:** `GET /api/modulos/agrupados`

**Descripción:** Obtiene módulos agrupados por categoría.

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "modulos": {
    "core": [...],
    "gestion": [...],
    "ventas": [...],
    "reportes": [...],
    "integraciones": [...]
  }
}
```

---

### 4. Obtener Módulos por Categoría

**Endpoint:** `GET /api/modulos/categoria/:categoria`

**Descripción:** Obtiene módulos de una categoría específica.

**Parámetros URL:**
- `categoria`: Categoría (`core`, `gestion`, `ventas`, `reportes`, `integraciones`)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "modulos": [...]
}
```

---

## Usuarios

Base URL: `/api/users`

**Autenticación:** Todas las rutas requieren token JWT

**Permisos:** Se requieren permisos específicos según la operación

### 1. Obtener Todos los Usuarios

**Endpoint:** `GET /api/users/traer-todos`

**Descripción:** Obtiene lista de usuarios del hotel con paginación y filtros.

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token-aqui"
}
```

**Nota:** El hotel se obtiene automáticamente del token JWT.

**Permiso Requerido:** `users.user.read`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `is_active` (opcional): Filtrar por estado (`true`, `false`)
- `busqueda` (opcional): Búsqueda por nombre, apellido o email

**Ejemplo:**
```
GET /api/users/traer-todos?page=1&limit=10&is_active=true&busqueda=juan
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "usuarios": [
    {
      "id": 1,
      "email": "usuario@hotel.com",
      "nombres": "Juan",
      "apellido_paterno": "Pérez",
      "apellido_materno": "García",
      "celular": "987654321",
      "is_active": true,
      "last_login": "2024-12-01T10:30:00Z",
      "roles": [
        {
          "id": 1,
          "name": "receptionist",
          "display_name": "Recepcionista"
        }
      ]
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

---

### 2. Obtener Usuario por ID

**Endpoint:** `GET /api/users/traer-por-id/:id`

**Descripción:** Obtiene información detallada de un usuario específico.

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token-aqui"
}
```

**Permiso Requerido:** `users.user.read`

**Parámetros URL:**
- `id`: ID del usuario (INTEGER)

**Validaciones:**
- `id`: Requerido, debe ser un número entero

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "usuario": {
    "id": 1,
    "email": "usuario@hotel.com",
    "nombres": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "García",
    "celular": "987654321",
    "is_active": true,
    "last_login": "2024-12-01T10:30:00Z",
    "preferences": {
      "theme": "dark",
      "language": "es"
    },
    "roles": [
      {
        "id": 1,
        "name": "receptionist",
        "display_name": "Recepcionista",
        "description": "Gestión de reservas y atención a huéspedes"
      }
    ],
    "created_at": "2024-01-15T08:00:00Z",
    "updated_at": "2024-12-01T10:30:00Z"
  }
}
```

**Errores:**
- `400`: ID inválido
- `404`: Usuario no encontrado

---

### 3. Obtener Usuario por Email

**Endpoint:** `GET /api/users/traer-por-email`

**Descripción:** Obtiene un usuario por su dirección de email.

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token-aqui"
}
```

**Permiso Requerido:** `users.user.read`

**Query Parameters:**
- `email` (requerido): Email del usuario

**Validaciones:**
- `email`: Requerido, debe ser un email válido

**Ejemplo:**
```
GET /api/users/traer-por-email?email=usuario@hotel.com
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "usuario": {
    "id": 1,
    "email": "usuario@hotel.com",
    "nombres": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "García",
    "celular": "987654321",
    "is_active": true,
    "roles": [...]
  }
}
```

**Errores:**
- `400`: Email inválido
- `404`: Usuario no encontrado

---

### 4. Crear Usuario

**Endpoint:** `POST /api/users/crear`

**Descripción:** Crea un nuevo usuario en el sistema.

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token-aqui"
}
```

**Permiso Requerido:** `users.user.create`

**Body:**
```json
{
  "email": "nuevo@hotel.com",
  "password": "password123",
  "nombres": "María",
  "apellido_paterno": "López",
  "apellido_materno": "Fernández",
  "celular": "987654321",
  "is_active": true,
  "preferences": {
    "theme": "light",
    "language": "es"
  }
}
```

**Validaciones:**
- `email`: Requerido, email válido, único en el sistema
- `password`: Requerido, mínimo 6 caracteres
- `nombres`: Requerido, 2-100 caracteres
- `apellido_paterno`: Requerido, 2-100 caracteres
- `apellido_materno`: Opcional, 2-100 caracteres
- `celular`: Opcional, 7-20 caracteres
- `is_active`: Opcional, booleano (default: true)
- `preferences`: Opcional, objeto JSON

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "usuario": {
    "id": 5,
    "email": "nuevo@hotel.com",
    "nombres": "María",
    "apellido_paterno": "López",
    "apellido_materno": "Fernández",
    "celular": "987654321",
    "is_active": true,
    "preferences": {
      "theme": "light",
      "language": "es"
    },
    "created_at": "2024-12-01T15:30:00Z"
  },
  "msg": "Usuario creado correctamente"
}
```

**Errores:**
- `400`: Errores de validación
- `409`: Email ya existe

**Nota:** La contraseña se hashea automáticamente usando bcrypt con 12 rounds antes de almacenarse.

---

### 5. Actualizar Usuario

**Endpoint:** `PUT /api/users/actualizar/:id`

**Descripción:** Actualiza información de un usuario existente.

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token-aqui"
}
```

**Permiso Requerido:** `users.user.update`

**Parámetros URL:**
- `id`: ID del usuario (INTEGER)

**Body:** (Todos los campos son opcionales)
```json
{
  "email": "actualizado@hotel.com",
  "nombres": "María Actualizada",
  "apellido_paterno": "López",
  "apellido_materno": "Fernández",
  "celular": "999888777",
  "is_active": true,
  "preferences": {
    "theme": "dark"
  }
}
```

**Validaciones:**
- `id`: Requerido, debe ser un número entero
- `email`: Opcional, email válido, único
- `nombres`: Opcional, 2-100 caracteres
- `apellido_paterno`: Opcional, 2-100 caracteres
- `apellido_materno`: Opcional, 2-100 caracteres
- `celular`: Opcional, 7-20 caracteres
- `is_active`: Opcional, booleano
- `preferences`: Opcional, objeto JSON

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "usuario": {
    "id": 5,
    "email": "actualizado@hotel.com",
    "nombres": "María Actualizada",
    "apellido_paterno": "López",
    "apellido_materno": "Fernández",
    "celular": "999888777",
    "is_active": true,
    "updated_at": "2024-12-01T16:00:00Z"
  },
  "msg": "Usuario actualizado correctamente"
}
```

**Errores:**
- `400`: Errores de validación
- `404`: Usuario no encontrado
- `409`: Email ya existe

---

### 6. Eliminar Usuario

**Endpoint:** `DELETE /api/users/eliminar/:id`

**Descripción:** Elimina un usuario del sistema (soft delete - marca como inactivo).

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token-aqui"
}
```

**Permiso Requerido:** `users.user.delete`

**Parámetros URL:**
- `id`: ID del usuario (INTEGER)

**Validaciones:**
- `id`: Requerido, debe ser un número entero

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Usuario eliminado correctamente"
}
```

**Errores:**
- `400`: ID inválido
- `404`: Usuario no encontrado
- `403`: No se puede eliminar el propio usuario

**Nota:** Esta operación realiza un soft delete, marcando al usuario como inactivo (`is_active = false`) en lugar de eliminarlo físicamente de la base de datos.

---

### 7. Activar Usuario

**Endpoint:** `PUT /api/users/activar/:id`

**Descripción:** Activa un usuario previamente desactivado.

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token-aqui"
}
```

**Permiso Requerido:** `users.user.update`

**Parámetros URL:**
- `id`: ID del usuario (INTEGER)

**Validaciones:**
- `id`: Requerido, debe ser un número entero

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "usuario": {
    "id": 5,
    "email": "usuario@hotel.com",
    "nombres": "María",
    "apellido_paterno": "López",
    "is_active": true,
    "updated_at": "2024-12-01T16:30:00Z"
  },
  "msg": "Usuario activado correctamente"
}
```

**Errores:**
- `400`: ID inválido
- `404`: Usuario no encontrado

---

### 8. Cambiar Contraseña

**Endpoint:** `PUT /api/users/cambiar-password/:id`

**Descripción:** Permite cambiar la contraseña de un usuario. Un usuario puede cambiar su propia contraseña o un administrador puede cambiar la de otros usuarios.

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token-aqui"
}
```

**Permiso Requerido:** Usuario autenticado (puede cambiar su propia contraseña)

**Parámetros URL:**
- `id`: ID del usuario (INTEGER)

**Body:**
```json
{
  "password_actual": "contraseñaActual123",
  "password_nuevo": "nuevaContraseña456"
}
```

**Validaciones:**
- `id`: Requerido, debe ser un número entero
- `password_actual`: Requerido si el usuario cambia su propia contraseña
- `password_nuevo`: Requerido, mínimo 6 caracteres, debe ser diferente a la actual

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Contraseña actualizada correctamente"
}
```

**Errores:**
- `400`: Errores de validación
- `401`: Contraseña actual incorrecta
- `403`: No autorizado para cambiar esta contraseña
- `404`: Usuario no encontrado

**Nota:** 
- Si un usuario cambia su propia contraseña, debe proporcionar `password_actual`
- Si un administrador cambia la contraseña de otro usuario, no necesita `password_actual`
- La nueva contraseña se hashea automáticamente usando bcrypt con 12 rounds

---

### 9. Actualizar Preferencias

**Endpoint:** `PUT /api/users/actualizar-preferencias/:id`

**Descripción:** Actualiza las preferencias personales del usuario (tema, idioma, notificaciones, etc.).

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token-aqui"
}
```

**Permiso Requerido:** Usuario autenticado (solo puede actualizar sus propias preferencias)

**Parámetros URL:**
- `id`: ID del usuario (INTEGER)

**Body:**
```json
{
  "preferences": {
    "theme": "dark",
    "language": "es",
    "notifications": {
      "email": true,
      "push": false
    },
    "dashboard": {
      "defaultView": "calendar",
      "itemsPerPage": 20
    }
  }
}
```

**Validaciones:**
- `id`: Requerido, debe ser un número entero
- `preferences`: Requerido, objeto JSON válido

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "usuario": {
    "id": 1,
    "email": "usuario@hotel.com",
    "nombres": "Juan",
    "preferences": {
      "theme": "dark",
      "language": "es",
      "notifications": {
        "email": true,
        "push": false
      },
      "dashboard": {
        "defaultView": "calendar",
        "itemsPerPage": 20
      }
    },
    "updated_at": "2024-12-01T17:00:00Z"
  },
  "msg": "Preferencias actualizadas correctamente"
}
```

**Errores:**
- `400`: Errores de validación
- `403`: No autorizado para actualizar estas preferencias
- `404`: Usuario no encontrado

**Nota:** Un usuario solo puede actualizar sus propias preferencias. El sistema verifica que el ID del usuario en la URL coincida con el ID del usuario autenticado en el token JWT.

---

## Habitaciones

Base URL: `/api/habitaciones`

**Autenticación:** Todas las rutas requieren token JWT

**Permisos:** Se requieren permisos específicos según la operación

### 1. Obtener Todas las Habitaciones

**Endpoint:** `GET /api/habitaciones/traer-todos`

**Descripción:** Obtiene lista de habitaciones del hotel. Soporta filtrado por status.

**Headers:**
```json
{
  "x-token": "jwt-token"
}
```

**Permiso Requerido:** `habitaciones.habitacion.leer`

**Query Parameters (opcionales):**
- `page`: Número de página (default: 1)
- `limit`: Registros por página (default: 10)
- `status`: Filtrar por estado (`available`, `occupied`, `maintenance`)

**Ejemplo:**
```
GET /api/habitaciones/traer-todos?status=available&page=1&limit=20
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "habitaciones": [
    {
      "id": 1,
      "number": "101",
      "room_type_id": 1,
      "floor": 1,
      "status": "available",
      "notes": null,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "roomType": {
        "id": 1,
        "name": "Doble",
        "description": "Habitación doble estándar",
        "max_occupancy": 2,
        "amenities": {
          "wifi": true,
          "tv": true,
          "minibar": true
        }
      }
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

---

### 2. Obtener Habitación por ID

**Endpoint:** `GET /api/habitaciones/traer-por-id/:id`

**Descripción:** Obtiene información detallada de una habitación.

**Permiso Requerido:** `habitaciones.habitacion.leer`

**Parámetros URL:**
- `id`: ID de la habitación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "habitacion": {
    "id": 1,
    "number": "101",
    "room_type_id": 1,
    "floor": 1,
    "status": "available",
    "notes": null,
    "is_active": true,
    "roomType": {
      "id": 1,
      "name": "Doble",
      "max_occupancy": 2,
      "amenities": {...}
    }
  }
}
```

---

### 3. Crear Habitación

**Endpoint:** `POST /api/habitaciones/crear`

**Descripción:** Crea una nueva habitación.

**Permiso Requerido:** `habitaciones.habitacion.crear`

**Body:**
```json
{
  "number": "101",
  "room_type_id": 1,
  "floor": 1,
  "status": "available",
  "notes": "Habitación renovada"
}
```

**Validaciones:**
- `number`: Requerido, string, máximo 10 caracteres, único por hotel
- `room_type_id`: Requerido, integer, debe existir en room_types
- `floor`: Opcional, integer positivo
- `status`: Opcional, valores permitidos: `'available'`, `'occupied'`, `'cleaning'`, `'maintenance'`, `'out_of_order'` (default: `'available'`)
- `notes`: Opcional, texto

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "habitacion": {
    "id": 1,
    "number": "101",
    "room_type_id": 1,
    "floor": 1,
    "status": "available",
    "notes": "Habitación renovada",
    "is_active": true
  }
}
```

---

### 4. Actualizar Habitación

**Endpoint:** `PUT /api/habitaciones/actualizar/:id`

**Descripción:** Actualiza información de una habitación.

**Permiso Requerido:** `habitaciones.habitacion.actualizar`

**Parámetros URL:**
- `id`: ID de la habitación (integer)

**Body:** (Todos los campos son opcionales)
```json
{
  "number": "102",
  "room_type_id": 2,
  "floor": 2,
  "notes": "Actualizado"
}
```

**Validaciones:**
- `number`: String, máximo 10 caracteres, único
- `room_type_id`: Integer, debe existir
- `floor`: Integer positivo
- `notes`: Texto

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "habitacion": {
    "id": 1,
    "number": "102",
    "room_type_id": 2,
    "floor": 2,
    "status": "available",
    "notes": "Actualizado"
  }
}
```

---

### 5. Cambiar Estado de Habitación

**Endpoint:** `PATCH /api/habitaciones/cambiar-estado/:id`

**Descripción:** Cambia el estado de una habitación.

**Permiso Requerido:** `habitaciones.habitacion.actualizar`

**Parámetros URL:**
- `id`: ID de la habitación (integer)

**Body:**
```json
{
  "status": "maintenance"
}
```

**Validaciones:**
- `status`: Requerido, valores permitidos: `'available'`, `'occupied'`, `'cleaning'`, `'maintenance'`, `'out_of_order'`

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "habitacion": {
    "id": 1,
    "number": "101",
    "status": "maintenance"
  }
}
```

---

### 6. Eliminar Habitación

**Endpoint:** `DELETE /api/habitaciones/eliminar/:id`

**Descripción:** Elimina una habitación.

**Permiso Requerido:** `habitaciones.habitacion.eliminar`

**Parámetros URL:**
- `id`: ID de la habitación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Habitación eliminada correctamente"
}
```

---

## Huéspedes

Base URL: `/api/huespedes`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Todos los Huéspedes

**Endpoint:** `GET /api/huespedes/traer-todos`

**Descripción:** Obtiene lista de huéspedes del hotel con paginación.

**Permiso Requerido:** `huespedes.huesped.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Registros por página (default: 10, max: 100)
- `search` (opcional): Término de búsqueda (nombres, apellidos, documento, email)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "huespedes": [
    {
      "id": 5,
      "nombres": "Juan Carlos",
      "apellido_paterno": "Pérez",
      "apellido_materno": "Gómez",
      "document_type_id": 1,
      "document_number": "12345678",
      "email": "juan@email.com",
      "phone": "987654321",
      "date_of_birth": "1990-01-01",
      "address": "Av. Principal 123",
      "city": "Lima",
      "country_id": 1,
      "created_at": "2024-01-15T10:00:00.000Z",
      "documentType": {
        "id": 1,
        "code": "DNI",
        "name": "DNI - Documento Nacional de Identidad"
      },
      "country": {
        "id": 1,
        "code": "PER",
        "name": "Perú",
        "nationality": "Peruana",
        "phone_code": "+51"
      }
    }
  ],
  "totalCount": 45,
  "currentPage": 1,
  "totalPages": 5
}
```

---

### 2. Buscar Huésped

**Endpoint:** `GET /api/huespedes/buscar`

**Descripción:** Busca huéspedes por cualquier campo (nombres, apellidos, documento, email, teléfono, dirección, ciudad). Soporta búsqueda general por texto o filtros específicos.

**Permiso Requerido:** `huespedes.huesped.leer`

**Query Parameters:** (Todos opcionales, se pueden combinar)
- `q` (opcional): Búsqueda general por texto en nombres, apellidos, documento, email, teléfono, dirección, ciudad (1-100 caracteres)
- `document_type_id` (opcional): ID del tipo de documento (integer)
- `document_number` (opcional): Número de documento (búsqueda parcial)
- `email` (opcional): Email (búsqueda parcial)
- `phone` (opcional): Teléfono (búsqueda parcial)
- `country_id` (opcional): ID del país (integer)

**Ejemplos:**

**Búsqueda general por texto:**
```
GET /api/huespedes/buscar?q=juan
```

**Búsqueda por documento específico:**
```
GET /api/huespedes/buscar?document_type_id=1&document_number=12345678
```

**Búsqueda por email:**
```
GET /api/huespedes/buscar?email=juan@email.com
```

**Búsqueda combinada:**
```
GET /api/huespedes/buscar-por-documento?country_id=1&q=pérez
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "huespedes": [
    {
      "id": 5,
      "nombres": "Juan Carlos",
      "apellido_paterno": "Pérez",
      "apellido_materno": "Gómez",
      "document_type_id": 1,
      "document_number": "12345678",
      "email": "juan@email.com",
      "phone": "987654321",
      "country_id": 1,
      "documentType": {
        "id": 1,
        "code": "DNI",
        "name": "DNI - Documento Nacional de Identidad"
      },
      "country": {
        "id": 1,
        "code": "PER",
        "name": "Perú",
        "nationality": "Peruana"
      }
    }
  ],
  "totalCount": 1
}
```

**Notas:**
- La búsqueda es case-insensitive
- Los filtros específicos se combinan con AND
- La búsqueda general (`q`) busca en múltiples campos con OR
- Límite de 50 resultados por búsqueda
- Si no se proporciona ningún parámetro, retorna array vacío

---

### 3. Obtener Huésped por ID

**Endpoint:** `GET /api/huespedes/traer-por-id/:id`

**Descripción:** Obtiene información detallada de un huésped.

**Permiso Requerido:** `huespedes.huesped.leer`

**Parámetros URL:**
- `id`: ID del huésped (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "huesped": {
    "id": 5,
    "nombres": "Juan Carlos",
    "apellido_paterno": "Pérez",
    "apellido_materno": "Gómez",
    "document_type_id": 1,
    "document_number": "12345678",
    "email": "juan@email.com",
    "phone": "987654321",
    "date_of_birth": "1990-01-01",
    "address": "Av. Principal 123",
    "city": "Lima",
    "country_id": 1,
    "documentType": {
      "id": 1,
      "code": "DNI",
      "name": "DNI - Documento Nacional de Identidad",
      "description": "Documento de identidad para ciudadanos peruanos"
    },
    "country": {
      "id": 1,
      "code": "PER",
      "name": "Perú",
      "nationality": "Peruana",
      "phone_code": "+51"
    }
  }
}
```

---

### 4. Obtener Historial de Reservas

**Endpoint:** `GET /api/huespedes/traer-historial-reservas/:id`

**Descripción:** Obtiene el historial de reservas de un huésped.

**Permiso Requerido:** `huespedes.huesped.leer`

**Parámetros URL:**
- `id`: ID del huésped (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "huesped": {
    "id": 5,
    "nombres": "Juan Carlos",
    "apellido_paterno": "Pérez",
    "apellido_materno": "Gómez",
    "document_type_id": 1,
    "document_number": "12345678",
    "country_id": 1
  },
  "reservas": [
    {
      "id": 10,
      "confirmation_code": "RES20260111001",
      "check_in_date": "2026-01-15",
      "check_out_date": "2026-01-18",
      "status": "confirmed",
      "room": {
        "id": 101,
        "number": "101"
      }
    }
  ]
}
```

---

### 5. Crear Huésped

**Endpoint:** `POST /api/huespedes/crear`

**Descripción:** Registra un nuevo huésped.

**Permiso Requerido:** `huespedes.huesped.crear`

**Body:**
```json
{
  "nombres": "Juan Carlos",
  "apellido_paterno": "Pérez",
  "apellido_materno": "Gómez",
  "document_type_id": 1,
  "document_number": "12345678",
  "email": "juan@email.com",
  "phone": "987654321",
  "date_of_birth": "1990-01-01",
  "address": "Av. Principal 123",
  "city": "Lima",
  "country_id": 1,
  "preferences": {}
}
```

**Validaciones:**
- `nombres`: Requerido, máximo 100 caracteres
- `apellido_paterno`: Requerido, máximo 100 caracteres
- `apellido_materno`: Opcional, máximo 100 caracteres
- `document_type_id`: Opcional, ID válido de tipo de documento (integer)
- `document_number`: Opcional, máximo 50 caracteres, único por tipo de documento
- `email`: Opcional, email válido, único
- `phone`: Opcional, 9 dígitos numéricos
- `date_of_birth`: Opcional, formato ISO8601 (YYYY-MM-DD)
- `address`: Opcional, texto
- `city`: Opcional, máximo 100 caracteres
- `country_id`: Opcional, ID válido de país (integer)
- `preferences`: Opcional, objeto JSON

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "huesped": { ... }
}
```

---

### 6. Actualizar Huésped

**Endpoint:** `PUT /api/huespedes/actualizar/:id`

**Descripción:** Actualiza información de un huésped.

**Permiso Requerido:** `huespedes.huesped.actualizar`

**Parámetros URL:**
- `id`: ID del huésped (integer)

**Body:** (Todos los campos son opcionales)
```json
{
  "email": "nuevo@email.com",
  "phone": "999888777",
  "address": "Nueva dirección",
  "city": "Arequipa",
  "country_id": 2,
  "document_type_id": 1,
  "document_number": "87654321"
}
```

**Validaciones:**
- Mismas validaciones que en crear huésped
- El documento debe ser único (excluyendo el huésped actual)
- El email debe ser único (excluyendo el huésped actual)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "huesped": { ... }
}
```

---

### 7. Eliminar Huésped

**Endpoint:** `DELETE /api/huespedes/eliminar/:id`

**Descripción:** Elimina un huésped. No se puede eliminar si tiene reservas activas.

**Permiso Requerido:** `huespedes.huesped.eliminar`

**Parámetros URL:**
- `id`: ID del huésped (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Huésped eliminado correctamente"
}
```

**Error (400):**
```json
{
  "ok": false,
  "msg": "No se puede eliminar el huésped porque tiene reservas activas"
}
```

---

## Catálogos

Base URL: `/api/catalogo`

**Autenticación:** Todas las rutas requieren token JWT

**Nota:** Estos son catálogos de solo lectura (sin CRUD)

### 1. Obtener Tipos de Documento

**Endpoint:** `GET /api/catalogo/tipos-documento`

**Descripción:** Obtiene lista de tipos de documento activos.

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "code": "DNI",
      "name": "DNI - Documento Nacional de Identidad",
      "description": "Documento de identidad para ciudadanos peruanos"
    },
    {
      "id": 2,
      "code": "CE",
      "name": "CE - Carnet de Extranjería",
      "description": "Documento para extranjeros residentes en Perú"
    },
    {
      "id": 3,
      "code": "PASSPORT",
      "name": "Pasaporte",
      "description": "Documento de viaje internacional"
    }
  ]
}
```

---

### 2. Obtener Países

**Endpoint:** `GET /api/catalogo/paises`

**Descripción:** Obtiene lista de países activos con sus nacionalidades.

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "code": "PER",
      "name": "Perú",
      "nationality": "Peruana",
      "phone_code": "+51"
    },
    {
      "id": 2,
      "code": "ARG",
      "name": "Argentina",
      "nationality": "Argentina",
      "phone_code": "+54"
    }
  ]
}
```

---

### 3. Buscar Países

**Endpoint:** `GET /api/catalogo/paises/buscar`

**Descripción:** Busca países por nombre, nacionalidad o código.

**Query Parameters:**
- `q` (requerido): Término de búsqueda (mínimo 2 caracteres)

**Ejemplo:**
```
GET /api/catalogo/paises/buscar?q=peru
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "code": "PER",
      "name": "Perú",
      "nationality": "Peruana",
      "phone_code": "+51"
    }
  ]
}
```

---

## Reservas

Base URL: `/api/reservas`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Todas las Reservas

**Endpoint:** `GET /api/reservas`

**Descripción:** Obtiene lista de reservas del hotel.

**Permiso Requerido:** `reservas.ver`

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "reservas": [
    {
      "id": 1,
      "confirmation_code": "RES-2024-001",
      "guest_id": 5,
      "room_id": 101,
      "check_in_date": "2024-12-01",
      "check_out_date": "2024-12-05",
      "adults": 2,
      "children": 0,
      "status": "confirmed",
      "base_price": 120.00,
      "total_nights": 4,
      "subtotal": 480.00,
      "taxes": 86.40,
      "discount": 0,
      "total_amount": 566.40,
      "special_requests": null,
      "notes": null,
      "created_at": "2024-11-25T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Obtener Reserva por ID

**Endpoint:** `GET /api/reservas/:id`

**Descripción:** Obtiene información detallada de una reserva.

**Permiso Requerido:** `reservas.ver`

**Parámetros URL:**
- `id`: UUID de la reserva

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "reserva": {
    "id": 1,
    "confirmation_code": "RES-2024-001",
    "guest_id": 5,
    "room_id": 101,
    "check_in_date": "2024-12-01",
    "check_out_date": "2024-12-05",
    "adults": 2,
    "children": 0,
    "status": "confirmed",
    "base_price": 120.00,
    "total_nights": 4,
    "subtotal": 480.00,
    "taxes": 86.40,
    "discount": 0,
    "total_amount": 566.40,
    "special_requests": null,
    "notes": null,
    "guest": { ... },
    "room": { ... },
    "roomType": { ... }
  }
}
```

---

### 3. Crear Reserva

**Endpoint:** `POST /api/reservas`

**Descripción:** Crea una nueva reserva.

**Permiso Requerido:** `reservas.crear`

**Body:**
```json
{
  "guest_id": 5,
  "room_id": 101,
  "check_in_date": "2024-12-01",
  "check_out_date": "2024-12-05",
  "adults": 2,
  "children": 1,
  "special_requests": "Habitación en piso alto",
  "notes": "Cliente VIP"
}
```

**Validaciones:**
- `guest_id`: Requerido, integer, debe existir
- `room_id`: Requerido, integer, debe existir y estar disponible
- `check_in_date`: Requerido, formato fecha (YYYY-MM-DD)
- `check_out_date`: Requerido, formato fecha (YYYY-MM-DD), debe ser posterior a check_in_date
- `adults`: Requerido, mínimo 1
- `children`: Opcional, mínimo 0
- `status`: Opcional, valores permitidos: `'pending'`, `'confirmed'`, `'checked_in'`, `'checked_out'`, `'cancelled'`, `'no_show'` (default: `'pending'`)
- `special_requests`: Opcional, texto
- `notes`: Opcional, texto

**Nota:** El `room_type_id` se obtiene automáticamente de la habitación asignada (`room.room_type_id`)

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "reserva": { ... }
}
```

---

### 4. Actualizar Reserva

**Endpoint:** `PUT /api/reservas/:id`

**Descripción:** Actualiza información de una reserva.

**Permiso Requerido:** `reservas.editar`

**Parámetros URL:**
- `id`: UUID de la reserva

**Body:** (Todos los campos son opcionales)
```json
{
  "room_id": 102,
  "check_in_date": "2024-12-02",
  "check_out_date": "2024-12-06",
  "adults": 3,
  "children": 1,
  "special_requests": "Cama extra"
}
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "reserva": { ... }
}
```

---

### 5. Confirmar Reserva

**Endpoint:** `PATCH /api/reservas/confirmar/:id`

**Descripción:** Confirma una reserva pendiente.

**Permiso Requerido:** `reservas.editar`

**Parámetros URL:**
- `id`: UUID de la reserva

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "reserva": { ... }
}
```

---

### 6. Cancelar Reserva

**Endpoint:** `PATCH /api/reservas/cancelar/:id`

**Descripción:** Cancela una reserva.

**Permiso Requerido:** `reservas.editar`

**Parámetros URL:**
- `id`: UUID de la reserva

**Body:**
```json
{
  "notes": "Cliente canceló por cambio de planes"
}
```

**Validaciones:**
- `notes`: Opcional, texto

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "reserva": {
    "id": 1,
    "confirmation_code": "RES-2024-001",
    "status": "cancelled",
    "cancelled_by": 8,
    "notes": "Cliente canceló por cambio de planes",
    ...
  }
}
```

**Nota:** El campo `cancelled_by` se registra automáticamente con el ID del usuario que realiza la cancelación.

---

### 7. Marcar No-Show

**Endpoint:** `PATCH /api/reservas/marcar-no-show/:id`

**Descripción:** Marca una reserva como no-show (cliente no se presentó).

**Permiso Requerido:** `reservas.editar`

**Parámetros URL:**
- `id`: UUID de la reserva

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "reserva": { ... }
}
```

---

## Check-in / Check-out

Base URL: `/api/checkin`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Resumen de Ocupación

**Endpoint:** `GET /api/checkin/traer-resumen-ocupacion`

**Descripción:** Obtiene resumen de ocupación actual del hotel.

**Permiso Requerido:** `checkin_checkout.checkin.leer`

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "resumen": {
    "totalHabitaciones": 50,
    "habitacionesOcupadas": 35,
    "habitacionesDisponibles": 15,
    "habitacionesMantenimiento": 0,
    "checkInsActivos": 35,
    "porcentajeOcupacion": "70.00"
  }
}
```

---

### 2. Obtener Check-ins Activos

**Endpoint:** `GET /api/checkin/traer-activos`

**Descripción:** Obtiene lista de check-ins activos (huéspedes actualmente alojados sin check-out).

**Permiso Requerido:** `checkin_checkout.checkin.leer`

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "checkIns": [
    {
      "id": 45,
      "reservation_id": 123,
      "room_id": 101,
      "actual_check_in": "2026-01-03T14:00:00.000Z",
      "expected_check_out": "2026-01-05T12:00:00.000Z",
      "notes": "Cliente VIP",
      "processed_by": 8,
      "created_at": "2026-01-03T14:00:00.000Z",
      "reservation": {
        "id": 123,
        "confirmation_code": "RES-2026-001",
        "status": "checked_in",
        "guest": {
          "id": 5,
          "nombres": "Juan Carlos",
          "apellido_paterno": "Pérez",
          "apellido_materno": "Gómez",
          "document_number": "12345678"
        },
        "room": {
          "number": "101",
          "status": "occupied",
          "floor": 1
        }
      }
    }
  ]
}
```

---

### 3. Obtener Check-in por ID

**Endpoint:** `GET /api/checkin/traer-por-id/:id`

**Descripción:** Obtiene información detallada de un check-in específico.

**Permiso Requerido:** `checkin_checkout.checkin.leer`

**Parámetros URL:**
- `id`: ID del check-in (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "checkIn": {
    "id": 45,
    "reservation_id": 123,
    "room_id": 101,
    "actual_check_in": "2026-01-03T14:00:00.000Z",
    "expected_check_out": "2026-01-05T12:00:00.000Z",
    "notes": "Cliente VIP",
    "reservation": { ... },
    "checkOut": null
  }
}
```

---

### 4. Realizar Check-in (Con Reserva Previa)

**Endpoint:** `POST /api/checkin/realizar/:reserva_id`

**Descripción:** Realiza el check-in de una reserva confirmada previamente.

**Permiso Requerido:** `checkin_checkout.checkin.procesar`

**Parámetros URL:**
- `reserva_id`: ID de la reserva (integer)

**Body:** (Todos los campos son opcionales)
```json
{
  "actual_check_in": "2026-01-03T14:00:00.000Z",
  "expected_check_out": "2026-01-05T12:00:00.000Z",
  "notes": "Cliente solicitó habitación en piso alto"
}
```

**Validaciones:**
- Reserva debe existir
- Reserva debe estar en estado `confirmed`
- Reserva no debe tener un check-in previo
- `actual_check_in`: Opcional, formato ISO8601 (timestamp). Si no se envía, se usa la fecha/hora actual
- `expected_check_out`: Opcional, formato ISO8601 (timestamp). Si no se envía, se calcula automáticamente desde la reserva
- `notes`: Opcional, máximo 500 caracteres

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "checkIn": {
    "id": 45,
    "reservation_id": 123,
    "room_id": 101,
    "actual_check_in": "2026-01-03T14:00:00.000Z",
    "expected_check_out": "2026-01-05T12:00:00.000Z",
    "notes": "Cliente solicitó habitación en piso alto",
    "processed_by": 8,
    "reservation": { ... }
  },
  "msg": "Check-in realizado correctamente"
}
```

---

### 5. Realizar Check-in Presencial (Walk-In) ⭐ NUEVO

**Endpoint:** `POST /api/checkin/realizar-presencial`

**Descripción:** Realiza check-in presencial sin reserva previa. Soporta alquiler por horas o días. **Los precios se calculan automáticamente** desde la tabla `room_type_prices` según el tipo de habitación.

**Permiso Requerido:** `checkin_checkout.checkin.procesar`

**Body:**
```json
{
  "guest_id": 5,
  "room_id": 101,
  "rental_type": "hours",
  "duration": 3,
  "payment_status": "paid",
  "actual_check_in": "2026-01-03T14:00:00.000Z",
  "notes": "Walk-in por 3 horas"
}
```

**Campos Requeridos:**
- `guest_id`: ID del huésped (integer) - debe existir
- `room_id`: ID de la habitación (integer) - debe estar disponible
- `rental_type`: Tipo de alquiler (`"hours"` o `"days"`)
- `duration`: Duración (integer, 1-24 para horas, 1-365 para días)

**Campos Opcionales:**
- `payment_status`: Estado de pago (`"pending"`, `"partial"`, `"paid"`) - default: `"pending"`
- `actual_check_in`: Fecha/hora del check-in (ISO8601) - default: fecha/hora actual
- `notes`: Notas adicionales (máximo 500 caracteres)

**Cálculo Automático de Precios:**
1. El sistema obtiene el `room_type_id` de la habitación
2. Busca el precio correspondiente en `room_type_prices`:
   - Si `rental_type = "hours"` → busca `price_type = "hourly"`
   - Si `rental_type = "days"` → busca `price_type = "daily"`
3. Calcula: `total_amount = price × duration`
4. Si no existe precio configurado, retorna error

**Validaciones:**
- Huésped debe existir en la BD
- Habitación debe estar disponible (`status = 'available'`)
- Habitación no debe tener check-in activo
- Duración por horas: 1-24 horas
- Duración por días: 1-365 días
- Debe existir precio configurado para el tipo de habitación y rental_type

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "checkIn": {
    "id": 46,
    "reservation_id": 124,
    "room_id": 101,
    "actual_check_in": "2026-01-03T14:00:00.000Z",
    "expected_check_out": "2026-01-03T17:00:00.000Z",
    "notes": "Walk-in: Alquiler por 3 horas. Walk-in por 3 horas",
    "processed_by": 8,
    "reservation": {
      "id": 124,
      "confirmation_code": "WI-1704323400000-XYZ123ABC",
      "guest_id": 5,
      "room_id": 101,
      "status": "checked_in",
      "total_amount": 150.00,
      "special_requests": "Alquiler por 3 horas",
      "guest": {
        "id": 5,
        "nombres": "Carlos Alberto",
        "apellido_paterno": "Ramírez",
        "apellido_materno": "Silva"
      },
      "room": {
        "number": "101",
        "status": "occupied"
      }
    }
  },
  "msg": "Check-in presencial realizado correctamente",
  "info": {
    "rental_type": "hours",
    "duration": 3,
    "expected_check_out": "2026-01-03T17:00:00.000Z"
  }
}
```

**Ejemplo - Alquiler por Días:**
```json
{
  "guest_id": 12,
  "room_id": 205,
  "rental_type": "days",
  "duration": 2,
  "price_per_unit": 120.00,
  "total_amount": 240.00,
  "payment_status": "partial",
  "notes": "Pago parcial de S/. 100"
}
```

**Cálculo de `expected_check_out`:**
- **Por horas:** `actual_check_in + duration horas`
- **Por días:** `actual_check_in + duration días`

**Características:**
- ✅ No requiere reserva previa
- ✅ Crea automáticamente una reserva walk-in
- ✅ Código de confirmación: `WI-{timestamp}-{random}`
- ✅ Soporta alquiler por horas (1-24h)
- ✅ Soporta alquiler por días (1-365 días)
- ✅ Habitación cambia a `occupied` inmediatamente

---

### 6. Actualizar Check-in

**Endpoint:** `PUT /api/checkin/actualizar/:id`

**Descripción:** Actualiza información de un check-in activo.

**Permiso Requerido:** `checkin_checkout.checkin.actualizar`

**Parámetros URL:**
- `id`: ID del check-in (integer)

**Body:** (Todos los campos son opcionales)
```json
{
  "expected_check_out": "2026-01-05T15:00:00.000Z",
  "notes": "Extensión de estadía solicitada"
}
```

**Validaciones:**
- Check-in debe existir
- Check-in no debe tener check-out realizado
- `expected_check_out`: Opcional, formato ISO8601
- `notes`: Opcional, máximo 500 caracteres

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "checkIn": {
    "id": 45,
    "expected_check_out": "2026-01-05T15:00:00.000Z",
    "notes": "Extensión de estadía solicitada"
  },
  "msg": "Check-in actualizado correctamente"
}
```

---

### 7. Realizar Check-out

**Endpoint:** `POST /api/checkin/realizar-checkout/:checkInId`

**Descripción:** Realiza el check-out de un huésped.

**Permiso Requerido:** `checkin_checkout.checkout.procesar`

**Parámetros URL:**
- `checkInId`: ID del check-in (integer)

**Body:**
```json
{
  "actual_check_out": "2026-01-05T12:00:00.000Z",
  "final_amount": 650.00,
  "payment_status": "paid",
  "notes": "Cliente satisfecho con el servicio"
}
```

**Validaciones:**
- Check-in debe existir
- Check-in no debe tener check-out previo
- Reserva debe estar en estado `checked_in`
- `actual_check_out`: Opcional, formato ISO8601
- `final_amount`: Requerido, mínimo 0
- `payment_status`: Opcional, máximo 20 caracteres
- `notes`: Opcional, máximo 500 caracteres

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "checkOut": {
    "id": 23,
    "check_in_id": 45,
    "actual_check_out": "2026-01-05T12:00:00.000Z",
    "final_amount": 650.00,
    "payment_status": "paid",
    "notes": "Cliente satisfecho con el servicio",
    "processed_by": 8,
    "created_at": "2026-01-05T12:00:00.000Z"
  },
  "msg": "Check-out realizado correctamente"
}
```

**Proceso automático:**
1. Crea registro de check-out
2. Actualiza reserva a estado `checked_out`
3. Libera habitación (`status = 'available'`)

---

## Check-Out (CRUD Completo)

Base URL: `/api/checkout`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Gestión completa de check-outs. Permite consultar, crear, actualizar y eliminar registros de check-out, así como obtener estadísticas.

### 1. Obtener Todos los Check-Outs

**Endpoint:** `GET /api/checkout/traer-todos`

**Descripción:** Obtiene lista de check-outs con filtros y paginación.

**Permiso Requerido:** `checkin_checkout.checkout.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, max: 100)
- `payment_status` (opcional): Filtrar por estado de pago (`pending`, `partial`, `paid`)
- `check_in_id` (opcional): Filtrar por ID de check-in

**Ejemplo:**
```
GET /api/checkout/traer-todos?page=1&limit=10&payment_status=pending
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "checkOuts": [
    {
      "id": 23,
      "check_in_id": 45,
      "actual_check_out": "2026-01-05T12:00:00.000Z",
      "final_amount": 650.00,
      "payment_status": "paid",
      "notes": "Cliente satisfecho",
      "processed_by": 8,
      "created_at": "2026-01-05T12:00:00.000Z",
      "checkIn": {
        "id": 45,
        "actual_check_in": "2026-01-01T14:00:00.000Z",
        "reservation": {
          "id": 123,
          "confirmation_code": "RES-2026-001",
          "guest": {
            "id": 5,
            "nombres": "Carlos",
            "apellido_paterno": "Ramírez"
          },
          "room": {
            "id": 101,
            "number": "101"
          }
        }
      },
      "processor": {
        "id": 8,
        "nombres": "Ana",
        "apellido_paterno": "García"
      }
    }
  ],
  "total": 150,
  "page": 1,
  "totalPages": 15
}
```

---

### 2. Obtener Check-Out por ID

**Endpoint:** `GET /api/checkout/traer-por-id/:id`

**Descripción:** Obtiene información detallada de un check-out específico.

**Permiso Requerido:** `checkin_checkout.checkout.leer`

**Parámetros URL:**
- `id`: ID del check-out (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "checkOut": {
    "id": 23,
    "check_in_id": 45,
    "actual_check_out": "2026-01-05T12:00:00.000Z",
    "final_amount": 650.00,
    "payment_status": "paid",
    "notes": "Cliente satisfecho con el servicio",
    "processed_by": 8,
    "created_at": "2026-01-05T12:00:00.000Z",
    "checkIn": {
      "id": 45,
      "actual_check_in": "2026-01-01T14:00:00.000Z",
      "reservation": {
        "id": 123,
        "confirmation_code": "RES-2026-001",
        "guest": {
        "id": 5,
        "nombres": "Carlos Alberto",
        "apellido_paterno": "Ramírez",
        "apellido_materno": "Silva"
      },
      "room": {
        "id": 101,
        "number": "101",
        "status": "available"
      }
    },
    "checkIn": {
      "id": 45,
      "actual_check_in": "2026-01-01T14:00:00.000Z",
      "expected_check_out": "2026-01-05T12:00:00.000Z"
    },
    "processedBy": {
      "id": 8,
      "nombres": "Ana",
      "apellido_paterno": "García",
      "email": "ana.garcia@hotel.com"
    }
  }
}
```

---

### 3. Crear Check-Out

**Endpoint:** `POST /api/checkout/crear`

**Descripción:** Crea un nuevo registro de check-out.

**Permiso Requerido:** `checkin_checkout.checkout.crear`

**Body:**
```json
{
  "check_in_id": 45,
  "actual_check_out": "2026-01-05T12:00:00.000Z",
  "final_amount": 650.00,
  "payment_status": "paid",
  "notes": "Check-out sin problemas"
}
```

**Campos Requeridos:**
- `check_in_id`: ID del check-in (integer)
- `final_amount`: Monto final (decimal ≥ 0)

**Campos Opcionales:**
- `actual_check_out`: Fecha/hora del check-out (ISO8601) - default: fecha/hora actual
- `payment_status`: Estado de pago (`pending`, `partial`, `paid`) - default: `pending`
- `notes`: Notas adicionales (máximo 500 caracteres)

**Validaciones:**
- Check-in debe existir
- No puede existir otro check-out para el mismo check-in
- Monto final no puede ser negativo

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "checkOut": {
    "id": 24,
    "check_in_id": 45,
    "actual_check_out": "2026-01-05T12:00:00.000Z",
    "final_amount": 650.00,
    "payment_status": "paid",
    "notes": "Check-out sin problemas",
    "processed_by": 8,
    "created_at": "2026-01-05T12:00:00.000Z"
  },
  "msg": "Check-out creado correctamente"
}
```

---

### 4. Actualizar Check-Out

**Endpoint:** `PUT /api/checkout/actualizar/:id`

**Descripción:** Actualiza un check-out existente.

**Permiso Requerido:** `checkin_checkout.checkout.actualizar`

**Parámetros URL:**
- `id`: ID del check-out (integer)

**Body:** (Todos los campos son opcionales)
```json
{
  "actual_check_out": "2026-01-05T13:00:00.000Z",
  "final_amount": 700.00,
  "payment_status": "paid",
  "notes": "Pago completado con tarjeta"
}
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "checkOut": {
    "id": 23,
    "actual_check_out": "2026-01-05T13:00:00.000Z",
    "final_amount": 700.00,
    "payment_status": "paid",
    "notes": "Pago completado con tarjeta"
  },
  "msg": "Check-out actualizado correctamente"
}
```

---

### 5. Eliminar Check-Out

**Endpoint:** `DELETE /api/checkout/eliminar/:id`

**Descripción:** Elimina un check-out.

**Permiso Requerido:** `checkin_checkout.checkout.eliminar`

**Parámetros URL:**
- `id`: ID del check-out (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Check-out eliminado correctamente"
}
```

---

### 6. Obtener Check-Outs por Rango de Fechas

**Endpoint:** `GET /api/checkout/traer-por-fechas`

**Descripción:** Obtiene check-outs filtrados por rango de fechas.

**Permiso Requerido:** `checkin_checkout.checkout.leer`

**Query Parameters:**
- `start_date`: Fecha de inicio (ISO8601) - **Requerido**
- `end_date`: Fecha de fin (ISO8601) - **Requerido**

**Ejemplo:**
```
GET /api/checkout/traer-por-fechas?start_date=2026-01-01&end_date=2026-01-31
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "checkOuts": [
    {
      "id": 23,
      "actual_check_out": "2026-01-05T12:00:00.000Z",
      "final_amount": 650.00,
      "payment_status": "paid",
      "reservation": {
        "guest": {
          "nombres": "Carlos",
          "apellido_paterno": "Ramírez"
        },
        "room": {
          "number": "101"
        }
      }
    }
  ],
  "total": 45
}
```

---

### 7. Obtener Estadísticas de Check-Outs

**Endpoint:** `GET /api/checkout/traer-estadisticas`

**Descripción:** Obtiene estadísticas generales de check-outs.

**Permiso Requerido:** `checkin_checkout.checkout.leer`

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "stats": {
    "totalCheckOuts": 150,
    "todayCheckOuts": 5,
    "pendingPayments": 12,
    "paidCheckOuts": 138
  }
}
```

**Descripción de estadísticas:**
- `totalCheckOuts`: Total de check-outs registrados
- `todayCheckOuts`: Check-outs realizados hoy
- `pendingPayments`: Check-outs con pago pendiente
- `paidCheckOuts`: Check-outs con pago completado

---

## Precios de Tipos de Habitación

Base URL: `/api/precios-habitacion`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Sistema de precios dinámicos para tipos de habitación. Permite configurar diferentes tarifas según el tipo de alquiler (por hora, día, semana o mes).

### 1. Obtener Todos los Precios

**Endpoint:** `GET /api/precios-habitacion/traer-todos`

**Descripción:** Obtiene lista de precios con filtros y paginación.

**Permiso Requerido:** `habitaciones.precio.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, max: 100)
- `room_type_id` (opcional): Filtrar por tipo de habitación
- `price_type` (opcional): Filtrar por tipo de precio (`hourly`, `daily`, `weekly`, `monthly`)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "prices": [
    {
      "id": 1,
      "room_type_id": 1,
      "price_type": "hourly",
      "price": 15.00,
      "is_active": true,
      "roomType": {
        "id": 1,
        "name": "Habitación Simple"
      }
    }
  ],
  "total": 8,
  "page": 1,
  "totalPages": 1
}
```

---

### 2. Obtener Precios de un Tipo de Habitación

**Endpoint:** `GET /api/precios-habitacion/tipo/:room_type_id`

**Descripción:** Obtiene todos los precios configurados para un tipo de habitación específico.

**Permiso Requerido:** `habitaciones.precio.leer`

**Parámetros URL:**
- `room_type_id`: ID del tipo de habitación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "prices": [
    {
      "id": 1,
      "room_type_id": 1,
      "price_type": "hourly",
      "price": 15.00,
      "is_active": true
    },
    {
      "id": 2,
      "room_type_id": 1,
      "price_type": "daily",
      "price": 120.00,
      "is_active": true
    }
  ]
}
```

---

### 3. Crear Precio

**Endpoint:** `POST /api/precios-habitacion/crear`

**Descripción:** Crea un nuevo precio para un tipo de habitación.

**Permiso Requerido:** `habitaciones.precio.crear`

**Body:**
```json
{
  "room_type_id": 1,
  "price_type": "hourly",
  "price": 15.00
}
```

**Validaciones:**
- `room_type_id`: Requerido, integer, debe existir
- `price_type`: Requerido, valores: `hourly`, `daily`, `weekly`, `monthly`
- `price`: Requerido, decimal, mínimo 0
- No puede existir otro precio del mismo tipo para el mismo room_type

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "price": {
    "id": 5,
    "room_type_id": 1,
    "price_type": "hourly",
    "price": 15.00,
    "is_active": true
  },
  "msg": "Precio creado correctamente"
}
```

---

### 4. Actualizar Precio

**Endpoint:** `PUT /api/precios-habitacion/actualizar/:id`

**Descripción:** Actualiza un precio existente.

**Permiso Requerido:** `habitaciones.precio.actualizar`

**Body:** (Todos los campos son opcionales)
```json
{
  "price": 18.00,
  "is_active": true
}
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "price": {
    "id": 1,
    "price": 18.00,
    "is_active": true
  },
  "msg": "Precio actualizado correctamente"
}
```

---

### 5. Eliminar Precio

**Endpoint:** `DELETE /api/precios-habitacion/eliminar/:id`

**Descripción:** Elimina un precio (soft delete).

**Permiso Requerido:** `habitaciones.precio.eliminar`

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Precio eliminado correctamente"
}
```

---

## Productos

Base URL: `/api/productos`

**Autenticación:** Todas las rutas requieren token JWT

### 📦 Sistema de Inventario y Ubicaciones

El sistema de productos utiliza un modelo de inventario multi-ubicación:

**Ubicaciones Predeterminadas:**
- **ID 1:** Recepción Principal
- **ID 2:** Almacén General (ubicación por defecto)
- **ID 3:** Restaurante
- **Minibars:** Cada habitación puede tener su propio minibar

**Funcionamiento:**
1. Al crear un producto con `requires_inventory: true`, se crea automáticamente un registro de inventario en "Almacén General" (ID: 2)
2. Al registrar una venta sin especificar `location_id`, se usa "Almacén General" por defecto
3. El trigger `update_inventory_on_sale_trigger` actualiza automáticamente el stock cuando se registra una venta
4. Cada ubicación mantiene su propio stock independiente del mismo producto

---

### 1. Obtener Todos los Productos

**Endpoint:** `GET /api/productos/traer-todos`

**Descripción:** Obtiene lista de productos del hotel con paginación.

**Permiso Requerido:** `productos.producto.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Registros por página (default: 10, max: 100)
- `category_id` (opcional): Filtrar por categoría (integer)
- `is_active` (opcional): Filtrar por estado activo (boolean)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "productos": [
    {
      "id": 1,
      "name": "Coca Cola 500ml",
      "description": "Bebida gaseosa",
      "category_id": 1,
      "sku": "BEB001",
      "price": 5.00,
      "cost": 3.00,
      "tax_rate": 0.18,
      "is_active": true,
      "requires_inventory": true,
      "created_at": "2024-01-10T10:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Bebidas"
      }
    }
  ]
}
```

---

### 2. Obtener Producto por ID

**Endpoint:** `GET /api/productos/traer-por-id/:id`

**Descripción:** Obtiene información detallada de un producto.

**Permiso Requerido:** `productos.producto.leer`

**Parámetros URL:**
- `id`: ID del producto (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "producto": {
    "id": 1,
    "name": "Coca Cola 500ml",
    "description": "Bebida gaseosa",
    "category_id": 1,
    "sku": "BEB001",
    "price": 5.00,
    "cost": 3.00,
    "tax_rate": 0.18,
    "is_active": true,
    "requires_inventory": true,
    "category": { ... }
  }
}
```

---

### 3. Crear Producto

**Endpoint:** `POST /api/productos/crear`

**Descripción:** Crea un nuevo producto.

**Permiso Requerido:** `productos.producto.crear`

**Body:**
```json
{
  "name": "Coca Cola 500ml",
  "description": "Bebida gaseosa",
  "category_id": 1,
  "sku": "BEB001",
  "price": 5.00,
  "cost": 3.00,
  "tax_rate": 0.18,
  "requires_inventory": true,
  "initial_stock": 100,
  "min_stock": 10,
  "max_stock": 200
}
```

**Validaciones:**
- `name`: Requerido, máximo 255 caracteres
- `description`: Opcional, texto, máximo 500 caracteres
- `category_id`: Opcional, integer, debe existir
- `sku`: Opcional, máximo 50 caracteres, único
- `price`: Requerido, decimal, mínimo 0
- `cost`: Opcional, decimal, mínimo 0
- `tax_rate`: Opcional, decimal (ej: 0.18 para 18%)
- `requires_inventory`: Opcional, booleano (default: false)
- `initial_stock`: Opcional, entero ≥ 0 (stock inicial en Almacén General)
- `min_stock`: Opcional, entero ≥ 0 (stock mínimo de alerta)
- `max_stock`: Opcional, entero > 0 (stock máximo permitido)

**Notas sobre Inventario:**
- Si `requires_inventory` es `true`, se creará automáticamente un registro de inventario en la ubicación "Almacén General" (ID: 2)
- Los campos `initial_stock`, `min_stock` y `max_stock` solo aplican si `requires_inventory` es `true`
- Si no se especifica `initial_stock`, el producto se creará con stock 0

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "producto": { ... }
}
```

---

### 4. Actualizar Producto

**Endpoint:** `PUT /api/productos/actualizar/:id`

**Descripción:** Actualiza información de un producto.

**Permiso Requerido:** `productos.producto.actualizar`

**Parámetros URL:**
- `id`: ID del producto (integer)

**Body:** (Todos los campos son opcionales)
```json
{
  "name": "Coca Cola 600ml",
  "price": 6.00,
  "cost": 3.50
}
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "producto": { ... }
}
```

---

### 5. Actualizar Stock

**Endpoint:** `PATCH /api/productos/actualizar-stock/:id`

**Descripción:** Actualiza el stock de un producto en "Almacén General" mediante entrada (incremento) o salida (decremento) de inventario.

**Permiso Requerido:** `productos.producto.actualizar`

**Parámetros URL:**
- `id`: ID del producto (integer)

**Body:**
```json
{
  "quantity": 50,
  "type": "entrada"
}
```

**Validaciones:**
- `quantity`: Requerido, entero mayor a 0
- `type`: Requerido, valores: `entrada` o `salida`

**Nota:** Este endpoint siempre actualiza el stock en la ubicación "Almacén General" (ID: 2). Para actualizar stock en otras ubicaciones, usar el CRUD completo de inventario.

---

#### **Caso 1: Entrada de Stock (Incremento)**

Incrementa el stock actual del producto. Útil para registrar compras o devoluciones.

**Ejemplo de Request:**
```json
{
  "quantity": 50,
  "type": "entrada"
}
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "producto": {
    "id": 1,
    "name": "Coca Cola 500ml",
    "sku": "COCA-500",
    "price": 3.50,
    "inventories": [
      {
        "id": 1,
        "current_stock": 150,
        "min_stock": 10,
        "max_stock": 200
      }
    ]
  },
  "msg": "Stock actualizado correctamente"
}
```

**Comportamiento:**
- Stock anterior: 100
- Cantidad entrada: 50
- **Stock nuevo: 150** (100 + 50)

---

#### **Caso 2: Salida de Stock (Decremento)**

Decrementa el stock actual del producto. Útil para registrar consumos internos o ajustes de inventario.

**Ejemplo de Request:**
```json
{
  "quantity": 30,
  "type": "salida"
}
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "producto": {
    "id": 1,
    "name": "Coca Cola 500ml",
    "sku": "COCA-500",
    "price": 3.50,
    "inventories": [
      {
        "id": 1,
        "current_stock": 70,
        "min_stock": 10,
        "max_stock": 200
      }
    ]
  },
  "msg": "Stock actualizado correctamente"
}
```

**Comportamiento:**
- Stock anterior: 100
- Cantidad salida: 30
- **Stock nuevo: 70** (100 - 30)

**Error - Stock Insuficiente (400):**
```json
{
  "ok": false,
  "msg": "Stock insuficiente"
}
```

**Nota:** La salida de stock valida que haya suficiente inventario disponible. Si se intenta retirar más unidades de las disponibles, retorna error 400.

---

#### **Errores Comunes:**

**Tipo de movimiento inválido (400):**
```json
{
  "ok": false,
  "msg": "Tipo de movimiento inválido. Debe ser \"entrada\" o \"salida\""
}
```

**Producto no encontrado (404):**
```json
{
  "ok": false,
  "msg": "Producto no encontrado"
}
```

---

### 6. Registrar Venta (Simple)

**Endpoint:** `POST /api/productos/registrar-venta`

**Descripción:** Registra una venta simple de un solo producto. Este endpoint crea automáticamente la venta (Sale) y el item de venta (SaleItem) en una sola operación. Calcula automáticamente precios y actualiza el inventario. Para ventas con múltiples productos, usar `/api/ventas/crear` + `/api/items-venta/crear`.

**Permiso Requerido:** `productos.venta.crear`

**Body:**
```json
{
  "product_id": 1,
  "quantity": 2,
  "reservation_id": 1,
  "guest_id": 1,
  "payment_method": "room_charge"
}
```

**Ejemplo con datos realistas (venta de minibar):**
```json
{
  "product_id": 1,
  "quantity": 3,
  "reservation_id": 1,
  "guest_id": 1,
  "payment_method": "room_charge"
}
```

**Ejemplo sin reserva (venta en restaurante):**
```json
{
  "product_id": 5,
  "quantity": 1,
  "payment_method": "card"
}
```

**Validaciones:**
- `product_id`: Requerido, integer, debe existir en la tabla `products`
- `quantity`: Requerido, entero mayor a 0
- `reservation_id`: Opcional, integer. **Si se proporciona, debe existir en la tabla `reservations`**. Omitir o enviar `null` si no hay reserva asociada.
- `guest_id`: Opcional, integer. **Si se proporciona, debe existir en la tabla `guests`**. Omitir o enviar `null` si no hay huésped asociado.
- `payment_method`: Requerido, string, máximo 20 caracteres

**Notas Importantes:**
- Este endpoint es una versión simplificada para ventas rápidas de un solo producto
- El estado de pago siempre será `paid`
- La venta se registra en "Almacén General" (ID: 2) por defecto
- El trigger `update_inventory_on_sale_trigger` actualiza automáticamente el stock cuando se crea el `sale_item`
- Si el producto requiere inventario y no hay stock suficiente en "Almacén General", la venta será rechazada
- Si envías `reservation_id` o `guest_id`, **deben ser IDs válidos que existan en sus respectivas tablas**, de lo contrario obtendrás un error de llave foránea

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "venta": {
    "id": 1,
    "sale_number": "SALE1705363200000",
    "reservation_id": 123,
    "guest_id": 5,
    "subtotal": 10.00,
    "tax_amount": 1.80,
    "discount_amount": 0.00,
    "total_amount": 11.80,
    "payment_method": "cash",
    "payment_status": "paid",
    "processed_by": 8,
    "created_at": "2024-12-01T15:30:00.000Z",
    "items": [
      {
        "id": 1,
        "sale_id": 1,
        "product_id": 1,
        "quantity": 2,
        "unit_price": 5.00,
        "total_price": 10.00
      }
    ]
  },
  "msg": "Venta registrada correctamente"
}
```

**Errores Posibles:**

**Stock insuficiente (400):**
```json
{
  "ok": false,
  "msg": "Stock insuficiente"
}
```

**Producto no encontrado (400):**
```json
{
  "ok": false,
  "msg": "Producto con ID 1 no encontrado"
}
```

**Reserva no encontrada (400):**
```json
{
  "ok": false,
  "msg": "Reserva con ID 123 no encontrada"
}
```

**Huésped no encontrado (400):**
```json
{
  "ok": false,
  "msg": "Huésped con ID 5 no encontrado"
}
```

---

### 7. Obtener Ventas

**Endpoint:** `GET /api/productos/traer-ventas`

**Descripción:** Obtiene lista de ventas de productos.

**Permiso Requerido:** `productos.venta.leer`

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "ventas": [
    {
      "id": 1,
      "sale_number": "V-2024-001",
      "reservation_id": 123,
      "guest_id": 5,
      "subtotal": 10.00,
      "tax_amount": 1.80,
      "total_amount": 11.80,
      "payment_method": "cash",
      "payment_status": "paid",
      "created_at": "2024-12-01T15:30:00.000Z",
      "items": [...]
    }
  ]
}
```

---

### 8. Eliminar Producto

**Endpoint:** `DELETE /api/productos/:id`

**Descripción:** Elimina un producto.

**Permiso Requerido:** `productos.eliminar`

**Parámetros URL:**
- `id`: UUID del producto

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Producto eliminado correctamente"
}
```

---

## Notas Finales

### Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error de validación o solicitud incorrecta
- **401**: No autenticado
- **403**: No autorizado (sin permisos)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

### Permisos del Sistema

Los permisos siguen el formato `recurso.accion`:

- **users**: `read`, `create`, `update`, `delete`
- **habitaciones**: `ver`, `crear`, `editar`, `eliminar`
- **huespedes**: `ver`, `crear`, `editar`, `eliminar`
- **reservas**: `ver`, `crear`, `editar`
- **checkin**: `ver`, `crear`, `editar`
- **checkout**: `crear`
- **productos**: `ver`, `crear`, `editar`, `eliminar`
- **ventas**: `ver`, `crear`

### Arquitectura Multi-Tenant

El sistema utiliza una arquitectura multi-tenant donde:

1. Cada hotel tiene su propia base de datos
2. Se requiere el header `X-Hotel-Id` para rutas públicas que necesitan identificar el hotel
3. Las rutas autenticadas obtienen el hotel del token JWT
4. Los modelos y conexiones se inicializan dinámicamente según el hotel

---

## Servicios Adicionales

Base URL: `/api/servicios-adicionales`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Todos los Servicios Adicionales

**Endpoint:** `GET /api/servicios-adicionales/traer-todos`

**Descripción:** Obtiene lista de servicios adicionales del hotel con paginación y filtros.

**Permiso Requerido:** `servicios.servicio.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `category` (opcional): Filtrar por categoría (spa, restaurant, laundry, transport, etc.)
- `is_active` (opcional): Filtrar por estado activo (true/false)

**Ejemplo de Request:**
```
GET /api/servicios-adicionales/traer-todos?page=1&limit=10&category=spa&is_active=true
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "services": [
    {
      "id": 1,
      "name": "Masaje Relajante",
      "description": "Masaje de cuerpo completo de 60 minutos",
      "category": "spa",
      "price": 80.00,
      "duration_minutes": 60,
      "is_active": true,
      "requires_reservation": true,
      "created_at": "2024-12-01T10:00:00.000Z"
    }
  ],
  "totalCount": 15,
  "currentPage": 1,
  "totalPages": 2
}
```

---

### 2. Obtener Servicio Adicional por ID

**Endpoint:** `GET /api/servicios-adicionales/traer-por-id/:id`

**Descripción:** Obtiene un servicio adicional específico por su ID.

**Permiso Requerido:** `servicios.servicio.leer`

**Parámetros URL:**
- `id`: ID del servicio adicional (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "service": {
    "id": 1,
    "name": "Masaje Relajante",
    "description": "Masaje de cuerpo completo de 60 minutos",
    "category": "spa",
    "price": 80.00,
    "duration_minutes": 60,
    "is_active": true,
    "requires_reservation": true,
    "created_at": "2024-12-01T10:00:00.000Z"
  }
}
```

---

### 3. Crear Servicio Adicional

**Endpoint:** `POST /api/servicios-adicionales/crear`

**Descripción:** Crea un nuevo servicio adicional.

**Permiso Requerido:** `servicios.servicio.crear`

**Body:**
```json
{
  "name": "Masaje Relajante",
  "description": "Masaje de cuerpo completo de 60 minutos",
  "category": "spa",
  "price": 80.00,
  "duration_minutes": 60,
  "is_active": true,
  "requires_reservation": true
}
```

**Validaciones:**
- `name`: Requerido, máximo 255 caracteres, único
- `description`: Opcional, texto
- `category`: Opcional, valores permitidos: `'spa'`, `'restaurant'`, `'laundry'`, `'transport'`, `'tours'`, `'other'`
- `price`: Requerido, decimal, mínimo 0
- `duration_minutes`: Opcional, entero positivo (duración en minutos)
- `is_active`: Opcional, booleano (default: true)
- `requires_reservation`: Opcional, booleano (default: false)

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "service": {
    "id": 1,
    "name": "Masaje Relajante",
    "description": "Masaje de cuerpo completo de 60 minutos",
    "category": "spa",
    "price": 80.00,
    "duration_minutes": 60,
    "is_active": true,
    "requires_reservation": true,
    "created_at": "2024-12-01T10:00:00.000Z"
  },
  "msg": "Servicio adicional creado correctamente"
}
```

---

### 4. Actualizar Servicio Adicional

**Endpoint:** `PUT /api/servicios-adicionales/actualizar/:id`

**Descripción:** Actualiza un servicio adicional existente.

**Permiso Requerido:** `servicios.servicio.actualizar`

**Parámetros URL:**
- `id`: ID del servicio adicional (integer)

**Body:**
```json
{
  "name": "Masaje Relajante Premium",
  "description": "Masaje de cuerpo completo de 90 minutos con aromaterapia",
  "price": 120.00,
  "duration_minutes": 90
}
```

**Validaciones:**
- Todos los campos son opcionales
- `name`: Máximo 255 caracteres, único
- `category`: Máximo 20 caracteres
- `price`: Decimal, mínimo 0
- `duration_minutes`: Entero positivo
- `is_active`: Booleano
- `requires_reservation`: Booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "service": {
    "id": 1,
    "name": "Masaje Relajante Premium",
    "description": "Masaje de cuerpo completo de 90 minutos con aromaterapia",
    "category": "spa",
    "price": 120.00,
    "duration_minutes": 90,
    "is_active": true,
    "requires_reservation": true,
    "created_at": "2024-12-01T10:00:00.000Z"
  },
  "msg": "Servicio adicional actualizado correctamente"
}
```

---

### 5. Cambiar Estado de Servicio Adicional

**Endpoint:** `PATCH /api/servicios-adicionales/cambiar-estado/:id`

**Descripción:** Activa o desactiva un servicio adicional.

**Permiso Requerido:** `servicios.servicio.actualizar`

**Parámetros URL:**
- `id`: ID del servicio adicional (integer)

**Body:**
```json
{
  "is_active": false
}
```

**Validaciones:**
- `is_active`: Requerido, booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "service": {
    "id": 1,
    "name": "Masaje Relajante",
    "is_active": false,
    ...
  },
  "msg": "Estado del servicio adicional actualizado correctamente"
}
```

---

### 6. Eliminar Servicio Adicional

**Endpoint:** `DELETE /api/servicios-adicionales/eliminar/:id`

**Descripción:** Elimina un servicio adicional del sistema.

**Permiso Requerido:** `servicios.servicio.eliminar`

**Parámetros URL:**
- `id`: ID del servicio adicional (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Servicio adicional eliminado correctamente"
}
```

**Nota:** La eliminación es permanente. Si el servicio tiene registros asociados en otras tablas, considere desactivarlo en lugar de eliminarlo.

---

### Categorías Comunes de Servicios Adicionales

- **spa**: Servicios de spa y bienestar (masajes, tratamientos faciales, etc.)
- **restaurant**: Servicios de restaurante y room service
- **laundry**: Servicios de lavandería y tintorería
- **transport**: Servicios de transporte (taxi, shuttle, etc.)
- **entertainment**: Entretenimiento (tours, actividades, etc.)
- **business**: Servicios de negocios (sala de conferencias, impresión, etc.)

---

## Clientes Corporativos

Base URL: `/api/clientes-corporativos`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Todos los Clientes Corporativos

**Endpoint:** `GET /api/clientes-corporativos/traer-todos`

**Descripción:** Obtiene lista de clientes corporativos del hotel con paginación y filtros.

**Permiso Requerido:** `huespedes.cliente.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `is_active` (opcional): Filtrar por estado activo (true/false)
- `country_id` (opcional): Filtrar por ID de país

**Ejemplo de Request:**
```
GET /api/clientes-corporativos/traer-todos?page=1&limit=10&is_active=true&country_id=1
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "clients": [
    {
      "id": 1,
      "company_name": "Corporación ABC S.A.",
      "contact_name": "Juan Pérez",
      "contact_email": "juan.perez@abc.com",
      "contact_phone": "+51 999 888 777",
      "tax_id": "20123456789",
      "address": "Av. Principal 123",
      "city": "Lima",
      "country_id": 1,
      "countryData": {
        "id": 1,
        "code": "PER",
        "name": "Perú",
        "nationality": "Peruana"
      },
      "discount_percentage": 15.00,
      "payment_terms": 30,
      "is_active": true,
      "created_at": "2024-12-01T10:00:00.000Z",
      "updated_at": "2024-12-01T10:00:00.000Z"
    }
  ],
  "totalCount": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

---

### 2. Obtener Cliente Corporativo por ID

**Endpoint:** `GET /api/clientes-corporativos/traer-por-id/:id`

**Descripción:** Obtiene un cliente corporativo específico por su ID.

**Permiso Requerido:** `huespedes.cliente.leer`

**Parámetros URL:**
- `id`: ID del cliente corporativo (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "client": {
    "id": 1,
    "company_name": "Corporación ABC S.A.",
    "contact_name": "Juan Pérez",
    "contact_email": "juan.perez@abc.com",
    "contact_phone": "+51 999 888 777",
    "tax_id": "20123456789",
    "address": "Av. Principal 123",
    "city": "Lima",
    "country_id": 1,
    "countryData": {
      "id": 1,
      "code": "PER",
      "name": "Perú",
      "nationality": "Peruana"
    },
    "discount_percentage": 15.00,
    "payment_terms": 30,
    "is_active": true,
    "created_at": "2024-12-01T10:00:00.000Z",
    "updated_at": "2024-12-01T10:00:00.000Z"
  }
}
```

---

### 3. Crear Cliente Corporativo

**Endpoint:** `POST /api/clientes-corporativos/crear`

**Descripción:** Crea un nuevo cliente corporativo.

**Permiso Requerido:** `huespedes.cliente.crear`

**Body:**
```json
{
  "company_name": "Corporación ABC S.A.",
  "contact_name": "Juan Pérez",
  "contact_email": "juan.perez@abc.com",
  "contact_phone": "+51 999 888 777",
  "tax_id": "20123456789",
  "address": "Av. Principal 123",
  "city": "Lima",
  "country_id": 1,
  "discount_percentage": 15.00,
  "payment_terms": 30,
  "is_active": true
}
```

**Validaciones:**
- `company_name`: Requerido, máximo 255 caracteres, único
- `contact_name`: Opcional, máximo 255 caracteres
- `contact_email`: Opcional, email válido, máximo 255 caracteres
- `contact_phone`: Opcional, máximo 20 caracteres
- `tax_id`: Opcional, máximo 50 caracteres, único (si se proporciona)
- `address`: Opcional, texto
- `city`: Opcional, máximo 100 caracteres
- `country_id`: Opcional, ID del país (integer, FK a tabla countries)
- `discount_percentage`: Opcional, decimal entre 0 y 100 (default: 0)
- `payment_terms`: Opcional, entero positivo en días (default: 30)
- `is_active`: Opcional, booleano (default: true)

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "client": {
    "id": 1,
    "company_name": "Corporación ABC S.A.",
    "contact_name": "Juan Pérez",
    "contact_email": "juan.perez@abc.com",
    "contact_phone": "+51 999 888 777",
    "tax_id": "20123456789",
    "address": "Av. Principal 123",
    "city": "Lima",
    "country_id": 1,
    "countryData": {
      "id": 1,
      "code": "PER",
      "name": "Perú",
      "nationality": "Peruana"
    },
    "discount_percentage": 15.00,
    "payment_terms": 30,
    "is_active": true,
    "created_at": "2024-12-01T10:00:00.000Z",
    "updated_at": "2024-12-01T10:00:00.000Z"
  },
  "msg": "Cliente corporativo creado correctamente"
}
```

---

### 4. Actualizar Cliente Corporativo

**Endpoint:** `PUT /api/clientes-corporativos/actualizar/:id`

**Descripción:** Actualiza un cliente corporativo existente.

**Permiso Requerido:** `huespedes.cliente.actualizar`

**Parámetros URL:**
- `id`: ID del cliente corporativo (integer)

**Body:**
```json
{
  "contact_name": "María García",
  "contact_email": "maria.garcia@abc.com",
  "discount_percentage": 20.00,
  "payment_terms": 45
}
```

**Validaciones:**
- Todos los campos son opcionales
- `company_name`: Máximo 255 caracteres, único
- `contact_email`: Email válido
- `tax_id`: Máximo 50 caracteres, único (si se proporciona)
- `discount_percentage`: Decimal entre 0 y 100
- `payment_terms`: Entero positivo

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "client": {
    "id": 1,
    "company_name": "Corporación ABC S.A.",
    "contact_name": "María García",
    "contact_email": "maria.garcia@abc.com",
    "contact_phone": "+51 999 888 777",
    "tax_id": "20123456789",
    "address": "Av. Principal 123",
    "city": "Lima",
    "country_id": 1,
    "countryData": {
      "id": 1,
      "code": "PER",
      "name": "Perú",
      "nationality": "Peruana"
    },
    "discount_percentage": 20.00,
    "payment_terms": 45,
    "is_active": true,
    "created_at": "2024-12-01T10:00:00.000Z",
    "updated_at": "2024-12-15T14:30:00.000Z"
  },
  "msg": "Cliente corporativo actualizado correctamente"
}
```

---

### 5. Cambiar Estado de Cliente Corporativo

**Endpoint:** `PATCH /api/clientes-corporativos/cambiar-estado/:id`

**Descripción:** Activa o desactiva un cliente corporativo.

**Permiso Requerido:** `huespedes.cliente.actualizar`

**Parámetros URL:**
- `id`: ID del cliente corporativo (integer)

**Body:**
```json
{
  "is_active": false
}
```

**Validaciones:**
- `is_active`: Requerido, booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "client": {
    "id": 1,
    "company_name": "Corporación ABC S.A.",
    "is_active": false,
    ...
  },
  "msg": "Estado del cliente corporativo actualizado correctamente"
}
```

---

### 6. Eliminar Cliente Corporativo

**Endpoint:** `DELETE /api/clientes-corporativos/eliminar/:id`

**Descripción:** Elimina un cliente corporativo del sistema.

**Permiso Requerido:** `huespedes.cliente.eliminar`

**Parámetros URL:**
- `id`: ID del cliente corporativo (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Cliente corporativo eliminado correctamente"
}
```

**Nota:** La eliminación es permanente. Si el cliente tiene reservas o transacciones asociadas, considere desactivarlo en lugar de eliminarlo para mantener la integridad de los datos históricos.

---

### Información Adicional sobre Clientes Corporativos

**Descuentos:**
- El campo `discount_percentage` permite configurar un descuento automático para todas las reservas del cliente corporativo
- El descuento se aplica como porcentaje sobre el precio base (0-100%)

**Términos de Pago:**
- El campo `payment_terms` indica los días de crédito otorgados al cliente
- Valor típico: 30 días (default)
- Valores comunes: 15, 30, 45, 60 días

**Tax ID:**
- Identificador fiscal único del cliente corporativo (RUC, NIT, RFC, etc.)
- Útil para facturación y reportes fiscales

---

## Inventario

Base URL: `/api/inventario`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Todos los Inventarios

**Endpoint:** `GET /api/inventario/traer-todos`

**Descripción:** Obtiene lista de registros de inventario con paginación y filtros.

**Permiso Requerido:** `productos.inventario.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `product_id` (opcional): Filtrar por ID de producto
- `location_id` (opcional): Filtrar por ID de ubicación
- `low_stock` (opcional): Filtrar productos con stock bajo (current_stock < min_stock) (true/false)

**Ejemplo de Request:**
```
GET /api/inventario/traer-todos?page=1&limit=10&low_stock=true
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "inventories": [
    {
      "id": 1,
      "product_id": 5,
      "location_id": 2,
      "current_stock": 15,
      "min_stock": 10,
      "max_stock": 100,
      "last_restock_date": "2024-12-10T10:00:00.000Z",
      "created_at": "2024-12-01T10:00:00.000Z",
      "updated_at": "2024-12-10T10:00:00.000Z",
      "product": {
        "id": 5,
        "name": "Coca Cola 500ml",
        "sku": "BEB001",
        "price": 5.00
      },
      "location": {
        "id": 2,
        "name": "Almacén General",
        "location_type": "storage"
      }
    }
  ],
  "totalCount": 45,
  "currentPage": 1,
  "totalPages": 5
}
```

---

### 2. Obtener Inventario por ID

**Endpoint:** `GET /api/inventario/traer-por-id/:id`

**Descripción:** Obtiene un registro de inventario específico por su ID.

**Permiso Requerido:** `productos.inventario.leer`

**Parámetros URL:**
- `id`: ID del registro de inventario (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "inventory": {
    "id": 1,
    "product_id": 5,
    "location_id": 2,
    "current_stock": 15,
    "min_stock": 10,
    "max_stock": 100,
    "last_restock_date": "2024-12-10T10:00:00.000Z",
    "created_at": "2024-12-01T10:00:00.000Z",
    "updated_at": "2024-12-10T10:00:00.000Z",
    "product": {
      "id": 5,
      "name": "Coca Cola 500ml",
      "sku": "BEB001",
      "price": 5.00
    },
    "location": {
      "id": 2,
      "name": "Almacén General",
      "location_type": "storage"
    }
  }
}
```

---

### 3. Crear Inventario

**Endpoint:** `POST /api/inventario/crear`

**Descripción:** Crea un nuevo registro de inventario para un producto en una ubicación específica.

**Permiso Requerido:** `productos.inventario.crear`

**Body:**
```json
{
  "product_id": 5,
  "location_id": 2,
  "current_stock": 50,
  "min_stock": 10,
  "max_stock": 100
}
```

**Validaciones:**
- `product_id`: Requerido, integer, debe existir en la tabla `products`
- `location_id`: Opcional, integer, debe existir en la tabla `inventory_locations`
- `current_stock`: Opcional, entero ≥ 0 (default: 0)
- `min_stock`: Opcional, entero ≥ 0 (default: 0)
- `max_stock`: Opcional, entero > 0
- **Restricción:** No puede existir otro registro con la misma combinación de `product_id` y `location_id`

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "inventory": {
    "id": 1,
    "product_id": 5,
    "location_id": 2,
    "current_stock": 50,
    "min_stock": 10,
    "max_stock": 100,
    "last_restock_date": "2024-12-15T10:00:00.000Z",
    "created_at": "2024-12-15T10:00:00.000Z",
    "updated_at": "2024-12-15T10:00:00.000Z",
    "product": { ... },
    "location": { ... }
  },
  "msg": "Inventario creado correctamente"
}
```

---

### 4. Actualizar Inventario

**Endpoint:** `PUT /api/inventario/actualizar/:id`

**Descripción:** Actualiza los parámetros de un registro de inventario (no el stock, usar ajustar-stock para eso).

**Permiso Requerido:** `productos.inventario.actualizar`

**Parámetros URL:**
- `id`: ID del registro de inventario (integer)

**Body:**
```json
{
  "min_stock": 15,
  "max_stock": 150
}
```

**Validaciones:**
- Todos los campos son opcionales
- `current_stock`: Entero ≥ 0
- `min_stock`: Entero ≥ 0
- `max_stock`: Entero > 0
- `last_restock_date`: Fecha ISO 8601

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "inventory": {
    "id": 1,
    "product_id": 5,
    "location_id": 2,
    "current_stock": 50,
    "min_stock": 15,
    "max_stock": 150,
    ...
  },
  "msg": "Inventario actualizado correctamente"
}
```

---

### 5. Ajustar Stock

**Endpoint:** `PATCH /api/inventario/ajustar-stock/:id`

**Descripción:** Ajusta el stock de un inventario mediante diferentes operaciones.

**Permiso Requerido:** `productos.inventario.actualizar`

**Parámetros URL:**
- `id`: ID del registro de inventario (integer)

**Body:**
```json
{
  "quantity": 20,
  "type": "add",
  "reason": "Compra de mercancía"
}
```

**Validaciones:**
- `quantity`: Requerido, entero positivo
- `type`: Requerido, valores: `add` (agregar), `subtract` (restar), `set` (establecer)
- `reason`: Opcional, string (motivo del ajuste)

**Tipos de Ajuste:**

#### **Tipo: add (Agregar)**
Incrementa el stock actual.
```json
{
  "quantity": 20,
  "type": "add",
  "reason": "Reabastecimiento"
}
```
Si `current_stock` era 50, ahora será 70.

#### **Tipo: subtract (Restar)**
Decrementa el stock actual. Valida que haya stock suficiente.
```json
{
  "quantity": 10,
  "type": "subtract",
  "reason": "Ajuste por merma"
}
```
Si `current_stock` era 50, ahora será 40.

#### **Tipo: set (Establecer)**
Establece el stock a un valor específico (útil para inventarios físicos).
```json
{
  "quantity": 35,
  "type": "set",
  "reason": "Inventario físico"
}
```
El `current_stock` será exactamente 35, sin importar el valor anterior.

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "inventory": {
    "id": 1,
    "product_id": 5,
    "location_id": 2,
    "current_stock": 70,
    "min_stock": 10,
    "max_stock": 100,
    "last_restock_date": "2024-12-15T14:30:00.000Z",
    ...
  },
  "msg": "Stock ajustado correctamente"
}
```

**Error - Stock Insuficiente (400):**
```json
{
  "ok": false,
  "msg": "Stock insuficiente para realizar la operación"
}
```

---

### 6. Eliminar Inventario

**Endpoint:** `DELETE /api/inventario/eliminar/:id`

**Descripción:** Elimina un registro de inventario del sistema.

**Permiso Requerido:** `productos.inventario.eliminar`

**Parámetros URL:**
- `id`: ID del registro de inventario (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Registro de inventario eliminado correctamente"
}
```

**Nota:** La eliminación es permanente. Solo elimine registros de inventario que no tengan movimientos históricos asociados.

---

### Información Adicional sobre Inventario

**Sistema Multi-Ubicación:**
- Cada producto puede tener múltiples registros de inventario, uno por ubicación
- Las ubicaciones comunes son: Almacén General, Recepción, Restaurante, Minibars
- `location_id` puede ser `null` para inventario general

**Alertas de Stock Bajo:**
- Use el filtro `low_stock=true` para obtener productos que necesitan reabastecimiento
- Un producto tiene stock bajo cuando `current_stock < min_stock`

**Fecha de Reabastecimiento:**
- `last_restock_date` se actualiza automáticamente cuando se usa `type: add` en ajustar-stock
- Útil para reportes de rotación de inventario

**Buenas Prácticas:**
- Usar `ajustar-stock` con `type: add` para compras y reabastecimientos
- Usar `ajustar-stock` con `type: subtract` para mermas, robos o ajustes
- Usar `ajustar-stock` con `type: set` para inventarios físicos periódicos
- Siempre incluir un `reason` descriptivo para auditoría

---

## Ubicaciones de Inventario

Base URL: `/api/ubicaciones-inventario`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Todas las Ubicaciones de Inventario

**Endpoint:** `GET /api/ubicaciones-inventario/traer-todos`

**Descripción:** Obtiene lista de ubicaciones de inventario con paginación y filtros.

**Permiso Requerido:** `productos.ubicacion.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `location_type` (opcional): Filtrar por tipo de ubicación (warehouse, bar, restaurant, minibar, etc.)
- `is_active` (opcional): Filtrar por estado activo (true/false)

**Ejemplo de Request:**
```
GET /api/ubicaciones-inventario/traer-todos?page=1&limit=10&location_type=warehouse&is_active=true
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "locations": [
    {
      "id": 1,
      "name": "Almacén General",
      "location_type": "warehouse",
      "room_id": null,
      "is_active": true,
      "created_at": "2024-12-01T10:00:00.000Z",
      "room": null
    },
    {
      "id": 2,
      "name": "Minibar Habitación 101",
      "location_type": "minibar",
      "room_id": 5,
      "is_active": true,
      "created_at": "2024-12-01T10:00:00.000Z",
      "room": {
        "id": 5,
        "number": "101",
        "room_type": "standard"
      }
    }
  ],
  "totalCount": 15,
  "currentPage": 1,
  "totalPages": 2
}
```

---

### 2. Obtener Ubicación de Inventario por ID

**Endpoint:** `GET /api/ubicaciones-inventario/traer-por-id/:id`

**Descripción:** Obtiene una ubicación de inventario específica por su ID.

**Permiso Requerido:** `productos.ubicacion.leer`

**Parámetros URL:**
- `id`: ID de la ubicación de inventario (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "location": {
    "id": 1,
    "name": "Almacén General",
    "location_type": "warehouse",
    "room_id": null,
    "is_active": true,
    "created_at": "2024-12-01T10:00:00.000Z",
    "room": null
  }
}
```

---

### 3. Crear Ubicación de Inventario

**Endpoint:** `POST /api/ubicaciones-inventario/crear`

**Descripción:** Crea una nueva ubicación de inventario.

**Permiso Requerido:** `productos.ubicacion.crear`

**Body:**
```json
{
  "name": "Almacén General",
  "location_type": "warehouse",
  "room_id": null,
  "is_active": true
}
```

**Validaciones:**
- `name`: Requerido, máximo 100 caracteres, único
- `location_type`: Opcional, valores permitidos: `'reception'`, `'minibar'`, `'storage'`, `'restaurant'`
- `room_id`: Opcional, integer, debe existir en la tabla `rooms` (requerido si `location_type` es `'minibar'`)
- `is_active`: Opcional, booleano (default: true)

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "location": {
    "id": 1,
    "name": "Almacén General",
    "location_type": "warehouse",
    "room_id": null,
    "is_active": true,
    "created_at": "2024-12-15T10:00:00.000Z",
    "room": null
  },
  "msg": "Ubicación de inventario creada correctamente"
}
```

---

### 4. Actualizar Ubicación de Inventario

**Endpoint:** `PUT /api/ubicaciones-inventario/actualizar/:id`

**Descripción:** Actualiza una ubicación de inventario existente.

**Permiso Requerido:** `productos.ubicacion.actualizar`

**Parámetros URL:**
- `id`: ID de la ubicación de inventario (integer)

**Body:**
```json
{
  "name": "Almacén Principal",
  "location_type": "warehouse"
}
```

**Validaciones:**
- Todos los campos son opcionales
- `name`: Máximo 100 caracteres, único
- `location_type`: Valores permitidos: `'reception'`, `'minibar'`, `'storage'`, `'restaurant'`
- `room_id`: Integer, debe existir en la tabla `rooms`
- `is_active`: Booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "location": {
    "id": 1,
    "name": "Almacén Principal",
    "location_type": "warehouse",
    "room_id": null,
    "is_active": true,
    "created_at": "2024-12-01T10:00:00.000Z",
    "room": null
  },
  "msg": "Ubicación de inventario actualizada correctamente"
}
```

---

### 5. Cambiar Estado de Ubicación de Inventario

**Endpoint:** `PATCH /api/ubicaciones-inventario/cambiar-estado/:id`

**Descripción:** Activa o desactiva una ubicación de inventario.

**Permiso Requerido:** `productos.ubicacion.actualizar`

**Parámetros URL:**
- `id`: ID de la ubicación de inventario (integer)

**Body:**
```json
{
  "is_active": false
}
```

**Validaciones:**
- `is_active`: Requerido, booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "location": {
    "id": 1,
    "name": "Almacén General",
    "is_active": false,
    ...
  },
  "msg": "Estado de ubicación de inventario actualizado correctamente"
}
```

---

### 6. Eliminar Ubicación de Inventario

**Endpoint:** `DELETE /api/ubicaciones-inventario/eliminar/:id`

**Descripción:** Elimina una ubicación de inventario del sistema.

**Permiso Requerido:** `productos.ubicacion.eliminar`

**Parámetros URL:**
- `id`: ID de la ubicación de inventario (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Ubicación de inventario eliminada correctamente"
}
```

**Nota:** La eliminación es permanente. Si la ubicación tiene registros de inventario asociados, considere desactivarla en lugar de eliminarla.

---

### Tipos de Ubicaciones de Inventario (Valores Permitidos)

⚠️ **IMPORTANTE:** Solo se permiten los siguientes valores para `location_type`:

- **`'reception'`**: Recepción del hotel
- **`'minibar'`**: Minibar de habitación (requiere `room_id`)
- **`'storage'`**: Almacén o bodega (use este para almacenes generales)
- **`'restaurant'`**: Restaurante del hotel

**Nota:** Si necesita usar `'warehouse'`, `'bar'`, `'kitchen'` o `'laundry'`, debe usar `'storage'` o `'restaurant'` según corresponda, ya que estos valores no están permitidos en la base de datos.

### Relación con Habitaciones

Las ubicaciones de tipo `minibar` deben estar asociadas a una habitación específica mediante el campo `room_id`. Esto permite:
- Rastrear el inventario de cada minibar por habitación
- Generar reportes de consumo por habitación
- Gestionar reabastecimientos específicos

**Ejemplo de Minibar:**
```json
{
  "name": "Minibar Habitación 101",
  "location_type": "minibar",
  "room_id": 5
}
```

---

## Facturas

Base URL: `/api/facturas`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Todas las Facturas

**Endpoint:** `GET /api/facturas/traer-todos`

**Descripción:** Obtiene lista de facturas con paginación y filtros.

**Permiso Requerido:** `analytics.factura.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `status` (opcional): Filtrar por estado (draft, sent, paid, overdue, cancelled)
- `guest_id` (opcional): Filtrar por ID de huésped
- `corporate_client_id` (opcional): Filtrar por ID de cliente corporativo
- `from_date` (opcional): Filtrar desde fecha (ISO 8601)
- `to_date` (opcional): Filtrar hasta fecha (ISO 8601)

**Ejemplo de Request:**
```
GET /api/facturas/traer-todos?page=1&limit=10&status=pending&from_date=2024-12-01
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "invoices": [
    {
      "id": 1,
      "invoice_number": "INV-2024-001",
      "reservation_id": 10,
      "guest_id": 5,
      "corporate_client_id": null,
      "issue_date": "2024-12-15T00:00:00.000Z",
      "due_date": "2024-12-30T00:00:00.000Z",
      "subtotal": 500.00,
      "tax_amount": 90.00,
      "discount_amount": 0.00,
      "total_amount": 590.00,
      "status": "draft",
      "notes": null,
      "created_by": 1,
      "created_at": "2024-12-15T10:00:00.000Z",
      "reservation": {
        "id": 10,
        "confirmation_code": "RES-2024-010",
        "check_in_date": "2024-12-10",
        "check_out_date": "2024-12-15"
      },
      "guest": {
        "id": 5,
        "nombres": "Juan",
        "apellido_paterno": "Pérez",
        "apellido_materno": "García",
        "email": "juan.perez@email.com"
      },
      "corporateClient": null
    }
  ],
  "totalCount": 50,
  "currentPage": 1,
  "totalPages": 5
}
```

---

### 2. Obtener Factura por ID

**Endpoint:** `GET /api/facturas/traer-por-id/:id`

**Descripción:** Obtiene una factura específica por su ID con todas sus relaciones.

**Permiso Requerido:** `analytics.factura.leer`

**Parámetros URL:**
- `id`: ID de la factura (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "invoice": {
    "id": 1,
    "invoice_number": "INV-2024-001",
    "reservation_id": 10,
    "guest_id": 5,
    "corporate_client_id": null,
    "issue_date": "2024-12-15T00:00:00.000Z",
    "due_date": "2024-12-30T00:00:00.000Z",
    "subtotal": 500.00,
    "tax_amount": 90.00,
    "discount_amount": 0.00,
    "total_amount": 590.00,
    "status": "draft",
    "notes": "Factura por estadía de 5 noches",
    "created_by": 1,
    "created_at": "2024-12-15T10:00:00.000Z",
    "reservation": {
      "id": 10,
      "confirmation_code": "RES-2024-010",
      "check_in_date": "2024-12-10",
      "check_out_date": "2024-12-15"
    },
    "guest": {
      "id": 5,
      "nombres": "Juan",
      "apellido_paterno": "Pérez",
      "apellido_materno": "García",
      "email": "juan.perez@email.com",
      "phone": "999888777"
    },
    "corporateClient": null,
    "creator": {
      "id": 1,
      "nombres": "Admin",
      "apellido_paterno": "Usuario",
      "apellido_materno": "Sistema",
      "email": "admin@hotel.com"
    }
  }
}
```

---

### 3. Crear Factura

**Endpoint:** `POST /api/facturas/crear`

**Descripción:** Crea una nueva factura.

**Permiso Requerido:** `analytics.factura.crear`

**Body:**
```json
{
  "invoice_number": "INV-2024-001",
  "reservation_id": 10,
  "guest_id": 5,
  "corporate_client_id": null,
  "issue_date": "2024-12-15",
  "due_date": "2024-12-30",
  "subtotal": 500.00,
  "tax_amount": 90.00,
  "discount_amount": 0.00,
  "total_amount": 590.00,
  "status": "pending",
  "notes": "Factura por estadía de 5 noches"
}
```

**Validaciones:**
- `invoice_number`: Requerido, máximo 50 caracteres, único
- `reservation_id`: Opcional, integer, debe existir en `reservations`
- `guest_id`: Opcional, integer, debe existir en `guests`
- `corporate_client_id`: Opcional, integer, debe existir en `corporate_clients`
- `issue_date`: Opcional, fecha ISO 8601 (default: fecha actual)
- `due_date`: Opcional, fecha ISO 8601
- `subtotal`: Requerido, decimal ≥ 0
- `tax_amount`: Requerido, decimal ≥ 0
- `discount_amount`: Opcional, decimal ≥ 0 (default: 0)
- `total_amount`: Requerido, decimal ≥ 0
- `status`: Opcional, valores permitidos: `'draft'`, `'sent'`, `'paid'`, `'overdue'`, `'cancelled'` (default: `'draft'`)
- `notes`: Opcional, texto

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "invoice": {
    "id": 1,
    "invoice_number": "INV-2024-001",
    "reservation_id": 10,
    "guest_id": 5,
    "corporate_client_id": null,
    "issue_date": "2024-12-15T00:00:00.000Z",
    "due_date": "2024-12-30T00:00:00.000Z",
    "subtotal": 500.00,
    "tax_amount": 90.00,
    "discount_amount": 0.00,
    "total_amount": 590.00,
    "status": "draft",
    "notes": "Factura por estadía de 5 noches",
    "created_by": 1,
    "created_at": "2024-12-15T10:00:00.000Z",
    "reservation": { ... },
    "guest": { ... },
    "corporateClient": null,
    "creator": { ... }
  },
  "msg": "Factura creada correctamente"
}
```

---

### 4. Actualizar Factura

**Endpoint:** `PUT /api/facturas/actualizar/:id`

**Descripción:** Actualiza una factura existente.

**Permiso Requerido:** `analytics.factura.actualizar`

**Parámetros URL:**
- `id`: ID de la factura (integer)

**Body:**
```json
{
  "due_date": "2025-01-15",
  "discount_amount": 50.00,
  "total_amount": 540.00,
  "notes": "Descuento aplicado por cliente frecuente"
}
```

**Validaciones:**
- Todos los campos son opcionales
- `invoice_number`: Máximo 50 caracteres, único
- `due_date`: Fecha ISO 8601
- `subtotal`: Decimal ≥ 0
- `tax_amount`: Decimal ≥ 0
- `discount_amount`: Decimal ≥ 0
- `total_amount`: Decimal ≥ 0
- `status`: Valores permitidos: `'draft'`, `'sent'`, `'paid'`, `'overdue'`, `'cancelled'`
- `notes`: Texto

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "invoice": {
    "id": 1,
    "invoice_number": "INV-2024-001",
    "due_date": "2025-01-15T00:00:00.000Z",
    "discount_amount": 50.00,
    "total_amount": 540.00,
    "notes": "Descuento aplicado por cliente frecuente",
    ...
  },
  "msg": "Factura actualizada correctamente"
}
```

---

### 5. Cambiar Estado de Factura

**Endpoint:** `PATCH /api/facturas/cambiar-estado/:id`

**Descripción:** Cambia el estado de una factura.

**Permiso Requerido:** `analytics.factura.actualizar`

**Parámetros URL:**
- `id`: ID de la factura (integer)

**Body:**
```json
{
  "status": "paid"
}
```

**Validaciones:**
- `status`: Requerido, valores permitidos: `'draft'`, `'sent'`, `'paid'`, `'overdue'`, `'cancelled'`

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "invoice": {
    "id": 1,
    "invoice_number": "INV-2024-001",
    "status": "paid",
    ...
  },
  "msg": "Estado de factura actualizado correctamente"
}
```

---

### 6. Eliminar Factura

**Endpoint:** `DELETE /api/facturas/eliminar/:id`

**Descripción:** Elimina una factura del sistema.

**Permiso Requerido:** `analytics.factura.eliminar`

**Parámetros URL:**
- `id`: ID de la factura (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Factura eliminada correctamente"
}
```

**Nota:** La eliminación es permanente. Considere cambiar el estado a `cancelled` en lugar de eliminar para mantener el historial contable.

---

### Estados de Factura

- **draft**: Factura en borrador (no enviada)
- **sent**: Factura enviada al cliente
- **paid**: Factura pagada
- **overdue**: Factura vencida (no pagada después de `due_date`)
- **cancelled**: Factura cancelada

### Relaciones de Factura

Una factura puede estar asociada a:
- **Reserva** (`reservation_id`): Factura generada por una reserva de hotel
- **Huésped** (`guest_id`): Cliente individual
- **Cliente Corporativo** (`corporate_client_id`): Empresa con cuenta corporativa

**Nota:** Una factura puede tener `reservation_id` Y `guest_id` simultáneamente (el huésped que hizo la reserva). También puede tener solo `corporate_client_id` para facturas corporativas sin reserva específica.

### Cálculo de Montos

```
total_amount = subtotal + tax_amount - discount_amount
```

**Ejemplo:**
- Subtotal: $500.00
- Impuesto (18%): $90.00
- Descuento: $50.00
- **Total: $540.00**

---

## Pagos

Base URL: `/api/pagos`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Todos los Pagos

**Endpoint:** `GET /api/pagos/traer-todos`

**Descripción:** Obtiene lista de pagos con paginación y filtros.

**Permiso Requerido:** `pagos.pago.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `status` (opcional): Filtrar por estado (pending, completed, failed, refunded)
- `reservation_id` (opcional): Filtrar por ID de reserva
- `sale_id` (opcional): Filtrar por ID de venta
- `payment_method_id` (opcional): Filtrar por ID de método de pago
- `from_date` (opcional): Filtrar desde fecha (ISO 8601)
- `to_date` (opcional): Filtrar hasta fecha (ISO 8601)

**Ejemplo de Request:**
```
GET /api/pagos/traer-todos?page=1&limit=10&status=completed&from_date=2024-12-01
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "payments": [
    {
      "id": 1,
      "payment_number": "PAY-2024-001",
      "reservation_id": 10,
      "sale_id": null,
      "amount": 590.00,
      "payment_method_id": 1,
      "payment_date": "2024-12-15T14:30:00.000Z",
      "status": "completed",
      "card_last_four": "4242",
      "transaction_id": "txn_1234567890",
      "authorization_code": "AUTH123456",
      "notes": null,
      "processed_by": 1,
      "created_at": "2024-12-15T14:30:00.000Z",
      "reservation": {
        "id": 10,
        "reservation_number": "RES-2024-010",
        "check_in_date": "2024-12-10",
        "check_out_date": "2024-12-15"
      },
      "sale": null,
      "payment_method": {
        "id": 1,
        "name": "Tarjeta de Crédito",
        "type": "card"
      }
    }
  ],
  "totalCount": 120,
  "currentPage": 1,
  "totalPages": 12
}
```

---

### 2. Obtener Pago por ID

**Endpoint:** `GET /api/pagos/traer-por-id/:id`

**Descripción:** Obtiene un pago específico por su ID con todas sus relaciones.

**Permiso Requerido:** `pagos.pago.leer`

**Parámetros URL:**
- `id`: ID del pago (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "payment": {
    "id": 1,
    "payment_number": "PAY-2024-001",
    "reservation_id": 10,
    "sale_id": null,
    "amount": 590.00,
    "payment_method_id": 1,
    "payment_date": "2024-12-15T14:30:00.000Z",
    "status": "completed",
    "card_last_four": "4242",
    "transaction_id": "txn_1234567890",
    "authorization_code": "AUTH123456",
    "notes": "Pago completo de la reserva",
    "processed_by": 1,
    "created_at": "2024-12-15T14:30:00.000Z",
    "reservation": {
      "id": 10,
      "reservation_number": "RES-2024-010",
      "check_in_date": "2024-12-10",
      "check_out_date": "2024-12-15"
    },
    "sale": null,
    "payment_method": {
      "id": 1,
      "name": "Tarjeta de Crédito",
      "type": "card"
    },
    "processor": {
      "id": 1,
      "name": "Admin Usuario",
      "email": "admin@hotel.com"
    }
  }
}
```

---

### 3. Crear Pago

**Endpoint:** `POST /api/pagos/crear`

**Descripción:** Registra un nuevo pago.

**Permiso Requerido:** `pagos.pago.crear`

**Body:**
```json
{
  "payment_number": "PAY-2024-001",
  "reservation_id": 10,
  "sale_id": null,
  "amount": 590.00,
  "payment_method_id": 1,
  "payment_date": "2024-12-15T14:30:00",
  "status": "completed",
  "card_last_four": "4242",
  "transaction_id": "txn_1234567890",
  "authorization_code": "AUTH123456",
  "notes": "Pago completo de la reserva"
}
```

**Validaciones:**
- `payment_number`: Requerido, máximo 50 caracteres, único
- `reservation_id`: Opcional, integer, debe existir en `reservations`
- `sale_id`: Opcional, integer, debe existir en `sales`
- `amount`: Requerido, decimal > 0
- `payment_method_id`: Opcional, integer, debe existir en `payment_methods`
- `payment_date`: Opcional, fecha ISO 8601 (default: fecha actual)
- `status`: Opcional, valores permitidos: `'pending'`, `'completed'`, `'failed'`, `'refunded'` (default: `'completed'`)
- `card_last_four`: Opcional, exactamente 4 caracteres
- `transaction_id`: Opcional, máximo 255 caracteres
- `authorization_code`: Opcional, máximo 100 caracteres
- `notes`: Opcional, texto

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "payment": {
    "id": 1,
    "payment_number": "PAY-2024-001",
    "reservation_id": 10,
    "sale_id": null,
    "amount": 590.00,
    "payment_method_id": 1,
    "payment_date": "2024-12-15T14:30:00.000Z",
    "status": "completed",
    "card_last_four": "4242",
    "transaction_id": "txn_1234567890",
    "authorization_code": "AUTH123456",
    "notes": "Pago completo de la reserva",
    "processed_by": 1,
    "created_at": "2024-12-15T14:30:00.000Z",
    "reservation": { ... },
    "sale": null,
    "payment_method": { ... },
    "processor": { ... }
  },
  "msg": "Pago creado correctamente"
}
```

---

### 4. Actualizar Pago

**Endpoint:** `PUT /api/pagos/actualizar/:id`

**Descripción:** Actualiza un pago existente.

**Permiso Requerido:** `pagos.pago.actualizar`

**Parámetros URL:**
- `id`: ID del pago (integer)

**Body:**
```json
{
  "status": "refunded",
  "notes": "Reembolso solicitado por el cliente"
}
```

**Validaciones:**
- Todos los campos son opcionales
- `payment_number`: Máximo 50 caracteres, único
- `amount`: Decimal > 0
- `status`: Valores permitidos: `'pending'`, `'completed'`, `'failed'`, `'refunded'`
- `card_last_four`: Exactamente 4 caracteres
- `transaction_id`: Máximo 255 caracteres
- `authorization_code`: Máximo 100 caracteres
- `notes`: Texto

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "payment": {
    "id": 1,
    "payment_number": "PAY-2024-001",
    "status": "refunded",
    "notes": "Reembolso solicitado por el cliente",
    ...
  },
  "msg": "Pago actualizado correctamente"
}
```

---

### 5. Cambiar Estado de Pago

**Endpoint:** `PATCH /api/pagos/cambiar-estado/:id`

**Descripción:** Cambia el estado de un pago.

**Permiso Requerido:** `pagos.pago.actualizar`

**Parámetros URL:**
- `id`: ID del pago (integer)

**Body:**
```json
{
  "status": "completed"
}
```

**Validaciones:**
- `status`: Requerido, valores: pending, completed, failed, refunded

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "payment": {
    "id": 1,
    "payment_number": "PAY-2024-001",
    "status": "completed",
    ...
  },
  "msg": "Estado del pago actualizado correctamente"
}
```

---

### 6. Eliminar Pago

**Endpoint:** `DELETE /api/pagos/eliminar/:id`

**Descripción:** Elimina un pago del sistema.

**Permiso Requerido:** `pagos.pago.eliminar`

**Parámetros URL:**
- `id`: ID del pago (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Pago eliminado correctamente"
}
```

**Nota:** La eliminación es permanente. Considere cambiar el estado a `refunded` en lugar de eliminar para mantener el historial contable.

---

### Estados de Pago

- **pending**: Pago pendiente de procesamiento
- **completed**: Pago completado exitosamente
- **failed**: Pago fallido
- **refunded**: Pago reembolsado

### Relaciones de Pago

Un pago puede estar asociado a:
- **Reserva** (`reservation_id`): Pago por una reserva de hotel
- **Venta** (`sale_id`): Pago por una venta de productos/servicios

**Nota:** Un pago debe tener al menos una de estas relaciones (`reservation_id` O `sale_id`), pero no necesariamente ambas.

### Información de Tarjeta

Para pagos con tarjeta, se almacena:
- `card_last_four`: Últimos 4 dígitos de la tarjeta (seguridad PCI)
- `transaction_id`: ID de transacción del procesador de pagos
- `authorization_code`: Código de autorización bancaria

**Importante:** Nunca almacene el número completo de tarjeta ni el CVV por razones de seguridad y cumplimiento PCI-DSS.

### Auditoría

- `processed_by`: Registra el usuario que procesó el pago
- `payment_date`: Fecha y hora exacta del pago
- `created_at`: Fecha de registro en el sistema

---

## Métodos de Pago

Base URL: `/api/metodos-pago`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Todos los Métodos de Pago

**Endpoint:** `GET /api/metodos-pago/traer-todos`

**Descripción:** Obtiene lista de métodos de pago con paginación y filtros.

**Permiso Requerido:** `pagos_online.metodo-pago.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `is_active` (opcional): Filtrar por estado activo (true/false)

**Ejemplo de Request:**
```
GET /api/metodos-pago/traer-todos?page=1&limit=10&is_active=true
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "paymentMethods": [
    {
      "id": 1,
      "name": "Tarjeta de Crédito",
      "type": "credit_card",
      "is_active": true,
      "created_at": "2024-12-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Efectivo",
      "type": "cash",
      "is_active": true,
      "created_at": "2024-12-01T10:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Transferencia Bancaria",
      "type": "bank_transfer",
      "is_active": true,
      "created_at": "2024-12-01T10:00:00.000Z"
    }
  ],
  "totalCount": 5,
  "currentPage": 1,
  "totalPages": 1
}
```

---

### 2. Obtener Método de Pago por ID

**Endpoint:** `GET /api/metodos-pago/traer-por-id/:id`

**Descripción:** Obtiene un método de pago específico por su ID.

**Permiso Requerido:** `pagos_online.metodo-pago.leer`

**Parámetros URL:**
- `id`: ID del método de pago (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "paymentMethod": {
    "id": 1,
    "name": "Tarjeta de Crédito",
    "type": "credit_card",
    "is_active": true,
    "created_at": "2024-12-01T10:00:00.000Z"
  }
}
```

---

### 3. Crear Método de Pago

**Endpoint:** `POST /api/metodos-pago/crear`

**Descripción:** Crea un nuevo método de pago.

**Permiso Requerido:** `pagos_online.metodo-pago.crear`

**Body:**
```json
{
  "name": "Tarjeta de Crédito",
  "type": "credit_card",
  "is_active": true
}
```

**Validaciones:**
- `name`: Requerido, máximo 100 caracteres, único
- `type`: Opcional, valores permitidos: `'cash'`, `'credit_card'`, `'debit_card'`, `'bank_transfer'`, `'check'`, `'other'`
- `is_active`: Opcional, booleano (default: true)

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "paymentMethod": {
    "id": 1,
    "name": "Tarjeta de Crédito",
    "type": "credit_card",
    "is_active": true,
    "created_at": "2024-12-15T10:00:00.000Z"
  },
  "msg": "Método de pago creado correctamente"
}
```

---

### 4. Actualizar Método de Pago

**Endpoint:** `PUT /api/metodos-pago/actualizar/:id`

**Descripción:** Actualiza un método de pago existente.

**Permiso Requerido:** `pagos_online.metodo-pago.actualizar`

**Parámetros URL:**
- `id`: ID del método de pago (integer)

**Body:**
```json
{
  "name": "Tarjeta de Crédito/Débito",
  "type": "credit_card"
}
```

**Validaciones:**
- Todos los campos son opcionales
- `name`: Máximo 100 caracteres, único
- `type`: Valores permitidos: `'cash'`, `'credit_card'`, `'debit_card'`, `'bank_transfer'`, `'check'`, `'other'`
- `is_active`: Booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "paymentMethod": {
    "id": 1,
    "name": "Tarjeta de Crédito/Débito",
    "type": "credit_card",
    "is_active": true,
    "created_at": "2024-12-01T10:00:00.000Z"
  },
  "msg": "Método de pago actualizado correctamente"
}
```

---

### 5. Cambiar Estado de Método de Pago

**Endpoint:** `PATCH /api/metodos-pago/cambiar-estado/:id`

**Descripción:** Activa o desactiva un método de pago.

**Permiso Requerido:** `pagos_online.metodo-pago.actualizar`

**Parámetros URL:**
- `id`: ID del método de pago (integer)

**Body:**
```json
{
  "is_active": false
}
```

**Validaciones:**
- `is_active`: Requerido, booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "paymentMethod": {
    "id": 1,
    "name": "Tarjeta de Crédito",
    "is_active": false,
    ...
  },
  "msg": "Estado del método de pago actualizado correctamente"
}
```

---

### 6. Eliminar Método de Pago

**Endpoint:** `DELETE /api/metodos-pago/eliminar/:id`

**Descripción:** Elimina un método de pago del sistema.

**Permiso Requerido:** `pagos_online.metodo-pago.eliminar`

**Parámetros URL:**
- `id`: ID del método de pago (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Método de pago eliminado correctamente"
}
```

**Nota:** La eliminación es permanente. Si el método de pago tiene pagos asociados, considere desactivarlo en lugar de eliminarlo.

---

### Códigos Comunes de Métodos de Pago

- **cash**: Efectivo
- **card**: Tarjeta de crédito/débito
- **transfer**: Transferencia bancaria
- **check**: Cheque
- **mobile**: Pago móvil (Yape, Plin, etc.)
- **wallet**: Billetera digital
- **crypto**: Criptomonedas

### Campo requires_reference

Indica si el método de pago requiere un número de referencia o autorización:

- **true**: Requiere referencia (tarjetas, transferencias, cheques)
  - Ejemplo: Número de autorización de tarjeta, número de operación de transferencia
- **false**: No requiere referencia (efectivo)

**Uso en Pagos:**
Cuando `requires_reference` es `true`, el sistema puede validar que se proporcione `transaction_id` o `authorization_code` al registrar el pago.

### Buenas Prácticas

- Mantener métodos de pago inactivos en lugar de eliminarlos para preservar el historial
- Usar códigos descriptivos y consistentes
- Documentar claramente qué información adicional requiere cada método
- Configurar correctamente `requires_reference` para validaciones automáticas

---

## Categorías de Producto

Base URL: `/api/categorias-producto`

**Autenticación:** Todas las rutas requieren token JWT

### 1. Obtener Todas las Categorías de Producto

**Endpoint:** `GET /api/categorias-producto/traer-todos`

**Descripción:** Obtiene lista de categorías de producto con paginación y filtros.

**Permiso Requerido:** `productos.categoria.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `is_active` (opcional): Filtrar por estado activo (true/false)

**Ejemplo de Request:**
```
GET /api/categorias-producto/traer-todos?page=1&limit=10&is_active=true
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "productCategories": [
    {
      "id": 1,
      "name": "Bebidas",
      "description": "Bebidas alcohólicas y no alcohólicas",
      "is_active": true,
      "created_at": "2024-12-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Snacks",
      "description": "Botanas y aperitivos",
      "is_active": true,
      "created_at": "2024-12-01T10:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Artículos de Higiene",
      "description": "Productos de aseo personal",
      "is_active": true,
      "created_at": "2024-12-01T10:00:00.000Z"
    }
  ],
  "totalCount": 8,
  "currentPage": 1,
  "totalPages": 1
}
```

---

### 2. Obtener Categoría de Producto por ID

**Endpoint:** `GET /api/categorias-producto/traer-por-id/:id`

**Descripción:** Obtiene una categoría de producto específica por su ID.

**Permiso Requerido:** `productos.categoria.leer`

**Parámetros URL:**
- `id`: ID de la categoría (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "productCategory": {
    "id": 1,
    "name": "Bebidas",
    "description": "Bebidas alcohólicas y no alcohólicas",
    "is_active": true,
    "created_at": "2024-12-01T10:00:00.000Z"
  }
}
```

---

### 3. Crear Categoría de Producto

**Endpoint:** `POST /api/categorias-producto/crear`

**Descripción:** Crea una nueva categoría de producto.

**Permiso Requerido:** `productos.categoria.crear`

**Body:**
```json
{
  "name": "Bebidas",
  "description": "Bebidas alcohólicas y no alcohólicas",
  "is_active": true
}
```

**Validaciones:**
- `name`: Requerido, máximo 100 caracteres, único
- `description`: Opcional, texto
- `is_active`: Opcional, booleano (default: true)

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "productCategory": {
    "id": 1,
    "name": "Bebidas",
    "description": "Bebidas alcohólicas y no alcohólicas",
    "is_active": true,
    "created_at": "2024-12-15T10:00:00.000Z"
  },
  "msg": "Categoría de producto creada correctamente"
}
```

---

### 4. Actualizar Categoría de Producto

**Endpoint:** `PUT /api/categorias-producto/actualizar/:id`

**Descripción:** Actualiza una categoría de producto existente.

**Permiso Requerido:** `productos.categoria.actualizar`

**Parámetros URL:**
- `id`: ID de la categoría (integer)

**Body:**
```json
{
  "name": "Bebidas y Refrescos",
  "description": "Bebidas alcohólicas, no alcohólicas y refrescos"
}
```

**Validaciones:**
- Todos los campos son opcionales
- `name`: Máximo 100 caracteres, único
- `description`: Texto
- `is_active`: Booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "productCategory": {
    "id": 1,
    "name": "Bebidas y Refrescos",
    "description": "Bebidas alcohólicas, no alcohólicas y refrescos",
    "is_active": true,
    "created_at": "2024-12-01T10:00:00.000Z"
  },
  "msg": "Categoría de producto actualizada correctamente"
}
```

---

### 5. Cambiar Estado de Categoría de Producto

**Endpoint:** `PATCH /api/categorias-producto/cambiar-estado/:id`

**Descripción:** Activa o desactiva una categoría de producto.

**Permiso Requerido:** `productos.categoria.actualizar`

**Parámetros URL:**
- `id`: ID de la categoría (integer)

**Body:**
```json
{
  "is_active": false
}
```

**Validaciones:**
- `is_active`: Requerido, booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "productCategory": {
    "id": 1,
    "name": "Bebidas",
    "is_active": false,
    ...
  },
  "msg": "Estado de la categoría de producto actualizado correctamente"
}
```

---

### 6. Eliminar Categoría de Producto

**Endpoint:** `DELETE /api/categorias-producto/eliminar/:id`

**Descripción:** Elimina una categoría de producto del sistema.

**Permiso Requerido:** `productos.categoria.eliminar`

**Parámetros URL:**
- `id`: ID de la categoría (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Categoría de producto eliminada correctamente"
}
```

**Nota:** La eliminación es permanente. Si la categoría tiene productos asociados, considere desactivarla en lugar de eliminarla.

---

### Categorías Comunes

Ejemplos de categorías típicas en un hotel:

- **Bebidas**: Bebidas alcohólicas y no alcohólicas
- **Snacks**: Botanas y aperitivos
- **Alimentos**: Productos alimenticios
- **Artículos de Higiene**: Productos de aseo personal
- **Amenidades**: Artículos de cortesía
- **Souvenirs**: Recuerdos y artículos de regalo
- **Medicamentos**: Productos farmacéuticos básicos
- **Electrónicos**: Cargadores, adaptadores, etc.

### Relación con Productos

Las categorías de producto se utilizan para:
- Organizar el inventario de productos
- Facilitar la búsqueda y filtrado de productos
- Generar reportes por categoría
- Aplicar políticas de precios por categoría

**Nota:** Un producto pertenece a una sola categoría (`product_category_id` en la tabla `products`).

### Buenas Prácticas

- Mantener categorías inactivas en lugar de eliminarlas para preservar el historial
- Usar nombres descriptivos y claros
- Evitar crear demasiadas categorías (mantener estructura simple)
- Revisar periódicamente las categorías para consolidar o reorganizar

---

## Huéspedes en Reservas (Reservation Guests)

Base URL: `/api/reservas-huespedes`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Este módulo gestiona la relación many-to-many entre reservas y huéspedes. Una reserva puede tener múltiples huéspedes, y un huésped puede estar en múltiples reservas. Cada reserva debe tener un huésped principal (`is_primary = true`).

### 1. Obtener Todas las Relaciones Reserva-Huésped

**Endpoint:** `GET /api/reservas-huespedes/traer-todos`

**Descripción:** Obtiene lista de relaciones reserva-huésped con paginación y filtros.

**Permiso Requerido:** `reservas.reserva.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `reservation_id` (opcional): Filtrar por ID de reserva
- `guest_id` (opcional): Filtrar por ID de huésped
- `is_primary` (opcional): Filtrar por huésped principal (true/false)

**Ejemplo de Request:**
```
GET /api/reservas-huespedes/traer-todos?reservation_id=10&page=1&limit=10
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "reservationGuests": [
    {
      "id": 1,
      "reservation_id": 10,
      "guest_id": 5,
      "is_primary": true,
      "created_at": "2024-12-15T10:00:00.000Z",
      "reservation": {
        "id": 10,
        "confirmation_code": "RES-2024-010",
        "check_in_date": "2024-12-20",
        "check_out_date": "2024-12-25",
        "status": "confirmed"
      },
      "guest": {
        "id": 5,
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan.perez@email.com",
        "phone": "+51987654321",
        "document_type": "DNI",
        "document_number": "12345678"
      }
    },
    {
      "id": 2,
      "reservation_id": 10,
      "guest_id": 8,
      "is_primary": false,
      "created_at": "2024-12-15T10:05:00.000Z",
      "reservation": {
        "id": 10,
        "confirmation_code": "RES-2024-010",
        "check_in_date": "2024-12-20",
        "check_out_date": "2024-12-25",
        "status": "confirmed"
      },
      "guest": {
        "id": 8,
        "first_name": "María",
        "last_name": "García",
        "email": "maria.garcia@email.com",
        "phone": "+51987654322",
        "document_type": "DNI",
        "document_number": "87654321"
      }
    }
  ],
  "totalCount": 2,
  "currentPage": 1,
  "totalPages": 1
}
```

---

### 2. Obtener Relación Reserva-Huésped por ID

**Endpoint:** `GET /api/reservas-huespedes/traer-por-id/:id`

**Descripción:** Obtiene una relación específica por su ID.

**Permiso Requerido:** `reservas.reserva.leer`

**Parámetros URL:**
- `id`: ID de la relación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "reservationGuest": {
    "id": 1,
    "reservation_id": 10,
    "guest_id": 5,
    "is_primary": true,
    "created_at": "2024-12-15T10:00:00.000Z",
    "reservation": {
      "id": 10,
      "confirmation_code": "RES-2024-010",
      "check_in_date": "2024-12-20",
      "check_out_date": "2024-12-25",
      "status": "confirmed"
    },
    "guest": {
      "id": 5,
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan.perez@email.com",
      "phone": "+51987654321",
      "document_type": "DNI",
      "document_number": "12345678"
    }
  }
}
```

---

### 3. Obtener Huéspedes de una Reserva

**Endpoint:** `GET /api/reservas-huespedes/traer-por-reserva/:reservation_id`

**Descripción:** Obtiene todos los huéspedes asociados a una reserva específica.

**Permiso Requerido:** `reservas.reserva.leer`

**Parámetros URL:**
- `reservation_id`: ID de la reserva (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "guests": [
    {
      "id": 1,
      "reservation_id": 10,
      "guest_id": 5,
      "is_primary": true,
      "created_at": "2024-12-15T10:00:00.000Z",
      "guest": {
        "id": 5,
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan.perez@email.com",
        "phone": "+51987654321",
        "document_type": "DNI",
        "document_number": "12345678"
      }
    },
    {
      "id": 2,
      "reservation_id": 10,
      "guest_id": 8,
      "is_primary": false,
      "created_at": "2024-12-15T10:05:00.000Z",
      "guest": {
        "id": 8,
        "first_name": "María",
        "last_name": "García",
        "email": "maria.garcia@email.com",
        "phone": "+51987654322",
        "document_type": "DNI",
        "document_number": "87654321"
      }
    }
  ]
}
```

**Nota:** Los resultados están ordenados con el huésped principal primero, seguido por los demás en orden de creación.

---

### 4. Agregar Huésped a una Reserva

**Endpoint:** `POST /api/reservas-huespedes/crear`

**Descripción:** Asocia un huésped a una reserva.

**Permiso Requerido:** `reservas.reserva.actualizar`

**Body:**
```json
{
  "reservation_id": 10,
  "guest_id": 8,
  "is_primary": false
}
```

**Validaciones:**
- `reservation_id`: Requerido, integer, debe existir en `reservations`
- `guest_id`: Requerido, integer, debe existir en `guests`
- `is_primary`: Opcional, booleano (default: false)
- No puede haber duplicados (mismo guest_id en la misma reservation_id)

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "reservationGuest": {
    "id": 2,
    "reservation_id": 10,
    "guest_id": 8,
    "is_primary": false,
    "created_at": "2024-12-15T10:05:00.000Z",
    "reservation": { ... },
    "guest": { ... }
  },
  "msg": "Huésped agregado a la reserva correctamente"
}
```

**Nota:** Si `is_primary` es `true`, automáticamente se remueve el flag `is_primary` de los demás huéspedes de esa reserva.

---

### 5. Actualizar Relación Reserva-Huésped

**Endpoint:** `PUT /api/reservas-huespedes/actualizar/:id`

**Descripción:** Actualiza una relación reserva-huésped (principalmente para cambiar is_primary).

**Permiso Requerido:** `reservas.reserva.actualizar`

**Parámetros URL:**
- `id`: ID de la relación (integer)

**Body:**
```json
{
  "is_primary": true
}
```

**Validaciones:**
- `is_primary`: Opcional, booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "reservationGuest": {
    "id": 2,
    "reservation_id": 10,
    "guest_id": 8,
    "is_primary": true,
    "created_at": "2024-12-15T10:05:00.000Z",
    "reservation": { ... },
    "guest": { ... }
  },
  "msg": "Relación reserva-huésped actualizada correctamente"
}
```

**Nota:** Si se establece `is_primary` en `true`, automáticamente se remueve de los demás huéspedes de esa reserva.

---

### 6. Establecer Huésped Principal

**Endpoint:** `PATCH /api/reservas-huespedes/establecer-principal/:id`

**Descripción:** Establece un huésped como principal en su reserva.

**Permiso Requerido:** `reservas.reserva.actualizar`

**Parámetros URL:**
- `id`: ID de la relación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "reservationGuest": {
    "id": 2,
    "reservation_id": 10,
    "guest_id": 8,
    "is_primary": true,
    ...
  },
  "msg": "Huésped establecido como principal correctamente"
}
```

**Nota:** Este endpoint automáticamente remueve `is_primary` de todos los demás huéspedes de la misma reserva.

---

### 7. Remover Huésped de una Reserva

**Endpoint:** `DELETE /api/reservas-huespedes/eliminar/:id`

**Descripción:** Remueve un huésped de una reserva.

**Permiso Requerido:** `reservas.reserva.actualizar`

**Parámetros URL:**
- `id`: ID de la relación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Huésped removido de la reserva correctamente"
}
```

**Advertencia:** Asegúrese de que la reserva tenga al menos un huésped después de la eliminación. No se recomienda eliminar al huésped principal sin antes designar otro.

---

### Conceptos Importantes

#### Huésped Principal (is_primary)

- Cada reserva debe tener **exactamente un** huésped principal
- El huésped principal es el responsable de la reserva
- Solo puede haber un `is_primary = true` por reserva
- Al establecer un nuevo huésped principal, el anterior pierde automáticamente el flag

#### Relación Many-to-Many

- **Una reserva** puede tener **múltiples huéspedes** (ej: familia, grupo)
- **Un huésped** puede estar en **múltiples reservas** (ej: cliente frecuente)
- La tabla `reservation_guests` es la tabla intermedia que conecta ambas entidades

#### Casos de Uso Comunes

1. **Reserva Familiar:**
   ```
   Reserva #10
   - Juan Pérez (principal)
   - María Pérez (esposa)
   - Pedro Pérez (hijo)
   ```

2. **Reserva Corporativa:**
   ```
   Reserva #15
   - Carlos Ruiz (principal, empleado que reserva)
   - Ana Torres (colega)
   ```

3. **Cliente Frecuente:**
   ```
   Juan Pérez aparece en:
   - Reserva #10 (diciembre 2024)
   - Reserva #25 (enero 2025)
   - Reserva #40 (febrero 2025)
   ```

### Flujo de Trabajo Recomendado

1. **Crear Reserva:** Usar endpoint de reservas (`/api/reservas/crear`)
2. **Agregar Huésped Principal:** Crear primera relación con `is_primary: true`
3. **Agregar Huéspedes Adicionales:** Crear relaciones adicionales con `is_primary: false`
4. **Cambiar Huésped Principal:** Usar endpoint `establecer-principal` si es necesario
5. **Consultar Huéspedes:** Usar `traer-por-reserva` para ver todos los huéspedes de una reserva

### Validaciones y Restricciones

- No se puede agregar el mismo huésped dos veces a la misma reserva
- La reserva debe existir antes de agregar huéspedes
- El huésped debe existir en la tabla `guests`
- Solo un huésped puede ser principal por reserva (se maneja automáticamente)

### Integración con Reservas

Este módulo está estrechamente relacionado con el módulo de Reservas (`/api/reservas`). Típicamente:

1. Se crea la reserva primero
2. Luego se agregan los huéspedes a esa reserva
3. Durante el check-in, se pueden consultar todos los huéspedes
4. Durante el check-out, se registra la salida de todos los huéspedes

---

## Ventas (Sales)

Base URL: `/api/ventas`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Este módulo gestiona las ventas de productos del hotel (minibar, restaurante, bar, tienda, etc.). Las ventas pueden estar asociadas a una ubicación de inventario, una reserva y/o un huésped.

### 1. Obtener Todas las Ventas

**Endpoint:** `GET /api/ventas/traer-todos`

**Descripción:** Obtiene lista de ventas con paginación y filtros.

**Permiso Requerido:** `productos.venta.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `payment_status` (opcional): Filtrar por estado de pago (pending, paid, refunded)
- `location_id` (opcional): Filtrar por ID de ubicación de inventario
- `reservation_id` (opcional): Filtrar por ID de reserva
- `guest_id` (opcional): Filtrar por ID de huésped
- `from_date` (opcional): Filtrar desde fecha (ISO 8601)
- `to_date` (opcional): Filtrar hasta fecha (ISO 8601)

**Ejemplo de Request:**
```
GET /api/ventas/traer-todos?page=1&limit=10&payment_status=paid&location_id=5
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "sales": [
    {
      "id": 1,
      "sale_number": "SALE-2024-001",
      "location_id": 5,
      "reservation_id": 10,
      "guest_id": 8,
      "subtotal": 45.00,
      "tax_amount": 8.10,
      "discount_amount": 0.00,
      "total_amount": 53.10,
      "payment_method": "card",
      "payment_status": "paid",
      "processed_by": 1,
      "created_at": "2024-12-15T14:30:00.000Z",
      "location": {
        "id": 5,
        "name": "Minibar Habitación 201",
        "location_type": "minibar"
      },
      "reservation": {
        "id": 10,
        "confirmation_code": "RES-2024-010",
        "check_in_date": "2024-12-10",
        "check_out_date": "2024-12-15"
      },
      "guest": {
        "id": 8,
        "first_name": "María",
        "last_name": "García",
        "email": "maria.garcia@email.com",
        "phone": "+51987654322"
      },
      "processor": {
        "id": 1,
        "name": "Admin Usuario",
        "email": "admin@hotel.com"
      }
    }
  ],
  "totalCount": 150,
  "currentPage": 1,
  "totalPages": 15
}
```

---

### 2. Obtener Venta por ID

**Endpoint:** `GET /api/ventas/traer-por-id/:id`

**Descripción:** Obtiene una venta específica por su ID con todas sus relaciones.

**Permiso Requerido:** `productos.venta.leer`

**Parámetros URL:**
- `id`: ID de la venta (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "sale": {
    "id": 1,
    "sale_number": "SALE-2024-001",
    "location_id": 5,
    "reservation_id": 10,
    "guest_id": 8,
    "subtotal": 45.00,
    "tax_amount": 8.10,
    "discount_amount": 0.00,
    "total_amount": 53.10,
    "payment_method": "card",
    "payment_status": "paid",
    "processed_by": 1,
    "created_at": "2024-12-15T14:30:00.000Z",
    "location": {
      "id": 5,
      "name": "Minibar Habitación 201",
      "location_type": "minibar"
    },
    "reservation": {
      "id": 10,
      "confirmation_code": "RES-2024-010",
      "check_in_date": "2024-12-10",
      "check_out_date": "2024-12-15"
    },
    "guest": {
      "id": 8,
      "first_name": "María",
      "last_name": "García",
      "email": "maria.garcia@email.com",
      "phone": "+51987654322"
    },
    "processor": {
      "id": 1,
      "name": "Admin Usuario",
      "email": "admin@hotel.com"
    }
  }
}
```

---

### 3. Crear Venta

**Endpoint:** `POST /api/ventas/crear`

**Descripción:** Crea una nueva venta (sin items). Este endpoint crea solo el registro de la venta. Los items se agregan posteriormente usando `/api/items-venta/crear`. Para ventas rápidas de un solo producto, considere usar `/api/productos/registrar-venta` que crea la venta y el item automáticamente.

**Permiso Requerido:** `productos.venta.crear`

**Body:**
```json
{
  "sale_number": "SALE-2024-001",
  "location_id": 2,
  "reservation_id": 1,
  "guest_id": 1,
  "subtotal": 45.00,
  "tax_amount": 8.10,
  "discount_amount": 5.00,
  "total_amount": 48.10,
  "payment_method": "card",
  "payment_status": "paid"
}
```

**Ejemplo con datos realistas:**
```json
{
  "sale_number": "SALE-20240203-001",
  "location_id": 2,
  "reservation_id": 1,
  "guest_id": 1,
  "subtotal": 85.50,
  "tax_amount": 15.39,
  "discount_amount": 0.00,
  "total_amount": 100.89,
  "payment_method": "room_charge",
  "payment_status": "paid"
}
```

**Validaciones:**
- `sale_number`: Requerido, máximo 50 caracteres, único
- `location_id`: Opcional, integer, debe existir en `inventory_locations`
- `reservation_id`: Opcional, integer, debe existir en `reservations`
- `guest_id`: Opcional, integer, debe existir en `guests`
- `subtotal`: Requerido, decimal >= 0
- `tax_amount`: Requerido, decimal >= 0
- `discount_amount`: Opcional, decimal >= 0 (default: 0)
- `total_amount`: Requerido, decimal >= 0
- `payment_method`: Opcional, valores permitidos: `'cash'`, `'card'`, `'transfer'`, `'room_charge'`
- `payment_status`: Opcional, valores permitidos: `'pending'`, `'paid'`, `'refunded'` (default: `'paid'`)

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "sale": {
    "id": 1,
    "sale_number": "SALE-2024-001",
    "location_id": 5,
    "reservation_id": 10,
    "guest_id": 8,
    "subtotal": 45.00,
    "tax_amount": 8.10,
    "discount_amount": 0.00,
    "total_amount": 53.10,
    "payment_method": "card",
    "payment_status": "paid",
    "processed_by": 1,
    "created_at": "2024-12-15T14:30:00.000Z",
    "location": { ... },
    "reservation": { ... },
    "guest": { ... },
    "processor": { ... }
  },
  "msg": "Venta creada correctamente"
}
```

---

### 4. Actualizar Venta

**Endpoint:** `PUT /api/ventas/actualizar/:id`

**Descripción:** Actualiza una venta existente.

**Permiso Requerido:** `productos.venta.actualizar`

**Parámetros URL:**
- `id`: ID de la venta (integer)

**Body:**
```json
{
  "discount_amount": 5.00,
  "total_amount": 48.10,
  "payment_status": "paid"
}
```

**Validaciones:**
- Todos los campos son opcionales
- `sale_number`: Máximo 50 caracteres, único
- `subtotal`: Decimal >= 0
- `tax_amount`: Decimal >= 0
- `discount_amount`: Decimal >= 0
- `total_amount`: Decimal >= 0
- `payment_method`: Valores permitidos: `'cash'`, `'card'`, `'transfer'`, `'room_charge'`
- `payment_status`: Valores permitidos: `'pending'`, `'paid'`, `'refunded'`

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "sale": {
    "id": 1,
    "sale_number": "SALE-2024-001",
    "discount_amount": 5.00,
    "total_amount": 48.10,
    "payment_status": "paid",
    ...
  },
  "msg": "Venta actualizada correctamente"
}
```

---

### 5. Cambiar Estado de Pago de Venta

**Endpoint:** `PATCH /api/ventas/cambiar-estado-pago/:id`

**Descripción:** Cambia el estado de pago de una venta.

**Permiso Requerido:** `productos.venta.actualizar`

**Parámetros URL:**
- `id`: ID de la venta (integer)

**Body:**
```json
{
  "payment_status": "refunded"
}
```

**Validaciones:**
- `payment_status`: Requerido, valores: pending, paid, refunded

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "sale": {
    "id": 1,
    "sale_number": "SALE-2024-001",
    "payment_status": "refunded",
    ...
  },
  "msg": "Estado de pago de la venta actualizado correctamente"
}
```

---

### 6. Eliminar Venta

**Endpoint:** `DELETE /api/ventas/eliminar/:id`

**Descripción:** Elimina una venta del sistema.

**Permiso Requerido:** `productos.venta.eliminar`

**Parámetros URL:**
- `id`: ID de la venta (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Venta eliminada correctamente"
}
```

**Nota:** La eliminación es permanente. Considere cambiar el estado a `refunded` en lugar de eliminar para mantener el historial contable.

---

### Estados de Pago

- **pending**: Pago pendiente
- **paid**: Pago completado
- **refunded**: Pago reembolsado

### Relaciones de Venta

Una venta puede estar asociada a:
- **Ubicación de Inventario** (`location_id`): De dónde se vendieron los productos (minibar, bar, restaurante)
- **Reserva** (`reservation_id`): Reserva a la que se carga la venta
- **Huésped** (`guest_id`): Cliente que realizó la compra

**Nota:** Una venta puede tener múltiples relaciones simultáneamente.

### Cálculo de Montos

```
total_amount = subtotal + tax_amount - discount_amount
```

**Ejemplo:**
- Subtotal: $45.00
- Impuesto (18%): $8.10
- Descuento: $5.00
- **Total: $48.10**

### Casos de Uso Comunes

1. **Venta de Minibar:**
   ```json
   {
     "location_id": 5,
     "reservation_id": 10,
     "guest_id": 8,
     "subtotal": 45.00,
     "tax_amount": 8.10,
     "total_amount": 53.10,
     "payment_method": "room_charge",
     "payment_status": "pending"
   }
   ```
   - Se carga a la cuenta de la habitación
   - Se paga al hacer check-out

2. **Venta de Bar/Restaurante:**
   ```json
   {
     "location_id": 2,
     "guest_id": 8,
     "subtotal": 120.00,
     "tax_amount": 21.60,
     "total_amount": 141.60,
     "payment_method": "card",
     "payment_status": "paid"
   }
   ```
   - Pago inmediato con tarjeta
   - No necesariamente asociado a reserva

3. **Venta Walk-in (sin reserva):**
   ```json
   {
     "location_id": 3,
     "subtotal": 25.00,
     "tax_amount": 4.50,
     "total_amount": 29.50,
     "payment_method": "cash",
     "payment_status": "paid"
   }
   ```
   - Cliente sin reserva
   - Pago en efectivo

### Integración con Inventario

Las ventas están relacionadas con el sistema de inventario:
- Cada venta debe tener items asociados (tabla `sale_items`)
- Al registrar una venta, el inventario se actualiza automáticamente
- La ubicación (`location_id`) indica de qué inventario se descontaron los productos

### Auditoría

- `processed_by`: Registra el usuario que procesó la venta
- `created_at`: Fecha y hora de la venta
- `sale_number`: Número único para trazabilidad

### Buenas Prácticas

- Generar `sale_number` único y secuencial
- Asociar ventas a reservas cuando sea posible para mejor trazabilidad
- Usar `payment_status = 'pending'` para cargos a habitación
- Registrar `location_id` para control de inventario
- No eliminar ventas, usar `refunded` para devoluciones

---

## Items de Venta (Sale Items)

Base URL: `/api/items-venta`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Este módulo gestiona los items individuales de cada venta. Cada venta (`Sale`) puede tener múltiples items (`SaleItem`), donde cada item representa un producto vendido con su cantidad, precio unitario y precio total.

### 1. Obtener Todos los Items de Venta

**Endpoint:** `GET /api/items-venta/traer-todos`

**Descripción:** Obtiene lista de items de venta con paginación y filtros.

**Permiso Requerido:** `productos.venta.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `sale_id` (opcional): Filtrar por ID de venta
- `product_id` (opcional): Filtrar por ID de producto

**Ejemplo de Request:**
```
GET /api/items-venta/traer-todos?page=1&limit=10&sale_id=1
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "saleItems": [
    {
      "id": 1,
      "sale_id": 1,
      "product_id": 15,
      "quantity": 2,
      "unit_price": 15.00,
      "total_price": 30.00,
      "created_at": "2024-12-15T14:30:00.000Z",
      "sale": {
        "id": 1,
        "sale_number": "SALE-2024-001",
        "total_amount": 53.10,
        "payment_status": "paid"
      },
      "product": {
        "id": 15,
        "name": "Coca Cola 500ml",
        "sku": "BEB-001",
        "price": 15.00,
        "product_category_id": 1
      }
    },
    {
      "id": 2,
      "sale_id": 1,
      "product_id": 20,
      "quantity": 1,
      "unit_price": 25.00,
      "total_price": 25.00,
      "created_at": "2024-12-15T14:30:00.000Z",
      "sale": {
        "id": 1,
        "sale_number": "SALE-2024-001",
        "total_amount": 53.10,
        "payment_status": "paid"
      },
      "product": {
        "id": 20,
        "name": "Papas Lays",
        "sku": "SNK-005",
        "price": 25.00,
        "product_category_id": 2
      }
    }
  ],
  "totalCount": 2,
  "currentPage": 1,
  "totalPages": 1
}
```

---

### 2. Obtener Item de Venta por ID

**Endpoint:** `GET /api/items-venta/traer-por-id/:id`

**Descripción:** Obtiene un item de venta específico por su ID.

**Permiso Requerido:** `productos.venta.leer`

**Parámetros URL:**
- `id`: ID del item (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "saleItem": {
    "id": 1,
    "sale_id": 1,
    "product_id": 15,
    "quantity": 2,
    "unit_price": 15.00,
    "total_price": 30.00,
    "created_at": "2024-12-15T14:30:00.000Z",
    "sale": {
      "id": 1,
      "sale_number": "SALE-2024-001",
      "total_amount": 53.10,
      "payment_status": "paid"
    },
    "product": {
      "id": 15,
      "name": "Coca Cola 500ml",
      "sku": "BEB-001",
      "price": 15.00,
      "product_category_id": 1
    }
  }
}
```

---

### 3. Obtener Items de una Venta

**Endpoint:** `GET /api/items-venta/traer-por-venta/:sale_id`

**Descripción:** Obtiene todos los items de una venta específica.

**Permiso Requerido:** `productos.venta.leer`

**Parámetros URL:**
- `sale_id`: ID de la venta (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "items": [
    {
      "id": 1,
      "sale_id": 1,
      "product_id": 15,
      "quantity": 2,
      "unit_price": 15.00,
      "total_price": 30.00,
      "created_at": "2024-12-15T14:30:00.000Z",
      "product": {
        "id": 15,
        "name": "Coca Cola 500ml",
        "sku": "BEB-001",
        "price": 15.00,
        "product_category_id": 1
      }
    },
    {
      "id": 2,
      "sale_id": 1,
      "product_id": 20,
      "quantity": 1,
      "unit_price": 25.00,
      "total_price": 25.00,
      "created_at": "2024-12-15T14:30:00.000Z",
      "product": {
        "id": 20,
        "name": "Papas Lays",
        "sku": "SNK-005",
        "price": 25.00,
        "product_category_id": 2
      }
    }
  ]
}
```

**Nota:** Los items están ordenados por fecha de creación ascendente.

---

### 4. Crear Item de Venta

**Endpoint:** `POST /api/items-venta/crear`

**Descripción:** Agrega un item a una venta existente.

**Permiso Requerido:** `productos.venta.crear`

**Body:**
```json
{
  "sale_id": 1,
  "product_id": 15,
  "quantity": 2,
  "unit_price": 15.00,
  "total_price": 30.00
}
```

**Validaciones:**
- `sale_id`: Requerido, integer, debe existir en `sales`
- `product_id`: Requerido, integer, debe existir en `products`
- `quantity`: Requerido, integer > 0
- `unit_price`: Requerido, decimal >= 0
- `total_price`: Requerido, decimal >= 0

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "saleItem": {
    "id": 1,
    "sale_id": 1,
    "product_id": 15,
    "quantity": 2,
    "unit_price": 15.00,
    "total_price": 30.00,
    "created_at": "2024-12-15T14:30:00.000Z",
    "sale": { ... },
    "product": { ... }
  },
  "msg": "Item de venta creado correctamente"
}
```

**Nota:** Después de agregar items, recuerde actualizar el `total_amount` de la venta padre.

---

### 5. Actualizar Item de Venta

**Endpoint:** `PUT /api/items-venta/actualizar/:id`

**Descripción:** Actualiza un item de venta existente.

**Permiso Requerido:** `productos.venta.actualizar`

**Parámetros URL:**
- `id`: ID del item (integer)

**Body:**
```json
{
  "quantity": 3,
  "unit_price": 15.00
}
```

**Validaciones:**
- Todos los campos son opcionales
- `quantity`: Integer > 0
- `unit_price`: Decimal >= 0
- `total_price`: Decimal >= 0

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "saleItem": {
    "id": 1,
    "sale_id": 1,
    "product_id": 15,
    "quantity": 3,
    "unit_price": 15.00,
    "total_price": 45.00,
    ...
  },
  "msg": "Item de venta actualizado correctamente"
}
```

**Nota:** Si se actualiza `quantity` o `unit_price`, el servicio recalcula automáticamente `total_price = quantity * unit_price`.

---

### 6. Eliminar Item de Venta

**Endpoint:** `DELETE /api/items-venta/eliminar/:id`

**Descripción:** Elimina un item de una venta.

**Permiso Requerido:** `productos.venta.eliminar`

**Parámetros URL:**
- `id`: ID del item (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Item de venta eliminado correctamente"
}
```

**Advertencia:** Después de eliminar items, recuerde actualizar el `total_amount` de la venta padre.

---

### Relación con Ventas

Los items de venta son **detalles de una venta**:
- Una venta (`Sale`) puede tener **múltiples items** (`SaleItem`)
- Cada item representa **un producto** con su cantidad y precio
- La suma de todos los `total_price` de los items debe coincidir con el `subtotal` de la venta

### Cálculo de Precios

```
total_price = quantity * unit_price
```

**Ejemplo:**
- Producto: Coca Cola 500ml
- Cantidad: 2
- Precio Unitario: $15.00
- **Total: $30.00**

### Flujo de Trabajo Típico

1. **Crear Venta:**
   ```
   POST /api/ventas/crear
   {
     "sale_number": "SALE-2024-001",
     "subtotal": 0,
     "tax_amount": 0,
     "total_amount": 0,
     ...
   }
   ```

2. **Agregar Items:**
   ```
   POST /api/items-venta/crear
   {
     "sale_id": 1,
     "product_id": 15,
     "quantity": 2,
     "unit_price": 15.00,
     "total_price": 30.00
   }
   ```

3. **Calcular Totales:**
   ```
   Subtotal = Suma de total_price de todos los items
   Tax = Subtotal * 0.18 (18%)
   Total = Subtotal + Tax - Descuento
   ```

4. **Actualizar Venta:**
   ```
   PUT /api/ventas/actualizar/:id
   {
     "subtotal": 55.00,
     "tax_amount": 9.90,
     "total_amount": 64.90
   }
   ```

### Ejemplo Completo de Venta

**Venta de Minibar:**

```json
{
  "sale": {
    "id": 1,
    "sale_number": "SALE-2024-001",
    "subtotal": 55.00,
    "tax_amount": 9.90,
    "total_amount": 64.90
  },
  "items": [
    {
      "product": "Coca Cola 500ml",
      "quantity": 2,
      "unit_price": 15.00,
      "total_price": 30.00
    },
    {
      "product": "Papas Lays",
      "quantity": 1,
      "unit_price": 25.00,
      "total_price": 25.00
    }
  ]
}
```

**Cálculo:**
- Item 1: 2 × $15.00 = $30.00
- Item 2: 1 × $25.00 = $25.00
- **Subtotal: $55.00**
- Impuesto (18%): $9.90
- **Total: $64.90**

### Integración con Inventario

Al crear items de venta:
- El sistema debe verificar disponibilidad del producto
- Descontar la cantidad del inventario correspondiente
- Registrar el movimiento de inventario

### Buenas Prácticas

- Crear la venta primero, luego agregar los items
- Validar disponibilidad de productos antes de crear items
- Recalcular totales de la venta después de agregar/modificar/eliminar items
- Mantener consistencia entre `total_price` del item y `quantity * unit_price`
- Usar transacciones para operaciones que afecten múltiples tablas

### Validaciones Importantes

- No permitir cantidades negativas o cero
- Validar que el producto exista y esté activo
- Validar que la venta exista antes de agregar items
- Verificar disponibilidad en inventario antes de crear el item

---

## Reservas de Servicios (Service Reservations)

Base URL: `/api/servicios-reserva`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Este módulo gestiona las reservas de servicios adicionales del hotel (spa, tours, transporte, etc.). Permite programar servicios para huéspedes, ya sea asociados a una reserva de habitación o de forma independiente.

### 1. Obtener Todas las Reservas de Servicio

**Endpoint:** `GET /api/servicios-reserva/traer-todos`

**Descripción:** Obtiene lista de reservas de servicio con paginación y filtros.

**Permiso Requerido:** `servicios.servicio.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `status` (opcional): Filtrar por estado (pending, confirmed, completed, cancelled)
- `service_id` (opcional): Filtrar por ID de servicio adicional
- `reservation_id` (opcional): Filtrar por ID de reserva de habitación
- `guest_id` (opcional): Filtrar por ID de huésped
- `from_date` (opcional): Filtrar desde fecha programada (ISO 8601)
- `to_date` (opcional): Filtrar hasta fecha programada (ISO 8601)

**Ejemplo de Request:**
```
GET /api/servicios-reserva/traer-todos?page=1&limit=10&status=confirmed&service_id=3
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "serviceReservations": [
    {
      "id": 1,
      "service_id": 3,
      "reservation_id": 10,
      "guest_id": 8,
      "scheduled_date": "2024-12-20T15:00:00.000Z",
      "duration_minutes": 60,
      "quantity": 1,
      "unit_price": 150.00,
      "total_price": 150.00,
      "status": "confirmed",
      "notes": "Masaje relajante - Preferencia por aceite de lavanda",
      "created_by": 1,
      "created_at": "2024-12-15T10:00:00.000Z",
      "service": {
        "id": 3,
        "name": "Masaje Relajante",
        "description": "Masaje de cuerpo completo de 60 minutos",
        "price": 150.00,
        "service_type": "spa"
      },
      "reservation": {
        "id": 10,
        "confirmation_code": "RES-2024-010",
        "check_in_date": "2024-12-18",
        "check_out_date": "2024-12-22",
        "status": "confirmed"
      },
      "guest": {
        "id": 8,
        "first_name": "María",
        "last_name": "García",
        "email": "maria.garcia@email.com",
        "phone": "+51987654322"
      },
      "creator": {
        "id": 1,
        "name": "Admin Usuario",
        "email": "admin@hotel.com"
      }
    }
  ],
  "totalCount": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

---

### 2. Obtener Reserva de Servicio por ID

**Endpoint:** `GET /api/servicios-reserva/traer-por-id/:id`

**Descripción:** Obtiene una reserva de servicio específica por su ID.

**Permiso Requerido:** `servicios.servicio.leer`

**Parámetros URL:**
- `id`: ID de la reserva de servicio (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "serviceReservation": {
    "id": 1,
    "service_id": 3,
    "reservation_id": 10,
    "guest_id": 8,
    "scheduled_date": "2024-12-20T15:00:00.000Z",
    "duration_minutes": 60,
    "quantity": 1,
    "unit_price": 150.00,
    "total_price": 150.00,
    "status": "confirmed",
    "notes": "Masaje relajante - Preferencia por aceite de lavanda",
    "created_by": 1,
    "created_at": "2024-12-15T10:00:00.000Z",
    "service": { ... },
    "reservation": { ... },
    "guest": { ... },
    "creator": { ... }
  }
}
```

---

### 3. Obtener Servicios de una Reserva

**Endpoint:** `GET /api/servicios-reserva/traer-por-reserva/:reservation_id`

**Descripción:** Obtiene todos los servicios reservados para una reserva de habitación específica.

**Permiso Requerido:** `servicios.servicio.leer`

**Parámetros URL:**
- `reservation_id`: ID de la reserva de habitación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "services": [
    {
      "id": 1,
      "service_id": 3,
      "reservation_id": 10,
      "guest_id": 8,
      "scheduled_date": "2024-12-20T15:00:00.000Z",
      "duration_minutes": 60,
      "quantity": 1,
      "unit_price": 150.00,
      "total_price": 150.00,
      "status": "confirmed",
      "notes": "Masaje relajante",
      "created_at": "2024-12-15T10:00:00.000Z",
      "service": {
        "id": 3,
        "name": "Masaje Relajante",
        "description": "Masaje de cuerpo completo de 60 minutos",
        "price": 150.00,
        "service_type": "spa"
      }
    },
    {
      "id": 2,
      "service_id": 5,
      "reservation_id": 10,
      "guest_id": 8,
      "scheduled_date": "2024-12-21T09:00:00.000Z",
      "duration_minutes": 180,
      "quantity": 2,
      "unit_price": 80.00,
      "total_price": 160.00,
      "status": "pending",
      "notes": "Tour a Machu Picchu - 2 personas",
      "created_at": "2024-12-15T10:05:00.000Z",
      "service": {
        "id": 5,
        "name": "Tour Machu Picchu",
        "description": "Tour guiado de día completo",
        "price": 80.00,
        "service_type": "tour"
      }
    }
  ]
}
```

**Nota:** Los servicios están ordenados por fecha programada ascendente.

---

### 4. Crear Reserva de Servicio

**Endpoint:** `POST /api/servicios-reserva/crear`

**Descripción:** Crea una nueva reserva de servicio.

**Permiso Requerido:** `servicios.servicio.crear`

**Body:**
```json
{
  "service_id": 3,
  "reservation_id": 10,
  "guest_id": 8,
  "scheduled_date": "2024-12-20T15:00:00.000Z",
  "duration_minutes": 60,
  "quantity": 1,
  "unit_price": 150.00,
  "total_price": 150.00,
  "status": "pending",
  "notes": "Masaje relajante - Preferencia por aceite de lavanda"
}
```

**Validaciones:**
- `service_id`: Requerido, integer, debe existir en `additional_services`
- `reservation_id`: Opcional, integer, debe existir en `reservations`
- `guest_id`: Opcional, integer, debe existir en `guests`
- `scheduled_date`: Requerido, fecha y hora válida (ISO 8601)
- `duration_minutes`: Opcional, integer > 0
- `quantity`: Opcional, integer > 0 (default: 1)
- `unit_price`: Requerido, decimal >= 0
- `total_price`: Requerido, decimal >= 0
- `status`: Opcional, valores permitidos: `'pending'`, `'confirmed'`, `'completed'`, `'cancelled'` (default: `'pending'`)
- `notes`: Opcional, texto

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "serviceReservation": {
    "id": 1,
    "service_id": 3,
    "reservation_id": 10,
    "guest_id": 8,
    "scheduled_date": "2024-12-20T15:00:00.000Z",
    "duration_minutes": 60,
    "quantity": 1,
    "unit_price": 150.00,
    "total_price": 150.00,
    "status": "pending",
    "notes": "Masaje relajante - Preferencia por aceite de lavanda",
    "created_by": 1,
    "created_at": "2024-12-15T10:00:00.000Z",
    "service": { ... },
    "reservation": { ... },
    "guest": { ... },
    "creator": { ... }
  },
  "msg": "Reserva de servicio creada correctamente"
}
```

---

### 5. Actualizar Reserva de Servicio

**Endpoint:** `PUT /api/servicios-reserva/actualizar/:id`

**Descripción:** Actualiza una reserva de servicio existente.

**Permiso Requerido:** `servicios.servicio.actualizar`

**Parámetros URL:**
- `id`: ID de la reserva de servicio (integer)

**Body:**
```json
{
  "scheduled_date": "2024-12-20T16:00:00.000Z",
  "status": "confirmed",
  "notes": "Masaje relajante - Cambio de horario confirmado"
}
```

**Validaciones:**
- Todos los campos son opcionales
- `scheduled_date`: Fecha y hora válida (ISO 8601)
- `duration_minutes`: Integer > 0
- `quantity`: Integer > 0
- `unit_price`: Decimal >= 0
- `total_price`: Decimal >= 0
- `status`: pending, confirmed, completed, cancelled
- `notes`: Texto

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "serviceReservation": {
    "id": 1,
    "scheduled_date": "2024-12-20T16:00:00.000Z",
    "status": "confirmed",
    "notes": "Masaje relajante - Cambio de horario confirmado",
    ...
  },
  "msg": "Reserva de servicio actualizada correctamente"
}
```

---

### 6. Cambiar Estado de Reserva de Servicio

**Endpoint:** `PATCH /api/servicios-reserva/cambiar-estado/:id`

**Descripción:** Cambia el estado de una reserva de servicio.

**Permiso Requerido:** `servicios.servicio.actualizar`

**Parámetros URL:**
- `id`: ID de la reserva de servicio (integer)

**Body:**
```json
{
  "status": "completed"
}
```

**Validaciones:**
- `status`: Requerido, valores: pending, confirmed, completed, cancelled

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "serviceReservation": {
    "id": 1,
    "status": "completed",
    ...
  },
  "msg": "Estado de la reserva de servicio actualizado correctamente"
}
```

---

### 7. Eliminar Reserva de Servicio

**Endpoint:** `DELETE /api/servicios-reserva/eliminar/:id`

**Descripción:** Elimina una reserva de servicio del sistema.

**Permiso Requerido:** `servicios.servicio.eliminar`

**Parámetros URL:**
- `id`: ID de la reserva de servicio (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Reserva de servicio eliminada correctamente"
}
```

**Nota:** Considere cambiar el estado a `cancelled` en lugar de eliminar para mantener el historial.

---

### Estados de Reserva de Servicio

- **pending**: Pendiente de confirmación
- **confirmed**: Confirmada por el hotel
- **completed**: Servicio completado
- **cancelled**: Cancelada

### Relaciones

Una reserva de servicio puede estar asociada a:
- **Servicio Adicional** (`service_id`): El servicio que se reserva (spa, tour, transporte, etc.)
- **Reserva de Habitación** (`reservation_id`): Opcional, reserva a la que se asocia el servicio
- **Huésped** (`guest_id`): Cliente que solicita el servicio

### Cálculo de Precios

```
total_price = quantity * unit_price
```

**Ejemplo:**
- Servicio: Tour Machu Picchu
- Cantidad: 2 personas
- Precio Unitario: $80.00
- **Total: $160.00**

### Casos de Uso Comunes

1. **Servicio de Spa Asociado a Reserva:**
   ```json
   {
     "service_id": 3,
     "reservation_id": 10,
     "guest_id": 8,
     "scheduled_date": "2024-12-20T15:00:00.000Z",
     "duration_minutes": 60,
     "quantity": 1,
     "unit_price": 150.00,
     "total_price": 150.00,
     "status": "pending"
   }
   ```
   - Huésped reserva masaje durante su estadía
   - Se carga a la cuenta de la habitación

2. **Tour para Grupo:**
   ```json
   {
     "service_id": 5,
     "reservation_id": 10,
     "guest_id": 8,
     "scheduled_date": "2024-12-21T09:00:00.000Z",
     "duration_minutes": 480,
     "quantity": 4,
     "unit_price": 80.00,
     "total_price": 320.00,
     "status": "confirmed"
   }
   ```
   - Tour para 4 personas
   - Duración de 8 horas (480 minutos)

3. **Servicio Walk-in (sin reserva de habitación):**
   ```json
   {
     "service_id": 7,
     "guest_id": 15,
     "scheduled_date": "2024-12-22T18:00:00.000Z",
     "duration_minutes": 120,
     "quantity": 2,
     "unit_price": 45.00,
     "total_price": 90.00,
     "status": "pending"
   }
   ```
   - Cliente externo reserva servicio de restaurante
   - No está asociado a reserva de habitación

### Flujo de Trabajo Típico

1. **Cliente Solicita Servicio:**
   - Durante el check-in o durante la estadía
   - Por teléfono, en recepción o app móvil

2. **Crear Reserva de Servicio:**
   ```
   POST /api/servicios-reserva/crear
   Status: pending
   ```

3. **Hotel Confirma Disponibilidad:**
   ```
   PATCH /api/servicios-reserva/cambiar-estado/:id
   Status: confirmed
   ```

4. **Servicio se Completa:**
   ```
   PATCH /api/servicios-reserva/cambiar-estado/:id
   Status: completed
   ```

5. **Cargo a Cuenta:**
   - Si está asociado a reserva, se carga al check-out
   - Si es walk-in, se cobra inmediatamente

### Integración con Otros Módulos

**Con Reservas de Habitación:**
- Servicios asociados a una reserva se cargan a la cuenta de la habitación
- Al hacer check-out, se incluyen en la factura final

**Con Servicios Adicionales:**
- Cada reserva de servicio referencia un servicio del catálogo
- El precio puede variar del precio base del servicio

**Con Facturación:**
- Los servicios completados se incluyen en las facturas
- Se pueden generar facturas separadas para servicios walk-in

### Consideraciones Importantes

- **Disponibilidad:** Verificar disponibilidad del servicio antes de confirmar
- **Horarios:** Validar que la fecha/hora programada sea válida
- **Capacidad:** Algunos servicios tienen límite de personas
- **Anticipación:** Algunos servicios requieren reserva con anticipación
- **Cancelación:** Definir políticas de cancelación por tipo de servicio

### Buenas Prácticas

- Confirmar servicios lo antes posible para asegurar disponibilidad
- Enviar recordatorios a huéspedes antes del servicio programado
- Actualizar estado a `completed` después de prestar el servicio
- Usar campo `notes` para preferencias especiales del cliente
- Asociar servicios a reservas cuando sea posible para mejor trazabilidad

---

## Tipos de Habitación (Room Types)

Base URL: `/api/tipos-habitacion`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Este módulo gestiona los tipos de habitación del hotel (Simple, Doble, Suite, etc.). Cada tipo de habitación tiene múltiples habitaciones físicas asociadas y diferentes precios según el tipo de tarifa (diaria, semanal, mensual).

### 1. Obtener Todos los Tipos de Habitación

**Endpoint:** `GET /api/tipos-habitacion/traer-todos`

**Descripción:** Obtiene lista de tipos de habitación con paginación y filtros.

**Permiso Requerido:** `habitaciones.tipo.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `is_active` (opcional): Filtrar por estado activo (true/false)

**Ejemplo de Request:**
```
GET /api/tipos-habitacion/traer-todos?page=1&limit=10&is_active=true
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "roomTypes": [
    {
      "id": 1,
      "name": "Habitación Simple",
      "description": "Habitación individual con cama simple",
      "max_occupancy": 1,
      "amenities": ["WiFi", "TV", "Aire acondicionado", "Baño privado"],
      "is_active": true,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z",
      "rooms": [
        {
          "id": 101,
          "number": "101",
          "floor": 1,
          "status": "available",
          "is_active": true
        },
        {
          "id": 102,
          "number": "102",
          "floor": 1,
          "status": "occupied",
          "is_active": true
        }
      ],
      "prices": [
        {
          "id": 1,
          "price_type": "daily",
          "price": 80.00,
          "is_active": true
        },
        {
          "id": 2,
          "price_type": "weekly",
          "price": 500.00,
          "is_active": true
        }
      ]
    },
    {
      "id": 2,
      "name": "Habitación Doble",
      "description": "Habitación con dos camas individuales o una cama matrimonial",
      "max_occupancy": 2,
      "amenities": ["WiFi", "TV", "Aire acondicionado", "Baño privado", "Minibar"],
      "is_active": true,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z",
      "rooms": [
        {
          "id": 201,
          "number": "201",
          "floor": 2,
          "status": "available",
          "is_active": true
        }
      ],
      "prices": [
        {
          "id": 3,
          "price_type": "daily",
          "price": 120.00,
          "is_active": true
        }
      ]
    }
  ],
  "totalCount": 5,
  "currentPage": 1,
  "totalPages": 1
}
```

---

### 2. Obtener Tipo de Habitación por ID

**Endpoint:** `GET /api/tipos-habitacion/traer-por-id/:id`

**Descripción:** Obtiene un tipo de habitación específico por su ID con todas sus habitaciones y precios.

**Permiso Requerido:** `habitaciones.tipo.leer`

**Parámetros URL:**
- `id`: ID del tipo de habitación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "roomType": {
    "id": 1,
    "name": "Habitación Simple",
    "description": "Habitación individual con cama simple",
    "max_occupancy": 1,
    "amenities": ["WiFi", "TV", "Aire acondicionado", "Baño privado"],
    "is_active": true,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z",
    "rooms": [
      {
        "id": 101,
        "number": "101",
        "floor": 1,
        "status": "available",
        "is_active": true
      },
      {
        "id": 102,
        "number": "102",
        "floor": 1,
        "status": "occupied",
        "is_active": true
      }
    ],
    "prices": [
      {
        "id": 1,
        "price_type": "daily",
        "price": 80.00,
        "is_active": true
      },
      {
        "id": 2,
        "price_type": "weekly",
        "price": 500.00,
        "is_active": true
      },
      {
        "id": 3,
        "price_type": "monthly",
        "price": 1800.00,
        "is_active": true
      }
    ]
  }
}
```

---

### 3. Crear Tipo de Habitación

**Endpoint:** `POST /api/tipos-habitacion/crear`

**Descripción:** Crea un nuevo tipo de habitación.

**Permiso Requerido:** `habitaciones.tipo.crear`

**Body:**
```json
{
  "name": "Suite Presidencial",
  "description": "Suite de lujo con sala de estar, jacuzzi y vista panorámica",
  "max_occupancy": 4,
  "amenities": [
    "WiFi",
    "TV 55 pulgadas",
    "Aire acondicionado",
    "Baño privado",
    "Jacuzzi",
    "Minibar",
    "Sala de estar",
    "Balcón",
    "Vista panorámica"
  ],
  "is_active": true
}
```

**Validaciones:**
- `name`: Requerido, máximo 100 caracteres, único
- `description`: Opcional, texto
- `max_occupancy`: Requerido, integer > 0
- `amenities`: Opcional, array de strings
- `is_active`: Opcional, booleano (default: true)

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "roomType": {
    "id": 5,
    "name": "Suite Presidencial",
    "description": "Suite de lujo con sala de estar, jacuzzi y vista panorámica",
    "max_occupancy": 4,
    "amenities": [
      "WiFi",
      "TV 55 pulgadas",
      "Aire acondicionado",
      "Baño privado",
      "Jacuzzi",
      "Minibar",
      "Sala de estar",
      "Balcón",
      "Vista panorámica"
    ],
    "is_active": true,
    "created_at": "2024-12-15T10:00:00.000Z",
    "updated_at": "2024-12-15T10:00:00.000Z",
    "rooms": [],
    "prices": []
  },
  "msg": "Tipo de habitación creado correctamente"
}
```

---

### 4. Actualizar Tipo de Habitación

**Endpoint:** `PUT /api/tipos-habitacion/actualizar/:id`

**Descripción:** Actualiza un tipo de habitación existente.

**Permiso Requerido:** `habitaciones.tipo.actualizar`

**Parámetros URL:**
- `id`: ID del tipo de habitación (integer)

**Body:**
```json
{
  "name": "Suite Presidencial Premium",
  "description": "Suite de lujo premium con sala de estar, jacuzzi, sauna y vista panorámica",
  "max_occupancy": 6,
  "amenities": [
    "WiFi",
    "TV 65 pulgadas",
    "Aire acondicionado",
    "Baño privado",
    "Jacuzzi",
    "Sauna",
    "Minibar premium",
    "Sala de estar",
    "Balcón amplio",
    "Vista panorámica"
  ]
}
```

**Validaciones:**
- Todos los campos son opcionales
- `name`: Máximo 100 caracteres, único
- `description`: Texto
- `max_occupancy`: Integer > 0
- `amenities`: Array de strings
- `is_active`: Booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "roomType": {
    "id": 5,
    "name": "Suite Presidencial Premium",
    "description": "Suite de lujo premium con sala de estar, jacuzzi, sauna y vista panorámica",
    "max_occupancy": 6,
    "amenities": [
      "WiFi",
      "TV 65 pulgadas",
      "Aire acondicionado",
      "Baño privado",
      "Jacuzzi",
      "Sauna",
      "Minibar premium",
      "Sala de estar",
      "Balcón amplio",
      "Vista panorámica"
    ],
    "is_active": true,
    "created_at": "2024-12-15T10:00:00.000Z",
    "updated_at": "2024-12-15T14:30:00.000Z",
    "rooms": [],
    "prices": []
  },
  "msg": "Tipo de habitación actualizado correctamente"
}
```

---

### 5. Cambiar Estado de Tipo de Habitación

**Endpoint:** `PATCH /api/tipos-habitacion/cambiar-estado/:id`

**Descripción:** Activa o desactiva un tipo de habitación.

**Permiso Requerido:** `habitaciones.tipo.actualizar`

**Parámetros URL:**
- `id`: ID del tipo de habitación (integer)

**Body:**
```json
{
  "is_active": false
}
```

**Validaciones:**
- `is_active`: Requerido, booleano

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "roomType": {
    "id": 5,
    "name": "Suite Presidencial Premium",
    "is_active": false,
    ...
  },
  "msg": "Estado del tipo de habitación actualizado correctamente"
}
```

---

### 6. Eliminar Tipo de Habitación

**Endpoint:** `DELETE /api/tipos-habitacion/eliminar/:id`

**Descripción:** Elimina un tipo de habitación del sistema.

**Permiso Requerido:** `habitaciones.tipo.eliminar`

**Parámetros URL:**
- `id`: ID del tipo de habitación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Tipo de habitación eliminado correctamente"
}
```

**Advertencia:** No se puede eliminar un tipo de habitación que tenga habitaciones o precios asociados. Considere desactivarlo en lugar de eliminarlo.

---

### Tipos de Habitación Comunes

Ejemplos típicos en un hotel:

- **Habitación Simple**: 1 persona, cama individual
- **Habitación Doble**: 2 personas, dos camas individuales o una matrimonial
- **Habitación Triple**: 3 personas, tres camas o una matrimonial + una individual
- **Suite Junior**: 2-3 personas, cama king + sala de estar pequeña
- **Suite Ejecutiva**: 2-4 personas, dormitorio + sala de estar + escritorio
- **Suite Presidencial**: 4-6 personas, múltiples habitaciones + sala + amenidades premium

### Relación con Habitaciones (Rooms)

- Un tipo de habitación puede tener **múltiples habitaciones físicas**
- Ejemplo: "Habitación Doble" puede tener las habitaciones 201, 202, 203, etc.
- Cada habitación física (`Room`) tiene su propio estado (disponible, ocupada, mantenimiento)

### Relación con Precios (RoomTypePrice)

- Un tipo de habitación puede tener **múltiples precios** según el tipo de tarifa
- Tipos de precio comunes:
  - **hourly**: Por hora (hoteles de paso)
  - **daily**: Por día (tarifa estándar)
  - **weekly**: Por semana (estadías prolongadas)
  - **monthly**: Por mes (residentes temporales)

**Ejemplo:**
```json
{
  "roomType": "Habitación Doble",
  "prices": [
    { "price_type": "daily", "price": 120.00 },
    { "price_type": "weekly", "price": 750.00 },
    { "price_type": "monthly", "price": 2800.00 }
  ]
}
```

### Campo Amenities (JSONB)

El campo `amenities` es un array JSON que almacena las comodidades del tipo de habitación:

```json
{
  "amenities": [
    "WiFi",
    "TV",
    "Aire acondicionado",
    "Baño privado",
    "Minibar",
    "Caja fuerte",
    "Secador de pelo",
    "Plancha",
    "Balcón",
    "Vista al mar"
  ]
}
```

### Flujo de Trabajo Típico

1. **Crear Tipo de Habitación:**
   ```
   POST /api/tipos-habitacion/crear
   ```

2. **Definir Precios:**
   ```
   POST /api/precios-habitacion/crear
   (Para cada tipo de precio: daily, weekly, monthly)
   ```

3. **Crear Habitaciones Físicas:**
   ```
   POST /api/habitaciones/crear
   (Asignar room_type_id)
   ```

4. **Consultar Disponibilidad:**
   ```
   GET /api/tipos-habitacion/traer-por-id/:id
   (Ver habitaciones disponibles y precios)
   ```

### Integración con Reservas

Al crear una reserva:
1. Se selecciona el tipo de habitación deseado
2. Se verifica disponibilidad de habitaciones de ese tipo
3. Se asigna una habitación física específica
4. Se aplica el precio según el tipo de tarifa (daily, weekly, etc.)

### Buenas Prácticas

- Mantener tipos de habitación inactivos en lugar de eliminarlos
- Usar nombres descriptivos y claros
- Actualizar amenities cuando se renueven las habitaciones
- Definir `max_occupancy` realista según regulaciones
- Mantener precios actualizados en `RoomTypePrice`
- Documentar características especiales en `description`

### Consideraciones Importantes

- **Capacidad:** `max_occupancy` debe respetar regulaciones de seguridad
- **Amenidades:** Mantener lista actualizada para marketing
- **Precios:** Los precios se gestionan en tabla separada (`room_type_prices`)
- **Habitaciones:** Las habitaciones físicas se gestionan en tabla separada (`rooms`)

---

## Permisos (Permissions)

Base URL: `/api/permisos`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Este módulo gestiona los permisos del sistema. Los permisos definen las acciones que los usuarios pueden realizar en cada módulo y recurso. Cada permiso se compone de: módulo, recurso y acción.

### 1. Obtener Todos los Permisos

**Endpoint:** `GET /api/permisos/traer-todos`

**Descripción:** Obtiene lista de permisos con paginación y filtros.

**Permiso Requerido:** `sistema.permiso.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `module_key` (opcional): Filtrar por módulo

**Ejemplo de Request:**
```
GET /api/permisos/traer-todos?page=1&limit=20&module_key=habitaciones
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "permisos": [
    {
      "id": 1,
      "module_key": "habitaciones",
      "resource": "habitacion",
      "action": "leer",
      "description": "Permite ver habitaciones",
      "created_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "module_key": "habitaciones",
      "resource": "habitacion",
      "action": "crear",
      "description": "Permite crear habitaciones",
      "created_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 3,
      "module_key": "habitaciones",
      "resource": "tipo",
      "action": "leer",
      "description": "Permite ver tipos de habitación",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "totalCount": 50,
  "currentPage": 1,
  "totalPages": 3
}
```

---

### 2. Obtener Permiso por ID

**Endpoint:** `GET /api/permisos/traer-por-id/:id`

**Descripción:** Obtiene un permiso específico por su ID.

**Permiso Requerido:** `sistema.permiso.leer`

**Parámetros URL:**
- `id`: ID del permiso (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "permiso": {
    "id": 1,
    "module_key": "habitaciones",
    "resource": "habitacion",
    "action": "leer",
    "description": "Permite ver habitaciones",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 3. Obtener Permisos por Módulo

**Endpoint:** `GET /api/permisos/traer-por-modulo/:module_key`

**Descripción:** Obtiene todos los permisos de un módulo específico.

**Permiso Requerido:** `sistema.permiso.leer`

**Parámetros URL:**
- `module_key`: Clave del módulo (string)

**Ejemplo de Request:**
```
GET /api/permisos/traer-por-modulo/reservas
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "permisos": [
    {
      "id": 10,
      "module_key": "reservas",
      "resource": "reserva",
      "action": "leer",
      "description": "Permite ver reservas",
      "created_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 11,
      "module_key": "reservas",
      "resource": "reserva",
      "action": "crear",
      "description": "Permite crear reservas",
      "created_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 12,
      "module_key": "reservas",
      "resource": "reserva",
      "action": "actualizar",
      "description": "Permite actualizar reservas",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 4. Crear Permiso

**Endpoint:** `POST /api/permisos/crear`

**Descripción:** Crea un nuevo permiso en el sistema.

**Permiso Requerido:** `sistema.permiso.crear`

**Body:**
```json
{
  "module_key": "ventas",
  "resource": "venta",
  "action": "leer",
  "description": "Permite ver ventas del hotel"
}
```

**Validaciones:**
- `module_key`: Requerido, máximo 100 caracteres
- `resource`: Requerido, máximo 100 caracteres
- `action`: Requerido, máximo 100 caracteres
- `description`: Opcional, texto
- La combinación de `module_key`, `resource` y `action` debe ser única

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "permiso": {
    "id": 51,
    "module_key": "ventas",
    "resource": "venta",
    "action": "leer",
    "description": "Permite ver ventas del hotel",
    "created_at": "2024-12-15T10:00:00.000Z"
  },
  "msg": "Permiso creado correctamente"
}
```

---

### 5. Actualizar Permiso

**Endpoint:** `PUT /api/permisos/actualizar/:id`

**Descripción:** Actualiza un permiso existente.

**Permiso Requerido:** `sistema.permiso.actualizar`

**Parámetros URL:**
- `id`: ID del permiso (integer)

**Body:**
```json
{
  "description": "Permite visualizar todas las ventas del hotel y sus detalles"
}
```

**Validaciones:**
- Todos los campos son opcionales
- `module_key`: Máximo 100 caracteres
- `resource`: Máximo 100 caracteres
- `action`: Máximo 100 caracteres
- `description`: Texto

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "permiso": {
    "id": 51,
    "module_key": "ventas",
    "resource": "venta",
    "action": "leer",
    "description": "Permite visualizar todas las ventas del hotel y sus detalles",
    "created_at": "2024-12-15T10:00:00.000Z"
  },
  "msg": "Permiso actualizado correctamente"
}
```

---

### 6. Eliminar Permiso

**Endpoint:** `DELETE /api/permisos/eliminar/:id`

**Descripción:** Elimina un permiso del sistema.

**Permiso Requerido:** `sistema.permiso.eliminar`

**Parámetros URL:**
- `id`: ID del permiso (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Permiso eliminado correctamente"
}
```

**Advertencia:** Eliminar un permiso puede afectar a los roles que lo tienen asignado. Asegúrese de que no esté en uso antes de eliminarlo.

---

### Estructura de Permisos

Los permisos siguen el formato: `module_key.resource.action`

**Componentes:**
- **module_key**: Módulo del sistema (ej: habitaciones, reservas, ventas)
- **resource**: Recurso dentro del módulo (ej: habitacion, tipo, reserva)
- **action**: Acción permitida (ej: leer, crear, actualizar, eliminar)

**Ejemplo:**
```
habitaciones.habitacion.leer
habitaciones.habitacion.crear
habitaciones.tipo.actualizar
reservas.reserva.eliminar
```

### Módulos del Sistema

Ejemplos de módulos comunes:

- **habitaciones**: Gestión de habitaciones y tipos
- **reservas**: Gestión de reservas y check-in/check-out
- **huespedes**: Gestión de huéspedes
- **ventas**: Gestión de ventas y productos
- **servicios**: Servicios adicionales
- **inventario**: Control de inventario
- **facturacion**: Facturas y pagos
- **usuarios**: Gestión de usuarios
- **sistema**: Configuración del sistema

### Acciones Estándar

Acciones comunes en todos los módulos:

- **leer**: Ver/consultar información
- **crear**: Crear nuevos registros
- **actualizar**: Modificar registros existentes
- **eliminar**: Eliminar registros
- **exportar**: Exportar datos
- **importar**: Importar datos

### Ejemplos de Permisos por Módulo

**Habitaciones:**
```json
[
  { "module_key": "habitaciones", "resource": "habitacion", "action": "leer" },
  { "module_key": "habitaciones", "resource": "habitacion", "action": "crear" },
  { "module_key": "habitaciones", "resource": "tipo", "action": "leer" },
  { "module_key": "habitaciones", "resource": "tipo", "action": "actualizar" }
]
```

**Reservas:**
```json
[
  { "module_key": "reservas", "resource": "reserva", "action": "leer" },
  { "module_key": "reservas", "resource": "reserva", "action": "crear" },
  { "module_key": "reservas", "resource": "reserva", "action": "actualizar" },
  { "module_key": "reservas", "resource": "reserva", "action": "eliminar" }
]
```

**Ventas:**
```json
[
  { "module_key": "ventas", "resource": "venta", "action": "leer" },
  { "module_key": "ventas", "resource": "venta", "action": "crear" },
  { "module_key": "ventas", "resource": "producto", "action": "leer" }
]
```

### Uso en Middleware

Los permisos se verifican usando el middleware `tienePermiso`:

```javascript
router.get('/traer-todos',
  validarJWT,
  tienePermiso('habitaciones.habitacion.leer'),
  validarCampos,
  obtenerHabitacionesController
);
```

### Relación con Roles

Los permisos se asignan a roles, y los roles se asignan a usuarios:

```
Usuario → Rol → Permisos
```

**Ejemplo:**
- **Rol:** Recepcionista
- **Permisos:**
  - `reservas.reserva.leer`
  - `reservas.reserva.crear`
  - `habitaciones.habitacion.leer`
  - `huespedes.huesped.leer`
  - `huespedes.huesped.crear`

### Buenas Prácticas

- Usar nombres descriptivos y consistentes para módulos y recursos
- Mantener la convención: `module_key.resource.action`
- Documentar claramente qué permite cada permiso
- Agrupar permisos relacionados en el mismo módulo
- No eliminar permisos que estén en uso por roles activos
- Revisar periódicamente permisos obsoletos

### Consideraciones de Seguridad

- **Principio de Menor Privilegio:** Asignar solo los permisos necesarios
- **Separación de Responsabilidades:** Dividir permisos críticos
- **Auditoría:** Registrar cambios en permisos
- **Revisión Periódica:** Auditar permisos asignados regularmente

### Flujo de Trabajo Típico

1. **Definir Módulos del Sistema:**
   - Identificar áreas funcionales del hotel

2. **Crear Permisos por Módulo:**
   ```
   POST /api/permisos/crear
   (Para cada acción en cada recurso)
   ```

3. **Asignar Permisos a Roles:**
   - Crear roles con conjuntos de permisos

4. **Asignar Roles a Usuarios:**
   - Usuarios heredan permisos de sus roles

5. **Verificar Acceso:**
   - Middleware valida permisos en cada request

---

## Roles

Base URL: `/api/roles`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Este módulo gestiona los roles del sistema. Los roles agrupan conjuntos de permisos que se asignan a los usuarios. Cada rol define qué acciones puede realizar un usuario en el sistema.

### 1. Obtener Todos los Roles

**Endpoint:** `GET /api/roles/traer-todos`

**Descripción:** Obtiene lista de roles con sus permisos asignados.

**Permiso Requerido:** `sistema.rol.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)

**Ejemplo de Request:**
```
GET /api/roles/traer-todos?page=1&limit=10
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "roles": [
    {
      "id": 1,
      "name": "admin",
      "display_name": "Administrador",
      "description": "Acceso completo al sistema",
      "is_system_role": true,
      "created_at": "2024-01-15T10:00:00.000Z",
      "permisos": [
        {
          "id": 1,
          "module_key": "habitaciones",
          "resource": "habitacion",
          "action": "leer"
        },
        {
          "id": 2,
          "module_key": "habitaciones",
          "resource": "habitacion",
          "action": "crear"
        }
      ]
    },
    {
      "id": 2,
      "name": "recepcionista",
      "display_name": "Recepcionista",
      "description": "Gestión de reservas y check-in/check-out",
      "is_system_role": false,
      "created_at": "2024-01-15T10:00:00.000Z",
      "permisos": [
        {
          "id": 10,
          "module_key": "reservas",
          "resource": "reserva",
          "action": "leer"
        },
        {
          "id": 11,
          "module_key": "reservas",
          "resource": "reserva",
          "action": "crear"
        }
      ]
    }
  ],
  "totalCount": 5,
  "currentPage": 1,
  "totalPages": 1
}
```

---

### 2. Obtener Rol por ID

**Endpoint:** `GET /api/roles/traer-por-id/:id`

**Descripción:** Obtiene un rol específico con todos sus permisos.

**Permiso Requerido:** `sistema.rol.leer`

**Parámetros URL:**
- `id`: ID del rol (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "rol": {
    "id": 2,
    "name": "recepcionista",
    "display_name": "Recepcionista",
    "description": "Gestión de reservas y check-in/check-out",
    "is_system_role": false,
    "created_at": "2024-01-15T10:00:00.000Z",
    "permisos": [
      {
        "id": 10,
        "module_key": "reservas",
        "resource": "reserva",
        "action": "leer",
        "description": "Permite ver reservas"
      },
      {
        "id": 11,
        "module_key": "reservas",
        "resource": "reserva",
        "action": "crear",
        "description": "Permite crear reservas"
      },
      {
        "id": 12,
        "module_key": "reservas",
        "resource": "reserva",
        "action": "actualizar",
        "description": "Permite actualizar reservas"
      },
      {
        "id": 20,
        "module_key": "habitaciones",
        "resource": "habitacion",
        "action": "leer",
        "description": "Permite ver habitaciones"
      },
      {
        "id": 30,
        "module_key": "huespedes",
        "resource": "huesped",
        "action": "leer",
        "description": "Permite ver huéspedes"
      },
      {
        "id": 31,
        "module_key": "huespedes",
        "resource": "huesped",
        "action": "crear",
        "description": "Permite crear huéspedes"
      }
    ]
  }
}
```

---

### 3. Crear Rol

**Endpoint:** `POST /api/roles/crear`

**Descripción:** Crea un nuevo rol en el sistema.

**Permiso Requerido:** `sistema.rol.crear`

**Body:**
```json
{
  "name": "gerente",
  "display_name": "Gerente de Hotel",
  "description": "Gestión completa del hotel excepto configuración del sistema",
  "is_system_role": false
}
```

**Validaciones:**
- `name`: Requerido, máximo 50 caracteres, único, solo letras minúsculas y guiones bajos
- `display_name`: Requerido, máximo 100 caracteres
- `description`: Opcional, texto
- `is_system_role`: Opcional, booleano (default: false)

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "rol": {
    "id": 6,
    "name": "gerente",
    "display_name": "Gerente de Hotel",
    "description": "Gestión completa del hotel excepto configuración del sistema",
    "is_system_role": false,
    "created_at": "2024-12-15T10:00:00.000Z",
    "permisos": []
  },
  "msg": "Rol creado correctamente"
}
```

---

### 4. Actualizar Rol

**Endpoint:** `PUT /api/roles/actualizar/:id`

**Descripción:** Actualiza un rol existente.

**Permiso Requerido:** `sistema.rol.actualizar`

**Parámetros URL:**
- `id`: ID del rol (integer)

**Body:**
```json
{
  "display_name": "Gerente General",
  "description": "Gestión completa del hotel con acceso a reportes ejecutivos"
}
```

**Validaciones:**
- Todos los campos son opcionales
- `name`: Máximo 50 caracteres, único, solo letras minúsculas y guiones bajos
- `display_name`: Máximo 100 caracteres
- `description`: Texto
- No se puede actualizar `is_system_role`
- No se pueden modificar roles del sistema (`is_system_role = true`)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "rol": {
    "id": 6,
    "name": "gerente",
    "display_name": "Gerente General",
    "description": "Gestión completa del hotel con acceso a reportes ejecutivos",
    "is_system_role": false,
    "created_at": "2024-12-15T10:00:00.000Z",
    "permisos": []
  },
  "msg": "Rol actualizado correctamente"
}
```

---

### 5. Asignar Permisos a Rol

**Endpoint:** `POST /api/roles/asignar-permisos/:id`

**Descripción:** Asigna un conjunto de permisos a un rol (reemplaza los permisos existentes).

**Permiso Requerido:** `sistema.rol.actualizar`

**Parámetros URL:**
- `id`: ID del rol (integer)

**Body:**
```json
{
  "permission_ids": [10, 11, 12, 20, 30, 31, 40, 41]
}
```

**Validaciones:**
- `permission_ids`: Requerido, array de integers, al menos un permiso
- Todos los IDs de permisos deben existir

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "rol": {
    "id": 6,
    "name": "gerente",
    "display_name": "Gerente General",
    "description": "Gestión completa del hotel con acceso a reportes ejecutivos",
    "is_system_role": false,
    "created_at": "2024-12-15T10:00:00.000Z",
    "permisos": [
      {
        "id": 10,
        "module_key": "reservas",
        "resource": "reserva",
        "action": "leer",
        "description": "Permite ver reservas"
      },
      {
        "id": 11,
        "module_key": "reservas",
        "resource": "reserva",
        "action": "crear",
        "description": "Permite crear reservas"
      },
      {
        "id": 12,
        "module_key": "reservas",
        "resource": "reserva",
        "action": "actualizar",
        "description": "Permite actualizar reservas"
      }
    ]
  },
  "msg": "Permisos asignados correctamente al rol"
}
```

**Nota:** Esta operación **reemplaza** todos los permisos existentes del rol con los nuevos permisos proporcionados.

---

### 6. Eliminar Rol

**Endpoint:** `DELETE /api/roles/eliminar/:id`

**Descripción:** Elimina un rol del sistema.

**Permiso Requerido:** `sistema.rol.eliminar`

**Parámetros URL:**
- `id`: ID del rol (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Rol eliminado correctamente"
}
```

**Restricciones:**
- No se pueden eliminar roles del sistema (`is_system_role = true`)
- No se puede eliminar un rol que esté asignado a usuarios activos

---

### Roles del Sistema

Los roles del sistema (`is_system_role = true`) son roles predefinidos que no se pueden modificar ni eliminar:

- **admin**: Acceso completo al sistema
- **super_admin**: Acceso total incluyendo configuración del sistema

### Roles Personalizados Comunes

Ejemplos de roles típicos en un hotel:

- **recepcionista**: Gestión de reservas, check-in/check-out, huéspedes
- **gerente**: Gestión completa del hotel, reportes, configuración
- **contador**: Acceso a facturación, pagos, reportes financieros
- **housekeeping**: Gestión de limpieza y mantenimiento de habitaciones
- **mesero**: Gestión de ventas en restaurante/bar
- **almacenero**: Gestión de inventario y productos

### Estructura de un Rol

```json
{
  "name": "recepcionista",           // Identificador único (snake_case)
  "display_name": "Recepcionista",   // Nombre para mostrar
  "description": "...",               // Descripción del rol
  "is_system_role": false,            // Si es rol del sistema
  "permisos": [...]                   // Array de permisos asignados
}
```

### Asignación de Permisos

**Flujo típico:**

1. **Crear Rol:**
   ```
   POST /api/roles/crear
   ```

2. **Asignar Permisos:**
   ```
   POST /api/roles/asignar-permisos/:id
   {
     "permission_ids": [1, 2, 3, 10, 11, 20]
   }
   ```

3. **Asignar Rol a Usuario:**
   ```
   POST /api/usuarios/asignar-rol/:user_id
   {
     "role_id": 6
   }
   ```

### Ejemplo: Rol de Recepcionista

**Permisos típicos:**
```json
{
  "name": "recepcionista",
  "display_name": "Recepcionista",
  "permisos": [
    "reservas.reserva.leer",
    "reservas.reserva.crear",
    "reservas.reserva.actualizar",
    "habitaciones.habitacion.leer",
    "huespedes.huesped.leer",
    "huespedes.huesped.crear",
    "huespedes.huesped.actualizar"
  ]
}
```

### Ejemplo: Rol de Gerente

**Permisos típicos:**
```json
{
  "name": "gerente",
  "display_name": "Gerente de Hotel",
  "permisos": [
    "reservas.*.*",
    "habitaciones.*.*",
    "huespedes.*.*",
    "productos.venta.leer",
    "productos.venta.crear",
    "inventario.*.*",
    "facturacion.*.*",
    "usuarios.usuario.leer"
  ]
}
```

### Jerarquía de Roles

```
Super Admin (sistema)
    └── Admin (sistema)
        ├── Gerente
        │   ├── Recepcionista
        │   ├── Contador
        │   └── Almacenero
        └── Housekeeping
            └── Mesero
```

### Buenas Prácticas

- Usar nombres descriptivos en `display_name`
- Mantener `name` en snake_case y en inglés
- Documentar claramente en `description` qué hace el rol
- Aplicar principio de menor privilegio
- Revisar periódicamente permisos asignados
- No eliminar roles que estén en uso
- Crear roles específicos en lugar de dar permisos individuales

### Consideraciones de Seguridad

- **Roles del Sistema:** No modificables para mantener integridad
- **Separación de Responsabilidades:** Dividir permisos críticos en roles diferentes
- **Auditoría:** Registrar cambios en roles y permisos
- **Revisión Periódica:** Auditar roles y permisos regularmente

### Relación con Usuarios

```
Usuario → Rol → Permisos
```

Un usuario tiene un rol, y ese rol tiene múltiples permisos.

**Ejemplo:**
```
Usuario: Juan Pérez
  └── Rol: Recepcionista
      ├── reservas.reserva.leer
      ├── reservas.reserva.crear
      ├── habitaciones.habitacion.leer
      └── huespedes.huesped.leer
```

### Flujo de Verificación de Permisos

1. Usuario hace request a endpoint
2. Middleware `validarJWT` verifica token
3. Middleware `tienePermiso` verifica:
   - Obtiene rol del usuario
   - Obtiene permisos del rol
   - Verifica si tiene el permiso requerido
4. Si tiene permiso, continúa
5. Si no, retorna 403 Forbidden

---

## Asignación de Permisos a Roles (Role Permissions)

Base URL: `/api/roles-permisos`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Este módulo gestiona la tabla intermedia entre roles y permisos. Permite asignar y remover permisos individuales a roles de forma granular.

### 1. Obtener Todas las Asignaciones

**Endpoint:** `GET /api/roles-permisos/traer-todos`

**Descripción:** Obtiene lista de asignaciones de permisos a roles con paginación y filtros.

**Permiso Requerido:** `sistema.rol.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `role_id` (opcional): Filtrar por ID de rol
- `permission_id` (opcional): Filtrar por ID de permiso

**Ejemplo de Request:**
```
GET /api/roles-permisos/traer-todos?page=1&limit=20&role_id=2
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "rolePermissions": [
    {
      "id": 1,
      "role_id": 2,
      "permission_id": 10,
      "created_at": "2024-01-15T10:00:00.000Z",
      "role": {
        "id": 2,
        "name": "recepcionista",
        "display_name": "Recepcionista"
      },
      "permission": {
        "id": 10,
        "module_key": "reservas",
        "resource": "reserva",
        "action": "leer"
      }
    },
    {
      "id": 2,
      "role_id": 2,
      "permission_id": 11,
      "created_at": "2024-01-15T10:00:00.000Z",
      "role": {
        "id": 2,
        "name": "recepcionista",
        "display_name": "Recepcionista"
      },
      "permission": {
        "id": 11,
        "module_key": "reservas",
        "resource": "reserva",
        "action": "crear"
      }
    }
  ],
  "totalCount": 15,
  "currentPage": 1,
  "totalPages": 1
}
```

---

### 2. Obtener Asignación por ID

**Endpoint:** `GET /api/roles-permisos/traer-por-id/:id`

**Descripción:** Obtiene una asignación específica por su ID.

**Permiso Requerido:** `sistema.rol.leer`

**Parámetros URL:**
- `id`: ID de la asignación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "rolePermission": {
    "id": 1,
    "role_id": 2,
    "permission_id": 10,
    "created_at": "2024-01-15T10:00:00.000Z",
    "role": {
      "id": 2,
      "name": "recepcionista",
      "display_name": "Recepcionista",
      "description": "Gestión de reservas y check-in/check-out"
    },
    "permission": {
      "id": 10,
      "module_key": "reservas",
      "resource": "reserva",
      "action": "leer",
      "description": "Permite ver reservas"
    }
  }
}
```

---

### 3. Obtener Permisos de un Rol

**Endpoint:** `GET /api/roles-permisos/traer-por-rol/:role_id`

**Descripción:** Obtiene todos los permisos asignados a un rol específico.

**Permiso Requerido:** `sistema.rol.leer`

**Parámetros URL:**
- `role_id`: ID del rol (integer)

**Ejemplo de Request:**
```
GET /api/roles-permisos/traer-por-rol/2
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "permissions": [
    {
      "id": 1,
      "role_id": 2,
      "permission_id": 10,
      "created_at": "2024-01-15T10:00:00.000Z",
      "permission": {
        "id": 10,
        "module_key": "reservas",
        "resource": "reserva",
        "action": "leer",
        "description": "Permite ver reservas"
      }
    },
    {
      "id": 2,
      "role_id": 2,
      "permission_id": 11,
      "created_at": "2024-01-15T10:00:00.000Z",
      "permission": {
        "id": 11,
        "module_key": "reservas",
        "resource": "reserva",
        "action": "crear",
        "description": "Permite crear reservas"
      }
    },
    {
      "id": 3,
      "role_id": 2,
      "permission_id": 20,
      "created_at": "2024-01-15T10:00:00.000Z",
      "permission": {
        "id": 20,
        "module_key": "habitaciones",
        "resource": "habitacion",
        "action": "leer",
        "description": "Permite ver habitaciones"
      }
    }
  ]
}
```

---

### 4. Asignar Permiso a Rol

**Endpoint:** `POST /api/roles-permisos/crear`

**Descripción:** Asigna un permiso individual a un rol.

**Permiso Requerido:** `sistema.rol.actualizar`

**Body:**
```json
{
  "role_id": 2,
  "permission_id": 12
}
```

**Validaciones:**
- `role_id`: Requerido, integer, debe existir en `roles`
- `permission_id`: Requerido, integer, debe existir en `permissions`
- La combinación de `role_id` y `permission_id` debe ser única

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "rolePermission": {
    "id": 16,
    "role_id": 2,
    "permission_id": 12,
    "created_at": "2024-12-15T10:00:00.000Z",
    "role": {
      "id": 2,
      "name": "recepcionista",
      "display_name": "Recepcionista",
      "description": "Gestión de reservas y check-in/check-out"
    },
    "permission": {
      "id": 12,
      "module_key": "reservas",
      "resource": "reserva",
      "action": "actualizar",
      "description": "Permite actualizar reservas"
    }
  },
  "msg": "Permiso asignado al rol correctamente"
}
```

---

### 5. Eliminar Asignación por ID

**Endpoint:** `DELETE /api/roles-permisos/eliminar/:id`

**Descripción:** Elimina una asignación de permiso por su ID.

**Permiso Requerido:** `sistema.rol.actualizar`

**Parámetros URL:**
- `id`: ID de la asignación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Permiso removido del rol correctamente"
}
```

---

### 6. Eliminar Permiso de Rol

**Endpoint:** `DELETE /api/roles-permisos/eliminar-por-rol/:role_id/:permission_id`

**Descripción:** Elimina un permiso específico de un rol.

**Permiso Requerido:** `sistema.rol.actualizar`

**Parámetros URL:**
- `role_id`: ID del rol (integer)
- `permission_id`: ID del permiso (integer)

**Ejemplo de Request:**
```
DELETE /api/roles-permisos/eliminar-por-rol/2/12
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Permiso removido del rol correctamente"
}
```

---

### Diferencia con `/api/roles/asignar-permisos`

**Endpoint de Roles (`POST /api/roles/asignar-permisos/:id`):**
- Asigna **múltiples permisos** a la vez
- **Reemplaza** todos los permisos existentes del rol
- Útil para configuración inicial o cambios masivos

**Endpoint de RolePermissions (`POST /api/roles-permisos/crear`):**
- Asigna **un permiso** a la vez
- **Agrega** el permiso sin afectar los existentes
- Útil para ajustes granulares

### Casos de Uso

**1. Configuración Inicial de Rol:**
```
POST /api/roles/asignar-permisos/2
{
  "permission_ids": [10, 11, 12, 20, 30, 31]
}
```
Asigna todos los permisos de una vez.

**2. Agregar Permiso Individual:**
```
POST /api/roles-permisos/crear
{
  "role_id": 2,
  "permission_id": 40
}
```
Agrega un permiso adicional sin afectar los existentes.

**3. Remover Permiso Específico:**
```
DELETE /api/roles-permisos/eliminar-por-rol/2/40
```
Remueve solo ese permiso del rol.

### Flujo de Trabajo Típico

**Configuración Inicial:**
1. Crear rol
2. Asignar permisos masivamente con `/api/roles/asignar-permisos/:id`

**Ajustes Posteriores:**
1. Agregar permisos individuales con `/api/roles-permisos/crear`
2. Remover permisos individuales con `/api/roles-permisos/eliminar-por-rol/:role_id/:permission_id`

### Ejemplo Completo

**Crear rol de Recepcionista:**
```bash
# 1. Crear rol
POST /api/roles/crear
{
  "name": "recepcionista",
  "display_name": "Recepcionista",
  "description": "Gestión de reservas y check-in/check-out"
}
# Response: { "id": 2, ... }

# 2. Asignar permisos iniciales
POST /api/roles/asignar-permisos/2
{
  "permission_ids": [10, 11, 20, 30, 31]
}

# 3. Más tarde, agregar permiso de actualizar reservas
POST /api/roles-permisos/crear
{
  "role_id": 2,
  "permission_id": 12
}

# 4. Consultar permisos del rol
GET /api/roles-permisos/traer-por-rol/2

# 5. Remover un permiso específico
DELETE /api/roles-permisos/eliminar-por-rol/2/31
```

### Estructura de la Tabla Intermedia

```sql
CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER REFERENCES roles(id),
  permission_id INTEGER REFERENCES permissions(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id)
);
```

**Restricción de Unicidad:** Un rol no puede tener el mismo permiso asignado dos veces.

### Buenas Prácticas

- Usar `/api/roles/asignar-permisos` para configuración inicial
- Usar `/api/roles-permisos/crear` para ajustes incrementales
- Consultar `/api/roles-permisos/traer-por-rol/:role_id` para auditar permisos
- Documentar cambios en permisos de roles críticos
- Revisar periódicamente permisos asignados

### Consideraciones

- **Unicidad:** No se puede asignar el mismo permiso dos veces al mismo rol
- **Validación:** Tanto el rol como el permiso deben existir
- **Auditoría:** Cada asignación registra `created_at` para trazabilidad
- **Cascada:** Al eliminar un rol o permiso, se eliminan las asignaciones automáticamente

---

## Asignación de Roles a Usuarios (User Roles)

Base URL: `/api/usuarios-roles`

**Autenticación:** Todas las rutas requieren token JWT

**Descripción:** Este módulo gestiona la tabla intermedia entre usuarios y roles. Permite asignar y remover roles a usuarios, controlando así sus permisos en el sistema.

### 1. Obtener Todas las Asignaciones

**Endpoint:** `GET /api/usuarios-roles/traer-todos`

**Descripción:** Obtiene lista de asignaciones de roles a usuarios con paginación y filtros.

**Permiso Requerido:** `sistema.usuario.leer`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de resultados por página (default: 10, max: 100)
- `user_id` (opcional): Filtrar por ID de usuario
- `role_id` (opcional): Filtrar por ID de rol

**Ejemplo de Request:**
```
GET /api/usuarios-roles/traer-todos?page=1&limit=20&user_id=5
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "userRoles": [
    {
      "id": 1,
      "user_id": 5,
      "role_id": 2,
      "assigned_by": 1,
      "created_at": "2024-01-15T10:00:00.000Z",
      "user": {
        "id": 5,
        "username": "jperez",
        "email": "jperez@hotel.com",
        "first_name": "Juan",
        "last_name": "Pérez"
      },
      "role": {
        "id": 2,
        "name": "recepcionista",
        "display_name": "Recepcionista"
      },
      "assigner": {
        "id": 1,
        "username": "admin",
        "first_name": "Admin",
        "last_name": "Sistema"
      }
    }
  ],
  "totalCount": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

---

### 2. Obtener Asignación por ID

**Endpoint:** `GET /api/usuarios-roles/traer-por-id/:id`

**Descripción:** Obtiene una asignación específica por su ID.

**Permiso Requerido:** `sistema.usuario.leer`

**Parámetros URL:**
- `id`: ID de la asignación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "userRole": {
    "id": 1,
    "user_id": 5,
    "role_id": 2,
    "assigned_by": 1,
    "created_at": "2024-01-15T10:00:00.000Z",
    "user": {
      "id": 5,
      "username": "jperez",
      "email": "jperez@hotel.com",
      "first_name": "Juan",
      "last_name": "Pérez"
    },
    "role": {
      "id": 2,
      "name": "recepcionista",
      "display_name": "Recepcionista",
      "description": "Gestión de reservas y check-in/check-out"
    },
    "assigner": {
      "id": 1,
      "username": "admin",
      "first_name": "Admin",
      "last_name": "Sistema"
    }
  }
}
```

---

### 3. Obtener Roles de un Usuario

**Endpoint:** `GET /api/usuarios-roles/traer-por-usuario/:user_id`

**Descripción:** Obtiene todos los roles asignados a un usuario específico.

**Permiso Requerido:** `sistema.usuario.leer`

**Parámetros URL:**
- `user_id`: ID del usuario (integer)

**Ejemplo de Request:**
```
GET /api/usuarios-roles/traer-por-usuario/5
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "roles": [
    {
      "id": 1,
      "user_id": 5,
      "role_id": 2,
      "assigned_by": 1,
      "created_at": "2024-01-15T10:00:00.000Z",
      "role": {
        "id": 2,
        "name": "recepcionista",
        "display_name": "Recepcionista",
        "description": "Gestión de reservas y check-in/check-out",
        "is_system_role": false
      },
      "assigner": {
        "id": 1,
        "username": "admin",
        "first_name": "Admin",
        "last_name": "Sistema"
      }
    }
  ]
}
```

---

### 4. Asignar Rol a Usuario

**Endpoint:** `POST /api/usuarios-roles/crear`

**Descripción:** Asigna un rol a un usuario.

**Permiso Requerido:** `sistema.usuario.actualizar`

**Body:**
```json
{
  "user_id": 5,
  "role_id": 2,
  "assigned_by": 1
}
```

**Validaciones:**
- `user_id`: Requerido, integer, debe existir en `users`
- `role_id`: Requerido, integer, debe existir en `roles`
- `assigned_by`: Opcional, integer, ID del usuario que asigna el rol
- La combinación de `user_id` y `role_id` debe ser única

**Respuesta Exitosa (201):**
```json
{
  "ok": true,
  "userRole": {
    "id": 1,
    "user_id": 5,
    "role_id": 2,
    "assigned_by": 1,
    "created_at": "2024-12-15T10:00:00.000Z",
    "user": {
      "id": 5,
      "username": "jperez",
      "email": "jperez@hotel.com",
      "first_name": "Juan",
      "last_name": "Pérez"
    },
    "role": {
      "id": 2,
      "name": "recepcionista",
      "display_name": "Recepcionista",
      "description": "Gestión de reservas y check-in/check-out"
    },
    "assigner": {
      "id": 1,
      "username": "admin",
      "first_name": "Admin",
      "last_name": "Sistema"
    }
  },
  "msg": "Rol asignado al usuario correctamente"
}
```

**Nota:** Si no se proporciona `assigned_by`, se usa automáticamente el ID del usuario autenticado que hace la petición.

---

### 5. Eliminar Asignación por ID

**Endpoint:** `DELETE /api/usuarios-roles/eliminar/:id`

**Descripción:** Elimina una asignación de rol por su ID.

**Permiso Requerido:** `sistema.usuario.actualizar`

**Parámetros URL:**
- `id`: ID de la asignación (integer)

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Rol removido del usuario correctamente"
}
```

---

### 6. Eliminar Rol de Usuario

**Endpoint:** `DELETE /api/usuarios-roles/eliminar-por-usuario/:user_id/:role_id`

**Descripción:** Elimina un rol específico de un usuario.

**Permiso Requerido:** `sistema.usuario.actualizar`

**Parámetros URL:**
- `user_id`: ID del usuario (integer)
- `role_id`: ID del rol (integer)

**Ejemplo de Request:**
```
DELETE /api/usuarios-roles/eliminar-por-usuario/5/2
```

**Respuesta Exitosa (200):**
```json
{
  "ok": true,
  "msg": "Rol removido del usuario correctamente"
}
```

---

### Flujo de Autenticación y Permisos

```
1. Usuario inicia sesión → Recibe JWT
2. JWT contiene user_id
3. En cada request:
   - Middleware valida JWT
   - Obtiene user_id del token
   - Consulta user_roles para obtener role_id
   - Consulta role_permissions para obtener permisos
   - Valida si tiene el permiso requerido
```

### Casos de Uso

**1. Nuevo Empleado (Recepcionista):**
```bash
# 1. Crear usuario
POST /api/usuarios/crear
{
  "username": "jperez",
  "email": "jperez@hotel.com",
  "password": "******",
  "first_name": "Juan",
  "last_name": "Pérez"
}
# Response: { "id": 5, ... }

# 2. Asignar rol de recepcionista
POST /api/usuarios-roles/crear
{
  "user_id": 5,
  "role_id": 2
}
```

**2. Promoción de Empleado:**
```bash
# Remover rol actual
DELETE /api/usuarios-roles/eliminar-por-usuario/5/2

# Asignar nuevo rol (gerente)
POST /api/usuarios-roles/crear
{
  "user_id": 5,
  "role_id": 3
}
```

**3. Consultar Permisos de Usuario:**
```bash
# Obtener roles del usuario
GET /api/usuarios-roles/traer-por-usuario/5

# Para cada rol, obtener permisos
GET /api/roles-permisos/traer-por-rol/2
```

### Estructura de la Tabla Intermedia

```sql
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  role_id INTEGER REFERENCES roles(id),
  assigned_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role_id)
);
```

**Campos:**
- `user_id`: Usuario al que se asigna el rol
- `role_id`: Rol asignado
- `assigned_by`: Usuario que realizó la asignación (auditoría)
- `created_at`: Fecha de asignación

**Restricción de Unicidad:** Un usuario no puede tener el mismo rol asignado dos veces.

### Jerarquía Completa

```
Usuario
  └── UserRole (user_roles)
      └── Rol (roles)
          └── RolePermission (role_permissions)
              └── Permiso (permissions)
```

**Ejemplo:**
```
Usuario: Juan Pérez (id: 5)
  └── UserRole (id: 1)
      └── Rol: Recepcionista (id: 2)
          ├── RolePermission → Permiso: reservas.reserva.leer
          ├── RolePermission → Permiso: reservas.reserva.crear
          ├── RolePermission → Permiso: habitaciones.habitacion.leer
          └── RolePermission → Permiso: huespedes.huesped.leer
```

### Buenas Prácticas

- **Un Usuario, Un Rol:** Generalmente un usuario tiene un solo rol activo
- **Auditoría:** Usar `assigned_by` para rastrear quién asignó roles
- **Cambio de Rol:** Remover rol anterior antes de asignar nuevo
- **Roles Temporales:** Considerar agregar `expires_at` si se necesitan roles temporales
- **Validación:** Verificar que el usuario no tenga ya el rol antes de asignar

### Consideraciones de Seguridad

- **Unicidad:** Un usuario no puede tener el mismo rol dos veces
- **Validación:** Usuario y rol deben existir
- **Auditoría:** Registrar quién asigna roles (`assigned_by`)
- **Permisos:** Solo usuarios con `sistema.usuario.actualizar` pueden asignar roles
- **Cascada:** Al eliminar un usuario o rol, se eliminan las asignaciones automáticamente

### Integración con Autenticación

**Middleware de Permisos (`tienePermiso`):**
```javascript
1. Extrae user_id del JWT
2. Consulta user_roles WHERE user_id = ?
3. Obtiene role_id
4. Consulta role_permissions WHERE role_id = ?
5. Obtiene lista de permission_ids
6. Consulta permissions WHERE id IN (...)
7. Verifica si el permiso requerido está en la lista
8. Permite o deniega acceso
```

### Ejemplo Completo: Configurar Nuevo Usuario

```bash
# Paso 1: Crear usuario
POST /api/usuarios/crear
{
  "username": "mgarcia",
  "email": "mgarcia@hotel.com",
  "password": "SecurePass123!",
  "first_name": "María",
  "last_name": "García"
}
# Response: { "id": 10, ... }

# Paso 2: Asignar rol
POST /api/usuarios-roles/crear
{
  "user_id": 10,
  "role_id": 2
}
# Response: { "id": 15, ... }

# Paso 3: Verificar asignación
GET /api/usuarios-roles/traer-por-usuario/10
# Response: Lista de roles del usuario

# Paso 4: Usuario puede iniciar sesión
POST /api/auth/login
{
  "username": "mgarcia",
  "password": "SecurePass123!"
}
# Response: { "token": "...", "user": {...} }

# Paso 5: Usuario hace requests con permisos
GET /api/reservas/traer-todas
Headers: { "Authorization": "Bearer <token>" }
# Middleware valida que tenga permiso "reservas.reserva.leer"
```

### Diferencia con Otros Endpoints

**`/api/usuarios-roles`** (Esta API):
- Gestiona la relación usuario-rol
- Asigna/remueve roles a usuarios individuales
- Consulta roles de un usuario

**`/api/roles`**:
- Gestiona los roles en sí
- Crea/actualiza/elimina roles
- Asigna permisos masivos a roles

**`/api/roles-permisos`**:
- Gestiona la relación rol-permiso
- Asigna/remueve permisos a roles
- Consulta permisos de un rol

---

**Versión del Manual:** 2.8  
**Última Actualización:** Enero 2025
