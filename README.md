# 🏝️ Punta Cana Excursiones - Dashboard Admin

Panel de administración moderno y completo para gestionar excursiones y actividades en Punta Cana. Construido con React, TypeScript, Tailwind CSS y las tecnologías más avanzadas.

## ✨ Características Principales

### 🎯 Dashboard de Administración
- **Panel de control** con métricas en tiempo real
- **Gestión completa de actividades** (CRUD)
- **Formularios avanzados** con validación
- **Subida de imágenes** drag & drop
- **Filtros y búsqueda** inteligente
- **Charts y estadísticas** visuales
- **Responsive design** móvil-first

### 🚀 Funcionalidades del Admin

#### 📊 Dashboard Principal
- Tarjetas de métricas (actividades, reservas, ingresos, rating)
- Gráfico de rendimiento configurable (7 días, 30 días, 90 días)
- Lista de reservas recientes
- Top actividades más populares
- Feed de actividad en tiempo real
- Acciones rápidas

#### 🗺️ Gestión de Actividades
- **Crear actividades** con formulario completo
- **Editar actividades** existentes
- **Eliminar actividades** con confirmación
- **Subir múltiples imágenes** (drag & drop)
- **Categorización** avanzada
- **Sistema de etiquetas**
- **Estados** (activa/inactiva, destacada)
- **Filtros y ordenamiento**

#### 📋 Formulario de Actividades
- **Información básica**: título, descripción, precio
- **Detalles técnicos**: duración, capacidad, ubicación
- **Descripciones**: corta y completa
- **Listas dinámicas**: qué incluye, qué no incluye, requisitos
- **Gestión de imágenes**: múltiples imágenes con preview
- **Sistema de etiquetas**: agregar/quitar tags
- **Configuración**: actividad destacada, estado activo
- **Validación completa** con mensajes de error

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool ultrarrápido)
- **Tailwind CSS** (styling utility-first)
- **Framer Motion** (animaciones fluidas)
- **React Router** (navegación SPA)
- **React Hook Form** + **Zod** (formularios y validación)
- **React Query** (gestión de estado del servidor)
- **Lucide React** (iconografía moderna)

### Herramientas de Desarrollo
- **ESLint** + **TypeScript ESLint**
- **PostCSS** + **Autoprefixer**
- **Hot Module Replacement** (HMR)
- **Path Aliases** para imports limpios

## 🚀 Instalación y Uso

### Prerequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

1. **Clona el repositorio**
```bash
git clone <repository-url>
cd punta-cana-excursiones
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

4. **Abre tu navegador**
```
http://localhost:3000
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Preview de la build de producción
npm run lint         # Ejecuta linter

# Base de datos (cuando se implemente)
npm run db:generate  # Genera cliente Prisma
npm run db:push      # Push schema a la DB
npm run db:migrate   # Ejecuta migraciones
npm run db:seed      # Seed de datos de prueba

# Servidor (cuando se implemente)
npm run server       # Inicia servidor backend
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   └── admin/           # Componentes específicos del admin
│       ├── AdminLayout.tsx      # Layout principal del admin
│       ├── ActivityCard.tsx     # Tarjeta de actividad
│       ├── ActivityForm.tsx     # Formulario de actividades
│       ├── ConfirmDialog.tsx    # Modal de confirmación
│       ├── DashboardCard.tsx    # Tarjeta de métricas
│       ├── PerformanceChart.tsx # Gráfico de rendimiento
│       ├── RecentBookings.tsx   # Lista de reservas
│       └── TopActivities.tsx    # Top actividades
├── pages/               # Páginas de la aplicación
│   └── admin/          # Páginas del admin
│       ├── Dashboard.tsx        # Dashboard principal
│       └── Activities.tsx       # Gestión de actividades
├── hooks/              # Custom hooks
├── utils/              # Utilidades y helpers
├── types/              # Definiciones de TypeScript
├── api/                # Servicios de API
├── assets/             # Recursos estáticos
├── App.tsx             # Componente raíz
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🎨 Características de Diseño

### Colores Personalizados
- **Caribbean**: Azul-turquesa tropical (#14b8a6 - #06b6d4)
- **Sunset**: Naranja-amarillo atardecer (#f97316 - #fbbf24)
- **Paleta completa** de grises y colores de estado

### Animaciones
- **Framer Motion** para transiciones suaves
- **Hover effects** en tarjetas y botones
- **Loading states** animados
- **Slide-in animations** para modales

### Componentes UI
- **Tarjetas con sombras** suaves y medianas
- **Botones** con estados hover y focus
- **Formularios** con validación visual
- **Modales** con backdrop blur
- **Charts** interactivos con tooltips

## 🔧 Funcionalidades Implementadas

### ✅ Completado
- [x] Configuración de proyecto con Vite + React + TypeScript
- [x] Dashboard principal con métricas y gráficos
- [x] Gestión completa de actividades (CRUD)
- [x] Formulario avanzado para actividades
- [x] Sistema de subida de imágenes
- [x] Filtros y búsqueda de actividades
- [x] Componentes UI reutilizables
- [x] Diseño responsive
- [x] Animaciones y transiciones

### 🚧 En Desarrollo
- [ ] Sistema de autenticación
- [ ] Gestión de reservas
- [ ] Panel de analytics avanzado
- [ ] Sistema de emails
- [ ] Integración de pagos
- [ ] Base de datos y API

### 📋 Por Implementar
- [ ] Gestión de clientes
- [ ] Reportes avanzados
- [ ] Configuración del sistema
- [ ] Notificaciones en tiempo real
- [ ] Sistema de permisos
- [ ] Backup y export de datos

## 🎯 Características Destacadas

### Formulario de Actividades
- **Validación completa** con mensajes específicos
- **Subida múltiple de imágenes** con preview
- **Listas dinámicas** para incluidos/no incluidos/requisitos
- **Sistema de etiquetas** con autocompletado
- **Categorización** por tipo de actividad
- **Estados configurables** (activa, destacada)

### Dashboard Interactivo
- **Métricas en tiempo real** con tendencias
- **Gráficos configurables** por período
- **Acciones rápidas** para tareas comunes
- **Feed de actividad** reciente
- **Top actividades** con estadísticas

### Experiencia de Usuario
- **Navegación intuitiva** con sidebar responsive
- **Búsqueda global** en header
- **Notificaciones** visuales
- **Confirmaciones** para acciones destructivas
- **Loading states** en todas las operaciones

## 📱 Responsive Design

- **Mobile-first** approach
- **Sidebar colapsable** en móviles
- **Grids responsivos** que se adaptan
- **Touch-friendly** interactions
- **Optimizado** para tablets y desktop

## 🔐 Próximas Funcionalidades

### Sistema de Emails
- Confirmación automática de reservas
- Recibos de compra personalizados
- Recordatorios de actividades
- Newsletter y promociones

### Panel de Analytics
- Métricas avanzadas de rendimiento
- Análisis de tendencias
- Reportes exportables
- Comparativas período a período

### Gestión de Reservas
- Calendar view de disponibilidad
- Estados de reserva automatizados
- Comunicación con clientes
- Sistema de check-in/check-out

## 🤝 Contribución

El proyecto está estructurado de manera modular para facilitar el desarrollo y mantenimiento. Cada componente tiene una responsabilidad específica y utiliza TypeScript para garantizar la seguridad de tipos.

## 📄 Licencia

Proyecto privado para Punta Cana Excursiones.

---

**Desarrollado con ❤️ para ofrecer la mejor experiencia de gestión de excursiones en Punta Cana**
