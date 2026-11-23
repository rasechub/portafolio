# Imagen base ligera con servidor web Nginx sobre Alpine Linux
FROM nginx:alpine

# Etiquetas de metadatos
LABEL maintainer="Portfolio Developer"
LABEL description="Servidor Nginx para portafolio web personal 100% frontend"

# Copiar archivos estáticos del portafolio al directorio raíz de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto HTTP estándar
EXPOSE 80

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
