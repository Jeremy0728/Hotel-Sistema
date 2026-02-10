# HISTORIAS DE USUARIO - FRONTEND
## Sistema de Gestión Hotelera - Guía para Maquetación Web

> **Objetivo**: Este documento define las historias de usuario desde la perspectiva del frontend/UI, orientado a guiar al maquetador web en la creación de interfaces, componentes y flujos de usuario.

---

## 📋 ÉPICA 1: AUTENTICACIÓN Y ONBOARDING

### HU-FE-001: Pantalla de Login
**Como** usuario del hotel  
**Quiero** una pantalla de login moderna y responsive  
**Para** acceder al sistema de manera segura

**Criterios de Aceptación UI/UX:**
- Formulario centrado con logo del hotel
- Campos: Email y Contraseña
- Checkbox "Recordarme"
- Botón "Iniciar Sesión" prominente
- Link "¿Olvidaste tu contraseña?"
- Mensajes de error claros (credenciales inválidas, campos vacíos)
- Diseño responsive (mobile-first)
- Animación de carga durante autenticación

**Componentes Necesarios:**
- `LoginForm`
- `InputField` (email, password)
- `Button` (primary)
- `ErrorMessage`
- `LoadingSpinner`

---

### HU-FE-002: Recuperación de Contraseña
**Como** usuario que olvidó su contraseña  
**Quiero** un flujo de recuperación por email  
**Para** restablecer mi acceso

**Criterios de Aceptación UI/UX:**
- Pantalla con campo de email
- Mensaje de confirmación al enviar
- Pantalla de reseteo con nueva contraseña
- Validación de fortaleza de contraseña (indicador visual)
- Confirmación de contraseña
- Redirección automática al login tras éxito

**Componentes Necesarios:**
- `ForgotPasswordForm`
- `ResetPasswordForm`
- `PasswordStrengthIndicator`
- `SuccessMessage`

---

## 📋 ÉPICA 2: DASHBOARD Y NAVEGACIÓN

### HU-FE-003: Dashboard Principal
**Como** usuario autenticado  
**Quiero** ver un dashboard con métricas clave  
**Para** tener visibilidad del estado del hotel

**Criterios de Aceptación UI/UX:**
- Sidebar con navegación por módulos
- Header con nombre de usuario, notificaciones y logout
- Cards con métricas principales:
  - Habitaciones disponibles/ocupadas
  - Check-ins de hoy
  - Check-outs de hoy
  - Ingresos del día
- Gráficos de ocupación (últimos 7 días)
- Lista de reservas próximas (hoy y mañana)
- Diseño en grid responsive

**Componentes Necesarios:**
- `DashboardLayout`
- `Sidebar`
- `Header`
- `MetricCard`
- `OccupancyChart`
- `UpcomingReservationsList`
- `NotificationBell`

---

### HU-FE-004: Navegación por Módulos
**Como** usuario del sistema  
**Quiero** navegar entre módulos según mis permisos  
**Para** acceder a las funcionalidades que necesito

**Criterios de Aceptación UI/UX:**
- Sidebar colapsable con iconos
- Menú organizado por categorías:
  - 🏨 Operaciones (Reservas, Check-in/out, Habitaciones)
  - 👥 Clientes (Huéspedes, Clientes Corporativos)
  - 💰 Finanzas (Facturas, Pagos, Ventas)
  - 📦 Productos (Inventario, Categorías, Ubicaciones)
  - 🛎️ Servicios (Servicios Adicionales, Reservas de Servicios)
  - ⚙️ Configuración (Usuarios, Roles, Permisos)
- Indicador visual del módulo activo
- Tooltips en iconos colapsados
- Ocultar módulos sin permisos

**Componentes Necesarios:**
- `Sidebar`
- `NavItem`
- `NavGroup`
- `IconButton`

---

## 📋 ÉPICA 3: GESTIÓN DE HABITACIONES

### HU-FE-005: Vista de Habitaciones (Grid)
**Como** recepcionista  
**Quiero** ver todas las habitaciones en formato grid  
**Para** conocer disponibilidad rápidamente

**Criterios de Aceptación UI/UX:**
- Grid de cards de habitaciones
- Cada card muestra:
  - Número de habitación
  - Tipo (Individual, Doble, Suite)
  - Estado con color:
    - 🟢 Verde: Disponible
    - 🔴 Rojo: Ocupada
    - 🟡 Amarillo: Limpieza
    - 🟠 Naranja: Mantenimiento
    - ⚫ Gris: Fuera de servicio
  - Piso
- Filtros por: Estado, Tipo, Piso
- Búsqueda por número
- Botón "Agregar Habitación"
- Click en card abre modal de detalles

**Componentes Necesarios:**
- `RoomGrid`
- `RoomCard`
- `StatusBadge`
- `FilterBar`
- `SearchInput`
- `RoomDetailsModal`

---

### HU-FE-006: Formulario de Habitación
**Como** administrador  
**Quiero** crear/editar habitaciones  
**Para** mantener el inventario actualizado

**Criterios de Aceptación UI/UX:**
- Modal o página con formulario
- Campos:
  - Número de habitación (requerido)
  - Tipo de habitación (select)
  - Piso (número)
  - Estado (select)
  - Notas (textarea)
- Validación en tiempo real
- Botones: Guardar, Cancelar
- Mensaje de éxito/error

**Componentes Necesarios:**
- `RoomForm`
- `Select`
- `TextArea`
- `FormActions`

---

### HU-FE-007: Gestión de Tipos de Habitación
**Como** administrador  
**Quiero** gestionar tipos de habitación y sus precios  
**Para** configurar la oferta del hotel

**Criterios de Aceptación UI/UX:**
- Tabla de tipos de habitación:
  - Nombre
  - Descripción
  - Capacidad máxima
  - Precios (por hora, día, semana, mes)
  - Estado (activo/inactivo)
  - Acciones (Editar, Eliminar)
- Botón "Agregar Tipo"
- Modal para crear/editar con:
  - Nombre, descripción, capacidad
  - Lista de amenidades (chips)
  - Configuración de precios por tipo
- Confirmación antes de eliminar

