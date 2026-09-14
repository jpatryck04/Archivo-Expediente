# 🗂️ Archivo de Expedientes

Sistema web para administrar, consultar y controlar la trazabilidad de expedientes físicos de la **Dirección de Habilitación y Servicios de Salud**.

La aplicación permite registrar expedientes, ubicarlos dentro de racks, controlar entradas y salidas, generar códigos QR para las ubicaciones y administrar el acceso de los usuarios según su rol.

## ✨ Funcionalidades

### 📁 Gestión de expedientes

- Crear expedientes con código personalizado.
- Usar códigos como `A00030`, `EXP-001`, `DOC-2026-45` o cualquier formato válido.
- Editar información del expediente según permisos.
- Buscar por código, nombre o descripción.
- Consultar el estado y la ubicación actual.
- Importar expedientes desde archivos CSV.
- Exportar información cuando el rol lo permite.

### 🗄️ Racks y ubicaciones

- Administrar racks y niveles desde la base de datos.
- Consultar la capacidad y ocupación de cada ubicación.
- La cantidad de racks, niveles y ubicaciones no está fijada en la interfaz.
- Cada ubicación tiene un código único y un código QR.
- Consultar los expedientes almacenados en cada ubicación.

### 🔄 Movimientos y trazabilidad

- Registrar entrada de expedientes.
- Registrar salida de expedientes.
- Registrar devolución.
- Registrar traslado entre ubicaciones.
- Guardar usuario, fecha, ubicación anterior y ubicación nueva.
- Consultar el historial de movimientos según los permisos del usuario.

### 📷 Códigos QR

- Generar códigos QR para las ubicaciones.
- Generar etiquetas para todos los racks, un rack o una ubicación.
- Configurar el tamaño del QR y el número de columnas.
- Imprimir etiquetas.
- Escanear códigos QR desde la cámara del teléfono.
- Consultar una ubicación directamente después de escanearla.
- Diseño responsive para celular, tablet y escritorio.

### 👥 Administración de usuarios

Desde el panel de administración se puede:

- Crear usuarios con nombre, correo, contraseña y rol.
- Cambiar el rol de un usuario.
- Suspender usuarios.
- Reactivar usuarios suspendidos.
- Eliminar usuarios permanentemente.
- Ver el estado del usuario con etiquetas visuales.
- Impedir que un administrador se suspenda o elimine a sí mismo.

## 🔐 Roles y permisos

| Funcionalidad | Administrador | Archivista | Consulta |
|---|:---:|:---:|:---:|
| Ver expedientes | ✅ | ✅ | ✅ |
| Crear y editar expedientes | ✅ | ✅ | ❌ |
| Registrar movimientos | ✅ | ✅ | ❌ |
| Ver historial de movimientos | ✅ | ✅ | ❌ |
| Consultar racks y ubicaciones | ✅ | ✅ | ✅ |
| Generar o imprimir códigos QR | ✅ | ❌ | ❌ |
| Importar expedientes | ✅ | ✅ | ❌ |
| Exportar información | ✅ | ✅ | ❌ |
| Ver auditoría | ✅ | ✅ | ❌ |
| Administrar usuarios | ✅ | ❌ | ❌ |
| Suspender o eliminar usuarios | ✅ | ❌ | ❌ |

### 👁️ Perfil Consulta

El perfil `consulta` funciona exclusivamente como usuario de lectura:

- Puede consultar expedientes, racks y ubicaciones.
- Puede escanear códigos QR para consultar información.
- No puede registrar, editar, importar, exportar ni eliminar información.
- No puede ver el historial de movimientos.
- No puede generar ni imprimir códigos QR.
- No puede administrar usuarios.

## 🛡️ Seguridad

- Autenticación mediante Supabase Auth.
- Políticas Row Level Security (RLS) en la base de datos.
- Protección de rutas según el rol del usuario.
- Validación de formularios con Zod.
- Funciones RPC para operaciones críticas y atómicas.
- Funciones Edge para crear, suspender, reactivar y eliminar usuarios.
- La clave `SUPABASE_SERVICE_ROLE_KEY` nunca se expone al frontend.
- Las cuentas suspendidas reciben un mensaje específico al intentar iniciar sesión.
- Los usuarios creados desde el panel administrativo pueden tener su nombre bloqueado desde Configuración.

## 🧰 Tecnologías

### Frontend

