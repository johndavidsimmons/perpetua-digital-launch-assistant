# Development Dockerfile
FROM node:20-alpine

# Install dependencies for HTTPS cert generation
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose port 3000 for Next.js dev server
EXPOSE 3000

# Run the development server with HTTPS
CMD ["npm", "run", "dev"]
