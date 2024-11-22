#!/bin/bash

# DO NOT PUSH THIS FILE TO GITHUB
# This file contains sensitive information and should be kept private

# TODO: Set your PostgreSQL URI - Use the External Database URL from the Render dashboard
PG_URI="postgresql://users_db_8f79_user:c2NATOTFsrsIr0DOJSioD9fSOd1Xf8cE@dpg-ct0b9e9opnds73aaqelg-a.oregon-postgres.render.com/users_db_8f79"

# Execute each .sql file in the directory
for file in src/init_data/*.sql; do
    echo "Executing $file..."
    psql $PG_URI -f "$file"
done