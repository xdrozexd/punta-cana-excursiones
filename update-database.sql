-- Script para agregar los campos faltantes a la tabla Activity
-- Ejecutar este script en la base de datos PostgreSQL

-- Agregar campos adicionales para el frontend
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "shortDescription" TEXT;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "meetingPoint" TEXT;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "included" TEXT[] DEFAULT '{}';
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "notIncluded" TEXT[] DEFAULT '{}';
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "requirements" TEXT[] DEFAULT '{}';
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "highlights" TEXT[] DEFAULT '{}';
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT '{}';
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT '{}';
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "languages" TEXT[] DEFAULT '{"Español"}';
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "availability" TEXT[] DEFAULT '{"Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"}';
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "startTime" TEXT[] DEFAULT '{"9:00 AM"}';
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "originalPrice" DOUBLE PRECISION;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "minAge" INTEGER DEFAULT 0;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "pickupIncluded" BOOLEAN DEFAULT false;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "itinerary" JSONB;

-- Comentarios para documentar los campos
COMMENT ON COLUMN "Activity"."shortDescription" IS 'Descripción corta para las tarjetas';
COMMENT ON COLUMN "Activity"."meetingPoint" IS 'Punto de encuentro específico';
COMMENT ON COLUMN "Activity"."included" IS 'Lo que está incluido en la actividad';
COMMENT ON COLUMN "Activity"."notIncluded" IS 'Lo que NO está incluido en la actividad';
COMMENT ON COLUMN "Activity"."requirements" IS 'Requisitos para participar';
COMMENT ON COLUMN "Activity"."highlights" IS 'Puntos destacados de la actividad';
COMMENT ON COLUMN "Activity"."tags" IS 'Etiquetas para categorización';
COMMENT ON COLUMN "Activity"."images" IS 'Múltiples imágenes de la actividad';
COMMENT ON COLUMN "Activity"."languages" IS 'Idiomas disponibles';
COMMENT ON COLUMN "Activity"."availability" IS 'Días disponibles';
COMMENT ON COLUMN "Activity"."startTime" IS 'Horarios de inicio';
COMMENT ON COLUMN "Activity"."originalPrice" IS 'Precio original (para descuentos)';
COMMENT ON COLUMN "Activity"."minAge" IS 'Edad mínima requerida';
COMMENT ON COLUMN "Activity"."pickupIncluded" IS 'Incluye recogida en hotel';
COMMENT ON COLUMN "Activity"."itinerary" IS 'Itinerario detallado en formato JSON';
