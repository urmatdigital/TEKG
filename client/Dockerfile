# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://api.te.kg
ENV NEXT_PUBLIC_SITE_URL=https://te.kg

# Build application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
