# Script de despliegue automatizado para Vercel
Write-Host "🚀 Iniciando despliegue en Vercel..." -ForegroundColor Green

# Verificar que Vercel CLI esté instalado
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI no encontrado. Instalando..." -ForegroundColor Red
    npm install -g vercel
}

# Construir el proyecto
Write-Host "📦 Construyendo el proyecto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build exitoso" -ForegroundColor Green
} else {
    Write-Host "❌ Error en el build" -ForegroundColor Red
    exit 1
}

# Desplegar en producción
Write-Host "🌐 Desplegando en producción..." -ForegroundColor Yellow
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 ¡Despliegue exitoso!" -ForegroundColor Green
    Write-Host "🔗 La aplicación está disponible en la URL mostrada arriba" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error en el despliegue" -ForegroundColor Red
    exit 1
}

Write-Host "✨ Proceso completado" -ForegroundColor Green
