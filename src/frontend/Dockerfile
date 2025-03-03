# Utilizar la imagen oficial de Node
FROM node:18

# Crear directorio de la aplicación
WORKDIR /app

# Copiar los archivos de definición de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto que use Vite (5173 o el que hayas configurado)
EXPOSE 3000

# Comando para levantar el servidor de desarrollo de Vite
CMD ["npm", "run", "dev"]
