#!/bin/bash

################################################################
# Polashtoli Store - Backup Script
# Automated backup for database and files
################################################################

BACKUP_DIR="$HOME/polashtoli-backups"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mkdir -p "$BACKUP_DIR"

echo "Creating backup..."

# Database backup
if docker ps | grep -q polashtoli-db; then
    # Docker deployment
    docker exec polashtoli-db pg_dump -U postgres polashtoli_db > "$BACKUP_DIR/db_$DATE.sql"
else
    # Local deployment
    sudo -u postgres pg_dump polashtoli_db > "$BACKUP_DIR/db_$DATE.sql"
fi

# Files backup
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" \
    --exclude='node_modules' \
    --exclude='venv' \
    --exclude='target' \
    --exclude='*.log' \
    "$PROJECT_DIR"

echo "✓ Backup complete!"
echo "Location: $BACKUP_DIR"
echo "Database: db_$DATE.sql"
echo "Files: files_$DATE.tar.gz"

# Keep only last 7 backups
cd "$BACKUP_DIR"
ls -t db_*.sql | tail -n +8 | xargs -r rm
ls -t files_*.tar.gz | tail -n +8 | xargs -r rm