- ⚛️ React 19
- 🟦 TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS 4
- 🧩 Radix UI
- 🔄 TanStack React Query
- 📝 React Hook Form
- ✅ Zod
- 🧭 React Router
- 🎯 Lucide React

### QR, archivos y reportes

- `qrcode.react` para generar códigos QR.
- `html5-qrcode` para escanear códigos desde la cámara.
- `papaparse` para importar y exportar CSV.
- `jspdf` y `jspdf-autotable` para documentos y reportes.
- `react-to-print` para imprimir etiquetas.
- `html2canvas` para capturas y exportación visual.

### Backend

- Supabase Auth.
- PostgreSQL.
- Row Level Security.
- Funciones RPC.
- Supabase Edge Functions.

## 📋 Requisitos

- Node.js 18 o superior.
- npm 9 o superior.
- Un proyecto de Supabase.
- Supabase CLI para aplicar migraciones y desplegar funciones.
- Docker únicamente si se desea ejecutar Supabase de forma local.

## 🚀 Instalación

### 1. Clonar el proyecto

```bash
git clone <url-del-repositorio>
cd archivo-expedientes
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables públicas

Crear un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon
VITE_APP_URL=http://localhost:5173
```

⚠️ Nunca agregues `SUPABASE_SERVICE_ROLE_KEY` a `.env.local`, a variables `VITE_*` ni al código del navegador.

### 4. Vincular Supabase

```bash
supabase login
supabase projects list
supabase link --project-ref TU_PROJECT_REF
```

### 5. Aplicar la base de datos

```bash
supabase db push
```

Las migraciones crean tablas, permisos, funciones RPC y reglas de seguridad. La carpeta `supabase/` se mantiene fuera del repositorio público según la configuración actual de `.gitignore`; debe conservarse en un entorno privado o administrarse por separado.

### 6. Desplegar funciones administrativas

```bash
supabase functions deploy admin-create-user
supabase functions deploy admin-manage-user
```

Estas funciones permiten crear, suspender, reactivar y eliminar usuarios desde el panel de administración.

### 7. Iniciar el proyecto

```bash
npm run dev
```

Abrir:

```text
http://localhost:5173
```

## 📦 Scripts disponibles

```bash
npm run dev       # Inicia el servidor de desarrollo
npm run build     # Compila TypeScript y genera el bundle de producción
npm run lint      # Ejecuta ESLint
npm run preview   # Sirve localmente el build de producción
```

## 🏗️ Estructura del proyecto

```text
src/
├── app/                    # Providers y configuración de rutas
├── components/
│   ├── dashboard/          # Widgets del dashboard
│   ├── layout/             # Sidebar, header y layout principal
│   ├── shared/             # Componentes reutilizables
│   └── ui/                 # Componentes base de interfaz
├── features/
│   ├── audit/              # Auditoría de ubicaciones
│   ├── auth/               # Autenticación y sesión
│   ├── dashboard/          # Estadísticas del dashboard
│   ├── expedientes/        # Expedientes y formularios
│   ├── import/             # Importación CSV
│   ├── locations/          # Ubicaciones
│   ├── movements/          # Entradas, salidas y traslados
│   ├── qr-generator/       # Generación e impresión QR
│   ├── racks/              # Racks y niveles
│   └── scanner/            # Escaneo de códigos QR
├── lib/                    # Supabase, permisos y utilidades
├── pages/                  # Vistas principales
├── styles/                 # Estilos adicionales
└── types/                  # Tipos TypeScript
```

## ☁️ Despliegue en Vercel

1. Subir el proyecto a GitHub.
2. Importar el repositorio en Vercel.
3. Configurar estas variables de entorno en Vercel:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon
VITE_APP_URL=https://tu-dominio.vercel.app
```

4. Ejecutar el despliegue.
5. Verificar que las funciones Edge estén desplegadas en Supabase.

## 🧪 Verificaciones antes de publicar

```bash
npm run lint
npm run build
```

Antes de publicar, confirma que:

- `.env.local` no esté incluido en Git.
- Las claves secretas no estén en el frontend.
- Las funciones Edge estén desplegadas.
- Las migraciones estén aplicadas en Supabase.
- Las políticas RLS estén activas.

## 📄 Licencia

Uso institucional para la gestión y trazabilidad de expedientes físicos de la **Dirección de Habilitación y Servicios de Salud**.

## 🤝 Soporte

Para soporte, cambios de permisos o recuperación de usuarios suspendidos, contactar al administrador del sistema.