**Componentes Necesarios:**
- `RoomTypesTable`
- `RoomTypeForm`
- `PriceConfigSection`
- `AmenitiesChips`
- `ConfirmDialog`

---

## 📋 ÉPICA 4: GESTIÓN DE HUÉSPEDES

### HU-FE-008: Lista de Huéspedes
**Como** recepcionista  
**Quiero** ver y buscar huéspedes  
**Para** gestionar información de clientes

**Criterios de Aceptación UI/UX:**
- Tabla con columnas:
  - Nombre completo (Apellidos, Nombres)
  - Tipo de documento
  - Número de documento
  - Email
  - Teléfono
  - Nacionalidad
  - Acciones
- Búsqueda por nombre, documento, email
- Filtros: Nacionalidad, Tipo de documento
- Paginación (10, 25, 50 por página)
- Botón "Agregar Huésped"
- Click en fila abre perfil del huésped

**Componentes Necesarios:**
- `GuestsTable`
- `SearchBar`
- `FilterDropdown`
- `Pagination`
- `ActionMenu`

---

### HU-FE-009: Perfil de Huésped
**Como** recepcionista  
**Quiero** ver el perfil completo de un huésped  
**Para** acceder a su historial y datos

**Criterios de Aceptación UI/UX:**
- Página/Modal con tabs:
  - **Información Personal**:
    - Nombres, apellidos
    - Documento, email, teléfono
    - Fecha de nacimiento, nacionalidad
    - Dirección, ciudad, país
  - **Historial de Reservas**:
    - Lista de reservas pasadas y futuras
    - Estado, fechas, habitación, monto
  - **Preferencias**:
    - Preferencias guardadas (JSON editable)
- Botón "Editar" en cada sección
- Indicador de huésped frecuente

**Componentes Necesarios:**
- `GuestProfile`
- `TabNavigation`
- `InfoCard`
- `ReservationHistory`
- `EditablePreferences`

---

### HU-FE-010: Formulario de Huésped
**Como** recepcionista  
**Quiero** registrar nuevos huéspedes  
**Para** crear su perfil en el sistema

**Criterios de Aceptación UI/UX:**
- Formulario con secciones:
  - **Datos Personales**:
    - Nombres (requerido)
    - Apellido Paterno (requerido)
    - Apellido Materno
    - Fecha de nacimiento
  - **Documento**:
    - Tipo de documento (select: DNI, Pasaporte, CE)
    - Número de documento
  - **Contacto**:
    - Email
    - Teléfono (9 dígitos)
  - **Ubicación**:
    - Nacionalidad (select con búsqueda)
    - País de residencia
    - Ciudad
    - Dirección
- Validación en tiempo real
- Autocompletado de países
- Botones: Guardar, Cancelar

**Componentes Necesarios:**
- `GuestForm`
- `FormSection`
- `CountrySelect` (con búsqueda)
- `PhoneInput` (formato peruano)
- `DocumentTypeSelect`

---

### HU-FE-011: Clientes Corporativos
**Como** administrador  
**Quiero** gestionar clientes corporativos  
**Para** manejar convenios empresariales

**Criterios de Aceptación UI/UX:**
- Tabla de clientes corporativos:
  - Nombre de empresa
  - Contacto (nombre, email, teléfono)
  - RUC/Tax ID
  - Descuento (%)
  - Términos de pago (días)
  - Estado
  - Acciones
- Formulario con:
  - Datos de empresa
  - Información de contacto
  - Condiciones comerciales
  - País
- Badge de descuento destacado

**Componentes Necesarios:**
- `CorporateClientsTable`
- `CorporateClientForm`
- `DiscountBadge`
- `PaymentTermsInput`

---

## 📋 ÉPICA 5: GESTIÓN DE RESERVAS

### HU-FE-012: Calendario de Reservas
**Como** recepcionista  
**Quiero** ver reservas en formato calendario  
**Para** visualizar ocupación por fechas

**Criterios de Aceptación UI/UX:**
- Vista de calendario mensual
- Cada día muestra:
  - Número de check-ins
  - Número de check-outs
  - Ocupación (barra de progreso)
- Click en día abre lista de reservas
- Leyenda de colores:
  - Azul: Check-in
  - Verde: Estancia
  - Naranja: Check-out
- Navegación mes anterior/siguiente
- Botón "Hoy"

**Componentes Necesarios:**
- `ReservationCalendar`
- `CalendarDay`
- `OccupancyBar`
- `DayReservationsList`
- `CalendarLegend`

---

### HU-FE-013: Lista de Reservas
**Como** recepcionista  
**Quiero** ver todas las reservas con filtros  
**Para** gestionar reservas eficientemente

**Criterios de Aceptación UI/UX:**
- Tabla con columnas:
  - Código de confirmación
  - Huésped
  - Habitación
  - Check-in / Check-out
  - Noches
  - Estado (badge con color)
  - Monto total
  - Acciones
- Filtros:
  - Estado (Pendiente, Confirmada, Check-in, Check-out, Cancelada)
  - Rango de fechas
  - Habitación
  - Huésped
- Búsqueda por código o nombre
- Acciones rápidas:
  - Confirmar
  - Check-in
  - Check-out
  - Cancelar
  - Ver detalles

**Componentes Necesarios:**
- `ReservationsTable`
- `StatusBadge`
- `DateRangePicker`
- `QuickActions`
- `ReservationFilters`

---

### HU-FE-014: Formulario de Nueva Reserva
**Como** recepcionista  
**Quiero** crear reservas paso a paso  
**Para** registrar solicitudes de huéspedes

**Criterios de Aceptación UI/UX:**
- Wizard de 4 pasos:
  
  **Paso 1: Fechas y Habitación**
  - Selector de fechas (check-in, check-out)
  - Cálculo automático de noches
  - Adultos / Niños
  - Selector de tipo de habitación
  - Mostrar habitaciones disponibles
  - Precio base calculado
  
  **Paso 2: Huésped**
  - Búsqueda de huésped existente
  - O crear nuevo huésped (formulario inline)
  - Opción de cliente corporativo
  - Agregar huéspedes adicionales
  
  **Paso 3: Detalles**
  - Solicitudes especiales (textarea)
  - Notas internas
  - Aplicar descuento (%)
  - Resumen de precios:
    - Subtotal
    - Impuestos
    - Descuento
    - Total
  
  **Paso 4: Confirmación**
  - Resumen completo
  - Código de confirmación generado
  - Botón "Crear Reserva"

