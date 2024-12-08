# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV BASE_URL=https://api.te.kg
ENV DB_SSL=true
ENV SUPABASE_SSL=true

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
