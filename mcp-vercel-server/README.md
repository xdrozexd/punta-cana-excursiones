# 🚀 MCP Server para Vercel

Servidor MCP (Model Context Protocol) que permite gestionar proyectos y despliegues de Vercel directamente desde Cursor.

## ✨ Características

- 📋 **Listar proyectos** - Ve todos tus proyectos de Vercel
- 🚀 **Ver despliegues** - Obtén información de despliegues por proyecto
- 📊 **Información detallada** - Detalles completos de proyectos específicos
- 🔧 **Gestión de despliegues** - Orientación para crear nuevos despliegues

## 🛠️ Configuración

### 1. Obtener Token de Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/account/tokens)
2. Crea un nuevo token con los permisos necesarios
3. Copia el token generado

### 2. Configurar el Token

Actualiza el archivo `C:\Users\blackwork\.cursor\mcp.json` y agrega tu token de Vercel:

```json
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": [
        "C:\\Users\\blackwork\\Desktop\\miapp\\mcp-vercel-server\\index.js"
      ],
      "env": {
        "VERCEL_TOKEN": "TU_TOKEN_AQUI"
      }
    }
  }
}
```

### 3. Reiniciar Cursor

1. Cierra Cursor completamente
2. Espera 5 segundos
3. Abre Cursor nuevamente
4. Ve a `Configuración` → `Features` → `MCP`
5. Verifica que el servidor "vercel" aparezca listado

## 🎯 Herramientas Disponibles

### `get_projects`
Obtiene la lista de todos tus proyectos en Vercel.

**Parámetros:** Ninguno

**Ejemplo de uso:**
```
Muéstrame todos mis proyectos de Vercel
```

### `get_deployments`
Obtiene la lista de despliegues, opcionalmente filtrados por proyecto.

**Parámetros:**
- `projectId` (opcional): ID del proyecto específico
- `limit` (opcional): Número máximo de despliegues (default: 10)

**Ejemplo de uso:**
```
Muéstrame los últimos 5 despliegues del proyecto ABC123
```

### `get_project_info`
Obtiene información detallada de un proyecto específico.

**Parámetros:**
- `projectId` (requerido): ID del proyecto

**Ejemplo de uso:**
```
Dame información detallada del proyecto ABC123
```

### `create_deployment`
Proporciona orientación para crear un nuevo despliegue.

**Parámetros:**
- `projectId` (requerido): ID del proyecto
- `target` (opcional): "production" o "preview" (default: "preview")

**Ejemplo de uso:**
```
Quiero crear un despliegue de producción para el proyecto ABC123
```

## 📝 Ejemplos de Uso

### Listar todos los proyectos
```
Cursor: Muéstrame todos mis proyectos de Vercel
```

### Ver despliegues recientes
```
Cursor: ¿Cuáles son los últimos 10 despliegues de mi proyecto punta-cana-excursiones?
```

### Información del proyecto
```
Cursor: Dame información completa del proyecto con ID prj_abc123
```

## 🔧 Solución de Problemas

### Error: "VERCEL_TOKEN environment variable is required"
- Verifica que hayas agregado tu token de Vercel en el archivo `mcp.json`
- Reinicia Cursor después de agregar el token

### Error: "API Error: 401"
- Tu token de Vercel puede haber expirado
- Genera un nuevo token en Vercel Dashboard

### El servidor no aparece en MCP
- Verifica que la ruta al archivo `index.js` sea correcta
- Asegúrate de que Node.js esté instalado y funcionando
- Reinicia Cursor completamente

### Error: "Network Error"
- Verifica tu conexión a internet
- Revisa si hay firewalls bloqueando las solicitudes

## 🚀 Siguientes Pasos

1. **Configura tu token de Vercel** en el archivo MCP
2. **Reinicia Cursor** para cargar el servidor
3. **Prueba las herramientas** pidiendo información de tus proyectos
4. **Usa el MCP** para gestionar tus despliegues directamente desde Cursor

## 📞 Soporte

Si encuentras problemas:
1. Verifica que el token de Vercel sea válido
2. Revisa los logs en `Developer Tools` de Cursor
3. Asegúrate de que todas las dependencias estén instaladas