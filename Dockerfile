# Elige la imagen de Ubuntu
FROM node:12


# Pasa módulos de node (node_modules) para caché
ADD package.json /src/package.json

# Elige el directorio de trabajo
WORKDIR /src

EXPOSE 8080 3600 

# Instala dependencias
RUN npm install

# Copia del directorio donde está el código al directorio dentro del container donde se va a ejecutar
COPY [".", "/src"]

# Ejecuta la aplicación con el parámetro
CMD ["node", "/src/server.js"]
