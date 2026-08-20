# Use the exact Node version requested (Alpine for a smaller image size)
FROM node:20.10.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app listens on (Change 3000 to match your app's port, e.g., 5173 for Vite)
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]