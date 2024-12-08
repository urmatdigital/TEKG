# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install pnpm and nest CLI
RUN npm install -g pnpm @nestjs/cli

# Install dependencies
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV BASE_URL=https://api.te.kg
ENV DB_SSL=true
ENV SUPABASE_SSL=true

# Build application
RUN pnpm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["pnpm", "start"]
