# ================================
# Build the app
# ================================

FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first

COPY package*.json ./

RUN npm install

COPY . .

# Build the Vite application
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ================================
# Serve with Nginx
# ================================

FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy React production build and nginx config
COPY --from=builder /app/dist/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]