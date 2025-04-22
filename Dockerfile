# Use official Node.js LTS image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Configure npm to handle SSL certificates
RUN npm config set strict-ssl false && \
    npm config set registry http://registry.npmjs.org/

# Install dependencies (copy only package.json and lockfile first for better cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copy rest of the app
COPY . .

# Build the Next.js app
RUN npx next build

# Production image, copy built assets and install only production deps
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Configure npm to handle SSL certificates
RUN npm config set strict-ssl false && \
    npm config set registry http://registry.npmjs.org/

# Disable SSL verification for Node.js requests
# You are probably running this on your work computer :)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Copy only necessary files from build stage
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/next.config.ts ./next.config.ts

# Expose port (default Next.js port)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
