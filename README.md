# Docker Setup Guide

## **Docker Compose for Production**

```yaml
version: "3.8"

services:
    backend:
        image: minhaz3001/user_server:v0.0.1
        container_name: user_server
        ports:
            - 8080:8080
        environment:
            - NODE_ENV=production
            - SERVER_KEY=12345000000

    frontend:
        image: minhaz3001/user_client:latest
        container_name: user_client
        ports:
            - 80:80
        depends_on:
            - backend
```

### **Starting the Production Containers**

```bash
docker-compose up -d
```

To check logs:

```bash
docker-compose logs -f
```

To stop and remove containers:

```bash
docker-compose down
```

## **Docker Compose for Development**

```yaml
version: "3.8"

services:
    frontend:
        build:
            context: ./client
            args:
                - VITE_API_URL=${VITE_API_URL}
                - VITE_CLIENT_SECRET=${VITE_CLIENT_SECRET}
        container_name: user_client
        ports:
            - 5173:5173
        volumes:
            - ./client/:/app
            - /app/node_modules
        env_file:
            - client/.env

    backend:
        build: ./server
        container_name: user_server
        ports:
            - 8080:8080
        volumes:
            - ./server/:/app
            - /app/node_modules
        env_file:
            - server/.env
```

### **Starting the Development Containers**

```bash
docker-compose up -d
```

## **Dockerfile for Client Development**

```dockerfile
FROM node
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

## **Dockerfile for Client Production**

```dockerfile
# Build Stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Pass environment variables during build
ARG VITE_API_URL
ARG VITE_CLIENT_SECRET
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLIENT_SECRET=$VITE_CLIENT_SECRET

RUN npm run build

# Serve static files using Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## **Dockerfile for Server Development**

```dockerfile
FROM node
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]
```

## **Dockerfile for Server Production**

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]
```

## **Building Docker Images**

### **Client Production Build**

```bash
docker build -t minhaz3001/user_client -f client/Dockerfile client
```

### **Server Production Build**

```bash
docker build -t minhaz3001/user_server -f server/Dockerfile server
```

### **Client Development Build**

```bash
docker build -t minhaz3001/user_client -f client/Dockerfile client
```

### **Server Development Build**

```bash
docker build -t minhaz3001/user_server -f server/Dockerfile server
```

## **Running Development Containers Individually**

### **Client Development Container**

```bash
docker run -d --name user_client \
  -p 5173:5173 \
  -v $(pwd)/client:/app \
  -v /app/node_modules \
  minhaz3001/user_client
```

### **Server Development Container**

```bash
docker run -d --name user_server \
  -p 8080:8080 \
  -v $(pwd)/server:/app \
  -v /app/node_modules \
  --env-file $(pwd)/server/.env \
  minhaz3001/user_server
```
