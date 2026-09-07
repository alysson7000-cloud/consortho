# Consortho - Dockerfile for VPS deployment
FROM node:20-alpine

# Install PM2 globally
RUN npm install -g pm2

# Create app directory
WORKDIR /app

# Copy package files first (for cache)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create data directories
RUN mkdir -p memoria prototipos/poe prototipos/colheita prototipos/jardim prototipos/gang

# Expose server port
EXPOSE 9877

# Start with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--no-daemon"]