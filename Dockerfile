# Stage 1: Build the React application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install project dependencies, ignoring version conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built files from the 'builder' stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# The Nginx server runs and serves the static files
CMD ["nginx", "-g", "daemon off;"]