- Navegación: Siguiente, Anterior, Cancelar
- Validación por paso
- Guardado como borrador

**Componentes Necesarios:**
- `ReservationWizard`
- `WizardStep`
- `DatePicker`
- `RoomSelector`
- `GuestSearchOrCreate`
- `PriceSummary`
- `DiscountInput`
- `ProgressIndicator`

---

### HU-FE-015: Detalles de Reserva
**Como** recepcionista  
**Quiero** ver todos los detalles de una reserva  
**Para** gestionar información completa

**Criterios de Aceptación UI/UX:**
- Página/Modal con secciones:
  
  **Header**:
  - Código de confirmación (grande)
  - Estado con badge
  - Acciones rápidas (Confirmar, Check-in, Cancelar)
  
  **Información de Reserva**:
  - Fechas (check-in, check-out)
  - Habitación asignada
  - Número de noches
  - Adultos / Niños
  
  **Huésped(es)**:
  - Huésped principal (destacado)
  - Huéspedes adicionales (lista)
  - Link a perfil de cada huésped
  
  **Información Financiera**:
  - Desglose de precios
  - Pagos realizados
  - Balance pendiente
  
  **Servicios Adicionales**:
  - Lista de servicios reservados
  - Botón "Agregar Servicio"
  
  **Historial**:
  - Timeline de cambios
  - Creado por, modificado por

**Componentes Necesarios:**
- `ReservationDetails`
- `ReservationHeader`
- `GuestsList`
- `FinancialSummary`
- `ServicesList`
- `ActivityTimeline`

---

### HU-FE-016: Huéspedes de Reserva
**Como** recepcionista  
**Quiero** gestionar múltiples huéspedes en una reserva  
**Para** registrar grupos o familias

**Criterios de Aceptación UI/UX:**
- Sección dentro de detalles de reserva
- Lista de huéspedes con:
  - Nombre completo
  - Documento
  - Badge "Principal" en huésped principal
  - Botón "Eliminar" (excepto principal)
- Botón "Agregar Huésped"
- Modal para buscar/crear huésped
- Botón "Establecer como Principal"
- Mínimo 1 huésped (principal)

**Componentes Necesarios:**
- `ReservationGuestsList`
- `GuestItem`
- `AddGuestModal`
- `PrimaryBadge`

---

## 📋 ÉPICA 6: CHECK-IN Y CHECK-OUT

### HU-FE-017: Proceso de Check-in
**Como** recepcionista  
**Quiero** procesar check-in de huéspedes  
**Para** registrar llegadas

**Criterios de Aceptación UI/UX:**
- Pantalla de check-in con:
  
  **Búsqueda de Reserva**:
  - Por código de confirmación
  - Por nombre de huésped
  - Por número de documento
  
  **Información de Reserva** (readonly):
  - Datos del huésped
  - Fechas de reserva
  - Habitación asignada
  
  **Formulario de Check-in**:
  - Fecha/hora de check-in (prellenado con ahora)
  - Habitación (confirmar o cambiar)
  - Fecha/hora esperada de check-out
  - Notas
  - Verificación de documentos (checkbox)
  - Firma digital (opcional)
  
  **Acciones**:
  - Botón "Completar Check-in" (grande, verde)
  - Botón "Cancelar"

- Actualización automática de estado de habitación
- Mensaje de confirmación
- Opción de imprimir comprobante

**Componentes Necesarios:**
- `CheckInScreen`
- `ReservationSearch`
- `CheckInForm`
- `SignaturePad`
- `PrintButton`
- `SuccessModal`

---

### HU-FE-018: Lista de Check-ins Pendientes
**Como** recepcionista  
**Quiero** ver check-ins programados para hoy  
**Para** preparar llegadas

**Criterios de Aceptación UI/UX:**
- Widget en dashboard o página dedicada
- Lista de reservas con check-in hoy:
  - Hora estimada
  - Nombre del huésped
  - Habitación asignada
  - Estado (Pendiente, Completado)
  - Botón "Check-in" rápido
- Filtros: Completados, Pendientes, Todos
- Ordenar por hora
- Badge con contador de pendientes

**Componentes Necesarios:**
- `CheckInsList`
- `CheckInItem`
- `QuickCheckInButton`
- `CounterBadge`

---

### HU-FE-019: Proceso de Check-out
**Como** recepcionista  
**Quiero** procesar check-out de huéspedes  
**Para** registrar salidas y generar factura

**Criterios de Aceptación UI/UX:**
- Pantalla de check-out con:
  
  **Búsqueda**:
  - Por habitación
  - Por nombre de huésped
  - Por código de reserva
  
  **Resumen de Estancia**:
  - Fechas de check-in y check-out
  - Noches totales
  - Habitación
  
  **Cargos**:
  - Hospedaje (desglosado por noche)
  - Servicios adicionales
  - Consumos (minibar, restaurante)
  - Subtotal
  - Impuestos
  - Descuentos
  - **Total a pagar** (destacado)
  
  **Pagos**:
  - Pagos previos (lista)
  - Balance pendiente
  - Formulario de pago:
    - Método de pago
    - Monto
    - Referencia
  
  **Finalización**:
  - Fecha/hora de check-out
  - Notas
  - Botón "Completar Check-out"

- Generación automática de factura
- Actualización de estado de habitación
- Opción de imprimir factura
- Enviar factura por email

**Componentes Necesarios:**
- `CheckOutScreen`
- `StaySummary`
- `ChargesBreakdown`
- `PaymentForm`
- `PaymentHistory`
- `InvoicePreview`
- `EmailInvoiceButton`

---

### HU-FE-020: Lista de Check-outs Programados
**Como** recepcionista  
**Quiero** ver check-outs programados para hoy  
**Para** preparar salidas

