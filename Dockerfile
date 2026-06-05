# --- Stage 1: Build the Frontend (Angular) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source and config files
COPY . .

# Build the Angular project
RUN npm run build

# --- Stage 2: Build the Gateway ---
FROM openresty/openresty:alpine

# opm needs perl and curl
RUN apk add --no-cache perl curl \
    && opm get SkyLothar/lua-resty-jwt \
    && opm get ledgetech/lua-resty-http \
    && find /usr/local/openresty -name "*.lua" -exec sed -i 's/EVP_MD_CTX_create/EVP_MD_CTX_new/g' {} + \
    && find /usr/local/openresty -name "*.lua" -exec sed -i 's/EVP_MD_CTX_destroy/EVP_MD_CTX_free/g' {} +


# Copy configurations from the new gateway/ directory
RUN rm /etc/nginx/conf.d/default.conf
COPY gateway/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY gateway/conf.d/ /etc/nginx/conf.d/
COPY gateway/lua/ /usr/local/openresty/nginx/lua/

# Copy built frontend from Stage 1 (Angular output)
# Note: For SSR/SSG projects, static files are in /browser
COPY --from=frontend-builder /app/dist/alldare-frontend/browser /usr/share/nginx/html

# Create directory for SSL certs and copy them
RUN mkdir -p /etc/nginx/certs
COPY gateway/certs/ /etc/nginx/certs/

EXPOSE 80 443

CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]
