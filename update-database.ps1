# Script para actualizar la base de datos con los nuevos campos
# Requiere que PostgreSQL esté instalado y configurado

Write-Host "Actualizando base de datos con nuevos campos..." -ForegroundColor Green

# Leer las variables de entorno
$envContent = Get-Content .env
$databaseUrl = ""
foreach ($line in $envContent) {
    if ($line.StartsWith("DATABASE_URL=")) {
        $databaseUrl = $line.Substring(13)
        break
    }
}

if (-not $databaseUrl) {
    Write-Host "Error: No se encontró DATABASE_URL en el archivo .env" -ForegroundColor Red
    exit 1
}

# Extraer información de la URL de la base de datos
# Formato esperado: postgresql://username:password@host:port/database
$databaseUrl = $databaseUrl.Trim('"')
$parts = $databaseUrl.Replace("postgresql://", "").Split("@")
$credentials = $parts[0].Split(":")
$hostPort = $parts[1].Split("/")
$hostPortParts = $hostPort[0].Split(":")

$username = $credentials[0]
$password = $credentials[1]
$dbHost = $hostPortParts[0]
$port = $hostPortParts[1]
$database = $hostPort[1]

Write-Host "Conectando a la base de datos: $database en ${dbHost}:${port}" -ForegroundColor Yellow

# Crear archivo temporal con el SQL
$sqlContent = Get-Content update-database.sql -Raw

# Ejecutar el SQL usando psql
try {
    $env:PGPASSWORD = $password
    $sqlContent | psql -h $dbHost -p $port -U $username -d $database
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Base de datos actualizada correctamente!" -ForegroundColor Green
    } else {
        Write-Host "Error al actualizar la base de datos" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
} finally {
    $env:PGPASSWORD = ""
}

Write-Host "Proceso completado." -ForegroundColor Green
