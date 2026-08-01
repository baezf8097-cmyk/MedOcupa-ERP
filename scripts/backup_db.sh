#!/bin/bash
# ==============================================================================
# MedOcupa ERP - Script de Respaldo Automático de Base de Datos PostgreSQL
# ==============================================================================
# Este script realiza un respaldo completo (pg_dump), comprime la salida (.tar.gz),
# elimina respaldos locales con antigüedad superior a 30 días y opcionalmente
# sincroniza con almacenamiento seguro en la nube (GCS / AWS S3).
# ==============================================================================

set -e

# Configuración por variables de entorno o valores por defecto
DB_NAME="${POSTGRES_DB:-medocupa_db}"
DB_USER="${POSTGRES_USER:-medocupa_user}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/medocupa}"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/medocupa_backup_${TIMESTAMP}.sql"
GZ_FILE="${BACKUP_FILE}.gz"

# Crear directorio de respaldos si no existe
mkdir -p "$BACKUP_DIR"

echo "=========================================================="
echo "📦 Iniciando Backup MedOcupa ERP: $TIMESTAMP"
echo "=========================================================="

# Exportar contraseña desde entorno si existe
if [ -n "$POSTGRES_PASSWORD" ]; then
  export PGPASSWORD="$POSTGRES_PASSWORD"
fi

# 1. Ejecutar pg_dump
echo "--> Extrayendo estructura y datos de la BD $DB_NAME..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -F c -b -v -f "$BACKUP_FILE" "$DB_NAME"

# 2. Comprimir respaldo
echo "--> Comprimiendo archivo de respaldo..."
gzip -f "$BACKUP_FILE"

echo "✅ Backup local creado con éxito: $GZ_FILE"

# 3. Limpieza de respaldos antiguos (> 30 días)
echo "--> Limpiando respaldos locales con más de $RETENTION_DAYS días..."
find "$BACKUP_DIR" -name "medocupa_backup_*.sql.gz" -mtime +$RETENTION_DAYS -exec rm -f {} \;

# 4. Sincronización opcional a la nube (Google Cloud Storage / AWS S3)
if [ -n "$GCS_BACKUP_BUCKET" ]; then
  echo "--> Sincronizando respaldo a Google Cloud Storage ($GCS_BACKUP_BUCKET)..."
  gsutil cp "$GZ_FILE" "gs://$GCS_BACKUP_BUCKET/backups/medocupa/"
fi

if [ -n "$S3_BACKUP_BUCKET" ]; then
  echo "--> Sincronizando respaldo a Amazon S3 ($S3_BACKUP_BUCKET)..."
  aws s3 cp "$GZ_FILE" "s3://$S3_BACKUP_BUCKET/backups/medocupa/"
fi

echo "=========================================================="
echo "🎉 Proceso de Respaldo Finalizado Satisfactoriamente."
echo "=========================================================="
