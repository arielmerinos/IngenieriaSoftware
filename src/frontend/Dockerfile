# Utilizar la imagen oficial de Node
FROM node:18

# Crear directorio de la aplicación
WORKDIR /app

# Copiar los archivos de definición de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

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
