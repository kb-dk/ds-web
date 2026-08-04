# Use the exact Node version requested (Alpine for a smaller image size)
FROM node:20.10.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
# This will include your .env file as long as it isn't excluded in .dockerignore
COPY . .

# Add a non-root user
RUN addgroup --system --gid 1001 app_group && \
    adduser --system --uid 1001 --ingroup app_group app_user && \
    chown --recursive app_user:app_group /app

# Expose the port your app listens on (Change 3000 to match your app's port, e.g., 5173 for Vite)
EXPOSE 3000

# Switch to non-root user
USER app_user

# Run the development server
CMD ["npm", "run", "dev"]