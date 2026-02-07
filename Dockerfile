# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package.json package-lock.json* ./

RUN npm ci

# Copy source code
COPY . .

# Build arg for API URL (baked into static assets at build time)
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
