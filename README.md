# Docker compose file to getting started as production:

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
            - 3000:80
        depends_on:
            - backend
```

# Docker compose file to getting started as development:

```yaml
version: "3.8"

services:
    frontend:
        build: ./client
        container_name: user_client
        ports:
            - 5173:5173
        volumes:
            - ./client/:/app
            - /app/node_modules
        env_file:
            - client/.env
        environment:
            - NODE_ENV=production
            - VITE_API_URL=${VITE_API_URL}
            - VITE_CLIENT_SECRET=${VITE_CLIENT_SECRET}

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
        environment:
            - NODE_ENV=production
            - SERVER_KEY=${SERVER_KEY}
```

# Docker file for client development:

```dockerfile
FROM node
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 5173
CMD ["npm", "start"]
```

# Docker file for client production build:

```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve static files using nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

# Docker file for server development:

```dockerfile
FROM node
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]
```

# Docker file for server production build:

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]
```
