# Nombre del programa: Impulsa tu futuro
# Copyright (C) 2025 - Autores:
# Merino Peña Kevin Ariel
# Ortíz Montiel Diego Iain
# Rodríguez Dimayuga Laura Itzel
# Sosa Romo Juan Mario
# Vargas Campos Miguel Angel
#
# Este archivo se distribuye bajo los términos de la Licencia Pública General de GNU v3.
# Consulte <https://www.gnu.org/licenses/> para más detalles.

# Utilizar la imagen oficial de Node
FROM node:20
# Crear directorio de la aplicación
WORKDIR /app

# Copiar los archivos de definición de dependencias
COPY package*.json ./

# Instalar dependencias y corregir vulnerabilidades
RUN npm install
RUN npm audit fix

# Generar el archivo de configuración de Tailwind
RUN npx tailwindcss init -p

# Copiar el resto del código
COPY . .

# Ejecutar la configuración de Tailwind solo si no existe el archivo tailwind.config.js
RUN [ ! -f tailwind.config.js ] && npx tailwindcss init -p || echo "Tailwind ya configurado"

# Exponer el puerto que use Vite (5173 o el que hayas configurado)
EXPOSE 3000

# Comando para levantar el servidor de desarrollo de Vite
CMD ["npm", "run", "dev"]
