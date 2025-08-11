// Script para verificar datos en localStorage
console.log('🔍 Verificando datos en localStorage...\n');

// Verificar actividades
const activities = localStorage.getItem('activities');
if (activities) {
  const parsedActivities = JSON.parse(activities);
  console.log(`📊 Actividades en localStorage: ${parsedActivities.length}`);
  console.log('📋 Actividades:');
  parsedActivities.forEach((activity, index) => {
    console.log(`${index + 1}. ID: ${activity.id}`);
    console.log(`   Nombre: ${activity.name || activity.title}`);
    console.log(`   Descripción: ${activity.description?.substring(0, 50)}...`);
    console.log('');
  });
} else {
  console.log('⚠️  No hay actividades en localStorage');
}

// Verificar reservas
const bookings = localStorage.getItem('bookings');
if (bookings) {
  const parsedBookings = JSON.parse(bookings);
  console.log(`📊 Reservas en localStorage: ${parsedBookings.length}`);
} else {
  console.log('⚠️  No hay reservas en localStorage');
}

// Verificar clientes
const customers = localStorage.getItem('customers');
if (customers) {
  const parsedCustomers = JSON.parse(customers);
  console.log(`📊 Clientes en localStorage: ${parsedCustomers.length}`);
} else {
  console.log('⚠️  No hay clientes en localStorage');
}

console.log('\n✅ Verificación completada');