**Criterios de Aceptación UI/UX:**
- Similar a check-ins pendientes
- Lista con:
  - Hora estimada de salida
  - Nombre del huésped
  - Habitación
  - Balance pendiente (destacar si > 0)
  - Estado de pago
  - Botón "Check-out" rápido
- Alertas para pagos pendientes

**Componentes Necesarios:**
- `CheckOutsList`
- `CheckOutItem`
- `BalanceBadge`
- `PaymentStatusIndicator`

---

## 📋 ÉPICA 7: GESTIÓN DE PRODUCTOS E INVENTARIO

### HU-FE-021: Catálogo de Productos
**Como** administrador  
**Quiero** gestionar el catálogo de productos  
**Para** mantener la oferta actualizada

**Criterios de Aceptación UI/UX:**
- Tabla de productos:
  - Nombre
  - SKU
  - Categoría
  - Precio
  - Costo
  - Margen (%)
  - Estado (activo/inactivo)
  - Requiere inventario
  - Acciones
- Filtros por categoría, estado
- Búsqueda por nombre o SKU
- Botón "Agregar Producto"
- Vista de card como alternativa

**Componentes Necesarios:**
- `ProductsTable`
- `ProductCard`
- `CategoryFilter`
- `PriceDisplay`
- `MarginBadge`

---

### HU-FE-022: Formulario de Producto
**Como** administrador  
**Quiero** crear/editar productos  
**Para** actualizar el catálogo

**Criterios de Aceptación UI/UX:**
- Formulario con:
  - Nombre (requerido)
  - Descripción
  - SKU (autogenerado o manual)
  - Categoría (select)
  - Precio de venta (requerido)
  - Costo
  - Tasa de impuesto (%)
  - Requiere inventario (checkbox)
  - Estado (activo/inactivo)
- Cálculo automático de margen
- Preview de precio con impuestos
- Imagen del producto (upload)

**Componentes Necesarios:**
- `ProductForm`
- `ImageUpload`
- `PriceCalculator`
- `SKUGenerator`

---

### HU-FE-023: Categorías de Productos
**Como** administrador  
**Quiero** gestionar categorías de productos  
**Para** organizar el catálogo

**Criterios de Aceptación UI/UX:**
- Lista de categorías con:
  - Nombre
  - Descripción
  - Número de productos
  - Estado
  - Acciones
- Modal para crear/editar
- Confirmación antes de eliminar (validar que no tenga productos)
- Iconos por categoría

**Componentes Necesarios:**
- `CategoriesList`
- `CategoryForm`
- `CategoryIcon`
- `ProductCount`

---

### HU-FE-024: Ubicaciones de Inventario
**Como** administrador  
**Quiero** gestionar ubicaciones de inventario  
**Para** controlar stock por área

**Criterios de Aceptación UI/UX:**
- Lista de ubicaciones:
  - Nombre (ej: "Recepción", "Minibar Hab 101")
  - Tipo (Recepción, Minibar, Almacén, Restaurante)
  - Habitación asociada (si aplica)
  - Productos en stock
  - Estado
  - Acciones
- Formulario para crear/editar:
  - Nombre
  - Tipo (select)
  - Habitación (select, solo si tipo = minibar)
  - Estado
- Iconos por tipo de ubicación

**Componentes Necesarios:**
- `LocationsList`
- `LocationForm`
- `LocationTypeIcon`
- `RoomSelector`

---

### HU-FE-025: Gestión de Inventario
**Como** administrador  
**Quiero** ver y ajustar inventario por ubicación  
**Para** controlar stock

**Criterios de Aceptación UI/UX:**
- Selector de ubicación (dropdown)
- Tabla de inventario:
  - Producto
  - SKU
  - Stock actual
  - Stock mínimo
  - Stock máximo
  - Estado (badge):
    - 🔴 Crítico (< mínimo)
    - 🟡 Bajo (< 20% del máximo)
    - 🟢 Normal
  - Última reposición
  - Acciones (Ajustar stock)
- Filtros: Estado, Categoría
- Alertas de stock bajo
- Modal de ajuste de stock:
  - Stock actual (readonly)
  - Tipo de ajuste (Agregar, Reducir, Establecer)
  - Cantidad
  - Motivo (select: Reabastecimiento, Venta, Merma, Ajuste)
  - Notas

**Componentes Necesarios:**
- `InventoryTable`
- `LocationSelector`
- `StockStatusBadge`
- `StockAdjustmentModal`
- `StockAlerts`

---

### HU-FE-026: Reporte de Stock Bajo
**Como** administrador  
**Quiero** ver productos con stock bajo  
**Para** planificar reabastecimiento

**Criterios de Aceptación UI/UX:**
- Dashboard widget o página
- Lista de productos críticos:
  - Producto
  - Ubicación
  - Stock actual
  - Stock mínimo
  - Diferencia
  - Botón "Reabastecer"
- Agrupado por ubicación
- Exportar a Excel

**Componentes Necesarios:**
- `LowStockReport`
- `LowStockItem`
- `RestockButton`
- `ExportButton`

---

## 📋 ÉPICA 8: VENTAS Y PUNTO DE VENTA

### HU-FE-027: Punto de Venta (POS)
**Como** recepcionista  
**Quiero** registrar ventas de productos  
**Para** facturar consumos

**Criterios de Aceptación UI/UX:**
- Pantalla dividida en 2 columnas:
  
  **Izquierda: Catálogo**
  - Grid de productos con imagen
  - Búsqueda rápida
  - Filtro por categoría
  - Precio visible
  - Click para agregar
  
  **Derecha: Carrito**
  - Lista de items:
    - Producto
    - Cantidad (editable con +/-)
    - Precio unitario
    - Subtotal
    - Botón eliminar
  - Resumen:
    - Subtotal
    - Impuestos
    - Descuento (opcional)
    - **Total** (grande)
  - Selector de:
    - Ubicación (de dónde sale el producto)
    - Reserva (opcional, para cargar a habitación)
    - Huésped (opcional)
  - Método de pago
  - Botón "Completar Venta" (grande)

- Validación de stock antes de vender
- Mensaje de éxito con número de venta
- Opción de imprimir ticket
- Limpiar carrito tras venta

