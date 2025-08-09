# Script para configurar Vercel CLI en Windows
Write-Host "🚀 Configurando Vercel CLI..." -ForegroundColor Green

# Instalar Vercel CLI globalmente
Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
npm install -g vercel

# Verificar instalación
Write-Host "✅ Verificando instalación..." -ForegroundColor Yellow
vercel --version

Write-Host ""
Write-Host "🎉 ¡Vercel CLI instalado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ejecuta: vercel login" -ForegroundColor White
Write-Host "2. Ejecuta: vercel" -ForegroundColor White
Write-Host "3. Sigue las instrucciones para vincular el proyecto" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Para desplegar:" -ForegroundColor Cyan
Write-Host "- Producción: npm run deploy" -ForegroundColor White
Write-Host "- Preview: npm run deploy:preview" -ForegroundColor White
