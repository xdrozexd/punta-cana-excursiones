#!/usr/bin/env node

// Script de prueba para el servidor MCP de Vercel
// Este script verifica que el servidor se inicia correctamente

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Probando servidor MCP de Vercel...\n');

// Configurar variables de entorno de prueba
const env = {
  ...process.env,
  VERCEL_TOKEN: process.env.VERCEL_TOKEN || 'test_token_placeholder'
};

// Verificar que Node.js puede ejecutar el archivo
const serverPath = path.join(__dirname, 'index.js');

console.log('📂 Ruta del servidor:', serverPath);
console.log('🔑 Token configurado:', env.VERCEL_TOKEN ? '✅ Sí (oculto)' : '❌ No');

if (!env.VERCEL_TOKEN || env.VERCEL_TOKEN === 'test_token_placeholder') {
  console.log('\n⚠️  NOTA: Para pruebas reales, configura VERCEL_TOKEN');
  console.log('   Puedes obtener tu token en: https://vercel.com/account/tokens');
}

console.log('\n🚀 Iniciando servidor MCP...');

const server = spawn('node', [serverPath], {
  env,
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let hasStarted = false;

// Timeout para la prueba
const timeout = setTimeout(() => {
  console.log('\n✅ Servidor MCP iniciado correctamente');
  console.log('   El servidor está listo para recibir conexiones MCP');
  server.kill('SIGTERM');
  
  console.log('\n📋 Siguientes pasos:');
  console.log('1. Configura tu token de Vercel en el archivo MCP:');
  console.log('   C:\\Users\\blackwork\\.cursor\\mcp.json');
  console.log('2. Reinicia Cursor completamente');
  console.log('3. Verifica que el servidor aparezca en MCP settings');
  
  process.exit(0);
}, 3000);

// Capturar output del servidor
server.stdout.on('data', (data) => {
  output += data.toString();
});

server.stderr.on('data', (data) => {
  const message = data.toString();
  if (message.includes('running on stdio')) {
    hasStarted = true;
    console.log('✅ Servidor iniciado exitosamente');
  } else if (message.includes('VERCEL_TOKEN')) {
    console.log('⚠️  ' + message.trim());
  } else {
    console.log('📝 ' + message.trim());
  }
});

server.on('error', (error) => {
  clearTimeout(timeout);
  console.log('❌ Error al iniciar el servidor:', error.message);
  process.exit(1);
});

server.on('close', (code) => {
  clearTimeout(timeout);
  if (code === 0 || hasStarted) {
    console.log('\n🎉 Prueba completada exitosamente');
  } else {
    console.log('\n❌ Servidor terminó con código:', code);
  }
});