**Componentes Necesarios:**
- `POSScreen`
- `ProductGrid`
- `ProductCard`
- `ShoppingCart`
- `CartItem`
- `CartSummary`
- `PaymentMethodSelector`
- `SaleReceipt`

---

### HU-FE-028: Historial de Ventas
**Como** administrador  
**Quiero** ver historial de ventas  
**Para** analizar ingresos

**Criterios de Aceptación UI/UX:**
- Tabla de ventas:
  - Número de venta
  - Fecha/hora
  - Ubicación
  - Reserva (si aplica)
  - Huésped (si aplica)
  - Total
  - Método de pago
  - Estado de pago
  - Procesado por
  - Acciones (Ver detalles, Anular)
- Filtros:
  - Rango de fechas
  - Ubicación
  - Estado de pago
  - Método de pago
- Búsqueda por número de venta
- Métricas superiores:
  - Total vendido (período)
  - Número de transacciones
  - Ticket promedio

**Componentes Necesarios:**
- `SalesTable`
- `SalesFilters`
- `SalesMetrics`
- `SaleDetailsModal`

---

### HU-FE-029: Detalles de Venta
**Como** recepcionista  
**Quiero** ver detalles de una venta  
**Para** verificar información

**Criterios de Aceptación UI/UX:**
- Modal o página con:
  - Header:
    - Número de venta
    - Fecha/hora
    - Estado
  - Items vendidos (tabla):
    - Producto
    - Cantidad
    - Precio unitario
    - Total
  - Resumen financiero
  - Información de pago
  - Procesado por (usuario)
  - Botón "Imprimir"
  - Botón "Anular" (si aplica)

**Componentes Necesarios:**
- `SaleDetails`
- `SaleItemsTable`
- `SaleHeader`
- `PrintButton`

---

## 📋 ÉPICA 9: SERVICIOS ADICIONALES

### HU-FE-030: Catálogo de Servicios
**Como** administrador  
**Quiero** gestionar servicios adicionales  
**Para** ofrecer servicios al huésped

**Criterios de Aceptación UI/UX:**
- Grid de servicios con cards:
  - Nombre
  - Categoría (Spa, Restaurante, Lavandería, Transporte, Tours)
  - Precio
  - Duración (si aplica)
  - Requiere reserva
  - Estado
  - Acciones
- Filtro por categoría
- Formulario para crear/editar:
  - Nombre, descripción
  - Categoría
  - Precio
  - Duración (minutos)
  - Requiere reserva (checkbox)
  - Imagen

**Componentes Necesarios:**
- `ServicesGrid`
- `ServiceCard`
- `ServiceForm`
- `CategoryBadge`
- `DurationDisplay`

---

### HU-FE-031: Reservar Servicio para Huésped
**Como** recepcionista  
**Quiero** reservar servicios para huéspedes  
**Para** programar actividades

**Criterios de Aceptación UI/UX:**
- Formulario con:
  - Búsqueda de reserva/huésped
  - Selector de servicio
  - Fecha y hora programada
  - Cantidad
  - Precio (prellenado, editable)
  - Notas especiales
  - Total calculado
- Validación de disponibilidad (si aplica)
- Confirmación visual
- Agregar a cuenta de habitación

**Componentes Necesarios:**
- `ServiceReservationForm`
- `ServiceSelector`
- `DateTimePicker`
- `GuestReservationSearch`

---

### HU-FE-032: Agenda de Servicios
**Como** coordinador de servicios  
**Quiero** ver servicios programados  
**Para** organizar operaciones

**Criterios de Aceptación UI/UX:**
- Vista de calendario/agenda:
  - Por día, semana
  - Cada servicio muestra:
    - Hora
    - Servicio
    - Huésped
    - Habitación
    - Estado (Pendiente, Confirmado, Completado, Cancelado)
  - Color por categoría de servicio
- Filtros por categoría, estado
- Click en servicio abre detalles
- Acciones: Confirmar, Completar, Cancelar
- Vista de lista como alternativa

**Componentes Necesarios:**
- `ServiceSchedule`
- `ServiceCalendar`
- `ServiceItem`
- `ServiceStatusBadge`
- `ServiceDetailsModal`

---

## 📋 ÉPICA 10: FINANZAS Y FACTURACIÓN

### HU-FE-033: Lista de Facturas
**Como** contador  
**Quiero** ver todas las facturas  
**Para** gestionar facturación

**Criterios de Aceptación UI/UX:**
- Tabla de facturas:
  - Número de factura
  - Fecha de emisión
  - Cliente (huésped o corporativo)
  - Reserva asociada
  - Subtotal
  - Impuestos
  - Total
  - Estado (Borrador, Enviada, Pagada, Vencida, Cancelada)
  - Acciones
- Filtros:
  - Estado
  - Rango de fechas
  - Cliente
- Búsqueda por número
- Métricas:
  - Total facturado
  - Pendiente de pago
  - Vencido

**Componentes Necesarios:**
- `InvoicesTable`
- `InvoiceStatusBadge`
- `InvoiceFilters`
- `FinancialMetrics`

---

### HU-FE-034: Detalles de Factura
**Como** contador  
**Quiero** ver detalles de factura  
**Para** verificar información

**Criterios de Aceptación UI/UX:**
- Página/Modal con diseño de factura:
  - Header con logo del hotel
  - Número de factura, fecha
  - Datos del cliente
  - Tabla de conceptos:
    - Descripción
    - Cantidad
    - Precio unitario
    - Total
  - Subtotal, impuestos, descuentos, total
  - Estado de pago
  - Pagos aplicados (lista)
  - Balance pendiente
- Botones:
  - Imprimir
  - Enviar por email
  - Registrar pago
  - Anular

**Componentes Necesarios:**
- `InvoiceDetails`
- `InvoiceHeader`
- `InvoiceItemsTable`
- `PaymentsList`
- `InvoiceActions`

---

### HU-FE-035: Registrar Pago
**Como** recepcionista  
**Quiero** registrar pagos de facturas  
**Para** actualizar estado financiero

**Criterios de Aceptación UI/UX:**
- Modal de pago:
  - Factura (readonly)
  - Balance pendiente (destacado)
  - Monto a pagar (editable, max = balance)
  - Método de pago (select)
  - Número de referencia
  - Fecha de pago (prellenado con hoy)
  - Notas
