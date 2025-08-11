# Script simple para actualizar la base de datos
Write-Host "Actualizando base de datos con nuevos campos..." -ForegroundColor Green

# Leer el contenido del SQL
$sqlContent = Get-Content update-database.sql -Raw

# Ejecutar directamente usando la URL de conexión
try {
    # Usar la URL completa de la base de datos
    $databaseUrl = "postgresql://postgres:password@localhost:5432/punta_cana_excursiones"
    
    Write-Host "Ejecutando SQL en la base de datos..." -ForegroundColor Yellow
    
    # Ejecutar el SQL usando psql con la URL completa
    $sqlContent | psql $databaseUrl
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Base de datos actualizada correctamente!" -ForegroundColor Green
    } else {
        Write-Host "Error al actualizar la base de datos" -ForegroundColor Red
        Write-Host "Código de salida: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "Proceso completado." -ForegroundColor Green
