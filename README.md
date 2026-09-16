# 🏪 Frontend — Sistema de Gestión POS

Frontend del sistema POS, construido en **Next.js + TypeScript** y conectado a un backend **Spring Boot (Java) + MySQL**.

Este documento no solo describe *qué* hay en cada carpeta, sino **por qué** se organizó así y **cómo** cada decisión de frontend está atada a una regla de negocio o a una restricción real del backend.

---

## 📚 Tabla de contenidos

1. [Stack tecnológico](#-stack-tecnológico)
2. [Estructura del proyecto](#-estructura-del-proyecto)
3. [Por qué esta arquitectura en capas](#-por-qué-esta-arquitectura-en-capas)
4. [Autenticación: por qué cookie httpOnly y no localStorage](#-autenticación-por-qué-cookie-httponly-y-no-localstorage)
5. [Roles y permisos: una sola fuente de verdad](#-roles-y-permisos-una-sola-fuente-de-verdad)
6. [Módulos funcionales y su lógica de negocio](#-módulos-funcionales-y-su-lógica-de-negocio)
7. [Contratos con el backend: puntos delicados](#-contratos-con-el-backend-puntos-delicados)
8. [Manejo de errores](#-manejo-de-errores)

---

## 🧱 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js (App Router) |
| Lenguaje | TypeScript |
| Fetching / cache | React Query (`@tanstack/react-query`) |
| Autenticación | JWT vía cookie `httpOnly` |
| Notificaciones | `react-hot-toast` |
| Backend | Spring Boot (Java) + MySQL |

---

## 🗂️ Estructura del proyecto

```
└── 📁src
    └── 📁app
        └── 📁(dashboard)
            └── 📁configuracion
                └── 📁promociones/page.tsx
                └── 📁sucursales/page.tsx
                ├── layout.tsx
            └── 📁dashboard/page.tsx
            └── 📁productos/page.tsx
            └── 📁reportes/page.tsx
            └── 📁stock/page.tsx
            └── 📁ventas
                └── 📁historial/page.tsx
                ├── page.tsx
            ├── layout.tsx
        └── 📁login/page.tsx
        ├── layout.tsx · page.tsx · globals.css
    └── 📁components        # UI por dominio (1 a 1 con los módulos de negocio)
    └── 📁config
        ├── permissions.ts  # 🔐 qué puede ver/hacer cada rol
    └── 📁constants
        ├── navigation.ts · stock.ts
    └── 📁context
        ├── AuthContext.tsx # 👤 sesión y rol disponibles en toda la app
    └── 📁hooks              # 🎣 un hook por dominio, envuelve React Query
    └── 📁lib
        ├── api.ts           # 🌐 cliente HTTP único
        ├── http-error.ts    # 🚨 normalización de errores
        ├── productSearch.ts # 🔍 búsqueda de catálogo compartida
    └── 📁providers
        ├── query-provide.tsx
    └── 📁services            # 📡 un archivo por dominio, arma cada request
    └── 📁types                # 🧬 espejo TypeScript de los DTOs de Java
```

**¿Por qué esta división y no una más simple?**
El sistema tiene dos roles con permisos muy distintos (`ADMINISTRADOR` / `CAJERO`) y varios flujos con reglas de negocio no triviales (promociones, pagos, tickets). Mezclar la lógica de fetching con los componentes hubiera significado repetir esas reglas en cada pantalla. Separar `services` (qué le pido al backend) de `hooks` (cómo lo cacheo y expongo) de `components` (cómo lo muestro) permite que una regla de negocio se cambie **en un solo lugar** sin tocar la UI, y viceversa.

---

## 🧭 Por qué esta arquitectura en capas

```
🖼️ Componente  →  🎣 Hook (useX)  →  📡 Service (x-service.ts)  →  🌐 lib/api.ts  →  ☕ Backend
```

- **Ningún componente llama `fetch` directamente.** Siempre pasa por un hook. Esto no es una preferencia estética: es lo que garantiza que el **cache de React Query** quede consistente (por ejemplo, si se anula una venta desde el panel de Admin, invalidar la query correcta hace que el Historial de Ventas se actualice solo, sin lógica manual de refresco).
- **Los `services/` son el único lugar que "conoce" el contrato exacto del backend** (nombres de campos, endpoints, DTOs). Esto aísla el resto de la app de cambios de contrato: si el backend cambia un nombre de campo, se corrige en un archivo, no en diez componentes.
- **`types/` es un espejo de los DTOs de Java.** Mantenerlo alineado 1 a 1 con el backend es lo que convierte un desalineamiento de contrato en un **error de compilación** en vez de un bug silencioso en producción.
- **Convención de trabajo:** ante cualquier discrepancia, el frontend se adapta al backend — con la única excepción de **Reportes**, donde el frontend definió los campos según necesidad de UI (porque son datos agregados, no entidades de negocio).

---

## 🔐 Autenticación: por qué cookie `httpOnly` y no `localStorage`

- El login (`auth-service.ts`) autentica contra el backend, que responde seteando el JWT en una **cookie `httpOnly`**. El navegador la adjunta solo en cada request gracias a `lib/api.ts` configurado con `credentials: "include"` — el frontend **nunca toca el token directamente**.
- **Por qué importa:** un token en `localStorage` es legible por cualquier script (riesgo de XSS); en cookie `httpOnly` es invisible para JavaScript. Para un sistema que maneja ventas y pagos reales, ese riesgo no era aceptable.
- `AuthContext.tsx` + `useAuth.ts` exponen usuario y rol a toda la app. El `layout.tsx` del grupo `(dashboard)` actúa como **guard**: sin sesión válida, redirige a `login` antes de renderizar cualquier pantalla protegida.

> 🕰️ La autenticación se implementó primero con `localStorage` y se migró después a este esquema, que es el vigente.

---

## 👥 Roles y permisos: una sola fuente de verdad

| Módulo | 🧑‍💼 Cajero | 👑 Administrador |
|---|---|---|
| Ventas | Punto de venta + su historial | Punto de venta + panel de administración (búsqueda global, anulación) |
| Productos | Solo consulta/búsqueda para vender | CRUD completo |
| Stock, Promociones, Sucursales, Reportes | Sin acceso | Acceso completo |

Este mapeo vive **una sola vez** en `config/permissions.ts` y `constants/navigation.ts`, y de ahí lo leen tanto el `Sidebar` (qué opciones mostrar) como el guard del dashboard (qué rutas bloquear). La decisión de negocio es simple pero estricta: **un Cajero no debe poder alterar catálogo, stock, precios ni promociones**, solo vender — por eso el permiso no se resuelve "a mano" en cada pantalla, sino en un único punto que no puede quedar desalineado.

---

## 🧩 Módulos funcionales y su lógica de negocio

### 🛒 Ventas — el módulo más complejo
- **Búsqueda de catálogo por código de barras:** los códigos del negocio tienen 13 dígitos. Se permite tipear progresivamente los últimos 6 dígitos o escanear el código completo. `lib/productSearch.ts` centraliza esta lógica y la reutilizan tanto Ventas (Cajero) como Productos (Admin), para que **ambos roles busquen exactamente igual** — evita que un producto aparezca en un lado y no en el otro por reglas de matching distintas.
- **Pago por transferencia:** `TransferenciaQRModal.tsx` muestra un QR (`qrcode.react`) y confirma el pago por **polling** contra `POST /app/pagos/transferencia`, no por webhook. Es una decisión de negocio pragmática: sin infraestructura para recibir webhooks de forma confiable, el polling garantiza que el Cajero vea la confirmación en tiempo razonable sin depender de un callback externo.
- **Ticket de venta:** se genera cuando la Venta pasa a estado `APROBADO`, y su detalle se arma directamente desde `Venta.getDetalles()` en vez de una tabla propia — porque una venta aprobada **nunca se edita** (solo se anula), así que `DetalleVentas` ya funciona como snapshot inmutable. Tener una entidad de ticket separada era redundancia sin beneficio.
- **Historial vs. Panel de Administración:** el Cajero ve su propio historial (`HistorialVentasView.tsx`); el Administrador tiene además un buscador independiente (`SaleIdSearch.tsx`) que detecta automáticamente si se ingresó un ID de venta o un número de ticket, y permite anular ventas — acción que un Cajero no tiene disponible.

### 📦 Productos y Stock
CRUD estándar, pero **Productos** es compartido conceptualmente con Ventas a través de la búsqueda por código de barras — no son módulos aislados, sino dos vistas sobre el mismo catálogo con permisos distintos.

### 🏷️ Promociones
Refleja en el frontend el modelo tipado de descuentos del backend (2x1, 3x2, 2da unidad 50%). Solo accesible por Administrador, porque afecta directamente el cálculo de totales en cada venta.

### 🏢 Sucursales
Configuración base del negocio, exclusiva de Administrador.

### 📊 Reportes
Consume agregaciones ya resueltas en el backend (ej. producto más vendido). Es el único módulo donde el frontend impuso su propio contrato de datos, por ser información analítica y no una entidad transaccional.

---

## ⚠️ Contratos con el backend: puntos delicados

Estos son los puntos donde el frontend tuvo que ajustarse a decisiones o restricciones puntuales del backend, y por qué:

- **`VentaResumenDTO` incluye `metodoPago`, `estadoPago` y `totalDescuento`** directamente, para que el Historial de Ventas no tenga que resolverlos con requests adicionales por cada fila (evita N+1 desde el frontend).
- **Nombres de campo no siempre son consistentes:** el preview del carrito espera `listDetalle`, mientras que la creación de venta espera `listaDetalle`. Los `types/` reflejan esta diferencia tal cual la espera el backend — no se "prolijó" en el frontend para no romper el contrato real.
- **`EstadoPago.ANULADO`** debe contemplarse en toda vista que muestre el estado de una venta: determina si corresponde ofrecer la acción "Anular Venta" o si ya no aplica.

---

## 🚨 Manejo de errores

Toda respuesta de error del backend pasa por `lib/http-error.ts`, que la normaliza antes de llegar a los hooks. Los hooks de React Query exponen ese error a los componentes, que lo muestran vía `react-hot-toast`. Esto evita manejo ad-hoc por pantalla y mantiene un único punto de traducción entre errores HTTP y mensajes que el usuario final entiende.

---

# 🌐 Backend

El backend funciona como una aplicación independiente que conecta con este Frontend.

Actualmente el proyecto cuenta con un backend desarrollado utilizando tecnologías del ecosistema Java/Spring Boot.

Repositorio:

👉 **Sistema de Gestión POS — Backend**

https://github.com/santiagozerda/SistemaPOS-Backend

La arquitectura desacoplada permite evolucionar o reemplazar el frontend sin modificar la lógica principal del backend.

---