- Validación: monto <= balance
- Actualización automática de estado
- Confirmación visual
- Opción de imprimir comprobante

**Componentes Necesarios:**
- `PaymentForm`
- `PaymentMethodSelector`
- `BalanceDisplay`
- `PaymentReceipt`

---

### HU-FE-036: Métodos de Pago
**Como** administrador  
**Quiero** configurar métodos de pago  
**Para** personalizar opciones

**Criterios de Aceptación UI/UX:**
- Lista de métodos:
  - Nombre (Efectivo, Tarjeta, Transferencia, etc.)
  - Tipo
  - Estado (activo/inactivo)
  - Acciones
- Formulario simple:
  - Nombre
  - Tipo (select)
  - Estado

**Componentes Necesarios:**
- `PaymentMethodsList`
- `PaymentMethodForm`

---

## 📋 ÉPICA 11: USUARIOS Y CONTROL DE ACCESO

### HU-FE-037: Lista de Usuarios
**Como** administrador  
**Quiero** ver todos los usuarios del sistema  
**Para** gestionar personal

**Criterios de Aceptación UI/UX:**
- Tabla de usuarios:
  - Nombre completo
  - Email
  - Teléfono
  - Roles asignados (chips)
  - Estado (activo/inactivo)
  - Último login
  - Acciones
- Filtros: Rol, Estado
- Búsqueda por nombre o email
- Botón "Agregar Usuario"
- Indicador visual de usuario activo/inactivo

**Componentes Necesarios:**
- `UsersTable`
- `RoleChips`
- `StatusIndicator`
- `LastLoginDisplay`

---

### HU-FE-038: Formulario de Usuario
**Como** administrador  
**Quiero** crear/editar usuarios  
**Para** gestionar accesos

**Criterios de Aceptación UI/UX:**
- Formulario con tabs:
  
  **Información Personal**:
  - Nombres (requerido)
  - Apellido Paterno (requerido)
  - Apellido Materno
  - Email (requerido, único)
  - Celular (9 dígitos)
  - Contraseña (solo al crear)
  
  **Roles y Permisos**:
  - Lista de roles disponibles (checkboxes)
  - Preview de permisos del rol seleccionado
  
  **Configuración**:
  - Estado (activo/inactivo)
  - Preferencias (JSON editable)

- Validación de email único
- Indicador de fortaleza de contraseña
- Botones: Guardar, Cancelar

**Componentes Necesarios:**
- `UserForm`
- `RoleSelector`
- `PermissionsPreview`
- `PasswordStrengthIndicator`

---

### HU-FE-039: Gestión de Roles
**Como** administrador  
**Quiero** crear y editar roles  
**Para** definir niveles de acceso

**Criterios de Aceptación UI/UX:**
- Lista de roles:
  - Nombre
  - Descripción
  - Usuarios asignados (contador)
  - Permisos (contador)
  - Sistema (badge si es rol de sistema)
  - Acciones
- Formulario de rol:
  - Nombre (requerido)
  - Nombre para mostrar
  - Descripción
  - Permisos (árbol jerárquico):
    - Por módulo
    - Por recurso
    - Por acción (leer, crear, actualizar, eliminar)
  - Checkboxes con "Seleccionar todos" por módulo

**Componentes Necesarios:**
- `RolesList`
- `RoleForm`
- `PermissionsTree`
- `PermissionCheckbox`
- `SystemRoleBadge`

---

### HU-FE-040: Gestión de Permisos
**Como** super-administrador  
**Quiero** ver todos los permisos del sistema  
**Para** entender estructura de acceso

**Criterios de Aceptación UI/UX:**
- Vista de árbol de permisos:
  - Agrupado por módulo
  - Luego por recurso
  - Luego por acción
- Cada permiso muestra:
  - Código (ej: reservas.reserva.leer)
  - Descripción
  - Roles que lo tienen
- Búsqueda por código o descripción
- Filtro por módulo
- Solo lectura (permisos no se crean desde UI)

**Componentes Necesarios:**
- `PermissionsTree`
- `PermissionNode`
- `RolesWithPermission`

---

## 📋 ÉPICA 12: REPORTES Y ANALÍTICAS

### HU-FE-041: Dashboard de Reportes
**Como** gerente  
**Quiero** ver reportes y métricas clave  
**Para** tomar decisiones

**Criterios de Aceptación UI/UX:**
- Página con widgets:
  
  **Ocupación**:
  - Gráfico de línea (últimos 30 días)
  - Porcentaje actual
  - Comparación con mes anterior
  
  **Ingresos**:
  - Gráfico de barras (por día/semana/mes)
  - Total del período
  - Desglose por fuente (hospedaje, servicios, productos)
  
  **Reservas**:
  - Nuevas reservas (período)
  - Cancelaciones
  - Tasa de conversión
  
  **Productos**:
  - Productos más vendidos
  - Ingresos por categoría

- Selector de rango de fechas
- Exportar reportes a PDF/Excel
- Filtros globales

**Componentes Necesarios:**
- `ReportsDashboard`
- `OccupancyChart`
- `RevenueChart`
- `TopProductsWidget`
- `DateRangePicker`
- `ExportButton`

---

### HU-FE-042: Reporte de Ocupación
**Como** gerente  
**Quiero** ver reporte detallado de ocupación  
**Para** analizar rendimiento

**Criterios de Aceptación UI/UX:**
- Gráfico de ocupación:
  - Por día (últimos 30 días)
  - Por tipo de habitación
  - Porcentaje de ocupación
- Tabla con:
  - Fecha
  - Habitaciones disponibles
  - Habitaciones ocupadas
  - Porcentaje
  - Ingresos
- Filtros: Rango de fechas, Tipo de habitación
- Comparación con período anterior
- Exportar a Excel

**Componentes Necesarios:**
- `OccupancyReport`
- `OccupancyChart`
- `OccupancyTable`
- `ComparisonIndicator`

---

### HU-FE-043: Reporte de Ingresos
**Como** contador  
**Quiero** ver reporte de ingresos detallado  
**Para** análisis financiero

