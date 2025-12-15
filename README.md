# FakeStore Manager

Sistema de gestión de productos desarrollado con Next.js y React para consumir el API Gateway de FakeStore.

## 🚀 Características

- **Lista de productos**: Visualización en tabla con opciones de edición y eliminación
- **Crear producto**: Formulario para agregar nuevos productos
- **Editar producto**: Formulario para modificar productos existentes
- **Validación**: Validación en cliente y manejo de errores del backend
- **TypeScript**: Tipado fuerte para mejor desarrollo
- **Tailwind CSS**: Estilos modernos y responsivos

## 🛠️ Tecnologías

- **Next.js 16** - Framework de React
- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **ESLint** - Linter de código

## 📋 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Página principal
│   ├── products/
│   │   ├── page.tsx          # Lista de productos
│   │   ├── new/
│   │   │   └── page.tsx      # Crear producto
│   │   └── [id]/
│   │       └── page.tsx      # Editar producto
├── services/
│   └── products.service.ts   # Cliente API para productos
└── types/
    └── api.ts                # Tipos TypeScript de la API
```

## ⚙️ Configuración

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar la variable de entorno del API. Crear archivo `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

## 🚀 Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📦 Build para Producción

```bash
npm run build
npm start
```

## 🔌 API Backend

El frontend consume el siguiente API Gateway:

### Endpoints

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/{id}` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

### Estructura de Respuesta

```typescript
{
  isSuccess: boolean;
  data?: T;
  message?: string;
  errores?: ValidationFailure[];
  errorCode: ErrorCode;
}
```

### Modelo de Producto

```typescript
{
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
```

## ✅ Validaciones

El formulario incluye validaciones en cliente:
- Nombre: Requerido
- Precio: Requerido, debe ser mayor a 0
- Descripción: Requerido
- Categoría: Requerido
- Imagen URL: Requerido

Los errores del backend (FluentValidation) se muestran automáticamente en los campos correspondientes.

## 📝 Comandos Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Crear build de producción
- `npm run start` - Iniciar servidor de producción
- `npm run lint` - Ejecutar ESLint

## 👤 Autor

Desarrollado para gestionar productos del FakeStore API Gateway.

---

## 🐳 Docker

### Configuración de Variables de Entorno

Las variables de entorno están configuradas directamente en `docker-compose.yml`:

- `API_URL`: URL interna para Server Components (http://backend-api:8080/api)
- `NEXT_PUBLIC_API_URL`: URL externa para Client Components (http://localhost:5127/api)

**Ventajas:**
- ✅ No requiere archivos `.env` adicionales
- ✅ Configuración portable en un solo archivo
- ✅ Fácil distribución para otros entornos

### Docker Compose (Recomendado - Backend + Frontend)

```bash
# Iniciar ambos servicios (Backend API + Frontend)
docker compose up -d

# Ver logs
docker compose logs -f

# Ver logs solo del frontend
docker compose logs -f nextjs-app

# Ver logs solo del backend
docker compose logs -f backend-api

# Detener servicios
docker compose down
```

**Servicios disponibles:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5127

### Configuración de red en Docker

El `docker-compose.yml` configura:
- Red compartida `app-network` entre frontend y backend
- El frontend (Server Components) se comunica internamente con `http://backend-api:8080/api`
- El navegador (Client Components) se comunica con `http://localhost:5127/api`