**Criterios de Aceptación UI/UX:**
- Métricas principales:
  - Ingresos totales
  - Por hospedaje
  - Por servicios
  - Por productos
- Gráficos:
  - Tendencia temporal
  - Distribución por fuente
  - Top 10 servicios/productos
- Tabla detallada:
  - Fecha
  - Concepto
  - Categoría
  - Monto
  - Método de pago
- Filtros: Fechas, Categoría, Método de pago
- Exportar a Excel

**Componentes Necesarios:**
- `RevenueReport`
- `RevenueMetrics`
- `RevenueChart`
- `RevenueTable`

---

## 📋 ÉPICA 13: CONFIGURACIÓN DEL SISTEMA

### HU-FE-044: Configuración del Hotel
**Como** administrador  
**Quiero** configurar información del hotel  
**Para** personalizar el sistema

**Criterios de Aceptación UI/UX:**
- Formulario con secciones:
  
  **Información General**:
  - Nombre del hotel
  - Dirección
  - Teléfono
  - Email
  - RUC
  - Logo (upload)
  
  **Configuración Regional**:
  - Moneda
  - Zona horaria
  - Formato de fecha
  - Idioma
  
  **Políticas**:
  - Hora de check-in
  - Hora de check-out
  - Política de cancelación
  - Términos y condiciones
  
  **Impuestos**:
  - Tasa de impuesto (%)
  - Incluir impuestos en precios

- Vista previa de cambios
- Botón "Guardar Configuración"

**Componentes Necesarios:**
- `HotelSettingsForm`
- `LogoUpload`
- `TimezonePicker`
- `CurrencySelector`
- `TaxConfiguration`

---

### HU-FE-045: Gestión de Plan y Módulos
**Como** administrador  
**Quiero** ver mi plan actual y módulos disponibles  
**Para** conocer funcionalidades

**Criterios de Aceptación UI/UX:**
- Card de plan actual:
  - Nombre del plan
  - Precio
  - Fecha de renovación
  - Estado
- Lista de módulos:
  - Nombre
  - Descripción
  - Estado (Disponible/No disponible)
  - Badge de plan requerido
- Botón "Solicitar Upgrade" (si hay módulos no disponibles)
- Indicador visual de módulos activos

**Componentes Necesarios:**
- `PlanCard`
- `ModulesList`
- `ModuleCard`
- `PlanBadge`
- `UpgradeButton`

---

## 📋 ÉPICA 14: NOTIFICACIONES Y ALERTAS

### HU-FE-046: Centro de Notificaciones
**Como** usuario  
**Quiero** ver mis notificaciones  
**Para** estar informado de eventos

**Criterios de Aceptación UI/UX:**
- Icono de campana en header con badge de contador
- Dropdown al hacer click:
  - Lista de notificaciones (últimas 10)
  - Cada notificación muestra:
    - Icono según tipo
    - Mensaje
    - Tiempo relativo (hace 5 min)
    - Estado (leída/no leída)
  - Link "Ver todas"
- Página de notificaciones:
  - Lista completa
  - Filtros: Tipo, Estado
  - Marcar como leída
  - Marcar todas como leídas
  - Eliminar

**Tipos de notificaciones**:
- Nueva reserva
- Check-in pendiente
- Check-out pendiente
- Stock bajo
- Pago recibido
- Servicio programado

**Componentes Necesarios:**
- `NotificationBell`
- `NotificationDropdown`
- `NotificationItem`
- `NotificationsPage`

---

### HU-FE-047: Alertas del Sistema
**Como** usuario  
**Quiero** ver alertas importantes  
**Para** actuar rápidamente

**Criterios de Aceptación UI/UX:**
- Banners de alerta en dashboard:
  - Stock crítico (rojo)
  - Pagos vencidos (naranja)
  - Mantenimientos pendientes (amarillo)
- Cada alerta muestra:
  - Icono
  - Mensaje
  - Botón de acción
  - Botón "Descartar"
- Alertas persistentes hasta resolverse
- Contador de alertas activas

**Componentes Necesarios:**
- `AlertBanner`
- `AlertsList`
- `AlertItem`
- `AlertCounter`

---

## 📋 ÉPICA 15: BÚSQUEDA GLOBAL Y NAVEGACIÓN

### HU-FE-048: Búsqueda Global
**Como** usuario  
**Quiero** buscar en todo el sistema  
**Para** encontrar información rápidamente

**Criterios de Aceptación UI/UX:**
- Barra de búsqueda en header (Ctrl+K o Cmd+K)
- Modal de búsqueda con:
  - Input de búsqueda
  - Resultados agrupados por tipo:
    - Reservas
    - Huéspedes
    - Habitaciones
    - Productos
    - Facturas
  - Cada resultado muestra:
    - Tipo (badge)
    - Información relevante
    - Link directo
  - Navegación con teclado (↑↓, Enter)
  - Búsqueda en tiempo real (debounced)
  - Historial de búsquedas recientes

**Componentes Necesarios:**
- `GlobalSearch`
- `SearchModal`
- `SearchResults`
- `ResultItem`
- `SearchHistory`

---

### HU-FE-049: Breadcrumbs y Navegación
**Como** usuario  
**Quiero** ver mi ubicación en el sistema  
**Para** navegar fácilmente

**Criterios de Aceptación UI/UX:**
- Breadcrumbs en cada página:
  - Home > Módulo > Sección > Página actual
  - Links clickeables
  - Última parte en negrita (actual)
- Botón "Atrás" en páginas de detalle
- Navegación consistente

**Componentes Necesarios:**
- `Breadcrumbs`
- `BreadcrumbItem`
- `BackButton`

---

## 📋 ÉPICA 16: RESPONSIVE Y MOBILE

### HU-FE-050: Diseño Responsive
**Como** usuario móvil  
**Quiero** usar el sistema desde mi teléfono  
**Para** trabajar desde cualquier lugar

**Criterios de Aceptación UI/UX:**
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Sidebar colapsable en mobile (hamburger menu)
- Tablas convertidas a cards en mobile
- Formularios apilados verticalmente
- Botones de tamaño táctil (min 44px)
- Navegación bottom bar en mobile
- Gestos táctiles (swipe, pull-to-refresh)

**Componentes Necesarios:**
- `ResponsiveLayout`
- `MobileMenu`
- `BottomNavigation`
- `MobileCard`

---

## 📋 COMPONENTES GLOBALES Y UTILIDADES

### Componentes de UI Base
- `Button` (primary, secondary, danger, ghost)
- `Input` (text, email, password, number, tel)
- `Select` (simple, multi-select, searchable)
- `Checkbox`
- `Radio`
- `Switch`
- `DatePicker`
- `TimePicker`
- `DateRangePicker`
- `TextArea`
- `Modal`
- `Drawer`
- `Tooltip`
- `Popover`
- `Dropdown`
- `Badge`
- `Chip`
- `Avatar`
- `Spinner`
- `Skeleton`
- `ProgressBar`
- `Alert`
- `Toast`
- `Tabs`
- `Accordion`
- `Card`
- `Table`
- `Pagination`
- `EmptyState`
- `ErrorState`

### Layouts
- `DashboardLayout` (sidebar + header + content)
- `AuthLayout` (centrado, sin sidebar)
- `FullPageLayout` (sin sidebar)
- `SplitLayout` (2 columnas)

### Utilidades
- `LoadingOverlay`
- `ConfirmDialog`
- `ImageViewer`
- `FileUpload`
- `ColorPicker`
- `IconPicker`
- `RichTextEditor`
- `CodeEditor`

---

## 🎨 GUÍA DE DISEÑO

### Paleta de Colores Sugerida
- **Primary**: Azul (#3B82F6) - Acciones principales
- **Secondary**: Gris (#6B7280) - Acciones secundarias
- **Success**: Verde (#10B981) - Estados positivos
- **Warning**: Amarillo (#F59E0B) - Alertas
- **Danger**: Rojo (#EF4444) - Acciones destructivas
- **Info**: Azul claro (#06B6D4) - Información

### Estados de Habitación
- 🟢 Disponible: Verde (#10B981)
- 🔴 Ocupada: Rojo (#EF4444)
- 🟡 Limpieza: Amarillo (#F59E0B)
- 🟠 Mantenimiento: Naranja (#F97316)
- ⚫ Fuera de servicio: Gris (#6B7280)

### Estados de Reserva
- Pendiente: Gris (#6B7280)
- Confirmada: Azul (#3B82F6)
- Check-in: Verde (#10B981)
- Check-out: Púrpura (#8B5CF6)
- Cancelada: Rojo (#EF4444)
- No Show: Naranja (#F97316)

### Tipografía
- **Headings**: Inter, Poppins, o Montserrat
- **Body**: Inter, Roboto, o Open Sans
- **Monospace**: Fira Code, JetBrains Mono

### Espaciado
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Bordes
- Radius: 8px (default), 4px (small), 12px (large)
- Width: 1px (default), 2px (focus)

### Sombras
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)
- xl: 0 20px 25px rgba(0,0,0,0.15)

---

## 🚀 PRIORIZACIÓN DE DESARROLLO

### Fase 1: MVP (Mínimo Viable)
1. Autenticación (HU-FE-001, 002)
2. Dashboard básico (HU-FE-003)
3. Gestión de habitaciones (HU-FE-005, 006)
4. Gestión de huéspedes (HU-FE-008, 010)
5. Reservas básicas (HU-FE-013, 014)
6. Check-in/Check-out (HU-FE-017, 019)

### Fase 2: Operaciones Completas
7. Calendario de reservas (HU-FE-012)
8. Múltiples huéspedes (HU-FE-016)
9. Tipos de habitación y precios (HU-FE-007)
10. Clientes corporativos (HU-FE-011)
11. Facturación (HU-FE-033, 034, 035)

### Fase 3: Productos y Servicios
12. Catálogo de productos (HU-FE-021, 022)
13. Inventario (HU-FE-025)
14. Punto de venta (HU-FE-027)
15. Servicios adicionales (HU-FE-030, 031, 032)

### Fase 4: Administración
16. Usuarios y roles (HU-FE-037, 038, 039)
17. Reportes (HU-FE-041, 042, 043)
18. Configuración (HU-FE-044, 045)
19. Notificaciones (HU-FE-046, 047)

### Fase 5: Optimización
20. Búsqueda global (HU-FE-048)
21. Mobile responsive (HU-FE-050)
22. Mejoras de UX

---

## 📱 CONSIDERACIONES TÉCNICAS

### Stack Tecnológico Sugerido
- **Framework**: React, Vue, o Angular
- **UI Library**: TailwindCSS + shadcn/ui, Material-UI, o Ant Design
- **State Management**: Redux, Zustand, o Pinia
- **Forms**: React Hook Form, Formik, o VeeValidate
- **Charts**: Chart.js, Recharts, o ApexCharts
- **Date Handling**: date-fns o Day.js
- **HTTP Client**: Axios
- **Icons**: Lucide, Heroicons, o Material Icons

### Estructura de Carpetas Sugerida
```
src/
├── components/
│   ├── ui/              # Componentes base
│   ├── layout/          # Layouts
│   ├── features/        # Componentes por módulo
│   │   ├── auth/
│   │   ├── rooms/
│   │   ├── guests/
│   │   ├── reservations/
│   │   └── ...
│   └── shared/          # Componentes compartidos
├── pages/               # Páginas/Vistas
├── hooks/               # Custom hooks
├── services/            # API calls
├── store/               # State management
├── utils/               # Utilidades
├── types/               # TypeScript types
└── assets/              # Imágenes, fonts, etc.
```

### Mejores Prácticas
- Componentes reutilizables y atómicos
- Tipado estricto con TypeScript
- Validación de formularios
- Manejo de errores consistente
- Loading states en todas las operaciones async
- Optimistic updates cuando sea posible
- Lazy loading de rutas
- Memoización de componentes pesados
- Accesibilidad (ARIA labels, keyboard navigation)
- Internacionalización (i18n) preparada

---

**Versión del Documento**: 1.0  
**Fecha**: Febrero 2026  
**Total de Historias**: 50 historias de usuario frontend
